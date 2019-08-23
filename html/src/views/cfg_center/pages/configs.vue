<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="switchTab">
      <el-tab-pane label="GTS2主包" name="main"></el-tab-pane>
      <el-tab-pane label="GTS2马甲包" name="vest"></el-tab-pane>
      <el-tab-pane label="插件化主包" name="main_p"></el-tab-pane>
      <el-tab-pane label="插件化马甲包" name="vest_p"></el-tab-pane>
    </el-tabs>

    <el-row class="toolbar">
      <el-button v-show="optAuth.curd" @click="showDialog(1)" type="primary">新增</el-button>
    </el-row>

    <!-- GTS2马甲包 -->
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 150"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="100">
      </el-table-column>
      <el-table-column :key="header.key" v-for="(header, index) in headers" :label="header.label">
        <template slot-scope="scope">
          {{scope.row[header.key]}}
        </template>
      </el-table-column>
      <el-table-column
        prop="versionApp"
        label="版本号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="clientType"
        label="应用于"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="modifiedTime"
        width="200"
        label="更新时间">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="modifier"
        width="200"
        label="更新人">
      </el-table-column>
      <el-table-column
        label="配置文件">
        <template slot-scope="scope">
          <el-upload
            v-show="optAuth.upload"
            :action="uploadFile.uploadFileUrl"
            :show-file-list="false"
            :on-success="avatarSuccess"
            :before-upload="(file) => {beforeUpload(file, scope.row)}"
            :on-error="avatarError"
            :data="uploadFile.uploadFileData"
          >
            <el-button type="primary" size="small"><i class="icon-upload"></i>&nbsp;&nbsp;上传</el-button>
          </el-upload>
          <el-button v-show="scope.row.url" type="primary" size="small">
            <a :href="scope.row.url" target="_blank" class="download-link" download="w3logo">
              <i class="icon-download"></i>&nbsp;&nbsp;下载</a></el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.curd" @click.native.prevent="showDialog(2, scope.$index)"
                     type="info" icon='edit' size="mini"></el-button>
          <el-button title="删除" v-show="optAuth.curd" @click.native.prevent="deleteItem(scope.row.id)"
                     type="danger" icon='delete' size="mini"></el-button>
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
    <!-- /GTS2马甲包 -->

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="configForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="应用平台：" prop="clientType">
              <el-radio class="radio" v-model="dialog.form.clientType"
                        v-for="(val, key) in clientTypeMap"
                        :key="'add-form-clientType-'+ key"
                        :label="key">{{val}}
              </el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-show="activeName === 'vest' || activeName === 'vest_p'">
          <el-col :span="24">
            <el-form-item label="名称：" prop="vestName">
              <el-input v-model="dialog.form.vestName" auto-complete="off"></el-input>
              <el-alert
                v-show="dialog.form.vestName"
                :title="vestNameC"
                type="info"
                :closable="false"
                show-icon>
              </el-alert>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="版本号：" prop="versionApp">
              <el-input v-model="dialog.form.versionApp" auto-complete="off"></el-input>
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
        <el-button @click="submitForm" type="primary">保 存</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'configs',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        activeName: 'main',
        headers: [],
        table: {
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          }
        },
        uploadFile: {
          uploadFileUrl: api.configUploadUrl,
          uploadFileData: {
            id: '',
            token: bsmp.util.getToken()
          }
        },
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          title: '',
          form: {
            vestName: '',
            versionApp: '',
            clientType: null,
            remark: ''
          },
          rules: null
        },
        clientTypeMap: {
          'ios': 'IOS',
          'android': 'Android'
        }
      };
    },
    mounted () {
      this.query();
      this.initRules();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          view: 'app_args_configs_view',
          curd: 'app_args_configs_curd',
          upload: 'app_args_configs_upload'
        });
      },
      vestNameC() {
        let name = this.dialog.form.vestName;
        if (this.dialog.form.clientType) {
          name += '_' + this.dialog.form.clientType;
        }
        return '最终名称：' + name;
      }
    },
    methods: {
      beforeUpload(file, row){
        if (!this.optAuth.upload) {
          this.$message.warning('无上传图片权限！');
          return false;
        }

        if(/\w?.json$/.test(file.name)) {
          this.uploadFile.uploadFileData.id = row.id;
          return true;
        } else {
          this.$message.error('文件格式不正确！');
          return false;
        }
      },
      avatarSuccess(res, file, files){
        if (res.code !== 0) {
          this.$message.error('上传图片失败' + res.msg);
          return;
        }
        this.$message.success('上传成功' + res.msg);
        this.query();
      },
      avatarError(err, file, fileList) {
        this.$message.error('上传图片失败' + err);
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['configForm'] && this.$refs['configForm'].resetFields) {
          this.$refs['configForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '编辑';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.vestName = form.vestName.replace(/_ios|_android/g, '');

          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            vestName: '',
            versionApp: '',
            clientType: null,
            remark: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['configForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.dialog.form);
            params.type = this.activeName;
            params.vestName += '_' + params.clientType;

            if (this.dialog.type === 1) {
              params.action = 'create';
              // 新增
              api.curdConfig(params).then((res) => {
                let data = res.data;
                if (data && data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'cfg_center',
                    type: 'add',
                    content: `[Configs] params: ${JSON.stringify(params)}`
                  });
                }
              });
            } else {
              // 修改
              params.action = 'update';
              api.curdConfig(params).then((res) => {
                let data = res.data;
                if (data && data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '编辑成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'cfg_center',
                    type: 'modify',
                    content: `[Configs] params: ${JSON.stringify(params)}`
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
          api.curdConfig({id: id, action: 'delete'}).then((res) => {
            let data = res.data;
            if (data && data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'cfg_center',
                type: 'delete',
                content: `[Configs] params: ${JSON.stringify({id: id, action: 'delete'})}`
              });
            }
          });
        }).catch(e => {
        });
      },
      switchTab() {
        this.headers = [];
        if (this.activeName === 'vest' || this.activeName === 'vest_p') {
          this.headers = [{
            key: 'vestName',
            label: '名称'
          }];
        }
        this.table = {
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          }
        };
        this.query();
        this.initRules();
      },

      validateName(rule, value, callback) {
        if (value === '') {
          callback(new Error('请输入名称'));
        } else if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(value)) {
          callback(new Error('名称不能输入中文'));
        } else {
          callback();
        }
      },

      initRules() {
        let formRules = rules;
        if (this.activeName === 'vest' || this.activeName === 'vest_p') {
          formRules = Object.assign({}, rules, {
            vestName: [
              {validator: this.validateName, trigger: 'blur'}
            ]
          });
        }
        this.dialog.rules = formRules;
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = {type: this.activeName};
        params = Object.assign({}, params, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getConfigs(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === 0) {

            this.table.items = data.data.list;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: parseInt(data.data.pageNo, 10) + 1,
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
        this.pager.pageSize = val;
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
      },

      cancelForm() {
        this.dialog.show = false;
      }
    }
  };
  // 表单规则
  let rules = {
    versionApp: [
      {required: true, message: '请输入版本号', trigger: 'blur'}
    ],
    clientType: [
      {required: true, message: '请选择应用平台', trigger: 'change'}
    ]
  };
</script>
<style lang="stylus" scoped>
  .cell > div
    display: inline-block
</style>
