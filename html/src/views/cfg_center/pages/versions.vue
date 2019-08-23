<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select clearable v-model="search.platform" placeholder="平台">
            <el-option  
              v-for="item in platformMap"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
               <el-form-item>
          <el-select clearable v-model="search.isForce" placeholder="版本升级方式">
            <el-option  
              v-for="item in forceMap"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <el-row class="toolbar">
      <el-button v-show="optAuth.add" @click="showDialog(1)" type="primary">新增</el-button>
    </el-row>

    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 165"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        prop="appId"
        label="应用Id"
        width="100">
      </el-table-column>
      <el-table-column
        prop="platTypeKey"
        :formatter="platformFmt"
        label="平台"
        width="100">
      </el-table-column>
      <el-table-column
        prop="version"
        width="100"
        label="版本">
      </el-table-column>
      <el-table-column
        prop="url"
        width="200"
        label="路径">
      </el-table-column>
      <el-table-column
        prop="isForce"
        :formatter="forceFmt"
        width="100"
        label="版本升级">
      </el-table-column>
      <el-table-column
        prop="updateTypes"
        :formatter="forceFmt"
        width="180"
        label="指定账号升级">
         <template slot-scope="scope">
           <div v-if="scope.row.updateTypes.length>0">
            <p v-for="(updateType, index) in scope.row.updateTypes.split(',')" :key="'sp-updateType-' + index">
              {{ forces['force'+updateType].label }}&nbsp;({{ getAcArraySize(scope.row.versionAccountList.filter(e=>e.updateType==updateType && e.updateStatus=='2')) }}/{{getAcArraySize(scope.row.versionAccountList.filter(e=>e.updateType==updateType))}})
            </p>
           </div>
            <div v-if="scope.row.updateTypes.length==0">
               无
           </div>
        </template>
      </el-table-column>
       <el-table-column
        prop="updateTime"
        width="180"
        label="更新时间">
      </el-table-column>
       <el-table-column label="备注">
        <template slot-scope="scope">
          <p v-html="scope.row.comment"></p>
        </template>
      </el-table-column>
       <el-table-column
        fixed="right"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.edit" @click.native.prevent="showDialog(2, scope.$index)"
                     type="info" icon='edit' size="mini"></el-button>
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
      <el-form ref="configForm" :model="dialog.form" :rules="dialog.rules" label-width="150px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="应用Id" prop="appId">
              <el-input v-model="dialog.form.appId" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台" prop="platTypeKey">
              <el-select v-model="dialog.form.platTypeKey" filterable placeholder="平台">
                <el-option  
                  v-for="item in platformMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="版本" prop="version">
              <el-input v-model="dialog.form.version" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路径" prop="url">
              <el-input v-model="dialog.form.url" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="版本升级" prop="isForce">
              <el-select ref="el-forceSelectId" v-model="dialog.form.isForce" filterable placeholder="升级方式"><!-- @change="forceChange" -->
                <el-option  
                  v-for="item in forceMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="30">
            <el-form-item label="指定账号(灰度)升级" > 
                <el-upload v-for="(item,index) in forces"    
                  :key="'upload-' + index"            
                  style="padding-top:15px;"
                  class="upload-demo"    
                  action=""    
                  :ref="'el-upload-' + index"
                  :auto-upload="false"
                  :disabled="item.disabled"
                  :on-remove="(file,fileList)=>{clearForceAc(index)}"
                  :on-change="(file,fileList)=>{importAccount(file,index)}">
                  <el-checkbox  v-model="item.checked" :disabled="item.disabled" :label="item.label+' ('+item.acNum+')'" border  style="width:120px;float:left;"></el-checkbox>
                  <el-button  slot="trigger" type="default">导入</el-button>     
                  <el-input v-show="index=='force1'" v-model="dialog.form.acCommonUrl" auto-complete="off" placeholder="升级地址" style="width:350px;margin-left:10px;"></el-input>
                  <el-input v-show="index=='force2'" v-model="dialog.form.acForceUrl" auto-complete="off" placeholder="升级地址" style="width:350px;margin-left:10px;"></el-input>
                </el-upload>                        
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="导入的账号列表">
                <div v-show="accountTable.show"> 
                <el-form :inline="true" :model="accountSearch" class="demo-form-inline">
                  <el-form-item>
                    <el-select clearable v-model="accountSearch.isForce" placeholder="升级方式" style="width:120px;">
                      <el-option  
                        v-for="item in forceMap"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select clearable v-model="accountSearch.updateStatus" placeholder="升级状态" style="width:120px;">
                      <el-option  
                        v-for="item in updateStatusMap"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-input v-model="accountSearch.accountNo" placeholder="账号" style="width:120px;"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="default" @click="queryAccount">查询</el-button>
                  </el-form-item>
                </el-form>
                 <el-table
                      highlight-current-row
                      v-loading.body="loading"
                      :data="accountTable.items"
                      border
                      :max-height="400"
                      style="width: 100%">
                      <el-table-column
                        type="index"
                        label="序号"
                        width="80">
                      </el-table-column>
                      <el-table-column
                        prop="accountNo"
                        label="账号"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="updateStatus"
                        :formatter="updateStatusFmt"
                        label="升级状态"
                        width="100">
                      </el-table-column>
                      <el-table-column
                        prop="updateType"
                        :formatter="updateTypeFmt"
                        width="100"
                        label="升级方式">
                      </el-table-column>
                      <el-table-column
                        prop="createUser"
                        width="100"
                        label="创建用户">
                      </el-table-column>
                      <el-table-column
                        prop="createDate"
                        width="180"
                        label="创建时间">
                      </el-table-column>
                      <el-table-column
                        prop="updateDate"
                        width="180"
                        label="更新时间">
                     </el-table-column>
                      <el-table-column
                        prop="remark"
                        width="180"
                        label="备注">
                      </el-table-column>
                      <el-table-column
                        fixed="right"
                        width="100"
                        label="操作">
                        <template slot-scope="scope">
                          <el-button title="删除"  @click.native.prevent="deleteAccount(scope)"
                                    type="info" icon='delete' size="mini"></el-button>
                        </template>
                      </el-table-column>
                  </el-table> 
                  <el-pagination class="pull-right"
                    @size-change="handleAccountSizeChange"
                    @current-change="handleAccountCurrentChange"
                    :current-page="accountTable.pager.pageNo"
                    :page-sizes="[20, 50, 100, 200]"
                    :page-size="accountTable.pager.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="accountTable.pager.total">
                  </el-pagination>
                </div>               
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注" prop="comment">
              <vue-editor useCustomImageHandler @imageAdded="handleImageAdded" placeholder="请输入备注"
                          v-model="dialog.form.comment"></vue-editor>
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
  import XLSX,{ version } from "xlsx";
  import {VueEditor} from 'vue2-editor';
  export default {
    name: 'versions',
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
        loading: true,
        search: {
          platform: '',
          isForce: ''
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
          form: {
            appId: '',
            platTypeKey: '',
            version: '',
            url: '',
            acUrl:'',
            acForceUrl: '',
            acCommonUrl:'',
            acGrayUrl:'',
            comment: '',
            isForce: '',
            versionAccountList:[],
            deleteVersionAccountList:[],
          },
          rules: rules
        },
        deleteAccounts:[],
        accountSearch: {
          isForce: '',
          updateStatus: '',
          accountNo: ''
        },
        accountTable:{
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          },
          show: true
        },
        fileList: [],
        defaultUpdateType:'',
        forces:{ force0:{
            checked:false,
            disabled:false,
            accounts:[],
            label:"不升级",
            updateType:0,
            acNum:0,
          
          },force1:{
            checked:false,
            disabled:false,
            accounts:[],
            label:"普通升級",
            updateType:1,
            acNum:0
          },force2:{
            checked:false,
            disabled:false,
            accounts:[],
            label:"強制升級",
            updateType:2,
            acNum:0
          }           
        } ,
        platformMap: [{
            value: 'ios',
            label: 'iOS'
          },{
            value: 'android',
            label: 'Android'
          }, {
            value: 'pcui',
            label: 'PCUI'
          },{
            value: 'pcui2',
            label: 'PCUI2'
          }],
        forceMap:[{
            value: '0',
            label: '不升級'
          },{
            value: '1',
            label: '普通升級'
          }, {
            value: '2',
            label: '強制升級'
          }] ,
        updateStatusMap:[{
            value: 0,
            label: '未升级'
          },{
            value: 1,
            label: '待升级'
          }, {
            value: 2,
            label: '已升级'
          }] 
      };
    },
    mounted () {   
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'app_args_versions_view',
          add: 'app_args_versions_save',
          edit: 'app_args_versions_update'
        });
      }
    },
    methods: {
      platformFmt (row) {
        return typeof row.platTypeKey !== 'undefined' ? this.platformMap.find(c => c.value==row.platTypeKey).label : '';
      },
      forceFmt (row) {
        return typeof row.isForce !== 'undefined' ? this.forceMap.find(c => c.value==row.isForce).label : '';
      },
      updateTypeFmt (row){
        return typeof row.updateType !== 'undefined' ? this.forceMap.find(c => c.value==row.updateType).label : '';
      },
      updateStatusFmt (row){
        return typeof row.updateStatus !== 'undefined' ? this.updateStatusMap.find(c => c.value==row.updateStatus).label : '';
      },
      /* forceChange(option){
        if(this.defaultUpdateType!=option){
             let key="force" + option;
             if(this.forces[key].checked||this.forces[key].accounts.length>0){
                  let _this=this;
                  return this.$confirm('【'+this.forces[key].label+'】已设成指定账号升级，确定要调整为默认升级方式？', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }).then(() => {
                      _this.forceChangeSubFun(key);
                      _this.forces[key].accounts=[];
                      _this.forces[key].acNum=0;
                      _this.$refs["el-upload-"+key][0].clearFiles();
                      _this.defaultUpdateType=option;
                    }).catch(e => {
                        _this.dialog.form.isForce=_this.defaultUpdateType;
                        return false;
                    }); 
              }else{
                this.forceChangeSubFun(key);
                this.defaultUpdateType=option;
              }
        }
      },
      forceChangeSubFun(key){
         for(let p in this.forces){
              this.forces[p].disabled = false;
           }
           this.forces[key].checked = false;
           this.forces[key].disabled = true; 
      }, */
      clearForceAc(index){
        this.forces[index].accounts=this.forces[index].accounts.filter(e=>e.id!=-1);
        this.forces[index].acNum=this.forces[index].accounts.length;
        this.queryAccount();
        this.$message({
            message: '本次导入的数据已移除成功！',
            type: 'info'
        });
      },
      getAcArraySize(acArray){
        return acArray?acArray.length:0;
      },
      importAccount(file, index){ 
         let force = this.forces[index];
          if(!force.checked){
              this.$message({
                message: '请先勾选升级方式',
                type: 'warning'
              });
              this.$refs["el-upload-"+index][0].clearFiles();
              return false;
          }
          let _self = this;
          if(force.accounts!=null && force.accounts.length>0){
              this.$confirm('已存在账号数据，是否清空并重新导入', '提示', {confirmButtonText: '是', cancelButtonText: '否', type: 'warning' }).then(() => {
                 _self.deleteAccounts=force.accounts.filter(x =>x.id!=-1);
                 force.accounts=[];
                 _self.queryAccount(true);
                 _self.importAcBegin(file, index);
              }).catch(e => {
                 _self.importAcBegin(file, index);
              });
          }else{
             _self.importAcBegin(file, index);
          }
      },
      importAcBegin(file, index){     
        let _self = this;
        let reader = new FileReader();
        reader.readAsBinaryString(file.raw);
        reader.onload = function(e) {
          let data = e.target.result;        
          let workbook = XLSX.read(data, { type: "binary" });
          let sheetNames = workbook.SheetNames;
          let sheet = workbook.Sheets[sheetNames[0]];
          let jsons = XLSX.utils.sheet_to_json(sheet,{raw:true});   
          if(jsons.length == 0 || jsons[0].accountNo == undefined || jsons[0].accountNo.toString().trim()==''){
              _self.$message({
                    message: "导入的账号为空，请检查要导入的文件",
                    type: 'warning'
                  });
              return;
          }         
          for(let p in _self.forces){           
              let force = _self.forces[p];
              let accountRow = force.accounts.find(x=> jsons.find(j=> x.accountNo.toString().trim() == j.accountNo.toString().trim()) != undefined);
              if(accountRow != undefined){
                  _self.$message({
                      message: "指定账号升级【"+force.label + "】已包含该账号【" + accountRow.accountNo+"】，请检查要导入的文件！",
                      type: 'warning'
                    });
                    if(accountRow.id!=-1){
                       _self.$refs["el-upload-"+index][0].clearFiles();
                    }
                    return;
              }
          }

          let force = _self.forces[index];
          for(let json of jsons){
            if(force.accounts.find(x=> x.accountNo == json.accountNo) == undefined){
              force.accounts.push({
                 accountNo: json.accountNo,
                 updateType: force.updateType,
                 updateStatus: 0,
                 id: -1,    
              });
              force.acNum=force.accounts.length;
            }           
          }
           _self.queryAccount(true);
           _self.$message({
              type: 'info',
              message: "Excel的数据已导入页面中，如要持久生效，请点击【保存】按钮！"
            });
        };
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['configForm'] && this.$refs['configForm'].resetFields) {
          this.$refs['configForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        for(let p in this.forces){
            this.forces[p].checked = false;
            this.forces[p].disabled = false;
            this.forces[p].accounts = [];
        }
        this.accountTable.items = [];
        this.accountTable.pager = {
            pageSize: 20,
            pageNo: 1,
            total: 0
          };
        this.accountTable.show = true;
        this.deleteAccounts = [];

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          this.dialog.form = form;       
          //this.forceChange(form.isForce);
          if(form.updateTypes != null && form.updateTypes != ""){
            let updateTypes = form.updateTypes.split(",");
            updateTypes.forEach(x=> {
                  this.forces["force" + x].checked = true;
                  this.forces["force" + x].disabled = false;
             });
            api.getVersionsAccountlist({versionId: form.id})
              .then((res) => {
                let data = res.data;
                if (data && data.code == 0) {
                   let list = data.data;
                   this.dialog.form["versionAccountList"] = list;
                   if(list!= null && list.length> 0){
                      for(let item of list){
                        let updateType = item.updateType;
                        let frRow=this.forces["force" + updateType];
                        frRow.accounts.push(item);   
                        frRow.acNum=frRow.accounts.length;               
                      }
                  }
                }
              }).catch((err) => {
                console.log(err);
              });           
          }       
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            appId: '',  
            platTypeKey: '',
            version: '',
            url: '',
            comment: '',
            isForce: '',
            versionAccountList: [],
            deleteVersionAccountList: [],
          };          
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['configForm'].validate((valid) => {
          if (valid) {
              let params = Object.assign({}, this.dialog.form);
              params["versionAccountList"] = [];
              params["deleteVersionAccountList"] = [];
              let updateTypes = [];
              for(let p in this.forces){
                let force = this.forces[p];
                let accounts =  force.accounts;
                if(force.checked && (accounts == null || accounts.length ==0)){
                   this.$message({
                      type: 'warning',
                      message: "已勾选指定账号升级【"+force.label +"】，请导入账号！"
                    });
                  return;
                }
                if(force.checked){
                  updateTypes.push(force.updateType);
                  for(let account of accounts){
                    if(account.id == -1){
                       params["versionAccountList"].push(account);
                    }                  
                  }
                }
              }
              params["updateTypes"] = updateTypes.join(",");
              params["deleteVersionAccountList"] = this.deleteAccounts;

              if (this.dialog.type === 1) {
                // 新增
                api.addVersions(params).then((res) => {
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
                      content: `[Versions] params: ${JSON.stringify(params)}`
                    });
                  }
                });
            } else {
                // 修改
                api.editVersions(params).then((res) => {
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
                      content: `[Versions] params: ${JSON.stringify(params)}`
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
       * 查询
       */
      query () {
        this.loading = true;
        let params = Object.assign({}, this.search, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getVersions(params).then((res) => {
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
      showAccountTable(){
        if(this.accountTable.show){
          this.accountTable.show = false;
        }else{
          this.accountTable.show = true;
        }
      },
      /**
       * 查询
       */
      queryAccount (isNotcheck) {
        let params = Object.assign({}, this.accountSearch, this.accountTable.pager, {pageNo: this.accountTable.pager.pageNo - 1});
         if(!params.isForce||params.isForce==''){
            if(!isNotcheck){
               this.$message.warning('请选择升级方式！');
            }
            return;
        }
        let accounts = this.forces["force" + params.isForce].accounts;
        if(params.updateStatus != '' ){
            accounts = accounts.filter(x=>x.updateStatus == params.updateStatus);
        }
        if(params.accountNo != '' ){
            accounts = accounts.filter(x=>(x.accountNo+"").indexOf(params.accountNo)!= -1 );
        }
        this.accountTable.items = accounts.slice(params.pageNo*params.pageSize, (params.pageNo + 1)*params.pageSize); 
        this.accountTable.pager = Object.assign({}, this.accountTable.pager,
              {
                pageNo: parseInt(params.pageNo, 10) + 1,
                total: accounts.length
              });      
      },
      deleteAccount(scope){
        let row = scope.row;
        let p = "force" + this.accountSearch.isForce;
        let accounts = this.forces[p].accounts;
        this.forces[p].accounts = accounts.filter(x => x.accountNo != row.accountNo);
        this.forces[p].acNum=this.forces[p].accounts.length;
        let curRow=accounts.find(x => x.accountNo == row.accountNo && x.id!=-1);
        if(curRow){
            this.deleteAccounts.push(curRow);
        }
        this.queryAccount();
        this.$message({
            message: '该账号【'+row.accountNo+'】已从页面中移除，如要持久生效，请点击【保存】按钮！',
            type: 'info'
        });

      },
       /**
       * 每页显示条数变化
       * @param val
       */
      handleAccountSizeChange (val) {
        this.accountTable.pager.pageSize = val;
        this.accountQuery();
      },    
      /**
       * 页码变化
       * @param val
       */
      handleAccountCurrentChange (val) {
        if (this.accountTable.pager.pageNo) {
          this.accountTable.pager.pageNo = val;
          this.accountQuery();
        }
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

      cancelForm() {
        this.dialog.show = false;
      }
    }
  };
  // 表单规则
  let rules = {
    appId: [
      {required: true, message: '请输入应用Id', trigger: 'blur'}
    ],
    platTypeKey: [
      {required: true, message: '请输入平台', trigger: 'blur'}
    ],
    version: [
      {required: true, message: '请输入版本', trigger: 'blur'}
    ],
    isForce: [
      {required: true, message: '请选择升级方式', trigger: 'blur'}
    ],
  };
</script>
