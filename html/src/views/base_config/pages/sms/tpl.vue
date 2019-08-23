<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.appCode" placeholder="应用方"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.tplCode" placeholder="模板编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.tplName" placeholder="模板名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.tplContent" placeholder="模板内容"></el-input>
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
      <el-table-column type="index" label="序号" width="70">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="appCode"
        label="应用方"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="tplCode"
        label="模板编号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="tplName"
        label="模板名称"
        width="250">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="tplContent"
        label="模板内容"
        width="400">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="smsSign"
        label="短信签名"
        :formatter="smsSignFmt"
        width="150">
      </el-table-column>
      <el-table-column
        prop="lang"
        :formatter="langFmt"
        label="语言"
        width="150">
      </el-table-column>
      <el-table-column
        prop="deleteFlag"
        :formatter="deleteFlagFmt"
        label="状态"
        width="150">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateDate"
        label="最后更新时间"
        :formatter="dateFmt"
        width="300"
        sortable>
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

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="smsTplForm" :model="dialog.form" :rules="dialog.rules" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="应用方：" prop="appCode">
              <el-input v-model="dialog.form.appCode" placeholder="应用方"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="短信签名：" prop="smsSign">
              <el-select v-model="dialog.form.smsSign" clearable placeholder="短信签名">
                <el-option v-for="(val, key) in smsSignMap" :label="val" :value="key"
                           :key="'form-smsSign-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模板编号：" prop="tplCode">
              <el-input v-model="dialog.form.tplCode" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板名称：" prop="tplName">
              <el-input v-model="dialog.form.tplName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="语言：" prop="lang">
              <el-select v-model="dialog.form.lang" filterable placeholder="语言">
                <el-option v-for="(val, key) in langMap" :label="val" :value="key"
                           :key="'form-lang-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态：" prop="deleteFlag">
              <el-select v-model="dialog.form.deleteFlag" filterable placeholder="状态">
                <el-option v-for="(val, key) in deleteFlagMap" :label="val" :value="key"
                           :key="'form-deleteFlag-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模板内容：" prop="tplContent">
              <el-input type="textarea" :rows="3" v-model="dialog.form.tplContent"></el-input>
            </el-form-item>
          </el-col>
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
  import bsmp from 'bsmp_main';
  export default {
    name: 'base_config_sms_tpl',
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
          tplCode: '',
          tplName: '',
          tplContent: '',
          deleteFlag: '',
          sort: 'updateDate',
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
            tplCode: '',
            tplName: '',
            smsSign: '',
            tplContent: '',
            lang: 'zh_CN',
            deleteFlag: 'N',
            remark: ''
          },
          rules: rules
        },
        langMap: {
          'zh_TW': '繁体',
          'zh_CN': '简体',
          'en_US': '英文'
        },
        deleteFlagMap: {
          'N': '启用',
          'Y': '关闭'
        },
        appCodes:[],
        appCodeMap:{},
        smsSigns:[],
        smsSignMap:{}
      };
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      if (this.userInfo.loginName) {
        this.getSmsAppConfIdDic().then(() => {
          this.getSmsSign().then(() => {
            this.query();
          });
        });
      }
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'base_config_sms_tpl_list',
          save: 'base_config_sms_tpl_save',
          del: 'base_config_sms_tpl_delete'
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
            this.getSmsSign().then(() => {
              this.query();
            });
          });
        }
      },
      'loginUser': function (loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
          this.getSmsAppConfIdDic().then(() => {
            this.getSmsSign().then(() => {
              this.query();
            });
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
       * 格式化状态
       * @param row
       * @returns {string}
       */
      deleteFlagFmt (row) {
        return typeof row.deleteFlag !== 'undefined' ? this.deleteFlagMap[row.deleteFlag] : '';
      },
      /**
       * 格式化短信签名
       * @param row
       * @returns {string}
       */
      smsSignFmt (row){
        return typeof row.smsSign !== 'undefined' ? this.smsSignMap[row.smsSign] : '';
      },

      /**
       * 格式化语言
       * @param row
       * @returns {string}
       */
      langFmt (row) {
        return typeof row.lang !== 'undefined' ? this.langMap[row.lang] : '';
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['smsTplForm'] && this.$refs['smsTplForm'].resetFields) {
          this.$refs['smsTplForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);

          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            appCode: '',
            tplCode: '',
            tplName: '',
            smsSign: '',
            tplContent: '',
            lang: 'zh_CN',
            deleteFlag: 'N',
            remark: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['smsTplForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              // 新增
              if (!this.getCompanyId()) {
                this.$message.error('请先选择公司！');
                return;
              }
              this.dialog.form.companyId = this.getCompanyId();

              api.saveSmsTpl(this.dialog.form).then((res) => {
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
                    content: `[SmsTpl] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            } else {
              // 修改
              api.saveSmsTpl(this.dialog.form).then((res) => {
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
                    content: `[SmsTpl] params: ${JSON.stringify(this.dialog.form)}`
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
          api.removeSmsTpl(id).then((res) => {
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
                content: `[SmsTpl] params: ${JSON.stringify({id: id})}`
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
       * 获取所有短信应用方
       *
       * */
      getSmsAppConfIdDic(){
        return api.getSmsAppConfIdDic(this.getCompanyId()).then((res) => {
          this.loading = false;
          let data = res.data;
          if(data && data.code === '0'){
            this.appCodes = data.data;
            if(this.appCodes && this.appCodes.length){
              this.appCodes.forEach((item) => {
                this.appCodeMap[item.id] = item.appCode;
              });
            }
          }
        }).catch(e => {
          this.loading = false;
        });
      },
      /**
       *获取短信签名类型
       * */
      getSmsSign() {
        return api.getDict({parentDictCode: 'SmsSign',companyId: this.getCompanyId()}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.smsSigns = data.data;
            if (this.smsSigns && this.smsSigns.length) {
              this.smsSigns.forEach((item) => {
                if(!item.dictName.startsWith('【')){
                  item.dictName = '【' + item.dictName;
                }
                if(!item.dictName.endsWith('】')){
                  item.dictName = item.dictName + '】';
                }
                this.smsSignMap[item.dictCode] = item.dictName;
              });
            }
          }
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
        api.getSmsTplList(params).then((res) => {
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
          appCode: '',
          tplCode: '',
          tplName: '',
          tplContent: ''
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
    appCode: [
      {required: true, message: '请选择应用方', trigger: 'blur'}
    ],
    tplCode: [
      {required: true, message: '请输入模板编号', trigger: 'blur'}
    ],
    tplName: [
      {required: true, message: '请输入模板名称', trigger: 'blur'}
    ],
    tplContent: [
      {required:true, message:'请输入模板内容', trigger: 'blur'}
    ],
    deleteFlag: [
      {required:true, message: '请选择状态', trigger: 'blur'}
    ]
  };
</script>
<style lang="stylus" scoped>
  .tpl-link
    word-break:break-all
</style>
