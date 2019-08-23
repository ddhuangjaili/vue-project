<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="search.channel" clearable filterable placeholder="上传渠道">
            <el-option v-for="b in fileChannels" :label="b.dictName" :value="b.dictCode"
                       :key="'form-channel-'+ b.dictCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.fileName" placeholder="文件名"></el-input>
        </el-form-item>
        <el-form-item label="上传人：">
          <el-input v-model="search.accountNo" placeholder="多上传人，请用英文逗号隔开"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="clear">清空</el-button>
        </el-form-item>
        </br>
        <el-form-item>
          <el-date-picker
            v-model="search.startDate"
            type="date"
            :clearable="true"
            class="inputStyle"
            placeholder="上传开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到">
          <el-date-picker
            v-model="search.endDate"
            type="date"
            :clearable="true"
            class="inputStyle"
            placeholder="上传结束时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-row class="toolbar">
      <el-button v-show="optAuth.del" @click="deleteMultiple" type="danger">批量删除</el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      stripe
      :max-height="height - 215"
      @selection-change="handleSelectionChange">
      <el-table-column
        fixed
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="index" width="70" label="序号">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="channel"
        label="上传渠道"
        :formatter="fileChannelFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="fileName"
        label="文件名"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="filePath"
        label="文件路径"
        width="350">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="accountNo"
        label="上传人"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createIp"
        label="上传ip"
        width="200"
        sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateDate"
        label="上传时间"
        :formatter="dateFmt"
        width="200"
        sortable>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="300"
        label="操作">
        <template slot-scope="scope">
          <el-button v-show="optAuth.del" title="删除" type="danger" icon='delete' size="mini"
                     @click.native.prevent="deleteItem(scope.row.id)"></el-button>
          <el-button v-show="scope.row.filePath" type="primary" size="small"><a :href="scope.row.filePath" target="_blank" class="download-link" download="w3logo"><i class="icon-download"></i>&nbsp;&nbsp;下载</a></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pull-right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="table.pager.page"
                   :page-sizes="[20, 50, 100, 200]"
                   :page-size="table.pager.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="table.pager.total">
    </el-pagination>
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'base_config_fileMng_fileList',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        userInfo: null,
        loading: true,
        search: {
          accountNo: '',
          channel: '',
          fileName: '',
          sort: 'updateDate',
          startDate: null,
          endDate: null,
          order: 'desc'
        },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            page: 1,
            total: 0
          }
        },
        fileChannels:[],
        fileChannelMap:{},
        multipleSelection: []
      };
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      if (this.userInfo.loginName) {
        this.getFileChannels().then(() => {
          this.query();
        });
      }
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'base_config_fileMng_fileList_list',
          del: 'base_config_fileMng_fileList_delete'
        });
      },
      company() {
        return bsmp.util.getCompany();
      },
      loginUser() {
        return bsmp.util.getUserInfo();
      }
    },
    watch: {
      'company': function (company) {
        if (this.userInfo.companyId === 'ALL' && company) {
          this.getFileChannels().then(() => {
            this.query();
          });
        }
      },
      'loginUser': function (loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
          this.getFileChannels().then(() => {
            this.query();
          });
        }
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteMultiple () {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的数据!'
          });
          return;
        }
        let ids = [];
        for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteItem(ids.join(','));
      },
      /**
       * 日期格式化
       * */
      dateFmt (row) {
        return row.updateDate ? bsmp.util.formatDate.format(new Date(row.updateDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      /**
       * 文件渠道格式化
       * */
      fileChannelFmt (row) {
        return typeof row.channel !== 'undefined' ? this.fileChannelMap[row.channel] : '';
      },

      /**
       * 删除
       * */
      deleteItem (id) {
        this.$confirm('确定要删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.removeFileMngFile(id).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'base_config',
                type: 'delete',
                content: `[FileMngFileList] params: ${JSON.stringify({id: id})}`
              });
            }
          });
        }).catch(e => {
        });
      },

      getCompanyId() {
        let companyId = '';
        if (this.userInfo.companyId) {
          if (this.userInfo.companyId === 'ALL') {
            if (this.company) {
              companyId = this.company.companyId;
            }
          } else {
            companyId = this.userInfo.companyId;
          }
        }
        return companyId;
      },
      /**
       *获取文件渠道
       * */
      getFileChannels() {
        return api.getDict({parentDictCode: 'FileChannels',companyId: this.getCompanyId()}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.fileChannels = data.data;
            if (this.fileChannels && this.fileChannels.length) {
              this.fileChannels.forEach((item) => {
                this.fileChannelMap[item.dictCode] = item.dictName;
              });
            }
          }
        });
      },
      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        if (this.getCompanyId()) {
          params.companyId = this.getCompanyId();
        }
        if(this.search.startDate){
          params.startDate = bsmp.util.formatDate.format(this.search.startDate, 'yyyy-MM-dd');
        }
        if(this.search.endDate){
          params.endDate = bsmp.util.formatDate.format(this.search.endDate, 'yyyy-MM-dd');
        }
        if(params.startDate > params.endDate){
          this.$message({
            type: 'error',
            message: '开始时间不能大于结束时间!'
          });
          this.loading = false;
          return;
        }
        params = Object.assign({}, params, this.table.pager);
        api.getFileMngFileList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.list;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                page: data.data.pageNum,
                total: data.data.total
              });
          }
        }).catch(e => {
          this.loading = false;
        });
      },
      /**
       * 清空
       */
      clear (){
        this.search = {
          accountNo: '',
          channel: '',
          fileName: '',
          sort: 'updateDate',
          startDate: '',
          endDate: ''
        }
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
        if (this.table.pager.page) {
          this.table.pager.page = val;
          this.query();
        }
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .el-input{
    width:250px;
  }
  .inputStyle{
    width: 215px;
  }

</style>

