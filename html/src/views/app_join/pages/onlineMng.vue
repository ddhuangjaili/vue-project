<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="switchTab">
      <el-tab-pane label="应用在线" name="list"></el-tab-pane>
      <el-tab-pane label="平台在线" name="platform"></el-tab-pane>
      <el-tab-pane label="频道在线" name="topic"></el-tab-pane>
    </el-tabs>
    <query-panel v-show="activeName !== 'list'">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item v-show="activeName === 'platform'">
          <el-select clearable v-model="search.platformCode" filterable placeholder="平台">
            <el-option v-for="(c, key) in platforms" :label="c.name" :value="c.code"
                       :key="'search-platform-'+ c.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="activeName === 'topic'">
          <el-select clearable v-model="search.topicCode" filterable placeholder="频道">
            <el-option v-for="(c, key) in topics" :label="c.name" :value="c.code"
                       :key="'search-topic-'+ c.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 185"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="socketId"
        label="Socket ID"
        width="250">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="uid"
        label="UID"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="topics"
        label="加入的频道列表"
        :formatter="topicFmt"
        width="300">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="platform"
        label="登录平台"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="ip"
        label="登录IP">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="showDialog(scope.row)" v-show="activeName === 'list'" size="mini">订阅
          </el-button>
          <el-button @click="leaveTopic(scope.row.uid)" v-show="activeName === 'topic'" size="mini">
            取消订阅
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
    <el-dialog title="订阅频道" v-model="dialog.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="userForm" :model="dialog.form" label-width="150px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="频道：" :rules="{required: true, message: '频道不能为空', trigger: 'blur'}">
              <el-select clearable v-model="dialog.form.topics" multiple filterable placeholder="频道">
                <el-option v-for="(c, key) in topics" :label="c.name" :value="c.code"
                           :key="'form-topic-'+ c.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="joinTopic">确 定</el-button>
        <el-button @click="dialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'onlineMng',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: false,
        activeName: 'list',
        search: {
          appCode: 'fxChat',
          topicCode: null,
          platformCode: null
        },
        params: {
          appCode: null,
          topicCode: null,
          platformCode: null
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
          form: {
            uid: '',
            topics: []
          }
        },
        apps: null,
        platforms: null,
        topics: null
      };
    },
    mounted () {
      this.query();
    },
    methods: {
      topicFmt(row) {
        return row.topics ? row.topics.toString() : '';
      },
      getPlatforms () {
        api.getPlatformList(this.search.appCode, {pageNo: 0, pageSize: 100}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.platforms = data.data.data;
          }
        });
      },
      getTopics () {
        api.getTopicList(this.search.appCode, {pageNo: 0, pageSize: 100}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.topics = data.data.data;
          }
        });
      },
      switchTab() {
        this.table.items = [];
        this.table.pager.pageNo = 1;
        this.table.pager.total = 0;
      },
      appChange() {
        this.getPlatforms();
        this.getTopics();
      },

      /**
       * 显示弹窗
       * */
      showDialog(row) {
        this.dialog.show = true;

        if (row.topics) {
          this.dialog.form.topics = [];
        }

        this.dialog.form.uid = row.uid;
      },

      joinTopic() {
        if (!this.dialog.form.topics.length) {
          this.$message.warning('请选择需要订阅的频道！');
          return;
        }
        api.joinTopic(this.params.appCode, this.dialog.form.uid, this.dialog.form.topics).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.$message({
              type: 'success',
              message: '频道订阅成功!'
            });
            this.query();

            // 记录日志
            bsmp.log({
              component: 'app_join',
              type: 'join',
              content: `[Online] params: ${JSON.stringify({
                appCode: this.params.appCode,
                uid: this.dialog.form.uid,
                topics: this.dialog.form.topics
              })}`
            });
          }
        });
      },

      leaveTopic(uid) {
        this.$confirm('确定要取消订阅?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.leaveTopic(this.params.appCode, uid, [this.params.topicCode]).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '取消订阅成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'app_join',
                type: 'leave',
                content: `[Online] params: ${JSON.stringify({
                  appCode: this.params.appCode,
                  uid: uid,
                  topics: this.params.topicCode
                })}`
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
        let params = Object.assign({}, this.search, this.table.pager, {pageNo: this.table.pager.pageNo - 1});

        let method = null, tabName = '';
        if (this.activeName === 'list') {
          tabName = 'list';
          this.loading = true;
          method = api.getListOnline(this.search.appCode, params);
        } else if (this.activeName === 'platform') {
          tabName = 'platform';
          if (!this.search.platformCode) {
            this.$message.warning('请先选择平台！');
            return;
          }
          this.loading = true;
          method = api.getPlatformOnline(this.search.appCode, this.search.platformCode, params);
        } else if (this.activeName === 'topic') {
          tabName = 'topic';
          if (!this.search.topicCode) {
            this.$message.warning('请先选择频道！');
            return;
          }
          this.loading = true;
          method = api.getTopicOnline(this.search.appCode, this.search.topicCode, params);
        }

        method.then((res) => {
          this.loading = false;
          let data = res.data;
          this.params = {
            appCode: params.appCode,
            platformCode: params.platformCode,
            topicCode: params.topicCode
          };
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
