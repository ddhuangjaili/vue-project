<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select clearable v-model="search.code" filterable placeholder="应用">
            <el-option v-for="(c, key) in apps" :label="c.name" :value="c.code"
                       :key="'search-app-'+ c.code"></el-option>
          </el-select>
        </el-form-item>
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
        width="300" sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="count"
        label="在线最高记录">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'onlineStat',
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
      this.getApps();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'ms_center_stat_online_view'
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
       * 日期格式化
       * */
      dateFmt (row) {
        return row.date ? bsmp.util.formatDate.format(new Date(row.date), 'yyyy-MM-dd') : '';
      },

      /**
       * 查询
       */
      query () {
        if (!this.search.code) {
          return;
        }
        this.loading = true;
        let params = {
          code: this.search.code
        };
        if (this.search.date) {
          if (this.search.date[0]) {
            params.startTime = bsmp.util.formatDate.format(this.search.date[0], 'yyyy-MM-dd');
          }
          if (this.search.date[1]) {
            params.endTime = bsmp.util.formatDate.format(this.search.date[1], 'yyyy-MM-dd');
          }
        }
        api.statOnline(this.search.code, params).then((res) => {
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
