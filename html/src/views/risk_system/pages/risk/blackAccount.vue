<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.accountNo" placeholder="账户"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.idCard" placeholder="身份证"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.bu" placeholder="案件来源">
            <el-option v-for="(val, key) in typeMap" :label="val" :value="key"
                       :key="'search-type-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="realName">
          <el-input v-model="search.realName" placeholder="客户姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.riskMark" placeholder="事件标签"></el-input>
        </el-form-item>
        <br>
        <el-form-item>
          <el-input v-model="search.ip" placeholder="IP地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.imei" placeholder="IMEI"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.email" placeholder="邮箱地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.riskTime"
            type="daterange"
            placeholder="时间">
          </el-date-picker>
        </el-form-item>
        <br>
        <el-form-item>
          <el-select clearable v-model="search.source" placeholder="操作类型">
            <el-option v-for="(val, key) in typeMap" :label="val" :value="key"
                       :key="'search-type-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.status" placeholder="操作状态">
            <el-option v-for="(val, key) in typeMap" :label="val" :value="key"
                       :key="'search-type-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.status" placeholder="外部数据源">
            <el-option v-for="(val, key) in typeMap" :label="val" :value="key"
                       :key="'search-type-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="clear">清空</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="clear">导出查询结果</el-button>
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
      :max-height="height - 200"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="index" label="序号" width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="appCode"
        label="流水号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="source"
        label="操作类型"
        width="100">
      </el-table-column>
      <el-table-column
        prop="accountNo"
        label="账户"
        width="150">
      </el-table-column>
      <el-table-column
        prop="idCard"
        label="身份证号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="phone"
        label="手机号码"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="realName"
        label="客户名称"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="riskMark"
        label="事件标签"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bu"
        label="案件来源"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="appCode"
        label="外部数据源"
        width="104">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="appCode"
        label="冻结/解冻时间"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="status"
        label="操作状态"
        width="100">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="删除" v-show="optAuth.del"  size="mini"
                     @click.native.prevent="deleteItem(scope.row.id)">
                      <i class="icon-trash-empty"></i>
                     </el-button>
          <el-button title="编辑" v-show="optAuth.update"  size="mini"
                     @click.native.prevent="showDialog(2, scope.$index)">
                      <i class="icon-edit-square"></i>
                     </el-button>
          <el-button title="审核" v-show="optAuth.approve" size="mini"
                     @click.native.prevent="deleteItem(scope.row.id)">
                      <i class="icon-ok-circled"></i>
                     </el-button>
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
      <el-form ref="blackAccountForm" :model="dialog.form" :rules="dialog.rules" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="应用方：" prop="appCode">
              <el-input v-model="dialog.form.appCode" placeholder="应用方" :disabled="dialog.type === 2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否邮件告警：" prop="isEmail">
              <el-switch
                v-model="dialog.form.isEmail"
                on-text="是"
                off-text="否"
                on-value="1"
                off-value="0"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否短信告警：" prop="isSms">
              <el-switch
                v-model="dialog.form.isSms"
                on-text="是"
                off-text="否"
                on-value="1"
                off-value="0"
              >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
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
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'black_account_manage',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        userInfo: null,
        loading: true,
        search: {
          appCode: '',
          isEmail: '',
          isSms: '',
          deleteFlag: '',
          sort: 'update_date',
          order: 'desc'
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
            appCode: '',
            isEmail: '',
            isSms: '',
            deleteFlag: 'N',
            remark: ''
          },
          rules: rules
        },
        isEmailMap: {
          '0': '否',
          '1': '是'
        },
        isSmsMap: {
          '0': '否',
          '1': '是'
        }
      };
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      if (this.userInfo.loginName) {
        this.query();
      }
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'risk_system_black_account',
          save: 'risk_system_black_account_save',
          update: 'risk_system_black_account_update',
          approve: 'risk_system_black_account_approve',
          del: 'risk_system_black_account_delete'
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
          this.query();
        }
      },
      'loginUser': function (loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
          this.query();
        }
      }
    },
    methods: {
      /**
       * 日期格式化
       * */
      dateFmt (row) {
        return row.updateDate ? bsmp.util.formatDate.format(new Date(row.updateDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      /**
       * 格式化是否开启邮件告警
       * @param row
       * @returns {string}
       */
      isEmailFmt (row) {
        return typeof row.isEmail !== 'undefined' ? this.isEmailMap[row.isEmail] : '';
      },
      /**
       * 格式化是否开启短信告警
       * @param row
       * @returns {string}
       */
      isSmsFmt (row) {
        return typeof row.isSms !== 'undefined' ? this.isSmsMap[row.isSms] : '';
      },

      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['blackAccountForm'] && this.$refs['blackAccountForm'].resetFields) {
          this.$refs['blackAccountForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          console.log(form.isEmail);
          if(form.isEmail === 1){

          }
          if(form.isSms === 1){

          }
          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            appCode: '',
            isEmail: '1',
            isSms: '1',
            deleteFlag: 'N',
            remark: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['blackAccountForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              // 新增
              if (!this.getCompanyId()) {
                this.$message.error('请先选择公司！');
                return;
              }
              this.dialog.form.companyId = this.getCompanyId();

              api.saveBlackAccount(this.dialog.form).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'risk_system',
                    type: 'add',
                    content: `[BlackAccount] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            } else {
              // 修改
              api.updateBlackAccount(this.dialog.form).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'risk_system',
                    type: 'modify',
                    content: `[BlackAccount] params: ${JSON.stringify(this.dialog.form)}`
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
          api.removeBlackAccount(id).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'risk_system',
                type: 'delete',
                content: `[BlackAccount] params: ${JSON.stringify({id: id})}`
              });
            }
          });
        }).catch(e => {
        });
      },
      /**
       * 取消弹窗
       * */
      cancelForm () {
        this.dialog.show = false;
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
        api.getBlackAccountList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.list;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                page: data.data.pageIndex,
                total: data.data.total
              });
          }
        }).catch(e => {
          this.loading = false;
        });
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
      }
    }
  };

  // 表单规则
  let rules = {
    accountNo: [
      {required: true, message: '请输入账户', trigger: 'blur'}
    ]
  };
</script>
<style lang="stylus" scoped>
  .tpl-link
    word-break:break-all
  .icon-arrows-cw{
    font-size: 80%
  }
</style>
