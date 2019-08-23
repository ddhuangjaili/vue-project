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
        prop="tag"
        label="标签名称"
        width="400" sortable>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button title="启用" @click="statusItem(scope.row.tag, 0)" v-if="optAuth.status && scope.row.status !== 0" size="mini"><i class="icon-play"></i></el-button>
          <el-button title="禁用" @click="statusItem(scope.row.tag, 999)" v-if="optAuth.status && scope.row.status === 0" size="mini"><i class="icon-stop"></i></el-button>
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
    name: 'admin-tag',
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
          search: 'ms_center_admin_tag_view',
          status: 'ms_center_admin_tag_status'
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

      statusItem(tag, status) {
        let title = status > 0 ? '确定要禁用该条记录？' : '确定要启用该条记录？';
        this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.adminTagStatus(this.table.appCode, tag, status).then((res) => {
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
                content: `[AdminTag] params: ${JSON.stringify({tag, status})}`
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
      }
    }
  };
</script>
