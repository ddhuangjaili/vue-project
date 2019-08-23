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
          <el-button type="primary" @click="query">查询</el-button>
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
  import bsmp from 'bsmp_main';
  export default {
    name: 'statOnline',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: false,
        search: {
          code: 'fxChat',
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
    methods: {
      /**
       * 日期格式化
       * */
      dateFmt (row) {
        return row.date ? bsmp.util.formatDate.format(new Date(row.date), 'yyyy-MM-dd hh:mm:ss') : '';
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
