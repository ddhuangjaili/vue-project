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
    <el-row class="toolbar">
      <el-button v-show="optAuth.add" @click="showDialog(1)" type="primary">新增</el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 165"
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
          <el-button title="编辑" v-show="optAuth.edit" type="info" icon='edit' size="mini"
                     @click.native.prevent="showDialog(2, scope.$index)"></el-button>
          <el-button title="删除" v-show="optAuth.del" type="danger" icon='delete' size="mini"
                     @click="deleteItem(scope.row.code)"></el-button>
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
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="appForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="应用名称：" prop="name">
              <el-input v-model="dialog.form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用编码：" prop="code">
              <el-input v-model="dialog.form.code" auto-complete="off" :disabled="dialog.type === 2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属公司：" prop="company">
              <el-input v-model="dialog.form.company" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重复登录限制 ：" prop="repeatLoginType">
              <el-select v-model="dialog.form.repeatLoginType" placeholder="重复登录限制">
                <el-option v-for="(val, key) in typeMap" :label="val" :value="key" :key="'add-type-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="黑名单ip地址：" prop="blackIp">
              <el-input type="textarea" :rows="3" v-model="dialog.form.blackIp" placeholder="多ip以,号间隔"></el-input>
            </el-form-item>
          </el-col>
          <el-col :offset="1" :span="7">
            <el-checkbox v-model="dialog.form.platformCheck">登录平台检查</el-checkbox>
            <br><br>
            <el-checkbox v-model="dialog.form.speechLimits">发言限制</el-checkbox>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'appList',
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
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          title: '',
          form: {
            name: '',
            code: '',
            platformCheck: false,
            speechLimits: false,
            repeatLoginType: 'ALLOW',
            blackIp: '',
            company: ''
          },
          rules: rules
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
          search: 'ms_center_appList_view',
          add: 'ms_center_appList_add',
          edit: 'ms_center_appList_edit',
          del: 'ms_center_appList_del'
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
      showDialog (type, index) {
        if (this.$refs['appForm'] && this.$refs['appForm'].resetFields) {
          this.$refs['appForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({
            name: '',
            code: '',
            platformCheck: false,
            speechLimits: false,
            repeatLoginType: '',
            blackIp: '',
            company: ''
          }, this.table.items[index]);
          if (form.blackIpList) {
            form.blackIp = form.blackIpList.join(',');
          }

          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            name: '',
            code: '',
            platformCheck: false,
            speechLimits: false,
            repeatLoginType: 'ALLOW',
            blackIp: '',
            company: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['appForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.dialog.form);
            if (params.blackIp) {
              params.blackIpList = params.blackIp.split(',');
            }
            delete params.blackIp;
            if (this.dialog.type === 1) {

              // 新增
              api.addApp(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'ms_center',
                    type: 'add',
                    content: `[App] params: ${JSON.stringify(params)}`
                  });
                }
              });
            } else {
              // 修改
              api.editApp(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'ms_center',
                    type: 'modify',
                    content: `[App] params: ${JSON.stringify(params)}`
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
      deleteItem (code) {
        this.$confirm('确定要删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.deleteApp(code).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'ms_center',
                type: 'delete',
                content: `[App] params: ${JSON.stringify({code: code})}`
              });
            }
          });
        }).catch(e => {});
      },

      /**
       * 取消弹窗
       * */
      cancelForm () {
        this.dialog.show = false;
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

  // 表单规则
  let rules = {
    name: [
      {required: true, message: '请输入应用名称', trigger: 'blur'}
    ],
    code: [
      {required: true, message: '请输入应用编码', trigger: 'blur'}
    ],
    company: [
      {required: true, message: '请输入所属公司', trigger: 'blur'}
    ]
  };
</script>
