<template>
  <div>
    <el-row class="toolbar">
      <el-button v-show="optAuth.search" @click="query()" title="刷新" type="primary" size="small">
        <i class="icon-arrows-cw"></i>&nbsp;&nbsp;刷新
      </el-button>
      <el-button v-show="optAuth.excel" type="primary" @click="handleDownload" title="导出" :loading="downloading"><i class="icon-download"></i>&nbsp;&nbsp;导出</el-button>
    </el-row>
    <el-table
      id="tableExcel"
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      stripe
      :max-height="height - 90"
      style="width: 100%">
      <el-table-column
        prop="code"
        label="编号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="question"
        label="咨询问题">
      </el-table-column>
      <el-table-column
        width="300"
        prop="createDate"
        label="操作信息">
        <template slot-scope="scope">
          账号ID：{{scope.row.accountID}}
          <br>
          时间：{{scope.row.createDate}}

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
  import api from '../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'crm_service_knowledgeBase',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        downloading: false,
        table: {
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          }
        }
      }
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'crm_service_knowledgeBase_list',
          excel: 'crm_service_knowledgeBase_excel'
        });
      }
    },
    mounted () {
      this.query();
    },
    methods: {

      handleDownload() {
        this.downloading = true;
        api.getKnowledgeBaseAll().then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            const filedHeader = ['编号', '咨询问题', '账号ID', '时间'];
            const fieldNames = ['code', 'question', 'accountID', 'createDate'];
            let filedData =  bsmp.util.excellentExport.formatJson(fieldNames, data.data);
            bsmp.util.excellentExport.csvByData('知识库.csv', filedHeader, filedData);
          }
          this.downloading = false;
        });
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = Object.assign({}, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getKnowledgeBaseList(params).then((res) => {
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
</script>
<style lang="stylus" scoped>
  .export-btn
    text-decoration none
    background #20a0ff
    color #fff
</style>
