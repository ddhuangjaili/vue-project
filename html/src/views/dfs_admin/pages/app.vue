<template>
  <div>
    <query-panel v-show="optAuth.limit">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-form-item>
            <el-input v-model="search.company" placeholder="公司编码"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button  type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-row class="toolbar">
      <el-button @click="showDialog(1)" type="primary">新增</el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 165"
      style="width: 100%">
      <el-table-column type="index" width="40">
      </el-table-column>
      <el-table-column
        prop="company"
        label="公司"
        width="120" sortable>
      </el-table-column>
      <el-table-column
        prop="name"
        label="应用名称"
        width="140" sortable>
      </el-table-column>
      <el-table-column
        prop="code"
        label="应用编码"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        prop="token"
        label="Token"
        width="310" sortable>
      </el-table-column>
      <el-table-column
        prop="volumeUsed"
        label="使用量MB"
        width="120" sortable>
      </el-table-column>
      <el-table-column
        prop="fileCount"
        label="文件总数"
        width="110" sortable>
      </el-table-column>
      <el-table-column
        prop="limit.volumeLimit"
        label="最大容量MB"
        width="140" sortable>
      </el-table-column>
      <el-table-column
        prop="limit.forbidUpload"
        label="禁止上传"
        :formatter="forbidUploadTypeFmt"
        width="110" sortable>
      </el-table-column>
	  <el-table-column
        prop="limit.accessOut"
        label="访问方式"
        :formatter="accessOutFmt"
        width="110" sortable>
      </el-table-column>
      <el-table-column
        prop="limit.forbidDownload"
        label="禁止下载"
        :formatter="forbidDownloadTypeFmt"
        width="110" sortable>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" type="info" icon='edit' size="mini"  @click.native.prevent="showDialog(2, scope.$index)"></el-button>
          <el-button title="限制" v-show="optAuth.limit" type="info" icon='setting' size="mini"  @click.native.prevent="showLimitDialog(scope.$index)"></el-button>
		  <el-button title="访问域名列表" v-show="optAuth.limit" type="info" icon='share' size="mini"  @click.native.prevent="showDomainListDialog(scope.$index)"></el-button>
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

    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="appForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="应用名称：" prop="name">
              <el-input v-model="dialog.form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应用编码：" prop="code">
              <el-input v-model="dialog.form.code" auto-complete="off" :disabled="dialog.type === 2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-show="optAuth.limit">
          <el-col :span="12">
            <el-form-item label="公司编码：" prop="company">
              <el-input v-model="dialog.form.company" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
    
	 <el-dialog :title="domainAddDialog.title" v-model="domainAddDialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="domainForm" :model="domainAddDialog.form" :rules="domainAddDialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="域名名称：" prop="domain">
              <el-input v-model="domainAddDialog.form.domain" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>

         
		<el-col :span="12">
		<el-form-item label="黑/白名单：" prop="domainType">
		  <el-select  v-model="domainAddDialog.form.domainType" >
			<el-option label="白名单" value="0"></el-option>
			<el-option label="黑名单" value="1"></el-option>
		  </el-select>
		</el-form-item>
        
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDomainForm">保 存</el-button>
        <el-button @click="cancelDomainForm">取 消</el-button>
      </div>
    </el-dialog>
	
	
	 <el-dialog :title="refererAddDialog.title" v-model="refererAddDialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="refererForm" :model="refererAddDialog.form" :rules="refererAddDialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="referer名称：" prop="referer">
              <el-input v-model="refererAddDialog.form.referer" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>

         
		<el-col :span="12">
		<el-form-item label="启/禁用：" prop="refererEnable">
		  <el-select  v-model="refererAddDialog.form.refererEnable" >
			<el-option label="启用" value="0"></el-option>
			<el-option label="禁用" value="1"></el-option>
		  </el-select>
		</el-form-item>
        
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRefererForm">保 存</el-button>
        <el-button @click="cancelRefererForm">取 消</el-button>
      </div>
    </el-dialog>
	
	
	<el-dialog :title="domainDialog.title" v-model="domainDialog.show" :close-on-press-escape="false" :close-on-click-modal="false" style="width: 80%">
		<el-row class="toolbar">
			<el-button @click="showdomainDialog(1)" type="primary">新增域名</el-button>
		</el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.domains"
      border
      :max-height="height - 165"
      style="width: 100%">
      <el-table-column type="index" width="40">
      </el-table-column>
      <el-table-column
        prop="appCode"
        label="应用编号"
        width="180" >
      </el-table-column>
      <el-table-column
        prop="domain"
        label="域名"
        width="280" >
      </el-table-column>
      <el-table-column
        prop="domainType"
        label="黑白名单"
		:formatter="domainTypeFmt"
        width="120" >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button title="删除" type="info" icon='delete' size="mini"  @click.native.prevent="deleteDomainDialog(scope.$index)"></el-button>
		  <el-button title="防盗链设置" v-show="optAuth.limit" type="info" icon='share' size="mini"  @click.native.prevent="showRefererDialog(scope.$index)"></el-button>
        </template>
      </el-table-column>
    </el-table>
	
	</el-dialog>
		<el-dialog :title="refererDialog.tableTitle" v-model="refererDialog.show" :close-on-press-escape="false" :close-on-click-modal="false" style="width: 80%">
		<el-row class="toolbar">
			<el-button @click="addRefererDialog(1)" type="primary">新增Referer</el-button>
		</el-row>
		<el-table
		  highlight-current-row
		  v-loading.body="loading"
		  :data="table.referers"
		  border
		  :max-height="height - 165"
		  style="width: 100%">
		  <el-table-column type="index" width="40">
		  </el-table-column>
		  <el-table-column
			prop="appCode"
			label="应用编号"
			width="140" >
		  </el-table-column>
		  <el-table-column
			prop="domain"
			label="域名"
			width="200" >
		  </el-table-column>
		   <el-table-column
			prop="referer"
			label="referer"
			width="200" >
		  </el-table-column>
		  <el-table-column
			prop="refererEnable"
			label="启/禁用"
			:formatter="refererFmt"
			width="80" >
		  </el-table-column>
		  <el-table-column
			fixed="right"
			label="操作">
			<template slot-scope="scope">
			  <el-button title="删除" type="info" icon='delete' size="mini"  @click.native.prevent="deleteRefererDialog(scope.$index)"></el-button>
			</template>
		  </el-table-column>
		</el-table>
	</el-dialog>
	
    
    <el-dialog :title="limitDialog.title" v-model="limitDialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="appLimitForm" :model="limitDialog.form" :rules="limitDialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="限制容量：" prop="volumeLimit">
              <el-input v-model.number="limitDialog.form.volumeLimit" :maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="禁止上传：" prop="forbidUpload">
              <el-select  v-model="limitDialog.form.forbidUpload" >
                <el-option label="允许上传" value="0"></el-option>
                <el-option label="禁止上传" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="访问方式：" prop="accessOut">
              <el-select  v-model="limitDialog.form.accessOut" >
                <el-option label="内网访问" value="0"></el-option>
                <el-option label="外网访问" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitLimitForm">保 存</el-button>
        <el-button @click="cancelLimitForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>


  import api from '../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'app',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        search: {company:null},
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
            name: '',
            code: '',
            company:null
          },
          rules:{
            "name":[
              {required: true, message: '请输入名称', trigger: 'blur'},
              { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
            ],
            "code":[
              {required: true, message: '请输入编码', trigger: 'blur'},
              { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
            ]
          }
        },
        limitDialog:{
          show: false,
          form: {
            volumeLimit: 1,
            forbidUpload: 0,
            accessOut: 0,
          },
          index: -1, // 数据下标
          title:"限制",
          rules:{
            volumeLimit:[
              {required: true, type: 'number', message: '请输入容量大小', trigger: 'blur'},
              //{ , message: '必须为数值', trigger: 'blur'},
              //{ min: 2, max: 30, message: '长度在 2 到 30 ', trigger: 'blur' }
            ],
            forbidUpload: [
              { required: true, message: '请选择是否禁止上传', trigger: 'change' }
            ],
             accessOut: [
              { required: true, message: '请选择访问方式', trigger: 'change' }
            ]
          },
        },
		domainDialog:{
          show: false,
		  form: {
            domain: '',
            appCode: '',
            domainType:'',
          },
          index: -1, // 数据下标
          title:"访问域名",
          rules:{
          },
        },
		refererDialog:{
          show: false,
		  form: {
            appCode: '',
            domain: '',
            referer:'',
			refererEnable:'',
          },
		  tableTitle:"防盗链设置",
          index: -1, // 数据下标
          title:"新增防盗链设置",
          rules:{
          },
        },
		refererAddDialog:{
          show: false,
		  form: {
            appCode: '',
            domain: '',
            referer:'',
			refererEnable:'',
          },
		  tableTitle:"防盗链设置",
          index: -1, // 数据下标
          title:"新增防盗链设置",
          rules:{
          },
        },
		domainAddDialog:{
          show: false,
		  form: {
            domain: '',
            appCode: '',
            domainType:'',
          },
          index: -1, // 数据下标
          title:"访问域名",
          rules:{
          },
        },
        limitSelect:[
          {"code":0,name:"允许上传"},
          {"code":1,name:"禁止上传"}
        ]
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          limit: 'dfs_admin_app_limit_update'
        });
      }
    },
    methods: {
      /**
       * 类型格式化
       * */
      typeFmt (row) {
        return row.repeatLoginType ? this.typeMap[row.repeatLoginType] : '';
      },
      forbidUploadTypeFmt (row){
        if(row.limit){
          row.limit.forbidUpload = row.limit.forbidUpload+"";
          if(row.limit.forbidUpload == "1"){
            return "已禁止";
          }
        }
        return "";
      },
      accessOutFmt (row){
        if(row.limit){
          row.limit.accessOut = row.limit.accessOut+"";
          if(row.limit.accessOut == "1"){
            return "外网访问";
          }
        }
        return "内网访问";
      },
      forbidDownloadTypeFmt (row){
        if(row.limit){
          row.limit.forbidDownload = row.limit.forbidDownload+"";
          if(row.limit.forbidDownload == "1"){
            return "已禁止";
          }
        }
        return "";
      },
	  domainTypeFmt (row){
        if(row.domainType == "1"){
            return "黑名单";
          }
        return "白名单";
      },
	  refererFmt (row){
        if(row.refererEnable == "1"){
            return "禁用";
          }
        return "启用";
      },
      showDialog (type, index) {
        if (this.$refs['appForm'] && this.$refs['appForm'].resetFields) {
          this.$refs['appForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({
            name: '',
            code: ''
          }, this.table.items[index]);
          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            name: '',
            code: ''
          };
        }
        this.dialog.show = true;
      },
	  addRefererDialog (type, index) {
        if (this.$refs['refererForm'] && this.$refs['refererForm'].resetFields) {
          this.$refs['refererForm'].resetFields();
        }

        this.refererAddDialog.title = type === 1 ? '新增referer' : '修改referer';
        this.refererAddDialog.type = type;

        
        this.refererAddDialog.show = true;
      },
	  showdomainDialog (type, index) {
        if (this.$refs['domainForm'] && this.$refs['domainForm'].resetFields) {
          this.$refs['domainForm'].resetFields();
        }

        this.domainAddDialog.title = type === 1 ? '新增域名' : '修改域名';
        this.domainAddDialog.type = type;

        
        this.domainAddDialog.show = true;
      },
      deleteRefererDialog(index) {
        let appCode =this.table.items[index].code;
		
		let form = Object.assign({
            appCode: '',
            domain: '',
            referer:'',
			refererEnable:'',
          }, this.table.referers[index]);

		
		if(confirm("确认删除吗")){
			api.app.refererDelete(form).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '操作成功!'
                  });
                				  
				let appCode =form.appCode;
				let domain =form.domain;
				
                this.queryReferer(appCode,domain);
                }
              });
		}
      },
	 deleteDomainDialog (index) {
        let appCode =this.table.items[index].code;
		
		
		let form = Object.assign({
           domain: '',
            appCode: '',
            domainType:'',
          }, this.table.domains[index]);

		  
		if(confirm("确认删除吗")){
			api.app.domainDelete(form).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '操作成功!'
                  });
                  this.domainAddDialog.show = false;
                 this.queryDomain(form.appCode);
                }
              });
		}
      },
	  
      showLimitDialog(index){
        if (this.$refs['appLimitForm'] && this.$refs['appLimitForm'].resetFields) {
          this.$refs['appLimitForm'].resetFields();
        }
        let form = Object.assign({
          volumeLimit:1,
          forbidUpload: 0
        }, this.table.items[index].limit);
        this.limitDialog.form = form;
        this.limitDialog.index = index;
        this.limitDialog.show = true;
      },
      showDomainListDialog(index){
		let appCode =this.table.items[index].code;
       
        this.domainDialog.show = true;
		this.domainAddDialog.form.appCode=appCode;
		
		this.queryDomain(appCode);
      },
     showRefererDialog (index){
	   this.refererDialog.show = true;
	   let appCode =this.table.items[index].code;
       let domain =this.table.domains[index].domain;
	   
	   this.refererAddDialog.form.appCode=appCode;
	   this.refererAddDialog.form.domain=domain;
	  
 		this.queryReferer(appCode,domain);
      },
	  
      submitForm () {
        this.$refs['appForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.dialog.form);
            if (this.dialog.type === 1) {
              // 新增
              api.app.add(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });
                  this.dialog.show = false;
                  this.query();
                }
              });
            } else {
              // 修改
              api.app.update(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.dialog.show = false;
                  this.query();
                }
              });
            }
          } else {
            return false;
          }
        });
      },
      submitLimitForm(){
        console.log(this.limitDialog.form);
        console.log( this.$refs['appLimitForm']);
        this.$refs['appLimitForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.limitDialog.form);
            let code =  this.table.items[this.limitDialog.index].code;
            console.log(params);
            api.app.updateLimit(code,params).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                this.limitDialog.show = false;
                this.query();
              }
            });
          }
        });
      },
	submitRefererForm(){
     
        this.$refs['refererForm'].validate((valid) => {
          if (valid) {
			
            let params = Object.assign({}, this.refererAddDialog.form);

            api.app.refererAdd(params).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                this.refererAddDialog.show = false;
				let appCode =params.appCode;
				let domain =params.domain;
                this.queryReferer(appCode,domain);
              }
            });
          }
        });
      },
	submitDomainForm(){
     
        this.$refs['domainForm'].validate((valid) => {
          if (valid) {
			
            let params = Object.assign({}, this.domainAddDialog.form);
         	console.log("3--"+params);
			
            api.app.domainAdd(params).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                this.domainAddDialog.show = false;
                this.queryDomain(params.appCode);
              }
            });
          }
        });
      },
	  cancelDomainForm () {
        this.domainAddDialog.show = false;
      },
	    cancelDomainForm () {
        this.domainAddDialog.show = false;
      },
	  cancelRefererForm () {
        this.refererAddDialog.show = false;
      },
      cancelForm () {
        this.dialog.show = false;
      },
	  
      cancelLimitForm () {
        this.limitDialog.show = false;
      },
      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = Object.assign({}, this.search, this.table.pager, {pageNum: this.table.pager.pageNo});
        api.app.list(params).then((res) => {
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
	  queryDomain (appCode) {
        this.loading = true;

		let params = {"appCode":appCode};
		
        api.app.domainList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.domains = data.data;
          }
        }).catch(e => {
          this.loading = false;
        });
      },
	  queryReferer (appCode,domain) {
        this.loading = true;
		
		let params = {"appCode":appCode,"domain":domain};
		
        api.app.refererList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.referers = data.data;
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
      }
    }
  };
  
  
 
</script>
