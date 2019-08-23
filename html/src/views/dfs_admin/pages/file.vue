<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item v-show="optAuth.setCompany">
          <el-select v-model="search.company" clearable placeholder="选择公司" @change="getSearchAppList()">
            <el-option
              v-for="item in search.companys"
              :key="'key-company-' + item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="app">
          <el-select v-model="search.app" clearable placeholder="选择应用">
            <el-option
              v-for="item in search.apps"
              :key="'key-app-' + item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="group">
          <el-input v-model="search.group" placeholder="所属组"></el-input>
        </el-form-item>

        <el-form-item prop="type">
          <el-input v-model="search.type" placeholder="文件类型"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="query">查 询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-row class="toolbar" style="height: 50px;line-height: 50px;">
      <el-button @click="showDialog(1)" type="primary" icon="upload">上 传</el-button>
      <el-button @click="deleteFiles()" type="danger" icon="delete">删 除</el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 165"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="company"
        label="公司编码"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        prop="appCode"
        label="应用编码"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        prop="fileName"
        label="文件名称"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        prop="group"
        label="所属组"
        width="100" sortable>
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="200" sortable>
      </el-table-column>
      <el-table-column
        prop="type"
        label="文件类型"
        width="120" sortable>
      </el-table-column>
      <el-table-column
        prop="contentType"
        label="类型"
        width="120" sortable>
      </el-table-column>
      <el-table-column
        prop="size"
        label="文件大小MB"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        prop="remotePath"
        label="远程访问路径"
        width="300" sortable>
      </el-table-column>
      <el-table-column
      prop="createTime"
      label="创建时间"
      :formatter="createTimeFmt"
      width="200" sortable>
    </el-table-column>
      <el-table-column
        prop="validTime"
        label="有效时间"
        width="200" sortable>
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

    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false"
               :close-on-click-modal="false">
      <el-form ref="fileForm" :model="dialog.form" :rules="dialog.rules" label-width="120px"
               class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司：" prop="company" v-show="optAuth.setCompany">
              <el-select v-model="dialog.form.company"
                         placeholder="选择公司" @change="getUploadAppList()">
                <el-option
                  v-for="item in dialog.companys"
                  :key="'key-form-company-' + item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用：" prop="appCode">
              <el-select v-model="dialog.form.appCode" placeholder="选择应用">
                <el-option
                  v-for="item in dialog.apps"
                  :key="'key-form-appCode-' + item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>








        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文件：" prop="file">
              <el-upload
                class="upload-demo"
                action="https://test.com"
                ref="upload"
                :on-change="fileChange"
                :auto-upload="false"
              >
                <el-button size="small" type="primary">选择文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">上 传</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import api from '../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'file',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        search: {company: null, app: null, companys: [], apps: [], group: null, type: null},
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
          title: '',
          form: {
            company: '',
            appCode: '',
            files: []
          },
          companys:[],
          apps:[],
          rules: {
            "appCode": [
              {required: true, message: '请选择app', trigger: 'blur'}
            ]
          }
        },
        selectFileIds: []
      };
    },
    mounted () {
      this.getSearchCompanyList();
      this.query();
    },
    computed: {
      ...mapGetters(['loginUser']),
      optAuth() {
        return bsmp.util.mapAuth({
          setCompany: 'dfs_admin_file_set_company'
        });
      }
    },
    methods: {
      showDialog (type, index) {
        if (this.$refs['fileForm'] && this.$refs['fileForm'].resetFields) {
          this.$refs['fileForm'].resetFields();
        }
        this.getUploadCompanyList();
        if (this.$refs['upload'] && this.$refs['upload'].clearFiles) {
          this.$refs['upload'].clearFiles();
        }
        if (this.optAuth.setCompany != 1) {
          this.dialog.form.company = this.loginUser.data.companyId;
        }
        this.dialog.show = true;
      },
      submitForm () {
        let fileList = this.dialog.form.files;
        if (!fileList || fileList.length < 1) {
          this.$message({
            type: 'error',
            message: '请选择文件!'
          });
          return;
        }

        this.$refs['fileForm'].validate((valid) => {
          if (valid) {
            let fd = new FormData();
            for (let i = 0; i < fileList.length; i++) {
              fd.append("files", fileList[i].raw);
            }
            fd.append("appCode", this.dialog.form.appCode);
            fd.append("company", this.dialog.form.company);
            api.file.upload(fd).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '上传成功!'
                });
                this.dialog.show = false;
                this.query();
              }
            });
          } else {
            return false;
          }
        });
      },
      cancelForm () {
        this.dialog.show = false;
      },
      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = Object.assign({}, this.search, this.table.pager,
          {pageNum: this.table.pager.pageNo});
        delete params.apps;
        delete params.companys;
        api.file.list(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.list;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: data.data.pageNum,
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
      handleSelectionChange(rows){
        this.selectFileIds = rows;
      },
      fileChange(file, fileList){
        this.dialog.form.files = fileList;
      },
      deleteFiles(){
        let ids = [];
        if (this.selectFileIds && this.selectFileIds.length > 0) {
          for (let i = 0; i < this.selectFileIds.length; i++) {
            ids.push(this.selectFileIds[i].id);
          }
        }
        if (ids.length < 1) {
          return;
        }
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.file.delete(ids).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
          });
        }).catch((e) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      getSearchCompanyList(){
        api.company.list().then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.search.companys = data.data;
            this.getSearchAppList();
          }
        });
      },
      getSearchAppList(){
        this.search.app = null;
        let company = null;
        if (this.optAuth.setCompany != 1) {
          company = this.loginUser.data.companyId;
        } else {
          company = this.search.company;
        }
        if (!company) {
          this.search.apps = [];
          return;
        }
        api.company.apps(company).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.search.apps = data.data;
          }
        });
      },
      getUploadCompanyList(){
        api.company.list().then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.dialog.companys = data.data;
            this.getUploadAppList();
          }
        });
      },
      getUploadAppList(){
        this.dialog.form.appCode = null;
        let company = null;
        if (this.optAuth.setCompany != 1) {
          company = this.loginUser.data.companyId;
        } else {
          company = this.dialog.form.company;
        }
        if (!company) {
          this.dialog.apps = [];
          return;
        }
        api.company.apps(company).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.dialog.apps = data.data;
          }
        });
      },
      createTimeFmt(row){
        if(row.createTime){
          return new Date(row.createTime).format("yyyy-MM-dd hh:mm:ss");
        }
        return "";
      }
    }
  };

  Date.prototype.format = function(fmt) {
    var o = {
      "M+" : this.getMonth()+1,                 //月份
      "d+" : this.getDate(),                    //日
      "h+" : this.getHours(),                   //小时
      "m+" : this.getMinutes(),                 //分
      "s+" : this.getSeconds(),                 //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
      if(new RegExp("("+ k +")").test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
    }
    return fmt;
  }
</script>
