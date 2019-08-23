<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.reasonNo" placeholder="流水号"></el-input>
        </el-form-item>
         <el-form-item>
          <el-input v-model="search.mobile" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.nameCn" placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.accountCode" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.type" placeholder="类型">
            <el-option v-for="(val, key) in typeMap" :label="val" :value="key"
                       :key="'search-type-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.clientGroup" placeholder="客户组别">
            <el-option v-for="(val, key) in clientGroupMap" :label="val" :value="key"
                       :key="'search-clientGroup-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.currencyCode" placeholder="币种代码"></el-input>
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
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
          <el-button type="primary" v-show="optAuth.export" @click="handleDownload" title="导出"
                     :loading="downloading"><i class="icon-download"></i>&nbsp;&nbsp;导出
          </el-button>
        </el-form-item>
      </el-form>
    </query-panel>

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
        prop="reasonNo"
        label="流水号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="mobile"
        label="手机号码"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="nameCn"
        label="昵称"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="accountCode"
        label="账号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="clientGroup"
        :formatter="clientGroupFmt"
        label="客户组别"
        width="110">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="currencyCode"
        label="币种代码"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="amount"
        label="交易数量"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="tradeLastAmount"
        label="交易后的数量"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="type"
        label="类型"
        :formatter="typeFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注信息"
        :formatter="remarkFmt"
        width="200">
           <template slot-scope="scope">
              <a href="javascript:void(0)" @click="queryToken(scope.row.amountToken)">{{remarkFmt(scope.row)}}</a>
           </template>
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

  <!-- 弹窗框 -->
      <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
        <el-form :model="dialog.form" label-width="120px" class="dialog-form">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="手机号：" prop="mobileNo">
                <el-input v-model="dialog.form.mobileNo" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号：" prop="accountCode">
                <el-input v-model="dialog.form.accountCode" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="币种代码：" prop="currencyCode">
                    <el-input v-model="dialog.form.currencyCode" auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="数量：" prop="amount">
                    <el-input v-model="dialog.form.amount" auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="来源：" prop="fromType">
                  <el-select v-model="dialog.form.fromType" filterable placeholder="来源">
                    <el-option v-for="(val, key) in fromTypeMap" :label="val" :value="key"
                               :key="'form-fromType-'+ key"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态：" prop="status">
                  <el-select v-model="dialog.form.status" filterable placeholder="状态">
                    <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                               :key="'form-status-'+ key"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="备注信息：" prop="remark">
                <el-input type="textarea" :rows="3" v-model="dialog.form.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
      <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'tokens',
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
          reasonNo: '',
          accountCode: '',
          type: '',
          platformNo: '',
          currencyCode: '',
          createUser: '',
          updateUser: '',
          clientGroup: '',
          datetime: null
        },
        dialog: {
          show: false,
          title: '',
          form: {
            mobileNo:'',
            accountCode:'',
            currencyCode:'',
            amount:'',
            remark:'',
            fromType: '',
            status: ''
          }
        },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          }
        },
        typeMap: {
          '0': '买',
          '1': '卖',
          '2': '充币',
          '3': '提币',
          '4': '后台转入',
          '5': '后台转出'
        },
       statusMap: {
          '0': '待使用',
          '1': '已使用',
          '2': '已取消'
        },
       fromTypeMap: {
          '0': '提币',
          '1': '商城'
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
          search: 'virtual_coin_currency_report_view',
          export: 'virtual_coin_currency_report_export',
        });
      }
    },
    methods: {
      /**
       * 日期格式化
       * */
      createDateFmt (row) {
        return row.createDate ? bsmp.util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      updateDateFmt (row) {
        return row.updateDate ? bsmp.util.formatDate.format(new Date(row.updateDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      queryToken (token) {
        api.findByToken(token).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            let form = Object.assign({}, data.data);
            form.status = form.status + '';
            form.fromType = form.fromType + '';
            this.dialog.form = form;
            this.dialog.show =  true;
          }
        });
        return '';
      },

      typeFmt(row) {
        return typeof row.type !== 'undefined' ? this.typeMap[row.type] : '';
      },
      remarkFmt(row) {
        if (row.remark === 'cancelToken') {
          return '取消提币(Token:' + (row.amountToken ? row.amountToken : '') + ')';
        } else {
          return row.amountToken;
        }
      },
      clientGroupFmt(row) {
        return typeof row.clientGroup !== 'undefined' ? this.clientGroupMap[row.clientGroup] : '';
      },

      handleDownload() {

        if (!this.table.items.length) {
          this.$message.warning('查询结果为空，没有可导出的数据！');
          return;
        }

        let params = bsmp.util.deleteBlank(this.search);
        params = Object.assign({}, params, this.table.pager);
        params.pageNumber = 1;
        params.pageSize = 1000000;

        this.downloading = true;
        api.getCurrencyReportList(params).then((res) => {
          let data = res.data, items = [];

          if (data && data.code === '0') {
            if (data.data.data instanceof Array) {
              items = data.data.data;

              let filedHeader = ['流水号', '手机号码', '昵称', '账号','客户组别', '币种代码',
                  '交易数量', '交易后的数量', '类型', '备注信息',
                '创建人', '创建时间', '更新人', '更新时间'],
                fieldNames = ['reasonNo', 'mobile', 'nameCn', 'accountCode', 'clientGroup','currencyCode',
                  'amount', 'tradeLastAmount', 'type', 'remark',
                  'createUser', 'createDate', 'updateUser', 'updateDate'];

              let filedData = bsmp.util.excellentExport.formatJson(fieldNames, items, {
                reasonNo: {tab: true},
                mobile: {tab: true},
                accountCode: {tab: true},
                clientGroup: {map: this.clientGroupFmt},
                currencyCode: {tab: true},
                createDate: {map: this.createDateFmt, tab: true},
                updateDate: {map: this.updateDateFmt, tab: true},
                type: {map: this.typeFmt}
              });
              bsmp.util.excellentExport.csvByData('资金流水.csv', filedHeader, filedData);
            }
            this.downloading = false;
          }
        });
      },

      /**
       * 日期格式化
       * */
      dateToStr(date) {
        return bsmp.util.formatDate.format(date, 'yyyy-MM-dd hh:mm:ss');
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

        api.getCurrencyReportList(params).then((res) => {
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
