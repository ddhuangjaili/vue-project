<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.orderNo" placeholder="订单号"></el-input>
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
          <el-select clearable v-model="search.status" placeholder="状态">
            <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                       :key="'search-status-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.clientGroup" placeholder="客户组别">
            <el-option v-for="(val, key) in clientGroupMap" :label="val" :value="key"
                       :key="'search-clientGroup-'+ key"></el-option>
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
        prop="goodsId"
        label="广告号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="genCode"
        label="付款参考号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="orderType"
        label="订单方向"
        :formatter="orderTypeFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="buyerCode"
        label="买入方账号"
        width="150">
      </el-table-column>
       <el-table-column
        :show-overflow-tooltip="true"
        prop="buyerMobile"
        label="买入方手机号"
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
        prop="sellerCode"
        label="卖出方账号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="sellerMobile"
        label="卖出方手机号"
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
        prop="refRate"
        label="参考汇率"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="num"
        label="数量"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="price"
        label="价格"
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
      <el-table-column
        fixed="right"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button title="查看详情" @click="showDialog(scope.$index)" size="mini"><i class="icon-eye"></i></el-button>
          <!--<el-button title="更新状态" v-show="optAuth.status && scope.row.status === 3"  @click="showUpdateStatusDialog(scope.row.id, scope.row.status, scope.row.appealRemark)" size="mini" type="danger">-->
            <!--更新状态-->
          <!--</el-button>-->
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

    <!-- 弹窗框 -->
    <el-dialog title="订单详情" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="goodsInfoForm" :model="dialog.form" :rules="dialog.rules" label-width="150px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="商品ID：">
              <el-input v-model="dialog.form.goodsId" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="订单ID：">
              <el-input v-model="dialog.form.orderId" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="订单方向：">
              <el-select v-model="dialog.form.orderType" filterable placeholder="订单方向" :disabled="true">
                <el-option v-for="(val, key) in orderTypeMap" :label="val" :value="key"
                           :key="'form-orderType-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="买入方账号：">
              <el-input v-model="dialog.form.buyerCode" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="卖出方账号：">
              <el-input v-model="dialog.form.sellerCode" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="数量：">
              <el-input v-model="dialog.form.num" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="价格：">
              <el-input v-model="dialog.form.price" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="状态：">
              <el-select v-model="dialog.form.status" filterable placeholder="状态" :disabled="true">
                <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                           :key="'form-status-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-show="appeal.id">
          <el-col :span="11">
            <el-form-item label="申诉方：">
              <el-input v-model="appeal.createUser" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="被诉方：">
              <el-input v-model="appeal.toAppealUser" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-show="appeal.id">
          <el-col :span="11">
            <el-form-item label="申诉类型：">
              <el-input v-model="appeal.appealType" auto-complete="off" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-show="appeal.id">
          <el-col :span="24">
            <el-form-item label="申诉理由：">
              <el-input type="textarea" :rows="3" v-model="appeal.appealReason" auto-complete="off" :readonly="true"></el-input>
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

        <el-row :gutter="20" v-show="appeal.id">
          <el-col :span="24">
            <el-form-item label="申诉处理：">
              <el-button @click="toCheck(1, appeal.orderId, appeal.id, dialog.form.remark)" type="primary"
                         v-show="optAuth.approve">强制放行</el-button>
              <el-button @click="toCheck(2, appeal.orderId, appeal.id, dialog.form.remark)" type="danger"
                         v-show="optAuth.cancel">强制取消</el-button>
              <el-button @click="toCheck(3, appeal.orderId, appeal.id, dialog.form.remark)" type="warning"
                         v-show="optAuth.cancelAppeal && appeal.cancelAppealShow">取消申诉</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

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
          status: '',
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
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          form: {

          }
        },
        statusMap: {
          '0': '未付款',
          '1': '已付款',
          '2': '已完成',
          '3': '申诉中',
          '4': '已取消'
        },
        orderTypeMap: {
          '0': '买',
          '1': '卖'
        },
        appeal: {
          id: null,
          orderId: '',
          createUser: '',
          toAppealUser: '',
          appealType: '',
          appealReason: '',
          cancelAppealShow: true
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
          search: 'vc_coupon_order_manage_view',
          getOrderOp: 'vc_coupon_order_manage_getOrderOp',
          approve: 'vc_coupon_order_manage_approve',
          cancel: 'vc_coupon_order_manage_cancel',
          cancelAppeal: 'vc_coupon_order_manage_cancelAppeal',
          status: 'vc_coupon_order_manage_status',
          export: 'vc_coupon_order_manage_export'
        });
      }
    },
    methods: {
      orderTypeFmt(row) {
        return typeof row.orderType !== 'undefined' ? this.orderTypeMap[row.orderType] : '';
      },
      statusFmt(row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
      },
      appealTypeFmt(row) {
        return typeof row.appealType !== 'undefined' ? this.appealTypeMap[row.appealType] : '';
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
      buyerClientGroupFmt(row) {
        return typeof row.buyerClientGroup !== 'undefined' ? this.clientGroupMap[row.buyerClientGroup] : '';
      },
      sellerClientGroupFmt(row) {
        return typeof row.sellerClientGroup !== 'undefined' ? this.clientGroupMap[row.sellerClientGroup] : '';
      },

      /**
       * 显示弹窗
       * */
      showDialog (index) {
        this.dialog.index = index;
        let form = Object.assign({}, this.table.items[index]);
        form.orderType = form.orderType + '';
        form.status = form.status + '';

        this.appeal.id = null;
        // 查询申诉资料
        if (form.status === '3' && this.optAuth.getOrderOp) {
          this.getOrderOpData(form.orderId);
        }

        this.dialog.form = form;
        this.dialog.show = true;
      },

      getOrderOpData(id) {
        if (id) {
          api.getOrderOp({orderNo: id}).then((res) => {
            this.loading = false;
            let data = res.data;
            if (data && data.code === '0') {
              if (data.data) {
                let orderOp = data.data;

                this.appeal.id = orderOp.id;
                this.appeal.orderId = orderOp.orderId;

                this.appeal.createUser = orderOp.createUser;
                if (this.appeal.createUser === this.dialog.form.buyerCode) {
                  this.appeal.cancelAppealShow = false;
                  this.appeal.toAppealUser = this.dialog.form.sellerCode;
                } else {
                  this.appeal.cancelAppealShow = true;
                  this.appeal.toAppealUser = this.dialog.form.buyerCode;
                }

                this.appeal.appealType = this.appealTypeFmt(orderOp);
                this.appeal.appealReason = orderOp.appealReason;
              }
            }
          });
        }
      },

      toCheck(type, orderId, orderOpId, remark) {
        if (!remark) {
          this.$message.warning('请填写备注信息！');
          return;
        }
        let params = {orderId, orderOpId, remark};
        let method = null;
        switch (type) {
          case 1: // 强制放行
            method = api.orderApprove(params);
            break;
          case 2: // 强制取消
            method = api.orderCancel(params);
            break;
          case 3: // 取消申诉
            method = api.orderCancelAppeal(params);
            break;
        }

        this.loading = true;
        method.then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.$message({
              type: 'success',
              message: '审核成功!'
            });

            this.dialog.show = false;
            this.query();

            // 记录日志
            bsmp.log({
              component: 'vc_coupon',
              type: 'appeal',
              content: `[orderManage] params: ${JSON.stringify(params)}`
            });
          }
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
        api.getOrderManageList(params).then((res) => {
          let data = res.data, items = [];

          if (data && data.code === '0') {
            if (data.data.data instanceof Array) {
              items = data.data.data;

              let filedHeader = ['订单ID', '广告ID', '付款参考号', '订单方向',
                  '买入方账号', '买入方手机号', '买入方昵称','买入方组别',
                  '卖出方账号', '卖出方手机号', '卖出方昵称','卖出方组别', '参考汇率', '数量', '价格',
                  '状态', '备注信息', '创建人', '创建时间', '更新人', '更新时间'],
                fieldNames = ['orderId', 'goodsId', 'genCode', 'orderType',
                  'buyerCode', 'buyerMobile', 'buyerName','buyerClientGroup',
                  'sellerCode', 'sellerMobile', 'sellerName','sellerClientGroup', 'refRate', 'num', 'price',
                  'status', 'remark', 'createUser', 'createDate',
                  'updateUser', 'updateDate'];

              let filedData = bsmp.util.excellentExport.formatJson(fieldNames, items, {
                orderId: {tab: true},
                goodsId: {tab: true},
                genCode: {tab: true},
                orderType: {map: this.orderTypeFmt},
                buyerCode: {tab: true},
                buyerClientGroup: {map: this.buyerClientGroupFmt},
                sellerCode: {tab: true},
                sellerClientGroup: {map: this.sellerClientGroupFmt},
                status: {map: this.statusFmt},
                createDate: {map: this.createDateFmt, tab: true},
                updateDate: {map: this.updateDateFmt, tab: true}
              });
              bsmp.util.excellentExport.csvByData('订单管理.csv', filedHeader, filedData);
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

        api.getOrderManageList(params).then((res) => {
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
