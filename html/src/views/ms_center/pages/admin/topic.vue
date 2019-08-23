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
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button title="启用" @click="statusItem(scope.row.code, 0)" v-if="optAuth.status && scope.row.status !== 0" size="mini"><i class="icon-play"></i></el-button>
          <el-button title="禁用" @click="statusItem(scope.row.code, 999)" v-if="optAuth.status && scope.row.status === 0" size="mini"><i class="icon-stop"></i></el-button>
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
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'admin-topic',
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
        apps: null
      };
    },
    mounted () {
      this.getApps();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'ms_center_admin_topic_view',
          status: 'ms_center_admin_topic_status'
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

      statusItem(code, status) {
        let title = status > 0 ? '确定要禁用该条记录？' : '确定要启用该条记录？';
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.adminTopicStatus(this.table.appCode, code, status).then((res) => {
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
                content: `[AdminTopic] params: ${JSON.stringify({code, status})}`
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
        if (!this.search.appCode) {
          return;
        }
        this.loading = true;
        let params = Object.assign({}, this.search, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getTopicList(params.appCode, params).then((res) => {
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
