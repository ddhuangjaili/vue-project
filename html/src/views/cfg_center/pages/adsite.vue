<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="广告位置状态：" prop="status">
          <el-select v-model="search.status" filterable clearable placeholder="状态">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                       :key="'search-status-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <el-row class="toolbar">
      <el-button v-show="optAuth.add" @click="showDialog(1)" type="primary">新增</el-button>
    </el-row>

    <!-- GTS2马甲包 -->
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 165"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="siteName"
        label="广告位置名称"
        width="300">
      </el-table-column>
      <el-table-column
        prop="siteCode"
        label="广告位置代码"
        width="150">
      </el-table-column>
      <el-table-column
        prop="status"
        :formatter="statusFmt"
        label="广告位置状态"
        width="200">
      </el-table-column>
      <el-table-column
        prop="siteDesc"
        label="广告位置描述"
        width="500">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        :formatter="createTimeFmt"
        width="200"
        label="创建时间">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="modifiedTime"
        :formatter="modifiedTimeFmt"
        width="200"
        label="更新时间">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="modifier"
        label="更新人"
        width="150">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.edit" @click.native.prevent="showDialog(2, scope.$index)"
                     type="info" icon='edit' size="mini"></el-button>
          <el-button title="启用" @click="activeItem(scope.$index, 1)" v-show="optAuth.status && scope.row.status === 0" size="mini">
            <i class="icon-play"></i>
          </el-button>
          <el-button title="禁用" @click="activeItem(scope.$index, 0)" v-show="optAuth.status && scope.row.status === 1" size="mini">
            <i class="icon-stop"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pull-right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="table.pager.pageNo"
                   :page-sizes="[20, 50, 100, 200]"
                   :page-size="table.pager.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="table.pager.total">
    </el-pagination>
    <!-- /GTS2马甲包 -->

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="adSiteForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="广告位置名称：" prop="siteName">
              <el-input v-model="dialog.form.siteName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="广告位置状态：" prop="status" v-show="dialog.type === 1">
              <el-select v-model="dialog.form.status" filterable placeholder="状态">
                <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                           :key="'form-status-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="广告位置描述：" prop="siteDesc">
              <el-input type="textarea" :rows="3" v-model="dialog.form.siteDesc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="广告位置代码：" prop="siteCode">
              <el-input v-model="dialog.form.siteCode" auto-complete="off" placeholder="若不填将自动生成"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm" type="primary">保 存</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'adsite',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        search: {
          status: ''
        },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          }
        },
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          title: '',
          form: {
            siteName: '',
            siteDesc: '',
            status: '1',
            siteCode: ''
          },
          rules: rules
        },
        statusMap: {
          '0': '无效',
          '1': '有效'
        }
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'app_args_adsite_view',
          add: 'app_args_adsite_add',
          edit: 'app_args_adsite_edit',
          status: 'app_args_adsite_status'
        });
      }
    },
    methods: {
      statusFmt (row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
      },
      /**
       * 日期格式化
       * */
      createTimeFmt(row) {
        return row.createTime ? bsmp.util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      modifiedTimeFmt(row) {
        return row.modifiedTime ? bsmp.util.formatDate.format(new Date(row.modifiedTime), 'yyyy-MM-dd hh:mm:ss') : '';
      },

      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['adSiteForm'] && this.$refs['adSiteForm'].resetFields) {
          this.$refs['adSiteForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.status = form.status + '';
          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            siteName: '',
            siteDesc: '',
            status: '1',
            siteCode: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['adSiteForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {

              // 新增
              api.addAdSite(this.dialog.form).then((res) => {
                let data = res.data;
                if (data && data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'cfg_center',
                    type: 'add',
                    content: `[AdSite] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            } else {
              // 修改
              let params = {
                id: this.dialog.form.id,
                siteName: this.dialog.form.siteName,
                siteDesc: this.dialog.form.siteDesc,
                siteCode: this.dialog.form.siteCode
              };

              api.editAdSite(params).then((res) => {
                let data = res.data;
                if (data && data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '编辑成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'cfg_center',
                    type: 'modify',
                    content: `[AdSite] params: ${JSON.stringify(params)}`
                  });
                }
              });
            }
          } else {
            return false;
          }
        });
      },

      activeItem(index, status) {
        let params = {id: this.table.items[index].id, status};
        api.editAdSiteStatus(params).then((res) => {
          let data = res.data;
          if (data && data.code === 0) {
            this.$message({
              type: 'success',
              message: status === 1 ? '启动成功!' : '禁用成功！'
            });
            this.query();

            // 记录日志
            bsmp.log({
              component: 'cfg_center',
              type: 'modify',
              content: `[AdSite] params: ${JSON.stringify(params)}`
            });
          }
        });
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = Object.assign(this.search, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getAdSiteList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === 0) {

            this.table.items = data.data.list;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: parseInt(data.data.pageNo, 10) + 1,
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

      cancelForm() {
        this.dialog.show = false;
      }
    }
  };
  
  // 表单规则
  let rules = {
    siteName: [
      {required: true, message: '请输入广告位置名称', trigger: 'blur'}
    ],
    siteCode: [
      {pattern: /^[1-9]+\d*$/, message: '广告位置代码必须为数字'}
    ]
  };
</script>
