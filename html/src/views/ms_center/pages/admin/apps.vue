<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.company" placeholder="公司编码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 135"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        prop="name"
        label="应用名称"
        width="250" sortable>
      </el-table-column>
      <el-table-column
        prop="code"
        label="应用编码"
        width="200" sortable>
      </el-table-column>
      <el-table-column
        prop="key"
        label="Token"
        width="300" sortable>
      </el-table-column>
      <el-table-column
        prop="company"
        label="所属公司"
        width="200" sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="repeatLoginType"
        label="重复登录限制"
        :formatter="typeFmt">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="禁用设置" v-show="optAuth.disable" type="info" icon='edit' size="mini"
                     @click="showDialog(scope.$index)">禁用设置
          </el-button>
          <el-button title="启用" @click="statusItem(scope.row.code, 0)" v-show="optAuth.status && scope.row.status !== 0"
                     size="mini">
            <i class="icon-play"></i>
          </el-button>
          <el-button title="禁用" @click="statusItem(scope.row.code, 999)" v-show="optAuth.status && scope.row.status === 0"
                     size="mini">
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

    <!-- 弹窗框 -->
    <el-dialog title="禁用设置" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="appForm" :model="dialog.form" label-width="50px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :offset="1" :span="11">
            <el-form-item>
              <el-checkbox v-model="dialog.form.disableApi">禁止调用api</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="11">
            <el-form-item>
              <el-checkbox v-model="dialog.form.disableApiMsg">禁止调用发送消息api</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="1" :span="11">
            <el-form-item>
              <el-checkbox v-model="dialog.form.disableApiGlobalMsg">禁止调用发送global消息api</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="11">
            <el-form-item>
              <el-checkbox v-model="dialog.form.disableApiPlatformMsg">禁止调用发送platform消息api</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="1" :span="11">
            <el-form-item>
              <el-checkbox v-model="dialog.form.disableApiTagMsg">禁止调用发送tag消息api</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="11">
            <el-form-item>
              <el-checkbox v-model="dialog.form.disableApiTopicMsg">禁止调用发送topic消息api</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="1" :span="11">
            <el-form-item>
              <el-checkbox v-model="dialog.form.disableApiPersonalMsg">禁止调用发送user消息api</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="11">
            <el-form-item>
              <el-checkbox v-model="dialog.form.disableClientPersonalMsg">禁止客户端发送user消息</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :offset="1" :span="11">
            <el-form-item>
              <el-checkbox v-model="dialog.form.disableClientTopicMsg">禁止客户端发送topic消息</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'admin-apps',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        search: {
          company: ''
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
          form: {}
        },
        disableMap: {
          disableApi: false,
          disableApiMsg: false,
          disableApiGlobalMsg: false,
          disableApiPlatformMsg: false,
          disableApiTagMsg: false,
          disableApiTopicMsg: false,
          disableApiPersonalMsg: false,
          disableClientPersonalMsg: false,
          disableClientTopicMsg: false,
        },
        typeMap: {
          'ALLOW': '允许重复登录',
          'FORBID': '不允许重复登录',
          'FORBID_PLATFORM': '不允许同平台重复登录',
          'FORBID_PLATFORM_GROUP': '不允许同平台组重复登录'
        }
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'ms_center_admin_apps_view',
          status: 'ms_center_admin_apps_status',
          disable: 'ms_center_admin_apps_disable'
        });
      }
    },
    methods: {
      /**
       * 类型格式化
       * */
      typeFmt (row) {
        return row.repeatLoginType ? this.typeMap[row.repeatLoginType] : '';
      },

      /**
       * 显示弹窗
       * */
      showDialog (index) {
        let item = this.table.items[index];

        let disableSetting = this.table.items[index].disableSetting;
        this.dialog.form = Object.assign({appCode: item.code}, this.disableMap, disableSetting);

        this.dialog.show = true;
      },

      /**
       * 取消弹窗
       * */
      cancelForm () {
        this.dialog.show = false;
      },

      submitForm () {
        // 新增
        api.adminAppDisable(this.dialog.form.appCode, this.dialog.form).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.$message({
              type: 'success',
              message: '设置成功!'
            });

            this.dialog.show = false;
            this.query();

            // 记录日志
            bsmp.log({
              component: 'ms_center',
              type: 'modify',
              content: `[AdminApps] params: ${JSON.stringify(this.dialog.form)}`
            });
          }
        });
      },

      statusItem(code, status) {
        let title = status > 0 ? '确定要禁用该条记录？' : '确定要启用该条记录？';
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.adminAppStatus(code, status).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'ms_center',
                type: 'modify',
                content: `[AdminApps] params: ${JSON.stringify({code, status})}`
              });
            }
          });
        }).catch(e => {
        });
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = Object.assign({}, this.search, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getAppList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: data.data.pageNo + 1,
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
      }
    }
  };
</script>
