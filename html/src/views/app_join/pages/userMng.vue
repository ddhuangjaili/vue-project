<template>
  <div>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 130"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        prop="uid"
        label="UID"
        width="200" sortable>
      </el-table-column>
      <el-table-column
        prop="token"
        label="Token"
        width="200"
        sortable>
      </el-table-column>
      <el-table-column
        prop="disable"
        label="状态"
        width="100"
        :formatter="disableFmt">
      </el-table-column>
      <el-table-column
        prop="speechLimits"
        label="禁言"
        width="100"
        :formatter="limitFmt">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="tags"
        label="所属标签"
        :formatter="tagFmt"
        width="200"
        sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="topics"
        label="加入频道"
        :formatter="topicFmt"
        width="200"
        sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="subscribeTopicLimits"
        label="限制订阅频道"
        :formatter="subscribeLimitTopicFmt"
        width="200"
        sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="publishTopicLimits"
        label="限制发言阅频道"
        :formatter="publishLimitTopicFmt"
        width="200"
        sortable>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="300"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="showMessageDialog(scope.row)" size="mini">
            <i class="icon-chat-empty"></i>&nbsp;&nbsp;推送消息</el-button>
          <el-button @click="showDialog(scope.row)" size="mini"><i class="icon-chat-empty"></i>&nbsp;&nbsp;禁言设置

          </el-button>
          <el-button title="禁用" @click="disableUser(scope.row, true)" v-show="!scope.row.disable" size="mini">
            <i class="icon-stop"></i></el-button>
          <el-button title="启用" @click="disableUser(scope.row, false)" v-show="scope.row.disable" size="mini">
            <i class="icon-play"></i></el-button>
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
    <el-dialog title="禁言设置" v-model="dialog.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="userForm" :model="dialog.form" label-width="150px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="全局：" prop="global">
              <el-checkbox v-model="dialog.form.global"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="个人：" prop="user">
              <el-checkbox v-model="dialog.form.user"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="dialog.show = false">取 消</el-button>
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
    name: 'userMng',
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
          form: {
            uid: '',
            global: false,
            user: false
          }
        },
        message: {
          show: false,
          text: '',
          tag: null
        }
      };
    },
    mounted () {
      this.query();
    },
    methods: {
      limitFmt(row) {
        let limit = [];
        if (row.speechLimits) {
          if (row.speechLimits.global) {
            limit.push('全局');
          }
          if (row.speechLimits.user) {
            limit.push('个人');
          }
        }
        return limit.join(',');
      },
      tagFmt(row) {
        let tags = [];
        if (row.tags) {
          row.tags.forEach((t) => {
            tags.push(t.tag);
          });
        }
        return tags.join(',');
      },
      topicFmt(row) {
        let topics = [];
        if (row.topics) {
          row.topics.forEach((t) => {
            topics.push(t.topic);
          });
        }
        return topics.join(',');
      },
      subscribeLimitTopicFmt(row) {
        return (row.subscribeTopicLimits || []).join(',');
      },
      publishLimitTopicFmt(row) {
        return (row.publishTopicLimits || []).join(',');
      },
      disableFmt(row) {
        let disable = '启用';
        if (typeof row.disable !== 'undefined' && row.disable) {
          disable = '禁用';
        }
        return disable;
      },

      showMessageDialog (row) {
        this.message.text = '';
        this.message.user = row;
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

        api.sendUserMsg(this.table.appCode, this.message.user.uid, {msg: this.message.text}).then((res) => {
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
              content: `[User] params: ${JSON.stringify({
                appCode: this.table.appCode,
                uid: this.message.user.uid,
                msg: this.message.text
              })}`
            });
          }
        });
      },

      disableUser(row, bol) {
        api.disableUser(this.table.appCode, row.uid, bol).then((res) => {
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
              content: `[User] params: ${JSON.stringify({
                appCode: this.table.appCode,
                uid: row.uid,
                disable: bol
              })}`
            });
          }
        });
      },
      /**
       * 显示弹窗
       * */
      showDialog(row) {
        this.dialog.show = true;

        if (row.speechLimits) {
          this.dialog.form.global = !!row.speechLimits.global;
          this.dialog.form.user = !!row.speechLimits.user;
        } else {
          this.dialog.form = {
            global: false,
            user: false
          };
        }

        this.dialog.form.uid = row.uid;
      },

      submitForm() {
        let params = Object.assign({}, this.dialog.form, {appCode: this.table.appCode});
        api.limitUser(params.appCode, params.uid, params).then((res) => {
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
              component: 'app_join',
              type: 'limit',
              content: `[User] params: ${JSON.stringify(params)}`
            });
          }
        });
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
        api.getUserList(params.appCode, params).then((res) => {
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
      }
    }
  };
</script>
