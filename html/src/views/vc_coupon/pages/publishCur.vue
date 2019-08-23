<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.accountCode" placeholder="账号编码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.publishStatus" placeholder="发布状态">
            <el-option v-for="(val, key) in publishStatusMap" :label="val" :value="key"
                       :key="'search-publishStatus-'+ key"></el-option>
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
      <el-button v-show="optAuth.batch" @click="deleteMultiple" type="danger">批量删除</el-button>
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
        prop="accountCode"
        label="发币账号"
        :formatter="accountFmt"
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
        prop="amount"
        label="发布数量"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="price"
        label="发布价格"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="publishStatus"
        label="发布状态"
        :formatter="publishStatusFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="couponStatus"
        label="券状态"
        :formatter="couponStatusFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="validTime"
        label="券有效期"
        :formatter="validTimeFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="reason"
        label="审批理由"
        :formatter="reasonFmt"
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
          <el-button title="编辑" v-show="optAuth.edit && scope.row.publishStatus === 0" @click="showDialog(2, scope.$index)"
                     type="info" icon='edit' size="mini"></el-button>
          <el-button title="删除" v-show="optAuth.del" type="danger" icon='delete' size="mini"
                     @click="deleteItem(scope.row.id)"></el-button>
          <el-button title="通过" v-show="optAuth.edit && scope.row.publishStatus === 0" @click="toApprove(scope.row)"
                     type="info" size="mini">通过</el-button>
          <el-button title="拒绝" v-show="optAuth.edit && scope.row.publishStatus === 0" type="danger" size="mini"
                     @click="toReject(scope.row)">拒绝</el-button>
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
      <el-form ref="publishCurForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="发币账号：" prop="accountCode">
              <el-select v-model="dialog.form.accountCode" filterable placeholder="发币账号">
                <el-option v-for="(val, key) in accountMap" :label="val" :value="key"
                           :key="'form-accountCode-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="币种类型：" prop="type">
              <el-select v-model="dialog.form.type" @change="getCurrencyList(dialog.form.type)" filterable placeholder="币种类型">
                <el-option v-for="(val, key) in typeMap" :label="val" :value="key"
                           :key="'form-type-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="币种编码：" prop="currencyCode">
              <el-select v-model="dialog.form.currencyCode" filterable placeholder="币种编码">
                <el-option v-for="(currency, i) in currencies" :label="currency.code" :value="currency.code"
                           :key="'form-currencyCode-'+ currency.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="发布数量：" prop="amount">
              <el-input-number v-model="dialog.form.amount" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布价格：" prop="price">
              <el-input v-model="dialog.form.price" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-show="dialog.type === 2">
          <el-col :span="12">
            <el-form-item label="发布状态：" prop="publishStatus">
              <el-select clearable v-model="dialog.form.publishStatus" placeholder="发布状态" :disabled="dialog.type === 2">
                <el-option v-for="(val, key) in publishStatusMap" :label="val" :value="key"
                           :key="'form-publishStatus-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!--<el-col :span="12">-->
            <el-form-item label="备注信息：" prop="remark">
              <el-input type="textarea" :rows="3" v-model="dialog.form.remark"></el-input>
            </el-form-item>
          <!--</el-col>-->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm" type="primary">保 存</el-button>
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
    name: 'publishCur',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        search: {
          accountCode: '',
          publishStatus: '',
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
        typeMap: {
          '1': '普通代币',
          '2': '代金券',
          '3': '代用券'
        },
        currencies: [],
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          title: '',
          form: {
            accountCode: '',
            currencyCode: '',
            amount: 1,
            price: 1,
            publishStatus: '',
            remark: '',
            curType: ''
          },
          rules: rules
        },
        publishStatusMap: {
          '0': '待审批',
          '1': '已批核',
          '2': '已拒绝'
        },
        multipleSelection: [],
        couponStatusMap: {
          '0': '待激活',
          '1': '可用',
          '2': '已使用',
          '3': '已提券',
          '4': '已过期'
        }
      };
    },
    mounted () {
      // 获取发币账号
      this.getClientAccounts().then((res) => {
        this.query();
      });
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'vc_coupon_publishCur_view',
          add: 'vc_coupon_publishCur_add',
          edit: 'vc_coupon_publishCur_edit',
          del: 'vc_coupon_publishCur_del',
          batch: 'vc_coupon_publishCur_batch'
        });
      }
    },
    methods: {
      publishStatusFmt(row) {
        return typeof row.publishStatus !== 'undefined' ? this.publishStatusMap[row.publishStatus] : '';
      },
      accountFmt(row) {
        return typeof row.accountCode !== 'undefined' ? this.accountMap[row.accountCode] : '';
      },
      reasonFmt(row) {
        if (row.publishStatus === 1) {
          return row.approveRemark;
        } else if (row.publishStatus === 2) {
          return row.cancelRemark;
        } else {
          return '';
        }
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
      couponStatusFmt(row) {
        return typeof row.couponStatus !== 'undefined' ? this.couponStatusMap[row.couponStatus] : '';
      },
      validTimeFmt (row) {
        return row.validBegin && row.validEnd ? '开始时间：'+bsmp.util.formatDate.format(new Date(row.validBegin), 'yyyy-MM-dd hh:mm:ss') + '<br />结束时间：' + bsmp.util.formatDate.format(new Date(row.validEnd), 'yyyy-MM-dd hh:mm:ss'): '';
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      /**
       * 获取发币账号列表
       * */
      getClientAccounts() {
        return api.getClientAccounts(1).then((res) => {
          let data = res.data;
          if (data && data.code === '0' && data.data && data.data.length) {
            data.data.forEach((item) => {
              this.accountMap[item.accountCode] = item.nameCn;
            });
          }
        });
      },

      /**
       * 获取币种列表
       */
      getCurrencyList(type) {
        this.dialog.form.currencyCode = '';
        if(type) {
          api.getCurrencyList({type: type, pageNo: 1, pageSize: 1000}).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.currencies = data.data.data;
            }
          });
        }
      },

      /**
       * 通过
       * */
      toApprove(row) {
        this.$prompt('请输入通过理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.handleApproval(row, 1, value);
        }).catch(() => {

        });
      },

      /**
       * 拒绝
       * */
      toReject(row) {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.handleApproval(row, 2, value);
        }).catch(() => {

        });
      },

      /**
       * 处理审批请求
       * */
      handleApproval(form, status, remark) {
        let params = {
          id: form.id,
          accountCode: form.accountCode,
          currencyCode: form.currencyCode,
          amount: form.amount,
          publishStatus: status,
          price: form.price,
          remark: form.remark
        };

        if (status === 1) {
          params.approveRemark = remark;
        } else if (status === 2) {
          params.cancelRemark = remark;
        }

        api.editPublishCur(params).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });

            this.query();

            // 记录日志
            bsmp.log({
              component: 'vc_coupon',
              type: 'approve',
              content: `[publishCur] params: ${JSON.stringify(params)}`
            });
          }
        });
      },

      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['publishCurForm'] && this.$refs['publishCurForm'].resetFields) {
          this.$refs['publishCurForm'].resetFields();
        }

        if (!this.currencies || this.currencies.length === 0) {
          // 获取币种列表
          //this.getCurrencyList();
        }

        this.dialog.title = type === 1 ? '新增' : '编辑';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.publishStatus = form.publishStatus + '';
          form.type = form.curType + '';

          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            accountCode: '',
            currencyCode: '',
            amount: 1,
            price: 1,
            remark: '',
            type: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['publishCurForm'].validate((valid) => {
          if (valid) {
            let params = {
              accountCode: this.dialog.form.accountCode,
              currencyCode: this.dialog.form.currencyCode,
              price: this.dialog.form.price,
              amount: this.dialog.form.amount,
              remark: this.dialog.form.remark,
              curType: this.dialog.form.type
            };

            if (this.dialog.type === 1) {
              // 新增
              api.addPublishCur(params).then((res) => {
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
                    component: 'vc_coupon',
                    type: 'add',
                    content: `[publishCur] params: ${JSON.stringify(params)}`
                  });
                }
              });
            } else {
              params.id = this.dialog.form.id;
              params.publishStatus = this.dialog.form.publishStatus;
              // 修改
              api.editPublishCur(params).then((res) => {
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
                    component: 'vc_coupon',
                    type: 'modify',
                    content: `[publishCur] params: ${JSON.stringify(params)}`
                  });
                }
              });
            }
          } else {
            return false;
          }
        });
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
            method = api.deletePublishCurs(id);
          } else {
            method = api.deletePublishCur(id);
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
                content: `[publishCur] params: ${JSON.stringify({id: id})}`
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

        api.getPublishCurList(params).then((res) => {
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
