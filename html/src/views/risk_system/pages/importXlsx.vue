<template>
    <el-dialog :title="dialog.title" v-model="dialog.isShow" :size="dialog.isUpload?dialog.size:'full'" :close-on-press-escape="false" :close-on-click-modal="false" @close="onClose">
        <el-upload accept=".xlsx" :action="upload.uploadUrl" v-show="dialog.isUpload" :on-change="onChange" :auto-upload="false" :show-file-list="false" drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或
                <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过500kb</div>
        </el-upload>
        <el-row class="toolbar" v-show="!dialog.isUpload">
            <el-button @click="postData()" type="primary">确认</el-button>
            <el-button @click="uploadAgain()" type="danger">重新导入</el-button>
        </el-row>
        <el-table id="importedTableExcel" ref="importedTable"
          v-show="!dialog.isUpload"
          highlight-current-row
          v-loading.body="table.loading"
          :data="table.items"
          border stripe
          style="width: 100%">
            <el-table-column :show-overflow-tooltip="true" prop="bu" label="事业部" width="120"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="level" label="风险等级" width="120"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="riskMark" label="风险标签" width="120"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="remark" label="风险备注" width="120"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="tradePlatform" label="交易平台" width="120"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="accountNo" label="账户" width="150"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="accountName" label="姓名" width="150"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="phone" label="电话" width="150"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="idCard" label="身份证" width="180"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" width="150"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="ip" label="IP" width="150"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="bankCard" label="银行卡号" width="200"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="imei" label="IMEI" width="150"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="idfa" label="IDFA" width="150"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="uuid" label="UUID" width="150"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="cookie" label="cookies" width="150"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="deviceId" label="deviceID" width="150"> </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="sourceOuter" label="外部数据源" width="120"> </el-table-column>
<!--            <el-table-column fixed="right" width="150" label="查看详情">
                <template slot-scope="scope">
                    <el-button @click="showFormDialog(2, scope.$index)" size="mini" title="查看详情">
                        <i class="icon-eye"></i>
                    </el-button>
                </template>
            </el-table-column>-->
        </el-table>
    </el-dialog>
</template>
<script>
import XLSX from "xlsx";
import api from "../api";
import bsmp  from "bsmp_main";
export default {
  name: "import-xlsx",
  props: {
    isActive: {
      type: Boolean
    },
    channelMap: {
      type: Object
    },
    spotMap: {
      type: Object
    },
    typeMap: {
      type: Object
    },
    clientTypeMap: {
      type: Object
    },
    userInfo: {
      type: Object
    }
  },
  data() {
    return {
      dialog: {
        title: "批量导入黑名单",
        isShow: false,
        size: "tiny",
        isUpload: true
      },
      upload: {
        uploadUrl: "/black/add/batch",
        uploadedIds: null
      },
      uploadFile: {
        isUploading: false,
        uploadFileUrl: bsmp.util.uploadFileCfg.uploadFileUrl,
        uploadFileData: {
          channel: 'backoffice',
          accountNo: '',
          companyId: '',
          encryptKey: bsmp.util.uploadFileCfg.encryptKey
        }
      },
      table: {
        loading: false,
        onDrag: false,
        items: null,
        mappedItems: null,
        isVerified: false
      },
      dialogForm: {
        index: null
      }
    };
  },
  watch: {
    isActive(value) {
      return (this.dialog.isShow = value || false);
    }
  },
  methods: {
    toggleUpload() {
      this.dialog.isUpload = !this.dialog.isUpload;
    },
    excelDateToDate(val){
      return new Date(1900, 0, val - 1).getTime();
    },
    excelDateFmt(row, column, cellValue){
      if(cellValue.indexOf('-') > -1){
        let dates = cellValue.split('-');
        return this.mainDateFmt(null, null, dates[0]) + '-' + this.mainDateFmt(null, null, dates[1]);
      }
      return cellValue
        ? this.mainDateFmt(null, null, this.excelDateToDate(cellValue))
        : "";
    },
    mainDateFmt(row, column, cellValue) {
      return cellValue
        ? bsmp.util.formatDate.format(
            new Date(cellValue),
            "MM/dd/yyyy hh:mm"
          )
        : "";
    },
    onFileLoad(e) {
      let data = e.target.result;
      let workbook = XLSX.read(data, {
        type: "binary"
      });
      let worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let workbookData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "-"
      });
      this.renderData(workbookData);
    },
    verifyData(items) {
      let isSuccess = false;
      let msg = "";
      let _this = this;
      items.forEach(item => {
        item.channel
          .replace("-", "")
          .replace(" ", "")
          .split(",")
          .forEach(c => {
            if (c == "") {
              return;
            }
            let found;
            for (var key in _this.channelMap) {
              if (_this.channelMap[key].name === c) {
                found = true;
                break;
              }
            }
            if (!found) {
              msg = `推送渠道名 ${c} - ${item.channel} 存在不匹配项`;
            }
          });
        item.pushSpot
          .replace("-", "")
          .replace(" ", "")
          .split(",")
          .forEach(c => {
            if (c == "") {
              return;
            }
            let found;
            for (var key in _this.spotMap) {
              if (_this.spotMap[key].name === c) {
                found = true;
                break;
              }
            }
            if (!found) {
              msg = `推送位置名 ${c} - ${item.pushSpot} 存在不匹配项`;
            }
          });
        item.pushType
          .replace("-", "")
          .replace(" ", "")
          .split(",")
          .forEach(c => {
            if (c == "") {
              return;
            }
            let found;
            for (var key in _this.typeMap) {
              if (_this.typeMap[key].name === c) {
                found = true;
                break;
              }
            }
            if (!found) {
              msg = `推送类型名 ${c} - ${item.pushType} 存在不匹配项`;
            }
          });
        item.clientType
          .replace("-", "")
          .replace(" ", "")
          .split(",")
          .forEach(c => {
            if (c == "") {
              return;
            }
            let found;
            for (var key in _this.clientTypeMap) {
              if (_this.clientTypeMap[key].name === c) {
                found = true;
                break;
              }
            }
            if (!found) {
              msg = `客户类型名 ${c} - ${item.clientType} 存在不匹配项`;
            }
          });
      });
      if (msg != "") {
        this.$message.error("信息不匹配：" + msg);
        return false;
      } else {
        return true;
      }
    },
    translateDataByMap(items) {
      let mappedItems = [];
      let _this = this;
      function translateStrByMap(str, map) {
        let mappedStrArray = [];
        str
          .replace("-", "")
          .replace(" ", "")
          .split(",")
          .forEach(c => {
            for (let key in map) {
              if (map[key].name === c) {
                mappedStrArray.push(key);
              }
            }
          });
        return mappedStrArray;
      }
      items.forEach(item => {
        let newItem = Object.assign({}, item);
        mappedItems.push(newItem);
      });
      return mappedItems;
    },
    renderData(workbookData) {
      let headers =
        "bu, level, riskMark, remark, tradePlatform, accountNo, accountName, phone, idCard, email, ip, bankCard, imei, idfa, uuid, cookie, deviceId, sourceOuter";
      let _this = this;
      headers = headers.split(",");
      let items = [];
      workbookData.forEach((item, i) => {
        if (i === 0) {
          return;
        }
        let row = {};
        item.forEach((cell, j) => {
          let key = headers[j];
          if (key) row[key] = cell === "-" ? "" : cell;
        });
        items.push(row);
      });
//      this.table.isVerified = this.verifyData(items);
      this.table.items = items;
      this.toggleUpload();
    },
    onChange(file) {
      let reader = new FileReader();
      reader.readAsBinaryString(file.raw);
      reader.addEventListener("load", this.onFileLoad, false);
    },
    onClose() {
      if (this.upload.uploadedIds)
        this.$emit("dialogClose", this.upload.uploadedIds.slice(0));
      else this.$emit("dialogClose");
      this.table.loading = false;
      this.table.items = null;
      this.table.mappedItems = null;
      this.dialog.isUpload = true;
      this.upload.uploadedIds = null;
    },
    showFormDialog(type, index) {
      this.dialogForm.index = index;
      this.table.mappedItems = this.translateDataByMap(this.table.items);
      this.$emit("showFormDialog", type, index, this.table.mappedItems);
    },
    dropItem() {

    },
    uploadAgain() {
      this.toggleUpload();
      this.table.items = null;
      this.table.mappedItems = null;
    },
    postData() {
      this.table.loading = true;
      if (!this.table.mappedItems)
        this.table.mappedItems = this.translateDataByMap(this.table.items);
      this.table.mappedItems.forEach(item => {
        Object.assign(item, {
          status: 1,
          approvalStatus: 0,
          sendStatus: 0
        });
      });
      api
        .importBlackList({ items: this.table.mappedItems })
        .then(res => {
          let data = res.data;
          if (data && data.code === 0) {
            this.$message({
              type: "success",
              message: "导入成功!"
            });
            this.dialog.isShow = false;
            this.upload.uploadedIds = data.data;
            this.table.mappedItems = null;
          } else {
            console.error(JSON.stringify(data));
            this.$message({
              type: "error",
              message: "批量导入失败!"
            });
          }
        })
        .catch(e => {
          console.error(e);
          this.$message({
            type: "error",
            message: "批量导入失败!"
          });
        });
    },
    beforeFileUpload(file){
      if (!file) {
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.$message.warning('上传单张图片不能大于5M！');
          return;
        }
        this.uploadFile.uploadFileData.accountNo = this.userInfo.loginName;
          this.uploadFile.uploadFileData.companyId = this.userInfo.companyId;
    },
    onFileUploadProgress(event, file, fileList){
      this.uploadFile.isUploading = true;
    },
    onFileUploadSuccess(response, file, fileList, scope){
      this.uploadFile.isUploading = false;
      if(response.notOk){
        this.$message.warning(`上传文件失败：${response.msg}`);
        return;
      }
      scope.row.attachFileName = response.data.fileName;
    },
    onFileUploadError(err, file, fileList, scope){
      this.uploadFile.isUploading = false;
      this.$message.warning(`上传文件失败：${err.message}`);
    },
    resetUpload(row){
      this.uploadFile.isUploading = false;
    }
  }
};
</script>
<style>
.on-row-upload .el-upload{
  display: block;
}
.on-row-upload .el-upload-dragger{
  width: auto;
  height: auto;
}
</style>

