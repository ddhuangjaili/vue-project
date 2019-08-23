<template>
  <div v-loading="uploadFile.isUploading">
    <div v-show="optAuth.upload">
      <a class="el-button el-button--primary downloadUrl" :href="downloadFile.month" title="公司月初日期"
        ><i class="icon-download"></i>下载 公司月初日期 模板</a>
      <a class="el-button el-button--primary downloadUrl" :href="downloadFile.symbol" title="symbol 分类"
        ><i class="icon-download"></i>下载 symbol 分类 模板</a>
      <a class="el-button el-button--primary downloadUrl" :href="downloadFile.hxfxCS" title="hxfx CS 数据"
        ><i class="icon-download"></i>下载 hxfx CS 数据 模板</a>
      <a class="el-button el-button--primary downloadUrl" :href="downloadFile.hxpmCS" title="hxpm CS 数据"
        ><i class="icon-download"></i>下载 hxpm CS 数据 模板</a>
    </div>
    <div class="operation-box" >
      <el-upload 
        v-show="optAuth.upload"
        accept=".xlsx" 
        action=""
        :on-change="onChange"
        :disabled="uploadFile.isUploading"
        :on-progress="onFileUploadProgress"
        :show-file-list="false"
        drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
            <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传xlsx文件</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp from 'bsmp_main';
  import XLSX from 'xlsx';
  export default {
    name: 'operation_code_upload',
    data() {
      return {
        month_begin: "company_id,month_begin",
        symbol_category_code: "symbol,category",
        cs_data_hxfx: "date,activity_sum,activity_mt4,activity_fts,open_activity,activity_pc,activity_mobile,open,open_no_activity,open_pc,open_mobile,phg,phone,potential_customers",
        cs_data_hxpm: "date,activity_mt4,open_activity_mt4,activity_pc_mt4,activity_mobile_mt4,open_no_activity_mt4,open_mobile_mt4,open_other_mt4,open_no_data_mt4,activity_gts2,open_activity_gts2,activity_pc_gts2,activity_mobile_gts2,open_no_activity_gts2,open_pc_gts2,open_ios_gts2,open_android_gts2,open_mobile_other_gts2,demo,chat_sum,phone,potential_customers",
        uploadFile: {
          isUploading: false,
        },
        downloadFile:{
          month:'static/files/data_center_month.xlsx',
          symbol:'static/files/data_center_symbol.xlsx',
          hxfxCS:'static/files/data_center_hxfx_cs.xlsx',
          hxpmCS:'static/files/data_center_hxpm_cs.xlsx',
        },
        table:{
          items:null,
          type:'',
        },
      };
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          upload: 'operation_code_upload',
        });
      },
    },
    methods: {
      onChange(file) {
        let reader = new FileReader();
        reader.readAsBinaryString(file.raw);
        reader.addEventListener("load", this.onFileLoad, false);
      },
      onFileLoad(e) {
        let data = e.target.result;
        let workbook = XLSX.read(data, {type: "binary"});
        let worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let workbookData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "-"
        });
        this.table.type = workbook.SheetNames[0];
        this.renderData(workbookData);
      },
      renderData(workbookData) {
        let headers = '';
        let num = '';
        let type = this.table.type;
        //type:第一张表名称，num：表头行数
        if(type && type == 'month_begin'){
          headers = this.month_begin;
          num = 0;
        }else if(type && type == 'symbol_category_code'){
          headers = this.symbol_category_code;
          num = 0;
        }else if(type && type == 'cs_data_hxfx'){
          headers = this.cs_data_hxfx;
          num = 1;
        }else if(type && type == 'cs_data_hxpm'){
          headers = this.cs_data_hxpm;
          num = 1;
        }
        let items = [];
        headers = headers.split(",");
        workbookData.forEach((item, i) => {
          if (i <= num) {
            return;
          }
          let row = {};
          item.forEach((cell, j) => {
            let key = headers[j];
            if (key) row[key] = cell === "-" ? "" : cell;
          });
          items.push(row);
        });
        this.table.items = items;
        this.submitFunc();
      }, 
      //提交execl解析后的参数
      submitFunc(){
        if(this.table.items && !this.uploadFile.isUploading){
          this.uploadFile.isUploading = true;
          let parems = {
            "table_name":this.table.type,
            "table_values":this.table.items,
          }
          const loading = this.$loading({
            lock: true,
            text: '上传中，请勿离开当前页面！',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          api.execlReceive(parems).then(res => {
            loading.close();
            this.uploadFile.isUploading = false;
            let data = res.data;
            if(data.status == "OK"){
              this.$message.success('文件解析成功');    
            }else{
              this.$message.warning('文件解析失败，请重新上传');  
            }
          }).catch(err => {
            loading.close();
            this.uploadFile.isUploading = false;
            this.$message.warning(err);
          });
        }
      },
      //上传之前  
      beforeUpload(file){
        if (!file) {
          return;
        }
        if (this.optAuth.upload) {
          return true;
        } else {
          this.$message.warning('无导入文件权限！');
          return false;
        }
      },
      //上传中
      onFileUploadProgress(event, file, fileList){
        this.uploadFile.isUploading = true;
      },
    }
  };
</script>
<style lang="stylus" scoped>
  .downloadUrl
    text-decoration :none
  .operation-box
    text-align:center;
    margin-top:30px;
  .el-upload__tip
    margin:7px 0;
</style>
