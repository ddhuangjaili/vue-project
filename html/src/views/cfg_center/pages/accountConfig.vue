<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.accountNo" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.platform" placeholder="平台"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <el-row class="toolbar">
      <el-button v-show="optAuth.curd" @click="showDialog(1)" type="primary">新增</el-button>
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
        prop="accountNo"
        label="账号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="platform"
        label="平台"
        width="150">
      </el-table-column>
      <el-table-column
        prop="status"
        :formatter="statusFmt"
        label="状态"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="modifiedTime"
        width="200"
        label="更新时间">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="modifier"
        label="更新人">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.curd" @click.native.prevent="showDialog(2, scope.$index)"
                     type="info" icon='edit' size="mini"></el-button>
          <el-button title="删除" v-show="optAuth.curd" @click.native.prevent="deleteItem(scope.row.id)"
                     type="danger" icon='delete' size="mini"></el-button>
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
      <el-form ref="configForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账号：" prop="accountNo">
              <el-input v-model="dialog.form.accountNo" auto-complete="off" :disabled="dialog.type === 2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台：" prop="platform">
              <el-input v-model="dialog.form.platform" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="状态：" prop="status">
              <el-select v-model="dialog.form.status" filterable placeholder="状态">
                <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                           :key="'form-status-'+ key"></el-option>
              </el-select>
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
    name: 'accountConfigs',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        type: 'upload_log',
        search: {
          accountNo: '',
          platform: ''
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
            accountNo: '',
            platform: '',
            status: '1'
          },
          rules: rules
        },
        statusMap: {
          '0': '禁用',
          '1': '启用'
        }
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'app_args_accountConfig_view',
          curd: 'app_args_accountConfig_curd'
        });
      }
    },
    methods: {
      statusFmt (row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['configForm'] && this.$refs['configForm'].resetFields) {
          this.$refs['configForm'].resetFields();
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
            accountNo: '',
            platform: '',
            status: '1'
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['configForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              let params = Object.assign({
                action: 'create', type: this.type
              }, this.dialog.form);

              // 新增
              api.curdAccountConfig(params).then((res) => {
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
                    content: `[Configs] params: ${JSON.stringify(params)}`
                  });
                }
              });
            } else {
              // 修改
              let params = {
                action: 'update',
                id: this.dialog.form.id,
                platform: this.dialog.form.platform,
                status: this.dialog.form.status
              };
              api.curdAccountConfig(params).then((res) => {
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
                    content: `[AccountConfig] params: ${JSON.stringify(params)}`
                  });
                }
              });
            }
          } else {
            return false;
          }
        });
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
          api.curdAccountConfig({id: id, action: 'delete'}).then((res) => {
            let data = res.data;
            if (data && data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'cfg_center',
                type: 'delete',
                content: `[AccountConfig] params: ${JSON.stringify({id: id, action: 'delete'})}`
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
        let params = Object.assign({type: this.type}, this.search, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getAccountConfig(params).then((res) => {
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
    accountNo: [
      {required: true, message: '请输入账号', trigger: 'blur'}
    ],
    platform: [
      {required: true, message: '请输入平台', trigger: 'blur'}
    ]
  };
</script>
