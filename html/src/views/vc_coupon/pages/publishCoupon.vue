<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.accountNo" placeholder="交易账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.activityId" placeholder="活动ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.couponId" placeholder="代用券ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.status" placeholder="状态">
            <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                       :key="'search-status-'+ key"></el-option>
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
      <!--<el-button v-show="optAuth.add" @click="showDialog(1)" type="primary">新增</el-button>-->
      <el-button v-show="optAuth.batch" @click="deleteMultiple" type="danger">批量删除</el-button>
      <el-button type="primary" v-show="optAuth.export" @click="handleDownload" title="导出" :loading="downloading"><i class="icon-download"></i>&nbsp;&nbsp;导出
    </el-button>
    </el-row>

    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 165"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        fixed
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="accountNo"
        label="交易账号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="agentId"
        label="代理ID"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="activityId"
        label="活动ID"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="couponFlowNo"
        label="发放流水号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="couponId"
        label="代用券ID"
        width="180">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="mobile"
        label="手机号"
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
        prop="amount"
        label="面额"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="taskAmount"
        label="任务面额"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="activityAmount"
        label="活动面额"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="validTime"
        label="券有效期"
        width="250">
        <template slot-scope="scope">
          {{validBeginFmt(scope.row)}}<br />
          {{validEndFmt(scope.row)}}
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
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <!--<el-button title="编辑" v-show="optAuth.edit && scope.row.publishStatus === 0" @click="showDialog(2, scope.$index)"-->
                     <!--type="info" icon='edit' size="mini"></el-button>-->
          <!--<el-button title="删除" v-show="optAuth.del" type="danger" icon='delete' size="mini"-->
                     <!--@click="deleteItem(scope.row.id)"></el-button>-->
          <!--<el-button title="通过" v-show="optAuth.edit && scope.row.publishStatus === 0" @click="toApprove(scope.row)"-->
                     <!--type="info" size="mini">通过</el-button>-->
          <!--<el-button title="拒绝" v-show="optAuth.edit && scope.row.publishStatus === 0" type="danger" size="mini"-->
                     <!--@click="toReject(scope.row)">拒绝</el-button>-->
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
    name: 'publishCoupon',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        search: {
          accountNo: '',
          mobile: '',
          activityId: '',
          couponId: '',
          status: '',
          createUser: '',
          updateUser: '',
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
        accountMap: {},
        statusMap: {
          //0[待激活]，1[可用]，2[已使用]，3[已提券]，4[已取消]
          '0': '待激活',
          '1': '可用',
          '2': '已使用',
          '3': '已提券',
          '4': '已取消'
        },
        multipleSelection: [],
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'vc_coupon_publishCoupon_view',
          add: 'vc_coupon_publishCoupon_add',
          edit: 'vc_coupon_publishCoupon_edit',
          del: 'vc_coupon_publishCoupon_del',
          export: 'vc_coupon_publishCoupon_export',
          batch: 'vc_coupon_publishCoupon_batch'
        });
      }
    },
    methods: {
      statusFmt(row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
      },
      accountFmt(row) {
        return typeof row.accountNo !== 'undefined' ? this.accountMap[row.accountNo] : '';
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
      validBeginFmt (row) {
        return row.validBegin ? '开始时间：'+bsmp.util.formatDate.format(new Date(row.validBegin), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      validEndFmt (row) {
        return row.validEnd ? '结束时间：' + bsmp.util.formatDate.format(new Date(row.validEnd), 'yyyy-MM-dd hh:mm:ss'): '';
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      deleteMultiple () {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的角色!'
          });
          return;
        }
        let ids = [];
        for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteItem(ids.join(','), 2);
      },

      /**
       * 删除
       * */
      deleteItem (id, type) {
        this.$confirm(type === 1 ? '确定要删除该条记录?': '确定要删除所选记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let method = null;
          if (type && type === 2) {
            method = api.deletePublishCoupons(id);
          } else {
            method = api.deletePublishCoupon(id);
          }
          // 删除
          method.then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'vc_coupon',
                type: 'delete',
                content: `[publishCoupon] params: ${JSON.stringify({id: id})}`
              });
            }
          });
        }).catch(e => {
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

        params.pageNumber = 1;
        params.pageSize = 1000000;

        this.downloading = true;
        api.getPublishCouponList(params).then((res) => {
          let data = res.data, items = [];

          if (data && data.code === '0') {
            if (data.data.data instanceof Array) {
              items = data.data.data;

              let filedHeader = ['交易账号', '代理ID', '活动ID', '任务ID','任务名称', '手机号',
                  '状态', '面额', '任务面额', '活动面额', '券有效期', '发券时间'],
                fieldNames = ['accountNo', 'agentId', 'activityId', 'taskId','taskName', 'mobile',
                  'status', 'amount', 'taskAmount', 'activityAmount', 'validTime', 'createDate'];

              let filedData = bsmp.util.excellentExport.formatJson(fieldNames, items, {
                status: {map: this.statusFmt},
                validTime: {map: this.validTimeFmt},
                createDate: {map: this.createDateFmt, tab: true}
              });
              bsmp.util.excellentExport.csvByData('代用券信息维护.csv', filedHeader, filedData);
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

        api.getPublishCouponList(params).then((res) => {
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

  let validateNum = (rule, value, callback) => {
    let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
    if (value === '') {
      callback(new Error('请输入正确的数字'));
    } else {
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的数字'));
      }
    }
  };

  // 表单规则
  let rules = {
    accountCode: [
      {required: true, message: '请选择账号编码', trigger: 'change'}
    ],
    currencyCode: [
      {required: true, message: '请选择币种', trigger: 'change'}
    ],
    price: [
      {required: true, validator: validateNum, trigger: 'blur'},
    ],
  };
</script>
