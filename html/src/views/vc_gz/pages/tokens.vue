<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.tokenVal" placeholder="token"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.mobileNo" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.nameCn" placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.accountCode" placeholder="账号"></el-input>
        </el-form-item>
         <el-form-item>
          <el-input v-model="search.currencyCode" placeholder="币种代码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.clientGroup" placeholder="客户组别">
            <el-option v-for="(val, key) in clientGroupMap" :label="val" :value="key"
                       :key="'search-clientGroup-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.fromType" placeholder="token来源">
            <el-option v-for="(val, key) in fromTypeMap" :label="val" :value="key"
                       :key="'fromType-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.status" placeholder="token状态">
            <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                       :key="'status-'+ key"></el-option>
          </el-select>
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
        </el-form-item>
      </el-form>
    </query-panel>
    <el-row class="toolbar">
      <el-button type="primary" v-show="optAuth.export" @click="handleDownload" title="导出"
                 :loading="downloading"><i class="icon-download"></i>&nbsp;&nbsp;导出
      </el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 125"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="token"
        label="token"
        width="300">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="fromType"
        :formatter="fromTypeFmt"
        label="来源"
        width="110">
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
        prop="amount"
        label="数量"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="mobileNo"
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
        prop="accountCode"
        label="账号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注"
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
      <el-table-column
        fixed="right"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button title="取消" v-show="optAuth.cancel && scope.row.status === 0"
                     @click="cancelToken(scope.row.id)" size="mini" type="danger">
            取消
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
          tokenVal: '',
          currencyCode: '',
          accountCode: '',
          createUser: '',
          updateUser: '',
          clientGroup: '',
          datetime: null,
          fromType: '',
          status: ''
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
          search: 'vc_gz_tokens_view',
          cancel: 'vc_gz_tokens_cancel',
          export: 'vc_gz_tokens_export'
        });
      }
    },
    methods: {
      statusFmt(row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
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
      clientGroupFmt(row) {
        return typeof row.clientGroup !== 'undefined' ? this.clientGroupMap[row.clientGroup] : '';
      },
      fromTypeFmt(row) {
        return typeof row.fromType !== 'undefined' ? this.fromTypeMap[row.fromType] : '';
      },

      /**
       * 取消
       * */
      cancelToken(id) {
        this.$prompt('请输入取消理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          let params = {
            id,
            remark: value
          };
          api.cancelToken(params).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '取消成功!'
              });

              this.query();

              // 记录日志
              bsmp.log({
                component: 'vc_gz',
                type: 'cancel',
                content: `[tokens] params: ${JSON.stringify(params)}`
              });
            }
          });
        }).catch(() => {

        });
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
        api.getTokenList(params).then((res) => {
          let data = res.data, items = [];

          if (data && data.code === '0') {
            if (data.data.data instanceof Array) {
              items = data.data.data;

              let filedHeader = ['token', '来源','状态', '数量', '手机号码','昵称','客户组别', '币种代码',
                  '账号', '备注','创建人', '创建时间', '更新人', '更新时间'],
                  fieldNames = ['token', 'status', 'amount', 'mobileNo','nameCn','clientGroup', 'currencyCode',
                    'accountCode', 'remark', 'createUser', 'createDate',
                  'updateUser', 'updateDate'];

              let filedData = bsmp.util.excellentExport.formatJson(fieldNames, items, {
                token: {tab: true},
                fromType: {map: this.fromTypeFmt},
                status: {map: this.statusFmt},
                mobileNo: {tab: true},
                clientGroup: {map: this.clientGroupFmt},
                currencyCode: {tab: true},
                accountCode: {tab: true},
                createDate: {map: this.createDateFmt, tab: true},
                updateDate: {map: this.updateDateFmt, tab: true}
              });
              bsmp.util.excellentExport.csvByData('token管理.csv', filedHeader, filedData);
            }
            this.downloading = false;
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

        api.getTokenList(params).then((res) => {
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
