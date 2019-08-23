<template>
  <div>
    <div class="cat-block">
      <span @click="focusCount(c)" :class="{'active': focus && c.name === focus.name}"
            v-for="c in commonQCount">{{c.name}}({{c.count}})</span>
    </div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.key" placeholder="关键字/编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-row class="toolbar">
      <el-button v-show="optAuth.add" @click="showDialog(1)" type="primary">新增</el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading="loading"
      :data="table.items"
      border
      :max-height="height - 235"
      style="width: 100%">
      <el-table-column
        prop="index"
        label="#"
        width="60">
      </el-table-column>
      <el-table-column
        prop="code"
        label="编号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="title"
        width="800"
        label="问题标题">
      </el-table-column>
      <el-table-column
        prop="status"
        :formatter="statusFmt"
        label="状态">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="scope.row.status !== -1 && optAuth.edit" type="info" icon='edit' size="mini"
                     @click.native.prevent="showDialog(2, scope.$index)"></el-button>
          <el-button title="删除" v-show="scope.row.status !== -1 && optAuth.del" type="danger" icon='delete' size="mini"
                     @click="deleteItem(scope.row.id)"></el-button>
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
      <el-form ref="commonQForm" :model="dialog.form" v-loading="dialog.loading" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类：" prop="category">
              <el-select clearable v-model="dialog.form.category" filterable placeholder="请选择分类">
                <el-option v-for="(c, key) in categories" :label="c.name" :value="c.id"
                           :key="'form-group-'+ c.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="TOP：" prop="top">
              <el-select clearable v-model="dialog.form.top" filterable placeholder="请选择TOP">
                <el-option v-for="t in [1, 2, 3, 4, 5, 6]" :label="'TOP' + t" :value="t"
                           :key="'form-top-'+ t"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="标题：" prop="title">
              <el-input v-model="dialog.form.title" auto-complete="off" :maxlength="200"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="内容：" prop="content">
              <vue-editor useCustomImageHandler @imageAdded="handleImageAdded" placeholder="请输入内容"
                          v-model="dialog.form.content"></vue-editor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="dialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp from 'bsmp_main';
  import {VueEditor} from 'vue2-editor';
  import axios from 'axios';
  export default {
    name: 'crm_service_commonQ',
    components: {
      VueEditor
    },
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        userInfo: null,
        loading: false,
        commonQCount: null,
        focus: null,
        categories: null,
        search: {
          cid: null,
          key: ''
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
          loading: false,
          form: {
            category: '',
            top: '',
            title: '',
            content: ''
          },
          rules: rules
        },
        statusMap: {
          '1': '可用',
          '0': '禁用',
          '-1': '删除'
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
      };
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      Promise.all([this.getCommonQCount(), this.getCategory()]).then(() => {
        this.query();
      });
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'crm_service_commonQ_view',
          get: 'crm_service_commonQ_get',
          add: 'crm_service_commonQ_add',
          edit: 'crm_service_commonQ_edit',
          del: 'crm_service_commonQ_delete'
        });
      },
      loginUser() {
        return bsmp.util.getUserInfo();
      }
    },
    watch: {
      'loginUser'(loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
        }
      },
      'dialog.form.content'(ctx) {
        if (ctx && !this.delHtmlTag(ctx)) {
          this.dialog.form.content = '';
        }
      }
    },
    methods: {
      /**
       * 状态格式化
       * */
      statusFmt (row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
      },

      focusCount(c) {
        this.focus = (this.focus && this.focus.name === c.name) ? null : c;
        this.query();
      },

      handleImageAdded(file, Editor, cursorLocation) {
        if (!file) {
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.$message.warning('上传单张图片不能大于5M！');
          return;
        }

        // An example of using FormData
        // NOTE: Your key could be different such as:
        // formData.append('file', file)
        this.dialog.loading = true;
        let formData = new FormData();
        formData.append('file', file);
        if (this.userInfo.loginName) {
          this.uploadFile.uploadFileData.accountNo = this.userInfo.loginName;
          this.uploadFile.uploadFileData.companyId = this.userInfo.companyId;
        }
        for (let key in this.uploadFile.uploadFileData) {
          formData.append(key, this.uploadFile.uploadFileData[key]);
        }

        axios({
          url: this.uploadFile.uploadFileUrl,
          method: 'POST',
          data: formData
        }).then((res) => {
          let url = res.data.data.fileAbsolutePath; // Get url from response
          console.log(url);
          Editor.insertEmbed(cursorLocation, 'image', url);
          this.dialog.loading = false;
        }).catch((err) => {
          this.dialog.loading = false;
          console.log(err);
        });
      },

      getCommonQ(id) {
        this.loading = true;
        api.getCommonQ(id).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            let form = data.data;
            if (form.top === 0) {
              form.top = '';
            }
            this.dialog.form = form;
          }

          this.loading = false;
          this.dialog.show = true;
        }).catch(e => {
          this.loading = false;
        });
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {

        if (this.$refs['commonQForm'] && this.$refs['commonQForm'].resetFields) {
          this.$refs['commonQForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          this.dialog.form = Object.assign({content: ''}, this.table.items[index]);
          this.getCommonQ(this.table.items[index].id);
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            category: '',
            top: '',
            title: '',
            content: ''
          };

          this.dialog.show = true;
        }
      },
      delHtmlTag(str) {
        return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
      },
      submitForm () {
        this.$refs['commonQForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.dialog.form);
            if (!params.top) {
              params.top = 0;
            }

            if (this.dialog.type === 1) {
              // 新增
              api.addCommonQ(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });

                  this.dialog.show = false;
                  this.query();
                  this.getCommonQCount();

                  // 记录日志
                  delete params.content;
                  bsmp.log({
                    component: 'crm_service',
                    type: 'add',
                    content: `[CommonQ] params: ${JSON.stringify(params)}`
                  });
                }
              });
            } else {
              // 修改
              api.editCommonQ(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });

                  this.dialog.show = false;
                  this.query();
                  this.getCommonQCount();

                  // 记录日志
                  delete params.content;
                  bsmp.log({
                    component: 'crm_service',
                    type: 'modify',
                    content: `[CommonQ] params: ${JSON.stringify(params)}`
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
          api.removeCommonQ(id).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();
              this.getCommonQCount();

              // 记录日志
              bsmp.log({
                component: 'crm_service',
                type: 'delete',
                content: `[CommonQ] params: ${JSON.stringify({id})}`
              });
            }
          });
        }).catch(e => {
        });
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        params = Object.assign({}, params, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        if (this.focus) {
          if (!this.focus.id && this.focus.name) {
            params.flag = this.focus.name.toLowerCase().indexOf('top') > -1 ? '1' : '2';
          } else {
            params.cid = this.focus.id;
          }
        }
        api.getCommonQList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
            this.table.items.map((item, i) => {
              item.index = i + 1 + params.pageNo * params.pageSize;
              return item;
            });
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: data.data.pageNo + 1,
                total: data.data.total
              });
          }
        }).catch(e => {
          this.loading = false;
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
      },

      getCommonQCount() {
        return api.getCommonQCount().then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.commonQCount = data.data;
          }
        });
      },

      getCategory() {
        return api.getCategoryList().then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.categories = data.data;
          }
        });
      }
    }
  }

  // 表单规则
  let rules = {
    category: [
      {required: true, message: '请选择分类', trigger: 'change'}
    ],
    title: [
      {required: true, message: '请输入标题', trigger: 'blur'}
    ],
    content: [
      {required: true, message: '请输入内容', trigger: 'blur'}
    ]
  };
</script>
<style lang="stylus" scoped>
  .cat-block
    background #eef1f6
    padding 5px
    margin 10px 0
    span
      cursor pointer
      display inline-block
      padding 5px 10px
      margin 5px
      border 1px solid #ff4949
      &.active
        color #fff
        background #20a0ff
</style>
