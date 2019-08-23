<template>
<div>
    <query-panel>
        <el-form :inline="true" :rules="rules" :model="search" ref="searchForm" class="demo-form-inline" v-show="optAuth.query">
            <el-form-item prop="status">
                <el-select clearable v-model="search.status" placeholder="上传状态">
                    <el-option label="初始化" value="0"></el-option>
                    <el-option label="失败" value="-1"></el-option>
                    <el-option label="成功" value="1"></el-option>
                    <el-option label="部分成功" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="createUser">
                <el-input v-model="search.createUser" placeholder="创建人"></el-input>
            </el-form-item>
            <el-form-item prop="fileName">
                <el-input v-model="search.fileName" placeholder="上传文件名称"></el-input>
            </el-form-item>
            <el-form-item prop="time">
                <el-date-picker
                    clearable
                    v-model="search.time"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="上传时间范围">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit" @click="submitForm('searchForm')">查询</el-button>
            </el-form-item>
        </el-form>
    </query-panel>
    <el-row class="toolbar" v-show="optAuth.upload">
      <el-button :disabled="!isUploading" @click="toUpload()" title="上传黑名单"
                 type="success" class="handle-btn">
        <i class="icon-ok-circled"></i>&nbsp;&nbsp;上传黑名单
      </el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      style="width: 100%">
        <el-table-column
            :show-overflow-tooltip="true"
            prop="fileName"
            label="上传文件名"
            width="200">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            prop="createIp"
            label="创建IP"
            width="150">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            prop="strCreateDate"
            label="创建日期"
            width="200">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            prop="count"
            label="笔数"
            width="80">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            prop="createUser"
            label="创建用户"
            width="150">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            prop="remark"
            label="备注">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            prop="status"
            label="状态"
            :formatter="statusFmt"
            width="100">
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
    
    <el-dialog 
        :title="uploadDialog.title" 
        v-model="uploadDialog.isShow" 
        :size="uploadDialog.size" 
        :close-on-press-escape="false" 
        :close-on-click-modal="false" 
        @close="onDialogClose">
        <el-upload accept=".xlsx" 
            v-show="!uploadDialog.upload.inProcessing"
            :disabled="uploadDialog.upload.inUploading"
            :action="uploadDialog.upload.url" 
            :on-change="onUploadChange" 
            :auto-upload="false" 
            :show-file-list="false" drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过{{uploadDialog.maxSize}}</div>
        </el-upload>
        <el-row v-show="uploadDialog.upload.inProcessing"><div slot="tip">文件上传完毕，正在审核中。。。</div></el-row>
        <el-row class="toolbar" v-show="uploadDialog.upload.inProcessing">
            <el-button 
                @click="uploadDialog.upload.inProcessing=!uploadDialog.upload.inProcessing" 
                type="primary">
                再次上传
            </el-button>
        </el-row>
        <loading-wheel v-if="uploadDialog.upload.inUploading"></loading-wheel>
    </el-dialog>
</div>  
</template>
<script>
import api from '../api';
import XLSX from "xlsx";
import LoadingWheel from "../components/LoadingWheel.vue";
import bsmp  from 'bsmp_main';
export default {
    name: "shield_office_uploadBlack",
    components: {LoadingWheel},
    data(){
        return {
            loading: false,
            statusMap: {
                '-1': "失败",
                '0': '初始化',
                '1': '成功',
                '2': '部分成功'
            },
            uploadDialog: {
                title: "上传黑名单",
                maxSize: "256kb",
                isShow: false,
                size: "tiny",
                upload: {
                    url: "/shield/office/black/upload",
                    uploadedData: null,
                    inProcessing: false,
                    inUploading: false
                }
            },
            table:{
                items: [],
                pager: {
                    pageSize: 20,
                    pageNo: 1,
                    total: 0
                }
            },
            search: {
                status: "",
                createUser: "",
                fileName: "",
                time: null
            },
            rules: {
                createUser:{
                    pattern: /(^[\u4e00-\u9fa5]{1,6}$)|(^[a-zA-Z]+$)/,
                    message: "不像是姓名哦，请重新输入！"
                },
                fileName: {
                    pattern: /(^[\u4e00-\u9fa5]{1,6}$)|(^[a-zA-Z]+$)/,
                    Range: {
                        max: 100
                    },
                    message: "不像是文件名哦，请重新输入！"
                }
            }
        };
    },
    mounted() {
      this.queryData();
    },
    computed:{
        isUploading(){
            return !this.uploadDialog.isShow;
        },
        optAuth() {
            return bsmp.util.mapAuth({
                upload: 'shield_office_uploadBlack_upload',
                query: 'shield_office_uploadBlack_query'
            });
        }
    },
    methods: {
        toUpload(){
            this.uploadDialog.isShow = true;
        },
        clearUploadDialog(){
            this.uploadDialog.upload.inProcessing = false;
            this.uploadDialog.upload.uploadedData= null;
            this.uploadDialog.upload.inUploading= false;
        },
        onDialogClose(){
            this.uploadDialog.isShow = false;
            this.clearUploadDialog();
            this.queryData();
        },
        onUploadChange(file){
            if(!this.checkUploadFile(file)){
                return false;
            }
            let reader = new FileReader();
            this.uploadDialog.upload.uploadedData = {
                fileName: file.name,
                data: []
            };
            reader.readAsBinaryString(file.raw);
            reader.addEventListener("load", this.onFileLoad, false);
            this.uploadDialog.upload.inUploading = true;
        },
        checkUploadFile(file){
            let maxSize = parseInt(this.uploadDialog.maxSize);
            if(file.size > maxSize * 1024){
                this.showWarnMessage(`文件太大，请上传小于${this.uploadDialog.maxSize}的文件。`);
                return false;
            }
            if(file.name.length > 100){
                this.showWarnMessage("文件名太长，请保持文件名小于100个字符。");
                return false;
            }
            let name = file.name;
            let type = name.slice(name.lastIndexOf(".")); 
            if(type !== ".xlsx"){
                this.showWarnMessage("文件类型不支持，仅支持xlsx文件。");
                return false;
            }
            return true;
        },
        showWarnMessage(msg){
            this.$message({
                        type: 'warning',
                        message: msg
                    });
        },
        onFileLoad(e){
            let data = e.target.result;
            let workbook = XLSX.read(data, {
                type: "binary"
            });
            let worksheet = workbook.Sheets[workbook.SheetNames[0]];
            let workbookData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: "-"
            });
            this.handleData(workbookData);
            let verify = this.verifyData();
            if(verify){
                this.doPostData();
            }
            else {
                this.clearUploadDialog();
            }
        },
        handleData(workbookData){
            let _this = this;
            let headers = "idx,name,phone,email,id,type,ip,remark,address,source".split(",");
            workbookData.forEach((row, i) => {
                if(i == 0){
                    return;
                }
                if(row.every(el => el.trim() === "-")){//skip empty rows.
                    return;
                }
                let rowData = {};
                rowData["idx"] = i + 1;
                for(var j = 1; j < headers.length; j++){
                    let header = headers[j];
                    rowData[header] = row[j - 1].trim().replace(/^\-$/, "");
                }
                 _this.uploadDialog.upload.uploadedData.data.push(rowData);
            });
        },
        verifyData(){
            let _this = this;
            let rows = this.uploadDialog.upload.uploadedData.data;
            let isEmptyData = rows.length == 0;
            let isFieldsLegal = rows.every(row => {
                let isBothEmpty = row.name=="" && row.id=="";
                if(isBothEmpty){
                    _this.showWarnMessage(`数据异常：第${row.idx}行的姓名和身份证同时为空，请重新检查文件!`);
                    return false;
                }
                return _this.checkRowLeagal(row);
            });
            if(isEmptyData){
                this.showWarnMessage("数据为空，请检查文件。");
                return false;
            }
            return isFieldsLegal;
        },
        checkRowLeagal(row){
            let chsNameRegx = /^[\u4e00-\u9fa5]{1,6}$/,
                engNameRegx = /^\w+[\w\s]+\w+$/,
                mobilePhoneRegx = /^[0-9]{8,20}$/,//手机号码为8到20位的纯数字
                emailAddressRegx = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
                ipAddressRegx = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
                idCardRegx = /(^\d{6,20}$)|(^\d{17}(\d|X|x)$)/;//6到20位的数字或者17位数字加1位数字或者字母
            if(row.name.length > 0){
                if(!chsNameRegx.test(row.name) && !(engNameRegx.test(row.name) && row.name.length <= 20)){
                    this.showWarnMessage(`数据异常：姓名不合法，请检查第${row.idx}行。`);
                    return false;
                }
            }
            if(row.phone.length > 0 && !mobilePhoneRegx.test(row.phone)){
                this.showWarnMessage(`数据异常：电话号码不合法，请检查第${row.idx}行。`);
                return false;
            }
            if(row.email.length > 0 && !emailAddressRegx.test(row.email)){
                this.showWarnMessage(`数据异常：邮箱地址不合法，请检查第${row.idx}行。`);
                return false;
            }
            if(row.ip.length > 0 && !ipAddressRegx.test(row.ip)){
                this.showWarnMessage(`数据异常：IP地址不合法，请检查第${row.idx}行。`);
                return false;
            }
            if(row.id.length > 0){
                if(!idCardRegx.test(row.id)){
                    this.showWarnMessage(`数据异常：身份证号不合法，请检查第${row.idx}行。`);
                    return false;
                }
            }
            if(row.source.length > 170){
                this.showWarnMessage(`数据异常：来源字段太长，请检查第${row.idx}行。`);
                return false;
            }
            if(row.remark.length > 170){
                this.showWarnMessage(`数据异常：备注信息字段太长，请检查第${row.idx}行。`);
                return false;
            }
            return true;
        },
        doPostData(){
            let _this = this;
            let postData = {
                fileName: _this.uploadDialog.upload.uploadedData.fileName,
                data: JSON.stringify(_this.uploadDialog.upload.uploadedData.data)
            };
            api.uploadBlackList(postData)
            .then(res => {
                if(res.data.code == "0"){
                    _this.$message({
                        type: 'success',
                        message: '上传中……'
                    });
                    _this.uploadDialog.upload.inProcessing = true;
                } else {
                    _this.$message({
                        type: 'warning',
                        message: '上传异常：' + res.data.msg
                    });
                    console.error(res.data);
                }
            })
            .catch(e => {
                _this.$message({
                    type: 'error',
                    message: '上传数据失败：'+ e.message
                });
            })
            .finally(()=> {
                _this.uploadDialog.upload.inUploading = false;
            });
        },
        parseSearchOptions(){
            let searchOptions = {};
            if(this.search.status != ""){
                searchOptions.status = this.search.status;
            }
            if(this.search.createUser != ""){
                searchOptions.createUser = this.search.createUser;
            }
            if(this.search.fileName != ""){
                searchOptions.fileName = this.search.fileName;
            }
            if(this.search.time){
                searchOptions.startTime = this.search.time[0] || null;
                searchOptions.endTime = this.search.time[1] || null;
                searchOptions.startTime = searchOptions.startTime ? bsmp.util.formatDate.format(searchOptions.startTime, 'yyyy-MM-dd hh:mm:ss') : null;
                searchOptions.endTime = searchOptions.endTime ? bsmp.util.formatDate.format(searchOptions.endTime, 'yyyy-MM-dd hh:mm:ss') : null;
            }
            return searchOptions;
        },
        submitForm(formName) {
            let _this = this;
            this.$refs[formName].validate((valid) => {
            if (valid) {
                _this.queryData();
            } else {
                _this.showWarnMessage('查询字段非法，不能往下执行！');
                return false;
            }
            });
        },
        queryData(){
            let _this = this, queryOptions = {
                pageNo: this.table.pager.pageNo,
                pageSize: this.table.pager.pageSize
            };
            Object.assign(queryOptions, this.parseSearchOptions());
            _this.loading = true;
            api.getUploadedBlackList(queryOptions)
            .then(res => {
                if(res.data.code != "0"){
                    console.error(res.data.msg);
                    return;
                }
                _this.table.items = res.data.data.data;
                _this.table.pager.total = res.data.data.total;
                _this.loading = false;
            })
            .catch(e => {
                console.error(e);
            });
        },
        statusFmt(row) {
            return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
        },
        handleSizeChange(val) {
            this.table.pager.pageSize = val;
            this.queryData();
        },
        handleCurrentChange(val){
            if (typeof this.table.pager.pageNo != "undefined") {
                this.table.pager.pageNo = val;
                this.queryData();
            }
        }
    }
};
</script>
<style scoped>
.query-block .el-form-item{
    margin-bottom: 20px;
}
</style>
