<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
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
              <el-input v-model="search.id" placeholder="广告ID"></el-input>
          </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.type" placeholder="发布类型">
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
      <el-button v-show="optAuth.add" @click="showDialog(1)" type="primary">新增</el-button>
      <el-button type="primary" v-show="optAuth.export" @click="handleDownload" title="导出"
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
        prop="id"
        label="广告ID"
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
        label="客户组别"
        :formatter="clientGroupFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="currencyCode"
        label="币种编码"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="type"
        label="发布类型"
        :formatter="typeFmt"
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
        prop="refRate"
        label="参考汇率"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="num"
        label="总数量"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="availNum"
        label="可用数量"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="frozenNum"
        label="冻结数量"
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
        prop="outRate"
        label="溢价比率"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="payTime"
        label="付款期限（分钟）"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="payType"
        label="付款方式"
        :formatter="payTypeFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="minAmount"
        label="最小交易额"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="maxAmount"
        label="最大交易额"
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
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.edit" @click="showDialog(2, scope.$index)"
                     type="info" icon='edit' size="mini"></el-button>
          <!--<el-button title="删除" v-show="optAuth.del" type="danger" icon='delete' size="mini"-->
                     <!--@click="deleteItem(scope.row.id)"></el-button>-->
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
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="goodsInfoForm" :model="dialog.form" :rules="dialog.rules" label-width="150px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="账号：" prop="accountCode">
              <el-input v-model="dialog.form.accountCode" auto-complete="off" :disabled="dialog.type === 2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="币种编码：" prop="currencyCode">
              <el-input v-model="dialog.form.currencyCode" auto-complete="off" :disabled="dialog.type === 2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="发布类型：" prop="type">
              <el-select v-model="dialog.form.type" filterable placeholder="发布类型" :disabled="dialog.type === 2">
                <el-option v-for="(val, key) in typeMap" :label="val" :value="key"
                           :key="'form-type-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="付款方式：" prop="payType">
              <el-select v-model="dialog.form.payType" filterable placeholder="付款方式" :disabled="dialog.type === 2">
                <el-option v-for="(val, key) in payTypeMap" :label="val" :value="key"
                           :key="'form-payType-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="总数量：" prop="num">
              <el-input-number v-model="dialog.form.num" :min="1" :disabled="dialog.type === 2"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="价格：" prop="price">
              <el-input v-model="dialog.form.price" auto-complete="off" :disabled="dialog.type === 2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="溢价比率：" prop="outRate">
              <el-input v-model="dialog.form.outRate" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="付款期限（分钟）：" prop="payTime">
              <el-input-number v-model="dialog.form.payTime" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="最小交易额：" prop="minAmount">
              <el-input-number v-model="dialog.form.minAmount" :min="1" :max="dialog.form.num"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="最大交易额：" prop="maxAmount">
              <el-input-number v-model="dialog.form.maxAmount" :min="1" :max="dialog.form.num"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="参考汇率：" prop="refRate">
              <el-input v-model="dialog.form.refRate" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13">
            <el-form-item label="状态：" prop="status" v-show="dialog.type === 2">
              <el-select v-model="dialog.form.status" filterable placeholder="状态"
                         :disabled="dialog.form.status === '1' || dialog.form.status === '3'">
                <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                           :key="'form-status-'+ key"
                           :disabled="key === '1' || key === '3'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注信息：" prop="remark">
              <el-input type="textarea" :rows="3" v-model="dialog.form.remark" :disabled="dialog.type === 2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm" type="primary" v-show="dialog.type === 1 || dialog.form.status === '0' || dialog.form.status === '2'">保 存</el-button>
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
    name: 'goodsInfo',
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
          accountCode: '',
          type: '',
          id: '',
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
          title: '',
          form: {
            accountCode: '',
            currencyCode: '',
            type: '',
            num: 0,
            price: '',
            outRate: '',
            payTime: 0,
            payType: '',
            minAmount: '',
            maxAmount: '',
            refRate: '',
            remark: ''
          },
          rules: rules
        },
        statusMap: {
          '0': '待接单',
          '1': '已完成',
          '2': '隐藏',
          '3': '已下架'
        },
        typeMap: {
          '0': '卖',
          '1': '买'
        },
        payTypeMap: {
          '0': '银行卡',
          '1': '支付宝',
          '2': '微信'
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
          search: 'virtual_coin_goodsInfo_view',
          add: 'virtual_coin_goodsInfo_add',
          edit: 'virtual_coin_goodsInfo_edit',
          del: 'virtual_coin_goodsInfo_del',
          export: 'virtual_coin_goodsInfo_export'
        });
      }
    },
    methods: {
      payTypeFmt(row) {
        return typeof row.payType !== 'undefined' ? this.payTypeMap[row.payType] : '';
      },
      typeFmt(row) {
        return typeof row.type !== 'undefined' ? this.typeMap[row.type] : '';
      },
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

      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['goodsInfoForm'] && this.$refs['goodsInfoForm'].resetFields) {
          this.$refs['goodsInfoForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '编辑';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.type = form.type + '';
          form.payType = form.payType + '';
          form.status = form.status + '';

          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            accountCode: '',
            currencyCode: '',
            type: '',
            num: 0,
            price: '',
            outRate: '',
            payTime: 0,
            payType: '',
            minAmount: '',
            maxAmount: '',
            refRate: '',
            remark: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['goodsInfoForm'].validate((valid) => {
          if (valid) {

            if (this.dialog.type === 1) {
              let params = Object.assign({}, this.dialog.form);

              // 新增
              api.addGoodsInfo(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'virtual_coin',
                    type: 'add',
                    content: `[goodsInfo] params: ${JSON.stringify(params)}`
                  });
                }
              });
            } else {
              let params = {
                id: this.dialog.form.id,
                price: this.dialog.form.price,
                outRate: this.dialog.form.outRate,
                payTime: this.dialog.form.payTime,
                minAmount: this.dialog.form.minAmount,
                maxAmount: this.dialog.form.maxAmount,
                refRate: this.dialog.form.refRate,
                status: this.dialog.form.status
              };

              // 修改
              api.editGoodsInfo(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '编辑成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'virtual_coin',
                    type: 'modify',
                    content: `[goodsInfo] params: ${JSON.stringify(params)}`
                  });
                }
              });
            }
          } else {
            return false;
          }
        });
      },
      /**
       * 删除
       * */
      deleteItem (id) {
        this.$confirm('确定要删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.deleteGoodsInfo(id).then((res) => {
            let data = res.data;
            if (data && data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'virtual_coin',
                type: 'delete',
                content: `[goodsInfo] params: ${JSON.stringify({id: id, action: 'delete'})}`
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
        api.getGoodsInfoList(params).then((res) => {
          let data = res.data, items = [];

          if (data && data.code === '0') {
            if (data.data.data instanceof Array) {
              items = data.data.data;

              let filedHeader = ['广告ID', '手机号码', '昵称"', '账号','客户组别', '币种编码', '发布类型', '状态', '参考汇率',
                  '总数量', '可用数量', '冻结数量', '价格', '溢价比率', '付款期限（分钟）',
                  '付款方式', '最小交易额', '最大交易额', '备注信息', '创建人', '创建时间',
                  '更新人', '更新时间'],
                fieldNames = ['id', 'mobile', 'nameCn', 'accountCode','clientGroup', 'currencyCode', 'type', 'status', 'refRate',
                  'num', 'availNum', 'frozenNum', 'price', 'outRate', 'payTime',
                  'payType', 'minAmount', 'maxAmount', 'remark', 'createUser', 'createDate',
                  'updateUser', 'updateDate'];

              let filedData = bsmp.util.excellentExport.formatJson(fieldNames, items, {
                id: {tab: true},
                mobile: {tab: true},
                accountCode: {tab: true},
                clientGroup: {map: this.clientGroupFmt},
                currencyCode: {tab: true},
                type: {map: this.typeFmt},
                status: {map: this.statusFmt},
                payType: {map: this.payTypeFmt},
                createDate: {map: this.createDateFmt, tab: true},
                updateDate: {map: this.updateDateFmt, tab: true}
              });
              bsmp.util.excellentExport.csvByData('广告发布管理.csv', filedHeader, filedData);
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

        api.getGoodsInfoList(params).then((res) => {
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

  let validateDouble = (rule, value, callback) => {
    let reg = /^([1-9][\d]{0,7}|0)(\.[\d]{1,5})?$/;
    if (value.toString().trim() !== '') {
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的数字'));
      }
    } else {
      callback();
    }
  };

  // 表单规则
  let rules = {
    accountCode: [
      {required: true, message: '请输入账号', trigger: 'blur'}
    ],
    currencyCode: [
      {required: true, message: '请输入币种编码', trigger: 'blur'}
    ],
//    num: [
//      {required: true, message: '请输入总数量', trigger: 'blur'}
//    ],
    price: [
      {required: true, validator: validateNum, trigger: 'blur'},
    ],
    outRate: [
      {required: true, validator: validateNum, trigger: 'blur'},
    ],
//    payTime: [
//      {required: true, message: '请输入付款期限', trigger: 'blur'}
//    ],
    payType: [
      {required: true, message: '请选择付款方式', trigger: 'change'}
    ],
    minAmount: [
      {required: true, validator: validateNum, trigger: 'blur'},
    ],
    maxAmount: [
      {required: true, validator: validateNum, trigger: 'blur'},
    ],
    refRate: [
      {validator: validateDouble, trigger: 'blur'},
    ],
  };
</script>
