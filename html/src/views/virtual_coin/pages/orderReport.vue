<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.orderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.createUser" placeholder="创建人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.updateUser" placeholder="更新人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.datetime"
            type="daterange"
            placeholder="时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.clientGroup" placeholder="客户组别">
            <el-option v-for="(val, key) in clientGroupMap" :label="val" :value="key"
                       :key="'search-clientGroup-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <el-row class="toolbar">
      <el-button type="primary" v-show="optAuth.export"  @click="handleDownload" title="导出"
                 :loading="downloading"><i class="icon-download"></i>&nbsp;&nbsp;导出
      </el-button>
    </el-row>

    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 165"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="orderId"
        label="订单ID"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="buyerName"
        label="买入方昵称"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="buyerClientGroup"
        :formatter="buyerClientGroupFmt"
        label="买入方客户组别"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="sellerName"
        label="卖出方昵称"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="sellerClientGroup"
        :formatter="sellerClientGroupFmt"
        label="卖出方客户组别"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="status"
        label="状态"
        :formatter="statusFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="appealType"
        label="申诉类型"
        :formatter="appealTypeFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="appealReason"
        label="申诉理由"
        width="250">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注信息"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createUser"
        label="创建人"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createDate"
        :formatter="createDateFmt"
        width="200"
        label="创建时间">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateUser"
        label="更新人"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateDate"
        :formatter="updateDateFmt"
        width="200"
        label="更新时间">
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
  import bsmp  from 'bsmp_main';
  export default {
    name: 'orderManage',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        downloading: false,
        search: {
          orderNo: '',
          mobileNo: '',
          createUser: '',
          updateUser: '',
          clientGroup: '',
          datetime: null
        },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          }
        },
        statusMap: {
          '0': '未付款',
          '1': '已付款',
          '2': '已完成',
          '3': '申诉中',
          '4': '已取消'
        },
        appealTypeMap: {
          '0': '对方未付款',
          '1': '对方未放行',
          '2': '对方无应答',
          '3': '对方有欺诈行为',
          '4': '其它'
        },
        clientGroupMap: this.getClientGroupList()
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'virtual_coin_order_report_view',
          export: 'virtual_coin_order_report_export'
        });
      }
    },
    methods: {
      appealTypeFmt(row) {
        return typeof row.appealType !== 'undefined' ? this.appealTypeMap[row.appealType] : '';
      },
      statusFmt(row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
      },
      buyerClientGroupFmt(row) {
        return typeof row.buyerClientGroup !== 'undefined' ? this.clientGroupMap[row.buyerClientGroup] : '';
      },
      sellerClientGroupFmt(row) {
        return typeof row.sellerClientGroup !== 'undefined' ? this.clientGroupMap[row.sellerClientGroup] : '';
      },
      /**
       * 日期格式化
       * */
      createDateFmt (row) {
        return row.createDate ? bsmp.util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      updateDateFmt (row) {
        return row.updateDate ? bsmp.util.formatDate.format(new Date(row.updateDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },

      /**
       * 日期格式化
       * */
      dateToStr(date) {
        return bsmp.util.formatDate.format(date, 'yyyy-MM-dd hh:mm:ss');
      },

      handleDownload() {

        if (!this.table.items.length) {
          this.$message.warning('查询结果为空，没有可导出的数据！');
          return;
        }

        let params = bsmp.util.deleteBlank(this.search);
        params = Object.assign({}, params, this.table.pager);
        if (this.search.datetime && this.search.datetime.length) {
          if (this.search.datetime[0]) {
            params.startDate = this.dateToStr(this.search.datetime[0]);
          }
          if (this.search.datetime[1]) {
            params.endDate = this.dateToStr(new Date(this.search.datetime[1].setHours(23, 59, 59, 0)));
          }
        }
        delete params.datetime;

        params.pageNumber = 1;
        params.pageSize = 1000000;

        this.downloading = true;
        api.getOrderReportList(params).then((res) => {
          let data = res.data, items = [];

          if (data && data.code === '0') {
            if (data.data.data instanceof Array) {
              items = data.data.data;

              let filedHeader = ['订单ID','买入方昵称','买入方组别','卖出方昵称','卖出方组别', '状态', '申诉类型',
                  '申诉理由', '备注信息',  '创建人', '创建时间',
                  '更新人', '更新时间'],
                fieldNames = ['orderId','buyerName','buyerClientGroup','sellerName','sellerClientGroup', 'status', 'appealType',
                  'appealReason', 'remark', 'createUser', 'createDate',
                  'updateUser', 'updateDate'];

              let filedData = bsmp.util.excellentExport.formatJson(fieldNames, items, {
                orderId: {tab: true},
                buyerName: {tab: true},
                buyerClientGroup: {map: this.buyerClientGroupFmt},
                sellerName: {tab: true},
                sellerClientGroup: {map: this.sellerClientGroupFmt},
                status: {map: this.statusFmt},
                appealType: {map: this.appealTypeFmt},
                createDate: {map: this.createDateFmt, tab: true},
                updateDate: {map: this.updateDateFmt, tab: true}
              });
              bsmp.util.excellentExport.csvByData('订单流水.csv', filedHeader, filedData);
            }
            this.downloading = false;
          }
        });
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        params = Object.assign({}, params, this.table.pager);

        if (this.search.datetime && this.search.datetime.length) {
          if (this.search.datetime[0]) {
            params.startDate = this.dateToStr(this.search.datetime[0]);
          }
          if (this.search.datetime[1]) {
            params.endDate = this.dateToStr(new Date(this.search.datetime[1].setHours(23, 59, 59, 0)));
          }
        }
        delete params.datetime;

        api.getOrderReportList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: parseInt(data.data.pageNo, 10),
                total: data.data.total
              });
          }
        });
      },

      /**
       * 查询客户分组列表
       * */
      getClientGroupList() {
        this.clientGroupMap = {};
        return api.getClientGroupList({pageNo:1,pageSize:30,status:0}).then((res) => {
          let data = res.data;
          if (data && data.code === '0' && data.data && data.data.data.length) {
            data.data.data.forEach((item) => {
              this.clientGroupMap[item.id] = item.name;
            });
          }
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
