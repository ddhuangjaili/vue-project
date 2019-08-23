<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.appCode" placeholder="应用方"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.appName" placeholder="应用名称"></el-input>
        </el-form-item>
        <el-form-item>
          <!--              <el-select v-model="dialog.form.smsSupplierId" filterable placeholder="供应商" :disabled="dialog.type === 2">
                <el-option v-for="(val, key) in smsSupplierAndSmsTypeMap" :label="val" :value="key"
                           :key="'form-smsSupplierId-'+ key"></el-option>
              </el-select>-->
          <el-select v-model="search.supplier" clearable filterable placeholder="供应商">
            <el-option v-for="(item, index) in supplierArr" :value="item"
                       :key="'search-supplier-'+ index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.smsType" clearable filterable placeholder="短信类型">
            <el-option v-for="(item, index) in smsTypeArr" :value="item"
                       :key="'search-smsType-'+ index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.switcher" clearable filterable placeholder="开关">
            <el-option v-for="(val, key) in switcherMap" :label="val" :value="key"
                       :key="'search-switcher-'+ key"></el-option>
          </el-select>
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
      stripe
      border
      :max-height="height - 165"
      style="width:100%">
      <el-table-column type="index" width="70" label="序号">
      </el-table-column>
      <el-table-column prop="appCode" label="应用方" width="200">
      </el-table-column>
      <el-table-column prop="appName" label="应用名称" width="200">
      </el-table-column>
      <el-table-column prop="supplier" label="供应商" width="200">
      </el-table-column>
      <el-table-column prop="smsType" label="短信类型" :formatter="smsTypeFmt" width="200">
      </el-table-column>
      <el-table-column prop="switcher" label="开关" :formatter="switcherFmt" width="200">
      </el-table-column>
      <el-table-column prop="orderId" label="优先级" width="200">
      </el-table-column>
      <el-table-column prop="usedTimes" label="使用次数" width="200">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="200">
      </el-table-column>
      <el-table-column prop="updateDate" label="最后更新时间" :formatter="dateFmt" width="200" sortable>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.save" type="info" icon='edit' size="mini"
                     @click.native.prevent="showDialog(2, scope.$index)"></el-button>
          <el-button title="删除" v-show="optAuth.del" type="danger" icon='delete' size="mini"
                     @click.native.prevent="deleteItem(scope.row.id)"></el-button>
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

    <!-- 弹窗框开始 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="smsConfForm" :model="dialog.form" :rules="dialog.rules" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="应用方：" prop="appCode">
              <el-input v-model="dialog.form.appCode" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用名称：" prop="appName">
              <el-input v-model="dialog.form.appName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商：" prop="supplier">
<!--              <el-select v-model="dialog.form.smsSupplierId" filterable placeholder="供应商" :disabled="dialog.type === 2">
                <el-option v-for="(val, key) in smsSupplierAndSmsTypeMap" :label="val" :value="key"
                           :key="'form-smsSupplierId-'+ key"></el-option>
              </el-select>-->
              <el-select v-model="dialog.form.supplier" clearable filterable placeholder="供应商">
                <el-option v-for="(item, index) in supplierArr" :value="item"
                           :key="'form-supplier-'+ index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="短信类型：" prop="smsType">
              <el-select v-model="dialog.form.smsType" clearable filterable placeholder="短信类型">
                <el-option v-for="(item, index) in smsTypeArr" :value="item"
                           :key="'form-smsType-'+ index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开关：" prop="switcher">
              <el-switch
                v-model="dialog.form.switcher"
                on-text="开"
                off-text="关"
                on-value="on"
                off-value="off"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级：" prop="orderId">
              <el-input-number v-model="dialog.form.orderId" :min="1"></el-input-number>
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
    <!-- /弹窗框结束 -->
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'base_config_sms_conf',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        userInfo: null,
        loading:true,
        search:{
          smsSupplierId: '',
          supplier: '',
          smsType: '',
          appCode: '',
          appName: '',
          switcher:'',
          sort:'updateDate',
          order:'desc'
        },
        table:{
          items:[],
          pager:{
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
            smsSupplierId: '',
            supplier: '',
            smsType: '',
            appCode: '',
            appName: '',
            orderId: '',
            switcher: '',
            remark: ''
          },
          rules: rules
        },
        smsSuppliers:[],
//        smsSupplierMap:{},
//        smsSupplierAndSmsTypeMap:{},
        switcherMap:{
          'on': '开',
          'off': '关'
        },
        smsTypeMap:{
          'common': '普通短信',
          'verify_code': '验证码',
          'voice': '语音'
        },
        supplierArr: [],
        smsTypeArr: [],
      };
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      if (this.userInfo.loginName) {
        this.getSmsSupplierDic().then(() => {
          this.query();
        });
      }
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search:'base_config_sms_conf_list',
          save:'base_config_sms_conf_save',
          del:'base_config_sms_conf_delete'
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
        if (this.userInfo.companyId && this.userInfo.companyId === 'ALL' && company) {
          this.getSmsSupplierDic().then(() => {
            this.query();
          });
        }
      },
      'loginUser': function (loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
          this.getSmsSupplierDic().then(() => {
            this.query();
          });
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
       * 格式化供应商
       * @param row
       * @returns {string}
       */
      smsSupplierFmt (row){
        return typeof row.smsSupplierId !== 'undefined' ? this.smsSupplierMap[row.smsSupplierId] : '';
      },
      /**
       * 短信类型
       * @param row
       * @returns {string}
       */
      smsTypeFmt (row) {
        return typeof row.smsType !== 'undefined' ? this.smsTypeMap[row.smsType] : '';
      },
      /**
       * 格式化开关
       * @param row
       * @returns {string}
       */
      switcherFmt (row) {
        return typeof row.switcher !== 'undefined' ? this.switcherMap[row.switcher] : '';
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['smsConfForm'] && this.$refs['smsConfForm'].resetFields) {
          this.$refs['smsConfForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.smsSupplierId = form.smsSupplierId + '';

          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            smsSupplierId: '',
            supplier: '',
            smsType: '',
            appCode: '',
            appName: '',
            orderId: '',
            switcher: 'on',
            remark: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['smsConfForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              this.dialog.form.companyId = this.getCompanyId();
              if (this.dialog.form.smsType === "普通短信"){
                this.dialog.form.smsType = "common";
              }
              if (this.dialog.form.smsType === "验证码") {
                this.dialog.form.smsType = "verify_code";
              }
              if (this.dialog.form.smsType === "语音"){
                this.dialog.form.smsType = "voice";
              }
              console.log(this.dialog.form.smsType);
              // 新增
              api.saveSmsConf(this.dialog.form).then((res) => {
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
                    content: `[SmsConf] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            } else {
              // 修改
              api.saveSmsConf(this.dialog.form).then((res) => {
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
                    content: `[SmsConf] params: ${JSON.stringify(this.dialog.form)}`
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
          api.removeSmsConf(id, {companyId: this.getCompanyId()}).then((res) => {
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
                content: `[SmsConf] params: ${JSON.stringify({id: id})}`
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
       * 获取所有短信供应商和短信类型
       *
       * */
      getSmsSupplierDic(){
        return api.getSmsSupplierDic(this.getCompanyId()).then((res) => {
          this.loading = false;
          let data = res.data;
          if(data && data.code === '0'){
            this.smsSuppliers = data.data;
            if(this.smsSuppliers && this.smsSuppliers.supplier.length){
              this.smsSuppliers.supplier.forEach((item) => {
                this.supplierArr.push(item);
              });
            }
            if(this.smsSuppliers && this.smsSuppliers.smsType.length){
              this.smsSuppliers.smsType.forEach((item) => {
                let smsTypeName;
                if (item === "common"){
                  smsTypeName = "普通短信";
                } else if (item === "verify_code") {
                  smsTypeName = "验证码";
                } else if (item === "voice"){
                  smsTypeName = "语音";
                } else{
                  smsTypeName = "";
                }
                this.smsTypeArr.push(smsTypeName);
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
        if(this.getCompanyId()){
          params.companyId = this.getCompanyId();
        }

        if (this.search.smsType === "普通短信"){
          params.smsType = "common";
        }
        if (this.search.smsType === "验证码") {
          params.smsType = "verify_code";
        }
        if (this.search.smsType === "语音"){
          params.smsType = "voice";
        }

        params = Object.assign({}, params, this.table.pager);
        api.getSmsConfList(params).then((res) => {
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
       * 清空
       */
      clear (){
        this.search = {
          smsSupplierId: '',
          smsType: '',
          appCode: '',
          appName: '',
          switcher:''
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
    },
  };
  // 表单规则
  let rules = {
    appCode: [
      {required: true, message: '请输入应用code', trigger: 'blur'}
    ],
    appName: [
      {required: true, message: '请输入应用名称', trigger: 'blur'}
    ],
    supplier: [
      {required: true, message: '请选择供应商', trigger: 'blur'}
    ],
    smsType: [
      {required: true, message: '请选择短信类型', trigger: 'blur'}
    ],
    orderId: [
      {required: false, type: 'number', message: '请选择优先级', trigger: 'blur'}
    ],
    switcher: [
      {required: true, message: '请选择开关', trigger: 'blur'}
    ]
  };
</script>
