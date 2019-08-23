<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.appCode" placeholder="应用方"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="clear">清空</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-row class="toolbar">
      <el-button v-show="optAuth.save" @click="showDialog(1)" type="primary">新增</el-button>
      <el-button v-show="optAuth.search" @click="query()" title="刷新" type="primary" size="small">
        <i class="icon-arrows-cw"></i>&nbsp;&nbsp;刷新
      </el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      stripe
      :max-height="height - 165"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="70">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="appCode"
        label="应用方"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="blackListIps"
        label="IP黑名单"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="blackListMobile"
        label="手机黑名单"
        width="250">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="whiteListPhones"
        label="手机白名单"
        width="250">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备 注"
        width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.save" type="info" icon='edit' size="mini"
                     @click.native.prevent="showDialog(2, scope.$index)"></el-button>
          <el-button title="删除" v-show="optAuth.save" type="danger" icon='delete' size="mini"
                     @click.native.prevent="deleteItem(scope.row.id)"></el-button>
          <el-button v-show="optAuth.save" @click="showDetailDialog(3, scope.$index, scope.row.id)"
                     size="mini"><i class="el-icon-document"></i>&nbsp;&nbsp;规则明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pull-right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="table.pager.page"
                   :page-sizes="[20, 50, 100, 200]"
                   :page-size="table.pager.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="table.pager.total">
    </el-pagination>

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="smsRuleForm" :model="dialog.form" :rules="dialog.rules" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="应用方：" prop="appCode">
              <el-input v-model="dialog.form.appCode" placeholder="应用方"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="ip黑名单：" prop="blackListIps">
              <el-input type="textarea" v-model="dialog.form.blackListIps" auto-complete="off"></el-input>
              <br>
              <span class="rule-tip">如果输入多个请使用；分割</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="手机黑名单：" prop="blackListMobile">
              <el-input :rows="3" type="textarea" v-model="dialog.form.blackListMobile" auto-complete="off"></el-input>
              <br>
              <span class="rule-tip">如果输入多个请使用；分割</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="手机白名单：" prop="whiteListMobile">
              <el-input :rows="3" type="textarea" v-model="dialog.form.whiteListMobile" auto-complete="off"></el-input>
              <br>
              <span class="rule-tip">如果输入多个请使用；分割</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :rows="3" v-model="dialog.form.remark"></el-input>
              </el-form-item>
            </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 明细列表弹窗框 -->
    <el-dialog title="明细规则列表" v-model="ruleDetaildialog.show" size="small" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-row class="toolbar">
        <el-button v-show="optAuth.saveDetail" @click="addDetailFormDialog" type="primary">新增</el-button>
        <!--<el-button v-show="optAuth.save" @click="editDetailFormDialog" type="primary">修改</el-button>-->
        <el-button v-show="optAuth.delDetail" @click="deleteMultipleRuleDetail" type="danger">批量删除</el-button>
      </el-row>
      <el-table
        highlight-current-row
        v-loading.body="ruleDetaildialog.loading"
        :data="ruleDetaildialog.items"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          fixed
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column
          prop="ruleType"
          label="规则类型"
          width="200">
        </el-table-column>
        <el-table-column
          prop="frequency"
          label="频率"
          width="200">
        </el-table-column>
        <el-table-column
          prop="times"
          label="限制次数"
          width="200">
        </el-table-column>
        <el-table-column
          prop="orderId"
          label="优先级"
          width="200">
        </el-table-column>
        <el-table-column
          prop="comment"
          label="备注"
          width="200">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button title="删除" v-show="optAuth.delDetail" @click="deleteRuleDetailItem(scope.row.id)" type="danger" icon='delete' size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pull-right"
                     @size-change="handleUserSizeChange"
                     @current-change="handleUserCurrentChange"
                     :current-page="ruleDetaildialog.pager.page"
                     :page-sizes="[5, 10, 20, 50]"
                     :page-size="ruleDetaildialog.pager.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="ruleDetaildialog.pager.total">
      </el-pagination>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 规则明细事件弹窗框 -->
    <el-dialog title="新增明细规则" v-model="ruleDetaildialog.form.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="smsRuleDetailForm" :model="ruleDetaildialog.form" :rules="ruleDetaildialog.rules" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12" v-show="false">
            <el-form-item label="rule id：" prop="smsRuleId">
              <el-input-number v-model="ruleDetaildialog.form.smsRuleId"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则类型：" prop="ruleType">
              <el-select v-model="ruleDetaildialog.form.ruleType" filterable placeholder="规则类型">
                <el-option v-for="(val, key) in ruleTypeMap" :label="val" :value="key"
                           :key="'form-ruleType-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="频率：" prop="frequency">
              <el-select v-model="ruleDetaildialog.form.frequency" filterable placeholder="频率">
                <el-option v-for="(val, key) in frequencyMap" :label="val" :value="key"
                           :key="'form-frequency-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="限制次数：" prop="times">
              <el-input-number v-model="ruleDetaildialog.form.times"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="优先级：" prop="orderId">
              <el-input-number v-model="ruleDetaildialog.form.orderId" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注：" prop="comment">
              <el-input type="textarea" :rows="3" v-model="ruleDetaildialog.form.comment"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ruleDetaildialog.form.show = false">取 消</el-button>
        <el-button type="primary" @click="submitDetailForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

  </div>
</template>

<script>
  import api from '../../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'base_config_sms_rule',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        userInfo: null,
        loading: true,
        search:{
          appCode: '',
          sort:'updateDate',
          order:'desc'
        },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            page: 1,
            total: 0
          }
        },
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          title: '',
          form: {
            appCode: null,
            frequency: null,
            blackListMobile: null,
            times: null,
            whiteListMobile: '',
            blackListIps: '',
            remark: ''
          },
          rules: rules
        },
        ruleDetaildialog: {
          show: false,
          type: 1, // 类型，3：新增，4：编辑
          index: -1, // 数据下标
          title: '',
          pager: {
            pageSize: 10,
            page: 1,
            total: 0
          },
          form: {
            show: false,
            frequency: null,
            times: null,
            smsRuleId: null,
            ruleType: null,
            orderId: null,
            comment:''
          },
          rules: rules
        },
        frequencyMap: {
          '1': '1分钟',
          '2': '2分钟',
          '5': '5分钟',
          '10': '10分钟',
          '60': '60分钟',
          '120': '120分钟',
          '1440': '1天'
        },
        ruleTypeMap: {
          "app": "app应用限制",
          "mobile": "手机号限制",
          "ip": "ip限制"
        },
        multipleSelection: [],
        smsAppCodes:[],
        smsAppCodeMap:{}
      }
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'base_config_sms_rule_list',
          save: 'base_config_sms_rule_save',
          edit: 'base_config_sms_rule_edit',
          del: 'base_config_sms_rule_delete',
          saveDetail: 'base_config_sms_rule_save_detail',
          editDetail: 'base_config_sms_rule_edit_detail',
          delDetail: 'base_config_sms_rule_del_detail'
        });
      },
      company() {
        return bsmp.util.getCompany();
      },
      loginUser() {
        return bsmp.util.getUserInfo();
      }
    },
    watch: {
      'company': function (company) {
        if (this.userInfo.companyId === 'ALL' && company) {
          this.getSmsAppConfIdDic().then(() => {
            this.query();
          });
        }
      },
      'loginUser': function (loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
          this.getSmsAppConfIdDic().then(() => {
            this.query();
          });
        }
      }
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      if (this.userInfo.loginName) {
        this.getSmsAppConfIdDic().then(() => {
          this.query();
        });
      }
    },
    methods: {
      /**
       * 格式化规则类型
       * @param row
       * @returns {string}
       */
      ruleTypeFmt (row){
        return typeof row.ruleType !== 'undefined' ? this.ruleTypeMap[row.ruleType] : '';
      },
      /**
       * 格式化应用方
       * @param row
       * @returns {string}
       */
      smsAppConfFmt (row){
        return typeof row.smsAppConfId !== 'undefined' ? this.smsAppCodeMap[row.smsAppConfId] : '';
      },
      submitForm() {
        this.$refs['smsRuleForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              // 新增
              if (!this.getCompanyId()) {
                this.$message.error('请先选择公司！');
                return;
              }
              this.dialog.form.companyId = this.getCompanyId();

              api.saveSmsRule(this.dialog.form).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'base_config',
                    type: 'add',
                    content: `[SmsRule] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            } else {
              // 修改
              api.saveSmsRule(this.dialog.form).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'base_config',
                    type: 'modify',
                    content: `[SmsRule] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            }

            this.dialog.show = false;
          } else {
            return false;
          }
        });
      },

      getCompanyId() {
        let companyId = '';
        if (this.userInfo.companyId) {
          if (this.userInfo.companyId === 'ALL') {
            if (this.company) {
              companyId = this.company.companyId;
            }
          } else {
            companyId = this.userInfo.companyId;
          }
        }
        return companyId;
      },

      getSmsRule() {
        api.getSmsRuleList({companyId: this.getCompanyId()}).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            let form = data.data;
            form.frequency = form.frequency + '';

            this.form = form;
          }
        }).catch(e => {
          this.loading = false;
        });
      },

      /**
       * 获取所有短信应用方
       *
       * */
      getSmsAppConfIdDic() {
        return api.getSmsAppConfIdDic(this.getCompanyId()).then((res) => {
          this.loading = false;
          let data = res.data;
          if(data && data.code === '0'){
            this.smsAppCodes = data.data;
            if(this.smsAppCodes && this.smsAppCodes.length){
              this.smsAppCodes.forEach((item) => {
                this.smsAppCodeMap[item.id] = item.appCode;
              });
            }
          }
        }).catch(e => {
          this.loading = false;
        });
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        if (this.getCompanyId()) {
          params.companyId = this.getCompanyId();
        }

        params = Object.assign({}, params, this.table.pager);
        api.getSmsRuleList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.list;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                page: data.data.pageNum,
                total: data.data.total
              });
          }
        }).catch(e => {
          this.loading = false;
        });
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['smsRule'] && this.$refs['smsRule'].resetFields) {
          this.$refs['smsRule'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.smsAppConfId = form.smsAppConfId + '';
          form.frequency = form.frequency + '';

          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            appCode: null,
            frequency: null,
            blackListMobile: null,
            times: null,
            whiteListMobile: '',
            blackListIps: '',
            remark: ''
          };
        }

        this.dialog.show = true;
      },

      /**
       * 显示规则明细弹窗
       * */
      showDetailDialog (type, index, id) {
        if (this.$refs['smsRuleDetail'] && this.$refs['smsRuleDetail'].resetFields) {
          this.$refs['smsRuleDetail'].resetFields();
        }
        this.ruleDetaildialog.show = true;
        this.getRuleDetail(id);
      },

      /**
       * 新增规则明细弹窗
       * */
      addDetailFormDialog() {
        this.ruleDetaildialog.form.ruleType = '';
        this.ruleDetaildialog.form.frequency = '';
        this.ruleDetaildialog.form.times = '';
        this.ruleDetaildialog.form.comment = '';
        this.ruleDetaildialog.form.show = true;
      },
      /**
       * 删除应用方
       * */
      deleteItem (id) {
        this.$confirm('确定要删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.removeSmsRule(id, {companyId: this.getCompanyId()}).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'base_config',
                type: 'delete',
                content: `[SmsRule] params: ${JSON.stringify({id: id})}`
              });
            }
          });
        }).catch(e => {
        });
      },

      /**
       * 批量删除短信应用方规则明细配置
       * */
      deleteMultipleRuleDetail () {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的规则类型!'
          });
          return;
        }
        let ids = [];
        for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteRuleDetailItem(ids.join(','));
      },
      /**
       * 删除规则明细配置
       * */
      deleteRuleDetailItem (id) {
        this.$confirm('确定要删除记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.removeSmsRuleDetail(id).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.ruleDetaildialog.show = false;

              // 记录日志
              bsmp.log({
                component: 'ms_center',
                type: 'delete',
                content: `[Rule Detail] params: ${JSON.stringify({
                  ruleType: this.ruleDetaildialog.ruleType, frequency: this.ruleDetaildialog.frequency, times: this.ruleDetaildialog.times
                })}`
              });
            }
          });
        }).catch(e => {});
      },

      /**
       * 短信规则明细配置提交
       * */
      submitDetailForm() {
        this.$refs['smsRuleDetailForm'].validate((valid) => {
          if (valid) {
            api.saveSmsRuleDetail(this.ruleDetaildialog.form).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                });
                this.ruleDetaildialog.form.show = false;
                this.ruleDetaildialog.show = false;

                // 记录日志
                bsmp.log({
                  component: 'base_config',
                  type: 'add',
                  content: `[SmsRuleDetail] params: ${JSON.stringify(this.ruleDetaildialog.form)}`
                });
              }
            });

            this.ruleDetaildialog.show = false;
          } else {
            return false;
          }
        });
      },

      /**
       * 获取规则明细列表
       *
       */
      getRuleDetail (smsRuleId) {
        this.ruleDetaildialog.loading = true;
        let params = Object.assign({}, this.ruleDetaildialog.pager, {page: this.ruleDetaildialog.pager.page});
        params.smsRuleId = smsRuleId;
        api.getSmsRuleDetailList(params).then((res) => {
          this.ruleDetaildialog.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.ruleDetaildialog.items = data.data.list;
            this.ruleDetaildialog.form.smsRuleId = smsRuleId;
            this.ruleDetaildialog.pager = Object.assign({}, this.ruleDetaildialog.pager,
              {
                page: data.data.pageNum,
                total: data.data.total
              });
          }
        }).catch(e => {
          this.ruleDetaildialog.loading = false;
        });
      },

      /**
       * 取消弹窗
       * */
      cancelForm () {
        this.dialog.show = false;
      },

      cancelDetailForm () {
        this.ruleDetaildialog.form.show = false;
      },
      /**
       * 清空
       */
      clear (){
        this.search = {
          appCode: ''
        }
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
        if (this.table.pager.page) {
          this.table.pager.page = val;
          this.query();
        }
      },
      /**
       * 明细列表每页显示条数变化
       * @param val
       */
      handleUserSizeChange (val) {
        this.ruleDetaildialog.pager.pageSize = val;
      },

      /**
       * 明细列表页码变化
       * @param val
       */
      handleUserCurrentChange (val) {
        if (this.ruleDetaildialog.pager.page) {
          this.ruleDetaildialog.pager.page = val;
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
    }
  };

  // 表单规则
  let rules = {
    appCode: [
      {required: true, message: '请选择应用方', trigger: 'blur'}
    ],
    ruleType: [
      {required: true, message: '请选择规则类型', trigger: 'blur'}
    ],
    times: [
      {required: true, type: 'number', message: '次数必须为整数', trigger: 'blur'}
    ],
    frequency: [
      {required: true, message: '请选择频率', trigger: 'blur'}
    ],
  };
</script>
<style lang="stylus" scoped>
  .rule-tip
    color: #ff4949
</style>
