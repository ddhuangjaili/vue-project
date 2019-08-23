<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.date"
            type="daterange"
            placeholder="选择日期范围">
          </el-date-picker>
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
      :max-height="height - 85"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="date"
        :formatter="dateFmt"
        label="日期"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="appCode"
        label="应用编码"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="count"
        label="在线最高记录"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="server"
        label="channel服务器在线情况">
        <template slot-scope="scope">
          <table class="stat-table" v-if="scope.row.server">
            <thead>
            <tr>
              <th>服务ID</th>
              <th>在线人数</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(val, key) in scope.row.server">
              <td>{{key}}</td>
              <td>{{val}}</td>
            </tr>
            </tbody>
          </table>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'admin-onlineStat',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: false,
        apps: null,
        search: {
          code: '',
          date: null
        },
        table: {
          items: []
        }
      }
    },
    mounted() {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'ms_center_admin_online_stat_view'
        });
      }
    },
    methods: {
      /**
       * 日期格式化
       * */
      dateFmt (row) {
        return row.date ? bsmp.util.formatDate.format(new Date(row.date), 'yyyy-MM-dd') : '';
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = {};
        if (this.search.date) {
          if (this.search.date[0]) {
            params.startTime = bsmp.util.formatDate.format(this.search.date[0], 'yyyy-MM-dd');
          }
          if (this.search.date[1]) {
            params.endTime = bsmp.util.formatDate.format(this.search.date[1], 'yyyy-MM-dd');
          }
        }
        api.adminStatOnline(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data;
          }
        }).catch(e => {
          this.loading = false;
        });
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .stat-table
    width 100%
    thead
      color #5e6d82
      background-color #eff2f7
      th
        width 20%
        text-align center
        border 1px solid rgb(223, 230, 236)
    tbody
      td
        text-align center
        border 1px solid rgb(223, 230, 236)
</style>
