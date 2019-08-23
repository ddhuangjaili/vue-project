<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.code" placeholder="模板编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.tplTitle" placeholder="模板名称"></el-input>
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
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      stripe
      :max-height="height - 165"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="businessType"
        label="应用方"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="code"
        label="模板编号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="tplTitle"
        label="模板名称"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="tplFileName"
        label="上传模板文件"
        width="300">
        <template slot-scope="scope">
          <a :href="scope.row.tplFilePath" target="_blank">{{scope.row.tplFileName}}</a>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="emailHead"
        label="邮件头部"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="emailFoot"
        label="邮件底部"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="isSendAttachment"
        :formatter="attachFmt"
        label="是否发送附件"
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
        prop="updateDate"
        label="最后更新时间"
        :formatter="dateFmt"
        width="250"
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
      <el-form ref="mailMgrForm" :model="dialog.form" :rules="dialog.rules" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="应用方：" prop="businessType">
              <el-input v-model="dialog.form.businessType" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模板编号：" prop="code">
              <el-input v-model="dialog.form.code" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板名称：" prop="tplTitle">
              <el-input v-model="dialog.form.tplTitle" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否发送附件：" prop="isSendAttachment">
              <el-select v-model="dialog.form.isSendAttachment" filterable placeholder="是否发送附件">
                <el-option v-for="(val, key) in attachMap" :label="val" :value="key"
                           :key="'form-isSendAttachment-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="上传模板：">
              <el-upload
                :action="uploadFile.uploadFileUrl"
                :show-file-list="false"
                :on-success="avatarSuccess"
                :before-upload="beforeUpload"
                :on-error="avatarError"
                :data="uploadFile.uploadFileData"
              >
                <el-button type="primary" size="small">上传</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="21">
            <el-form-item v-show="dialog.form.tplFilePath">
              <a class="tpl-link" :href="dialog.form.tplFilePath" target="_blank">{{dialog.form.tplFileName}}</a>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="邮件头部：" prop="emailHead">
              <el-input v-model="dialog.form.emailHead" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="邮件底部：" prop="emailFoot">
              <el-input v-model="dialog.form.emailFoot" auto-complete="off"></el-input>
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
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'base_config_mail_mgr',
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
          code: '',
          tplTitle: '',
          sort: 'updateDate',
          order: 'desc'
        },
        uploadFile: {
          uploadFileUrl: bsmp.util.uploadFileCfg.uploadFileUrl,
          uploadFileData: {
            channel: 'backoffice',
            accountNo: '',
            companyId: '',
            encryptKey: bsmp.util.uploadFileCfg.encryptKey
          }
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
            code: '',
            tplTitle: '',
            tplFileName: '',
            tplFilePath: '',
            isSendAttachment: '',
            emailHead: '',
            emailFoot: '',
            remark: ''
          },
          rules: rules
        },
        attachMap: {
          '1': '不发送',
          '2': '发送'
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
          search: 'base_config_mail_mgr_list',
          save: 'base_config_mail_mgr_save',
          del: 'base_config_mail_mgr_delete'
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
      beforeUpload(file){
        if (!file) {
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.$message.warning('上传单张图片不能大于5M！');
          return;
        }
        if (this.userInfo.loginName) {
          this.uploadFile.uploadFileData.accountNo = this.userInfo.loginName;
          this.uploadFile.uploadFileData.companyId = this.userInfo.companyId;
        }
        if (/\w?.html/.test(file.name)) {
          return true;
        } else {
          this.$message.error('文件格式不正确！');
          return false;
        }
      },
      avatarSuccess(res, file, files){
        if (res.code !== '0') {
          this.$message.error('上传图片失败' + res.msg);
          return;
        }
        if (res.data) {
          this.dialog.form.tplFileName = res.data.fileName;
          this.dialog.form.tplFilePath = res.data.fileAbsolutePath;
        }

        this.$message.success('上传成功' + res.msg);
      },
      avatarError(err, file, fileList) {
        this.$message.error('上传图片失败' + err);
      },
      /**
       * 日期格式化
       * */
      dateFmt (row) {
        return row.updateDate ? bsmp.util.formatDate.format(new Date(row.updateDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      /**
       * 格式化开关
       * @param row
       * @returns {string}
       */
      attachFmt (row) {
        return typeof row.isSendAttachment !== 'undefined' ? this.attachMap[row.isSendAttachment] : '';
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['mailMgrForm'] && this.$refs['mailMgrForm'].resetFields) {
          this.$refs['mailMgrForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.isSendAttachment = form.isSendAttachment + '';

          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            code: '',
            tplTitle: '',
            tplFileName: '',
            tplFilePath: '',
            isSendAttachment: '',
            emailHead: '',
            emailFoot: '',
            remark: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['mailMgrForm'].validate((valid) => {
          if (valid) {
            if (!this.dialog.form.tplFilePath) {
              this.$message.warning('请先上传文件！');
              return;
            }
            this.dialog.form.isSendAttachment = parseInt(this.dialog.form.isSendAttachment, 10);
            if (this.dialog.type === 1) {
              // 新增
              if (!this.getCompanyId()) {
                this.$message.error('请先选择公司！');
                return;
              }
              this.dialog.form.companyId = this.getCompanyId();

              api.saveMailMgr(this.dialog.form).then((res) => {
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
                    content: `[MailMgr] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            } else {
              // 修改
              api.saveMailMgr(this.dialog.form).then((res) => {
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
                    content: `[MailMgr] params: ${JSON.stringify(this.dialog.form)}`
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
          api.removeMailMgr(id).then((res) => {
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
                content: `[MailMgr] params: ${JSON.stringify({id: id})}`
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
        api.getMailMgrList(params).then((res) => {
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
          code: '',
          tplTitle: ''
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
    businessType:[
      {required: true, message: '请输入应用方', trigger: 'blur'}
    ],
    code: [
      {required: true, message: '请输入模板编号', trigger: 'blur'}
    ],
    tplTitle: [
      {required: true, message: '请输入模板名称', trigger: 'blur'}
    ],
    isSendAttachment: [
      {required: true, message: '请选择附件方式', trigger: 'blur,change'}
    ]
  };
</script>
<style lang="stylus" scoped>
  .tpl-link
    word-break: break-all
</style>
