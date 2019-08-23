<template>
  <div>
    <el-row class="toolbar">
      <el-button @click="showDialog(1)" type="primary">新增</el-button>
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
        :show-overflow-tooltip="true"
        prop="name"
        label="频道名称"
        width="200" sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="code"
        label="频道编码"
        width="200" sortable>
      </el-table-column>
      <el-table-column
        prop="disable"
        label="禁用"
        :formatter="disableFmt"
        width="100">
      </el-table-column>
      <el-table-column
        prop="publishSetting"
        label="禁止发布"
        :formatter="publishFmt"
        width="100">
      </el-table-column>
      <el-table-column
        prop="subscribeSetting"
        label="禁止订阅"
        :formatter="subscribeFmt"
        width="100">
      </el-table-column>
      <el-table-column
        prop="group"
        label="是否为群组模式"
        :formatter="groupFmt"
        width="200">
      </el-table-column>
      <el-table-column
        prop="offline"
        label="是否开启离线"
        :formatter="offlineFmt"
        width="200">
      </el-table-column>
      <el-table-column
        prop="onlineStatusNotice"
        label="开启上下线通知"
        :formatter="onlineStatusNoticeFmt"
        width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="showMessageDialog(scope.row)" size="mini">
            <i class="icon-chat-empty"></i>&nbsp;&nbsp;推送消息
          </el-button>
          <el-button title="编辑" type="info" icon='edit' size="mini"
                     @click="showDialog(2, scope.$index)"></el-button>
	        <el-button title="删除" type="danger" icon='delete' size="mini" @click="deleteItem(scope.row.code)"></el-button>
          <el-button title="启用" @click="disableTopic(scope.row, false)" v-if="scope.row.disable" size="mini">
            <i class="icon-play"></i></el-button>
          <el-button title="禁用" @click="disableTopic(scope.row, true)" size="mini" v-else>
            <i class="icon-stop"></i></el-button>
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
      <el-form ref="topicForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="频道名称：" prop="name">
              <el-input v-model="dialog.form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="频道编码：" prop="code">
              <el-input v-model="dialog.form.code" auto-complete="off" :disabled="dialog.type === 2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="订阅限制：">
              <el-checkbox v-model="dialog.form.subscribeSetting.disable">是否禁止订阅</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="订阅标签：">
              <el-select v-model="dialog.form.subscribeSetting.tags" multiple filterable placeholder="订阅标签">
                <el-option v-for="t in tags" :label="t.tag" :value="t.tag"
                           :key="'form-subscribe-tag-'+ t.tag"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发布限制：">
              <el-checkbox v-model="dialog.form.publishSetting.disable">是否禁止订阅</el-checkbox>
              <br>
              <el-checkbox v-model="dialog.form.publishSetting.subscribe">是否需要先订阅才可以发布</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发布标签：">
              <el-select v-model="dialog.form.publishSetting.tags" multiple filterable placeholder="发布标签">
                <el-option v-for="t in tags" :label="t.tag" :value="t.tag"
                           :key="'form-publish-tag-'+ t.tag"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发言间隔：">
              <el-input-number v-model="dialog.form.publishSetting.speakInterval" :min="100"></el-input-number>&nbsp;&nbsp;毫秒


            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="其他限制：">
              <el-checkbox v-model="dialog.form.group">是否为群组模式</el-checkbox>
              <br>
              <el-checkbox v-model="dialog.form.offline">是否开启离线</el-checkbox>
              <br>
              <el-checkbox v-model="dialog.form.onlineStatusNotice">是否开启topic订阅用户变化通知</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="频道用户：">
              <el-button @click="showUserDialog('user')" type="primary"><i class="icon-users"></i>&nbsp;&nbsp;用户列表
              </el-button>
              <el-button @click="showUserDialog('publish')" type="danger"><i class="icon-users"></i>&nbsp;&nbsp;发言禁止用户列表
              </el-button>
              <el-button @click="showUserDialog('subscribe')" type="warning"><i class="icon-users"></i>&nbsp;&nbsp;订阅禁止用户列表
              </el-button>
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

    <!-- 弹窗框 -->
    <el-dialog title="用户列表" v-model="user.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-row class="toolbar">
        <el-button @click="showUserFormDialog" type="primary">新增</el-button>
        <el-button @click="deleteMultipleUser" type="danger">批量删除</el-button>
      </el-row>
      <el-table
        highlight-current-row
        v-loading.body="user.loading"
        :data="user.items"
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
            <el-button title="删除" @click="deleteUserItem(scope.row.uid)" type="danger" icon='delete' size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pull-right"
                     @size-change="handleUserSizeChange"
                     @current-change="handleUserCurrentChange"
                     :current-page="user.pager.pageNo"
                     :page-sizes="[5, 10, 20, 50]"
                     :page-size="user.pager.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="user.pager.total">
      </el-pagination>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog title="新增用户" v-model="user.form.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="userForm" :model="user.form" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="UID：" prop="uid" :rules="{required: true, message: 'UID不能为空', trigger: 'blur'}">
              <el-input v-model="user.form.uid" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUserForm">确 定</el-button>
        <el-button @click="user.form.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog title="推送消息" v-model="message.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="messageForm" label-width="60px" class="dialog-form">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="消息：">
              <el-input :rows="3" type="textarea" v-model="message.text" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendMsg">确 定</el-button>
        <el-button @click="message.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'topicMng',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: false,
        search: {
          appCode: 'fxChat'
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
            name: '',
            code: '',
            subscribeSetting: {
              disable: false,
              tags: []
            },
            publishSetting: {
              disable: false,
              subscribe: false,
              tags: [],
              speakInterval: 100
            },
            group: false,
            offline: false,
            onlineStatusNotice: false
          },
          rules: rules
        },
        tags: null,
        user: {
          type: '',
          show: false,
          loading: false,
          topicCode: '',
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
        message: {
          show: false,
          text: '',
          topic: null
        }
      };
    },
    mounted () {
      this.query();
    },
    methods: {
      showMessageDialog (row) {
        this.message.text = '';
        this.message.topic = row;
        this.message.show = true;
      },

      sendMsg () {
        if (!this.message.text) {
          this.$message({
            type: 'warning',
            message: '请输入要发送消息!'
          });
          return;
        }
        api.sendTopicMsg(this.table.appCode, this.message.topic.code, {msg: this.message.text}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.message.show = false;
            this.$message({
              type: 'success',
              message: '消息推送成功!'
            });

            // 记录日志
            bsmp.log({
              component: 'app_join',
              type: 'send',
              content: `[Topic] params: ${JSON.stringify({
                appCode: this.table.appCode, topicCode: this.message.topic.code, msg: this.message.text})}`
            });
          }
        });
      },
      getTags () {
        if (!this.table.appCode) {
          return;
        }
        api.getTagList(this.table.appCode, {pageNo: 0, pageSize: 1000}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.tags = data.data.data;
          }
        });
      },
      generateBolFmt(key) {
        let disable = '否';
        if (key) {
          disable = '是';
        }
        return disable;
      },
      /**
       * 发布格式化
       * */
      publishFmt (row) {
        return typeof row.publishSetting !== 'undefined' && typeof row.publishSetting.disable !== 'undefined' ? this.generateBolFmt(row.publishSetting.disable) : '否';
      },
      /**
       * 订阅格式化
       * */
      subscribeFmt (row) {
        return typeof row.subscribeSetting !== 'undefined' && typeof row.subscribeSetting.disable !== 'undefined' ? this.generateBolFmt(row.publishSetting.disable) : '否';
      },
      /**
       * 禁用格式化
       * */
      disableFmt (row) {
        return typeof row.disable !== 'undefined' ? this.generateBolFmt(row.disable) : '否';
      },
      /**
       * 禁用格式化
       * */
      groupFmt (row) {
        return typeof row.group !== 'undefined' ? this.generateBolFmt(row.group) : '否';
      },
      offlineFmt (row) {
        return typeof row.offline !== 'undefined' ? this.generateBolFmt(row.offline) : '否';
      },
      onlineStatusNoticeFmt (row) {
        return typeof row.onlineStatusNotice !== 'undefined' ? this.generateBolFmt(row.onlineStatusNotice) : '否';
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.dialog.type === 1 && !this.search.appCode) {
          this.$message.warning('请先选择应用！');
          return;
        }

        this.getTags();
        if (this.$refs['topicForm'] && this.$refs['topicForm'].resetFields) {
          this.$refs['topicForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          this.dialog.form = JSON.parse(JSON.stringify(this.table.items[index]));
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            name: '',
            code: '',
            subscribeSetting: {
              disable: false,
              tags: []
            },
            publishSetting: {
              disable: false,
              subscribe: false,
              tags: [],
              speakInterval: 100
            },
            group: false,
            offline: false,
            onlineStatusNotice: false
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['topicForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              // 新增
              api.addTopic(this.search.appCode, this.dialog.form).then((res) => {
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
                    component: 'app_join',
                    type: 'add',
                    content: `[Topic] params: ${JSON.stringify({
                      appCode: this.search.appCode, ...this.dialog.form})}`
                  });
                }
              });
            } else {
              api.editTopic(this.table.appCode, this.dialog.form).then((res) => {
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
                    component: 'app_join',
                    type: 'modify',
                    content: `[Topic] params: ${JSON.stringify({
                      appCode: this.table.appCode, ...this.dialog.form})}`
                  });
                }
              });
            }
          } else {
            return false;
          }
        });
      },
      disableTopic(row, bol) {
        api.disableTopic(this.table.appCode, row.code, bol).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.query();

            // 记录日志
            bsmp.log({
              component: 'app_join',
              type: 'disable',
              content: `[Topic] params: ${JSON.stringify({
                appCode: this.table.appCode, topicCode: row.code, disable: bol})}`
            });
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
          api.removeTopic(this.table.appCode, code).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'app_join',
                type: 'delete',
                content: `[Topic] params: ${JSON.stringify({appCode: this.table.appCode, tag: tag})}`
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
        if (!this.search.appCode) {
          return;
        }
        this.loading = true;
        let params = Object.assign({}, this.search, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getTopicList(params.appCode, params).then((res) => {
          this.loading = false;
          this.table.appCode = params.appCode;
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
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      /**
       * 用户列表弹窗
       * */
      showUserDialog(type) {
        this.user.type = type;
        this.user.topicCode = this.dialog.form.code;
        this.user.items = [];
        this.user.pager = {
          pageSize: 20,
          pageNo: 1,
          total: 0
        };

        this.multipleSelection = [];

        this.getTopicUsers();
        this.user.show = true;
      },

      showUserFormDialog() {
        this.user.form.uid = '';
        this.user.form.show = true;
      },

      submitUserForm() {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            // 新增
            let uid = this.getTopicUserUid().concat(this.user.form.uid);
            let method = null;
            switch (this.user.type) {
              case 'user':
                method = api.editTopicUser(this.table.appCode,
                  this.user.topicCode,
                  uid);
                break;
              case 'subscribe':
                method = api.editTopicSubscribeUser(this.table.appCode,
                  this.user.topicCode,
                  uid);
                break;
              case 'publish':
                method = api.editTopicPublishUser(this.table.appCode,
                  this.user.topicCode,
                  uid);
                break;
            }
            method.then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                this.getTopicUsers();

                // 记录日志
                bsmp.log({
                  component: 'app_join',
                  type: 'add',
                  content: `[Topic User] params: ${JSON.stringify({
                    appCode: this.table.appCode,
                    topicCode: this.user.topicCode,
                    type: this.user.type,
                    uid
                  })}`
                });
              }
            });

            this.user.form.show = false;
          } else {
            return false;
          }
        });
      },

      getTopicUserUid() {
        let uid = [];
        if (this.user.items) {
          this.user.items.forEach((item) => {
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
          let method = null;
          switch (this.user.type) {
            case 'user':
              method = api.removeTopicUser(this.table.appCode, this.user.topicCode, id);
              break;
            case 'subscribe':
              method = api.removeTopicSubscribeUser(this.table.appCode, this.user.topicCode, id);
              break;
            case 'publish':
              method = api.removeTopicPublishUser(this.table.appCode, this.user.topicCode, id);
              break;
          }
          // 删除
          method.then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getTopicUsers();

              // 记录日志
              bsmp.log({
                component: 'app_join',
                type: 'delete',
                content: `[Topic User] params: ${JSON.stringify({
                  appCode: this.table.appCode,
                  topicCode: this.user.topicCode,
                  type: this.user.type,
                  uid: id
                })}`
              });
            }
          });
        }).catch(e => {
        });
      },

      getTopicUsers () {
        if (!this.table.appCode) {
          return;
        }
        if (!this.user.topicCode) {
          return;
        }
        this.user.loading = true;
        let params = Object.assign({}, this.user.pager, {pageNo: this.user.pager.pageNo - 1});
        let method = null;
        switch (this.user.type) {
          case 'user':
            method = api.getTopicUsers(this.table.appCode, this.user.topicCode, params);
            break;
          case 'subscribe':
            method = api.getTopicSubscribeUsers(this.table.appCode, this.user.topicCode, params);
            break;
          case 'publish':
            method = api.getTopicPublishUsers(this.table.appCode, this.user.topicCode, params);
            break;
        }
        method.then((res) => {
          this.user.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.user.items = data.data.data;
            this.user.pager = Object.assign({}, this.user.pager,
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
        this.user.pager.pageSize = val;
        this.getTopicUsers();
      },

      /**
       * 页码变化
       * @param val
       */
      handleUserCurrentChange (val) {
        if (this.user.pager.pageNo) {
          this.user.pager.pageNo = val;
          this.getTopicUsers();
        }
      }
    }
  };

  // 表单规则
  let rules = {
    name: [
      {required: true, message: '请输入频道名称', trigger: 'blur'}
    ],
    code: [
      {required: true, message: '请输入频道编码', trigger: 'blur'}
    ]
  };
</script>
