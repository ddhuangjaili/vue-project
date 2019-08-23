<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select clearable v-model="search.appCode" filterable placeholder="应用">
            <el-option v-for="(c, key) in apps" :label="c.name" :value="c.code"
                       :key="'search-app-'+ c.code"></el-option>
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
        prop="tag"
        label="标签名称"
        width="400" sortable>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button title="删除" v-show="optAuth.del" type="danger" icon='delete' size="mini" @click="deleteItem(scope.row.tag)"></el-button>
          <el-button v-show="optAuth.user" @click="showUserDialog(scope.row)" size="mini"><i class="icon-users"></i>&nbsp;&nbsp;用户列表</el-button>
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
    <el-dialog :title="dialog.title" v-model="dialog.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="tagForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="标签名称：" prop="tag">
              <el-input v-model="dialog.form.tag" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="dialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog title="标签用户列表" v-model="userDialog.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-row class="toolbar">
        <el-button v-show="optAuth.userEdit" @click="showUserFormDialog" type="primary">新增</el-button>
        <el-button v-show="optAuth.userDel" @click="deleteMultipleUser" type="danger">批量删除</el-button>
      </el-row>
      <el-table
        highlight-current-row
        v-loading.body="userDialog.loading"
        :data="userDialog.items"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          fixed
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column
          prop="uid"
          label="UID"
          width="200">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button title="删除" v-show="optAuth.userDel" @click="deleteUserItem(scope.row.uid)" type="danger" icon='delete' size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pull-right"
                     @size-change="handleUserSizeChange"
                     @current-change="handleUserCurrentChange"
                     :current-page="userDialog.pager.pageNo"
                     :page-sizes="[5, 10, 20, 50]"
                     :page-size="userDialog.pager.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="userDialog.pager.total">
      </el-pagination>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog title="新增用户" v-model="userDialog.form.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="userForm" :model="userDialog.form" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="UID：" prop="uid" :rules="{required: true, message: 'UID不能为空', trigger: 'blur'}">
              <el-input v-model="userDialog.form.uid" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUserForm">确 定</el-button>
        <el-button @click="userDialog.form.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'tagMng',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: false,
        search: {
          appCode: null
        },
        table: {
          appCode: null,
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
            tag: '',
            appCode: ''
          },
          rules: rules
        },
        userDialog: {
          show: false,
          loading: false,
          tag: '',
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          },
          form: {
            show: false,
            uid: ''
          }
        },
        multipleSelection: [],
        apps: null
      };
    },
    mounted () {
      this.getApps();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'ms_center_tagMng_view',
          add: 'ms_center_tagMng_add',
          del: 'ms_center_tagMng_delete',
          user: 'ms_center_tagMng_user',
          userEdit: 'ms_center_tagMng_user_edit',
          userDel: 'ms_center_tagMng_user_del'
        });
      }
    },
    methods: {
      getApps () {
        api.getAppList({}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.apps = data.data.data;
          }
        });
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.dialog.type === 1 && !this.search.appCode) {
          this.$message.warning('请先选择应用！');
          return;
        }

        if (this.$refs['tagForm'] && this.$refs['tagForm'].resetFields) {
          this.$refs['tagForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          this.dialog.form = Object.assign({}, this.table.items[index]);
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            tag: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['tagForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              // 新增
              this.dialog.form.appCode = this.search.appCode;
              api.addTag(this.search.appCode, this.dialog.form).then((res) => {
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
                    content: `[Tag] params: ${JSON.stringify({
                      appCode: this.search.appCode, ...this.dialog.form
                    })}`
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
      deleteItem (tag) {
        this.$confirm('确定要删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.removeTag(this.table.appCode, tag).then((res) => {
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
                content: `[Tag] params: ${JSON.stringify({appCode: this.table.appCode, tag: tag})}`
              });
            }
          });
        }).catch(e => {});
      },

      /**
       * 查询
       */
      query () {
        if (!this.search.appCode) {
          return;
        }
        this.loading = true;
        let params = Object.assign({}, this.search, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getTagList(params.appCode, params).then((res) => {
          this.loading = false;
          let data = res.data;
          this.table.appCode = params.appCode;
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
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      /**
       * 用户列表弹窗
       * */
      showUserDialog(row) {
        this.userDialog.tag = row.tag;
        this.getUsers();
        this.userDialog.show = true;
      },

      showUserFormDialog() {
        this.userDialog.form.uid = '';
        this.userDialog.form.show = true;
      },

      submitUserForm() {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            // 新增
            let uid = this.getTagUserUid().concat(this.userDialog.form.uid);
            api.editTagUser(this.table.appCode,
              this.userDialog.tag,
              uid).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                });

                this.userDialog.form.show = false;
                this.getUsers();

                // 记录日志
                bsmp.log({
                  component: 'ms_center',
                  type: 'modify',
                  content: `[Tag User] params: ${JSON.stringify({
                    appCode: this.table.appCode, tag: this.userDialog.tag, uid
                  })}`
                });
              }
            });
          } else {
            return false;
          }
        });
      },

      getTagUserUid() {
        let uid = [];
        if (this.userDialog.items) {
          this.userDialog.items.forEach((item) => {
            uid.push(item.uid);
          });
        }
        return uid;
      },

      deleteMultipleUser () {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的用户!'
          });
          return;
        }
        let ids = [];
        for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
          ids.push(this.multipleSelection[i].uid);
        }
        this.deleteUserItem(ids.join(','));
      },

      /**
       * 删除
       * */
      deleteUserItem (id) {
        this.$confirm('确定要删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.removeTagUser(this.table.appCode, this.userDialog.tag, id).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getUsers();

              // 记录日志
              bsmp.log({
                component: 'ms_center',
                type: 'delete',
                content: `[Tag User] params: ${JSON.stringify({
                  appCode: this.table.appCode, tag: this.userDialog.tag, uid: id
                })}`
              });
            }
          });
        }).catch(e => {});
      },

      getUsers () {
        if (!this.table.appCode) {
          return;
        }
        if (!this.userDialog.tag) {
          return;
        }
        this.userDialog.loading = true;
        let params = Object.assign({}, this.userDialog.pager, {pageNo: this.userDialog.pager.pageNo - 1});
        api.getTagUserList(this.table.appCode, this.userDialog.tag, params).then((res) => {
          this.userDialog.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.userDialog.items = data.data.data;
            this.userDialog.pager = Object.assign({}, this.userDialog.pager,
              {
                pageNo: data.data.pageNo + 1,
                total: data.data.total
              });
          }
        });
      },
      /**
       * 每页显示条数变化
       * @param val
       */
      handleUserSizeChange (val) {
        this.userDialog.pager.pageSize = val;
        this.getUsers();
      },

      /**
       * 页码变化
       * @param val
       */
      handleUserCurrentChange (val) {
        if (this.userDialog.pager.pageNo) {
          this.userDialog.pager.pageNo = val;
          this.getUsers();
        }
      },
    }
  };

  // 表单规则
  let rules = {
    tag: [
      {required: true, message: '请输入标签名称', trigger: 'blur'}
    ]
  };
</script>
