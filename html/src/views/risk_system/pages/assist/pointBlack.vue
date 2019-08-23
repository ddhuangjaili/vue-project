<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.contactTime"
            type="daterange"
            placeholder="查询时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button v-show="optAuth.contact" type="primary" @click="getPointBlackContact">扫黑通讯录</el-button>
        </el-form-item>
        <br/>

        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.deviceTime"
            type="daterange"
            placeholder="查询时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button v-show="optAuth.deviceId" type="primary" @click="getPointBlackDeviceId" >扫黑设备的名单账户</el-button>
        </el-form-item>
        <br/>

        <el-form-item label="黑名单批量查询：">
          <el-button @click="importExcel(3)" v-show="optAuth.black" type="primary"><i class="icon-upload"></i>&nbsp;&nbsp;搜索导入</el-button>
          <a class="el-button el-button--primary export-btn"
             href="static/files/risk_batch_search_black_template.xlsx"><i class="icon-download"></i>&nbsp;&nbsp;下载模板</a>
        </el-form-item>
        <br/>

        <el-form-item label="可疑客户信息搜索（批量信息搜素功能）：">
          <el-button @click="importExcel(1)" v-show="optAuth.import" type="primary"><i class="icon-upload"></i>&nbsp;&nbsp;搜索导入</el-button>
          <a class="el-button el-button--primary export-btn"
            href="static/files/spider_info_search_template_import.xlsx"><i class="icon-download"></i>&nbsp;&nbsp;下载模板</a>
        </el-form-item>
        <br/>

        <el-form-item label="可疑客户通讯查询关联信息：">
          <el-button  @click="importExcel(2)" v-show="optAuth.relevant" type="primary"><i class="icon-upload"></i>&nbsp;&nbsp;搜索导入</el-button>
          <a class="el-button el-button--primary export-btn"
            href="static/files/spider_contact_call_relevant_template_import.xlsx"><i class="icon-download"></i>&nbsp;&nbsp;下载模板</a>
        </el-form-item>
        <br/>
        <el-form-item label="客户通话记录训练采样统计：">
            <el-button  @click="importExcel(4)" v-show="optAuth.sampleStat" type="primary"><i class="icon-upload"></i>&nbsp;&nbsp;搜索导入</el-button>
            <a class="el-button el-button--primary export-btn"
               href="static/files/sample_call_stat_template.xlsx"><i class="icon-download"></i>&nbsp;&nbsp;下载模板</a>

          <el-button  v-show="optAuth.list" type="primary" @click="query()"><i class="icon-arrows-cw"></i>刷新</el-button>
        </el-form-item>

      </el-form>
    </query-panel>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      stripe
      :max-height="height - 250"
      style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="fileType"
        label="任务名称"
        width="300">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createUser"
        label="执行人员">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="任务状态"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.filePath || scope.row.updateDate">已完成</span>
          <span v-else>执行中</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createDate"
        :formatter="taskDateFmt"
        label="任务提交时间"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="任务类型">
        <template slot-scope="scope">
          <span>文件导出</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="执行操作">
        <template slot-scope="scope">
          <div v-if="scope.row.filePath">
              <a v-for="(path, index) in scope.row.filePath.split(',')" :key="'path_' + index" class="el-button el-button--primary export-btn" :href="path" title="导出"><i class="icon-download"></i>导出</a>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pull-right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="table.pager.page"
      :page-sizes="[50, 100, 500]"
      :page-size="table.pager.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="table.pager.total">
    </el-pagination>

    <el-dialog :title="uploadDialog.title" v-model="uploadDialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="uploadForm" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-upload
              :action="uploadDialog.action"
              :show-file-list="false"
              :on-success="avatarSuccess"
              :before-upload="beforeUpload"
              :on-error="avatarError"
              :headers="headers"
            >
              <el-button size="small">选择文件</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import api from "../../api";
import bsmp  from "bsmp_main";

export default {
  name: "assist_tools_pointBlack",
  props: {
    height: {
      type: Number
    }
  },
  data() {
    return {
      userInfo: null,
      loading: false,
      headers: {
        bu: '',
        userId: '',
        ip: ''
      },
      search: {
        contactTime: null,
        deviceTime: null,
      },
      table: {
        params: {id: null},
        items: [],
        pager: {
          pageSize: 50,
          pageNo: 1,
          total: 0
        }
      },
      uploadDialog: {
        type: 0,
        show: false,
        title: 'excel导入',
        action: ''
      },
    };
  },

  mounted() {
    this.userInfo = bsmp.util.getUserInfo();
    if (this.userInfo.loginName) {
      this.headers = {
        bu: this.userInfo.companyId,
        userId: this.userInfo.loginName,
        ip: '127.0.0.1'
      };
      this.query();
    }
  },
  computed: {
    optAuth() {
      return bsmp.util.mapAuth({
        list: "assist_tools_pointBlack_list",
        deviceId: "assist_tools_pointBlack_blackdeviceId",
        contact: "assist_tools_pointBlack_blackcontact",
        import: "assist_tools_pointBlack_import",
        relevant: "assist_tools_pointBlack_import_relevant",
        black: "assist_tools_pointBlack_import_batch_search_black",
        sampleStat:"assist_tools_pointBlack_sampleStat"
      });
    },
    loginUser() {
      return bsmp.util.getUserInfo();
    }
  },
  watch: {
    'loginUser': function (loginUser) {
      if (loginUser && loginUser.loginName) {
        this.userInfo = bsmp.util.getUserInfo();
        if (this.userInfo.loginName) {
          this.headers = {
            bu: this.userInfo.companyId,
            userId: this.userInfo.loginName,
            ip: '127.0.0.1'
          };
          this.query();
        }
      }
    }
  },
  methods: {
      /**
       * 日期格式化
       * */
      taskDateFmt (row) {
      return row.createDate ? bsmp.util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd hh:mm:ss') : '';
    },

    importExcel(type) {
      this.uploadDialog.type = type;
      this.uploadDialog.action = type === 1 ? api.point.batchImport : api.point.batchImportRelevant;
      if (type == 3){
          this.uploadDialog.action = api.point.batchImportBlack;
      } else if(type ==4){
          this.uploadDialog.action = api.point.batchImportSampleStat;
      }
      this.uploadDialog.show = true;
    },
    beforeUpload(file){
      if (this.uploadDialog.type === 1 && this.optAuth.import) {
        return true;
      } else if (this.uploadDialog.type === 2 && this.optAuth.relevant) {
        return true;
      } else if (this.uploadDialog.type === 3 && this.optAuth.black) {
          return true;
      } else if (this.uploadDialog.type === 4 && this.optAuth.sampleStat) {
          return true;
      }else {
        this.$message.warning('无导入文件权限！');
        return false;
      }
    },

    avatarSuccess(res, file, files){
      this.uploadDialog.show = false;
      if (res.code !== '0') {
        this.$message({
          message: '导入文件失败！'+ res.msg,
          type: 'error',
          duration: 8000,
          center: true
        });
        return;
      }
      this.$message.success('导入文件成功！');
      this.query();
    },

    avatarError(err, file, fileList) {
      this.loading = false;
      this.uploadDialog.show = false;
      err = err + "";
      if (err.indexOf('504') > -1 || err.indexOf('Error') > -1) {
        this.$message.error("导入文件失败！");
      } else {
        this.$message({
          message: '文件正在后台批量处理,文件过大可能导入失败！请尽量控制文件大小...',
          type: 'error',
          duration: '8000',
          center: true
        });
      }
    },

    getPointBlackContact() {
      let params = {};
      if (this.search.contactTime && this.search.contactTime.length
        && this.search.contactTime[0] && this.search.contactTime[1]) {
        params.beginDate = bsmp.util.formatDate.format(this.search.contactTime[0], "yyyy-MM-dd hh:mm:ss");
        params.endDate = bsmp.util.formatDate.format(this.search.contactTime[1], "yyyy-MM-dd") + " 23:59:59";
      } else {
        this.$message.warning(`请选择查询时间！`);
        return;
      }

      this.loading = true;
      api.getPointBlackContact(params, this.headers).then(res => {
        let data = res.data;
        if (data && data.code === "0") {

          if (data.data && data.data.msg) {
            this.loading = false;
            this.$message.warning(data.data.msg);
            return;
          }

          this.table.params.id = data.data;
          this.query();
        } else {
          this.loading = false;
        }
      }).catch(e => {
        this.loading = false;
      });
    },

    getPointBlackDeviceId() {
      let params = {};
      if (this.search.deviceTime && this.search.deviceTime.length
        && this.search.deviceTime[0] && this.search.deviceTime[1]) {
        params.accessTimeStart = bsmp.util.formatDate.format(this.search.deviceTime[0], "yyyy-MM-dd hh:mm:ss");
        params.accessTimeEnd = bsmp.util.formatDate.format(this.search.deviceTime[1], "yyyy-MM-dd") + " 23:59:59";
      } else {
        this.$message.warning(`请选择查询时间！`);
        return;
      }

      this.loading = true;
      api.getPointBlackDeviceId(params, this.headers).then(res => {
        let data = res.data;
        if (data && data.code === "0") {

          if (data.data && data.data.msg) {
            this.loading = false;
            this.$message.warning(data.data.msg);
            return;
          }

          this.table.params.id = data.data;
          this.query();
        } else {
          this.loading = false;
        }
      }).catch(e => {
        this.loading = false;
      });
    },

    /**
     * 查询
     */
    query() {
      this.loading = true;

      let params = bsmp.util.deleteBlank(this.table.params);
      params = Object.assign({}, params, this.table.pager);

      api.getPointBlackUploadlist(params, this.headers).then(res => {
        this.loading = false;
        let data = res.data;
        if (data && data.code === "0") {
          this.table.items = data.data.data;
          this.table.pager = Object.assign({}, this.table.pager,
            {
              pageNo: data.data.pageNo,
              total: data.data.total
            });
        }
      }).catch(e => {
        this.loading = false;
      });
    },

    /**
     * 每页显示条数变化
     * @param val
     */
    handleSizeChange (val) {
      this.table.pager.pageSize = val;
      this.query();
    },

    /**
     * 页码变化
     * @param val
     */
    handleCurrentChange (val) {
      if (this.table.pager.pageNo) {
        this.table.pager.pageNo = val;
        this.query();
      }
    },
  }
};
</script>
<style lang="stylus" scoped>
  .export-btn {
    text-decoration:none;
  }
  .pull-right {
    margin-left: 50px;
  }
  .icon-download{
    font-size: 80%
  }
  .icon-upload{
    font-size: 80%
  }
  .icon-arrows-cw{
    font-size: 80%
  }
</style>

