<template>
  <div>
    <query-panel>
      <el-form :rules="rules" :inline="true" :model="search" class="demo-form-inline credit-form" ref="ruleForm2">
        <el-tabs type="border-card" v-model="serviceCategory" @tab-click="tabChange">
          <el-tab-pane v-for="category in serviceTypeMap"
                       :label="category.serviceCategoryName" :name="category.serviceCategory"
                       :key="'search-serviceCategory-' + category.serviceCategoryName">
            <el-checkbox v-model="search.serviceTypes" v-for="item in category.items" 
                         :key="'search-serviceTyp-' + item.serviceType"
                         :label="item.serviceType"
                         @change="handleServiceTypeCheck">{{item.serviceTypeName}}
            </el-checkbox>
          </el-tab-pane>
        </el-tabs>
        <br/>
        <el-form-item prop="name" label="客户姓名">
          <el-input v-model="search.name" placeholder="客户姓名"></el-input>
        </el-form-item>
        <el-form-item prop="idNo" label="身份证">
          <el-input v-model="search.idNo" placeholder="身份证"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="search.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="cardNo" label="银行卡">
          <el-input v-model="search.cardNo" placeholder="银行卡"></el-input>
        </el-form-item>
        <el-form-item prop="ip" label="ip地址">
          <el-input v-model="search.ip" placeholder="ip地址"></el-input>
        </el-form-item>
        <el-form-item prop="address" label="地址">
          <el-input v-model="search.address" placeholder="地址"></el-input>
        </el-form-item>
        <el-form-item prop="longitude" label="经度">
          <el-input v-model="search.longitude" placeholder="经度"></el-input>
        </el-form-item>
        <el-form-item prop="latitude" label="纬度">
          <el-input v-model="search.latitude" placeholder="纬度"></el-input>
        </el-form-item>
        <br/>
        <el-form-item prop="mediaHeadUrl" label="头像图片">
          <!-- <el-button v-show="optAuth.import" type="primary" @click="fileCredit">上传相关文件</el-button> -->
          <el-col :span = "20">
            <el-upload
              action="/api/risk_system/common/file/upload"
              :show-file-list="false"
              :on-success="(response, file, fileList) => {avatarFileSuccess(response, file, fileList, 'mediaHeadUrl')}"
              :before-upload="(file) => {beforeFileUpload(file, 'mediaHeadUrl')}"
              :on-progress="(event, file, fileList) => {uploadFileprogress(event, file, fileList, 'mediaHeadUrl')}"
              :on-error="avatarError"
              :data="{ token: token}">
              <el-button size="small" type="primary">上传头像图片<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-upload>
          </el-col>
          <el-col :offset="2" :span = "2" >
            <el-tooltip v-show="search.mediaHeadUrl" class="item" effect="dark" :content = search.mediaHeadUrl placement="bottom" > 
               <i class="el-icon-check" ></i>
           </el-tooltip>
          
          </el-col>          
        </el-form-item>



        <!-- <el-form-item>
          <el-input v-model="search.city" placeholder="城市"></el-input>
        </el-form-item> -->
        <br/>
        <el-form-item>
          <el-select v-model="search.channelCode" clearable filterable placeholder="验证通道源">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="channel in channels" :label="channel.channelDbCode" :value="channel.channelCode"
                       :key="'search-channel-'+ channel.channelCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.credit" type="primary" @click="credit">发起验证</el-button>
        </el-form-item>
        <el-form-item>
          <a v-show="optAuth.download" class="el-button el-button--primary downloadTemplate" :href="downloadUrl" title="下载模板"
            ><i class="icon-download"></i>下载模板</a>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.import" type="primary" @click="batchCredit">批量导入验证</el-button>
          <el-tooltip class="item item-doubt" effect="dark" content="批量验证结果请根据批量查询id在验证记录查询菜单中查询并导出" placement="bottom">
            <i class="icon-info"></i>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      stripe
      :max-height="height - 200"
      style="width: 100%">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="queryId"
        label="查询编号"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="serviceTypeName"
        label="类型"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        label="姓名"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="callResult"
        label="调用结果"
        width="150"
        sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="queryResult"
        label="查询结果"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="channelName"
        label="供应商"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="creditTime"
        label="时间"
        width="180">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="queryInput"
        :formatter="queryInputFmt"
        label="查询输入"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="queryOutput"
        :formatter="queryOutputFmt"
        label="查询输出"
        min-width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button v-show="scope.row.queryInputList || scope.row.queryOutputList" title="查看详情" @click="showDialog(scope.$index)" size="mini"><i class="icon-eye"></i></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="详情" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="msgForm" label-width="150px" class="dialog-form">
        <el-tabs v-if="dialog.form && dialog.form.queryInputList" v-model="queryInputActive" type="card">
          <el-tab-pane label="查询输入" name="queryInput">
             <table class="stat-table">
                <thead>
                  <tr>
                    <th>字段</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dialog.form.queryInputList" :key="'queryInputList-' + index">
                    <td>{{item.key}}</td>
                    <td v-html="item.value"></td>
                  </tr>
                </tbody>
             </table>
          </el-tab-pane>
        </el-tabs>

        <el-tabs v-if="dialog.form && dialog.form.queryOutputList" v-model="queryOutputActive" type="card">
          <el-tab-pane label="查询输出" name="queryOutput">
            <table class="stat-table">
                <thead>
                  <tr>
                    <th>字段</th>
                    <th>内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dialog.form.queryOutputList" :key="'queryOutputList-' + index">
                    <td>{{item.key}}</td>
                    <td v-html="item.value"></td>
                  </tr>
                </tbody>
             </table>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-dialog>

    
    <!-- 批量验证弹窗框 -->
    <el-dialog :title="uploadDialog.title" v-model="uploadDialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form v-if="batchQuery.show" class="dialog-form" >
        <div class="batchQuery-box" >
          <h3>文件导入成功</h3>
          <table class="stat-table batchQuery-table">
            <tbody>
              <tr>
                <th>批量查询id</th>
                <td>{{batchQuery.id}}</td>
              </tr>
              <tr>
                <th>数据量</th>
                <td>{{batchQuery.num}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-form>
      <el-form v-else ref="uploadForm" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-upload
              :action="uploadFile.uploadFileUrl"
              :show-file-list="false"
              :on-success="avatarSuccess"
              :before-upload="beforeUpload"
              :on-error="avatarError"
              :data="uploadFile.uploadFileImg"
              :headers="uploadFile.uploadFileImg"
            >
              <el-button size="small">选择文件</el-button>
            </el-upload>
          </el-col>
          <el-col :span="22">
            <img v-if="imageUrl" :src="imageUrl" class="show-img">
            <img v-else src="static/images/ewm-file.png">
            <br><br>
            <div v-if="imageUrl">文件地址：<a href="imageUrl" target="_blank">{{imageUrl}}</a></div>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api';
import bsmp  from 'bsmp_main';

export default {
  name: 'risk_credit_service',
  props: {
    height: {
      type: Number
    },
  },
  data() {
    return {
      loading: false,
      serviceCategory: 'identity',
      serviceTypeMap: {},
      mandatoryMap:{ },
      token: bsmp.util.getToken(),
      search: {
        serviceTypes: [],
        name: '',
        idNo: '',
        phone: '',
        cardNo: '',
        city: '',
        ip:'',
        address:'',
        longitude:'',
        latitude:'',
        channelCode: '',
        mediaHeadUrl: ''
      },
      table: {
        items: []
      },
      channels: [],
      dialog: {
        show: false,
        index: -1, // 数据下标
        form: null
      },
      queryInputActive: 'queryInput',
      queryOutputActive: 'queryOutput',
      uploadDialog: {
        show: false,
        title: 'excel导入',
        form: {

        },
      },
      progress: {
          mediaHeadUrl: 0
      },

      imageUrl: '',
      uploadFile: {
        uploadFileUrl: api.creditUploadUrl,
        uploadFileImg: {
          token: bsmp.util.getToken(),
          responseType: 'blob'
        }
      },
      require:'',
      rules: {
        name: [
          { required: false, message: '请输入客户姓名', trigger: 'blur' }
        ],
        idNo: [
          { required: false, message: '请输入身份证', trigger: 'blur' }
        ],
        phone: [
          { required: false, message: '请输入手机号', trigger: 'blur' }
        ],
        cardNo: [
          { required: false, message: '请输入银行卡', trigger: 'blur' }
        ],
        ip: [
          { required: false, message: '请输入ip地址', trigger: 'blur' }
        ],
        mediaHeadUrl: [
          { required: false, message: '请上传头像比对文件', trigger: 'blur' }
        ],
        address: [
          { required: false, message: '请输入地址', trigger: 'blur' }
        ],
        longitude: [
          { required: false, message: '请输入经度', trigger: 'blur' }
        ],
        latitude: [
          { required: false, message: '请输入纬度', trigger: 'blur' }
        ]
      },
      downloadUrl2:'',
      batchQuery:{
        show:false,
        id:'',
        num:''
      },
    };
  },

  mounted() {
    this.getServiceListDic();
  },
  computed: {
    optAuth() {
      return bsmp.util.mapAuth({
        credit: 'risk_credit_service_credit',
        import: 'risk_credit_service_batch',
        download: 'risk_credit_service_template',
      });
    },
    //导出excel url
    downloadUrl() {
      let token = bsmp.util.getToken();
      return `${api.path}/static/template/credit_data_template_import.xlsx?token=${token}`
    }
  },
  methods: {
    showFileImage(url) {
      this.$msgbox({
        title: '图片预览',
        customClass: 'm-message-box-img',
        message: this.$createElement('img', {style: 'color: teal', attrs: {src: url}}),
      }).catch(() => {

      });
    },
    beforeFileUpload(file, type){
      return true;
    },
    uploadFileprogress(event, file, fileList, type) {
      if (event.percent) {
        this.progress[type] = parseInt(event.percent, 10);
        if (event.percent == 100) {
          setTimeout(() => {
            this.progress[type] = 0;
          }, 500);
        }
      }
      console.log('event:', event);
    },
    avatarFileSuccess(res, file, files, type){
      console.log(res);
      if (res.code != 0) {
        this.$message.error('上传图片失败' + res.msg);
        return;
      }
      this.$message.success('上传成功' + res.msg);
      this.search[type] = res.data;
      
    },
    avatarFileError(err, file, fileList) {
      this.$message.error('上传图片失败' + err);
    },
    
    queryInputFmt(row) {
      return row.queryInput ? JSON.stringify(row.queryInput) : '';
    },
    queryOutputFmt(row) {
      return row.queryOutput ? JSON.stringify(row.queryOutput) : '';
    },
    tabChange() {
      this.search.serviceTypes = [];
    },
    handleServiceTypeCheck() {
      //清空所有必填项 
      for(let i in this.rules){
        this.rules[i][0].required = false
      } 
      //已选要素
      let selected = this.search.serviceTypes
      if(this.search.serviceTypes){
        //通过已选要素去筛选必填项
        for(let i=0;i<selected.length;i++){
          let mandatory = this.mandatoryMap[selected[i]].serviceType;
          if(this.mandatoryMap && mandatory){
            let manArr = mandatory.split(',');
            //必填项对应勾选
            for(let k=0;k<manArr.length;k++){
              this.rules[manArr[k]][0].required = true
            }
          }
        }
      }  
      this.search.channelCode = '';
      this.channels = [];
      this.getChannelDic();
    },

    showDialog(index) {
      this.dialog.index = index;
      let form = Object.assign({}, this.table.items[index]);

      this.dialog.form = form;
      this.dialog.show = true;
    },

    /**
     * 验证
     */
    credit() {
      this.$refs["ruleForm2"].validate((valid) => { 
        if (!this.search.serviceTypes.length) {
          this.$message.warning('请选中服务类型！');
          return;
        }
        let serviceTypes_checked = this.search.serviceTypes;
        if ((serviceTypes_checked.indexOf("phone") !== -1 || serviceTypes_checked.indexOf("phone_name") !== -1
          || serviceTypes_checked.indexOf("phone_time") !== -1 || serviceTypes_checked.indexOf("phone_status") !== -1) && this.search.phone == '') {
          this.$message.warning('请输入有效手机号码！');
          return;
        }
        if (this.search.idNo !== '' && /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.search.idNo) == false) {
          this.$message.warning('请输入正确的身份证！');
          return;
        }
        if (this.search.phone !== '' && bsmp.util.isMobile(this.search.phone) == false) {
          this.$message.warning('请输入正确的手机号码！');
          return;
        }
        if ((serviceTypes_checked.indexOf("bank_3") !== -1 || serviceTypes_checked.indexOf("bank_4") !== -1
          || serviceTypes_checked.indexOf("card_his") !== -1) && this.search.cardNo == '') {
          this.$message.warning('请输入有效银行卡号！');
          return;
        }
        if (this.search.cardNo !== '' && /^\d{16}|\d{19}$/.test(this.search.cardNo) == false) {
          this.$message.warning('请输入正确的银行卡号！');
          return;
        }
        if (serviceTypes_checked.indexOf("suit_info") !== -1 && (this.search.name == '' || this.search.idNo == '')) {
          this.$message.warning('请输入完整有效个人信息！');
          return;
        }
        if (serviceTypes_checked.indexOf("phone_city_check") !== -1 && (this.search.name == '' || this.search.idNo == '' || this.search.phone == '')) {
          this.$message.warning('请输入完整有效个人信息！');
          return;
        }
        if ((serviceTypes_checked == "phone_location") == 1
        && (this.search.name == '' || this.search.idNo == '' || this.search.phone == '')) {
          this.$message.warning('请输入完整有效个人信息！');
          return;
        }
        
        if ((serviceTypes_checked == "phone_location_now" ) == 1 && (this.search.phone == '' || this.search.longitude == '' || this.search.latitude == '')) {
          this.$message.warning('请输入完整有效个人信息与经纬度！');
          return;
        }
        if ((serviceTypes_checked == "phone_location") == 1  
          && (this.search.address == '' && (this.search.longitude == '' || this.search.latitude == '')) ){
          this.$message.warning('请输入地址或者经纬度！');
          return;
        }
        // if (serviceTypes_checked.indexOf("face_compared") !== -1 && (this.search.name == '' || this.search.idNo == '' || this.search.mediaHeadUrl == '')) {
          if (serviceTypes_checked.indexOf("face_verify") !== -1 && ( this.search.mediaHeadUrl == '')) {
          this.$message.warning('请输入完整有效个人信息与文件！');
          return;
        }

        if(!valid) return
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        params.serviceTypes = params.serviceTypes.join(',');

        api.credit(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data;
          }
        }).catch(e => {
          this.loading = false;
        });
      });
    },

    //导入文件批量验证
    batchCredit (){
        this.uploadDialog.show = true;
        this.batchQuery.show = false;
    },
    beforeUpload(file){
      this.loading = true;
      if (this.optAuth.import) {
        return true;
      } else {
        this.$message.warning('无导入文件权限！');
        return false;
      }
    },
    avatarSuccess(res, file, files){
      let data = res;
      if (data && data.code === '0') {
        this.batchQuery.show = true;
        this.batchQuery.id = data.data.batchQueryId;
        this.batchQuery.num = data.data.batchQueryCount;
        this.$message.success('文件导入成功');
      }else {
        console.error(JSON.stringify(data));
        this.$message.error('导入失败' + res.msg);
      }
      this.loading = false;
    },
    avatarError(err, file, fileList) {
      this.loading = false;
      this.$message.error('导入文件失败' + err);
    },
    //查询输入格式化
    queryInputFmt (row) {
      let str = '';
      if(row && row.queryInputList){
        let items = row.queryInputList;
        for(let i in items){
          str += items[i].key + ':' + items[i].value + '\n'
        }
      }
      return str
    },
    //查询输出格式化
    queryOutputFmt (row) {
      let str = '';
      if(row && row.queryOutputList){
        let items = row.queryOutputList;
        for(let i in items){
          str += items[i].key + ':' + items[i].value + '\n'
        }
      }
      return str
    },

    /**
     * 获取验证服务列表
     * */
    getServiceListDic() {
      return api.getServiceListDic().then((res) => {
        let data = res.data;
        if (data && data.code === '0'
          && data.data && data.data.length) {
          let map = {};
          let arr = {};
          data.data.forEach((item) => {
            if (!map[item.serviceCategory]) {
              map[item.serviceCategory] = {
                serviceCategory: item.serviceCategory,
                serviceCategoryName: item.serviceCategoryName,
                items: []
              };
            }
            map[item.serviceCategory].items.push(item);
            //必填map
            if (!arr[item.serviceType]) {
              arr[item.serviceType] = {
                serviceType: item.requiredField,
              };
            }
          });
          this.serviceTypeMap = Object.assign({}, map);
          this.mandatoryMap = Object.assign({}, arr);
        }
      }).catch(e => {
        console.error(e);
      });
    },

    /**
     * 获取通道源字典
     * */
    getChannelDic() {
      if (!this.search.serviceTypes.length) {
        return;
      }
      return api.getChannelDic({ serviceTypes: this.search.serviceTypes.join(',') }).then((res) => {
        let data = res.data;
        if (data && data.code === '0') {
          this.channels = data.data;
        }
      }).catch(e => {
        console.error(e);
      });
    },
  }
};
</script>
<style lang="stylus" scoped>
.stat-table {
  width: 100%;
  line-height: 30px;

  thead {
    color: #5e6d82;
    background-color: #eff2f7;

    th {
      width: 50%;
      text-align: center;
      border: 1px solid rgb(223, 230, 236);
    }
  }

  tbody {
    td {
      text-align: center;
      border: 1px solid rgb(223, 230, 236);
    }
  }
}
.downloadTemplate{
  text-decoration:none
}
.credit-form .el-form-item{
  margin-bottom:20px
}
.batchQuery-box{
  width:75%;
  margin:15px auto;
}
.batchQuery-box h3{
      margin-bottom: 5px;
}
.batchQuery-table th {
  color: #5e6d82;
  background-color: #eff2f7;
  width: 50%;
  text-align: center;
  border: 1px solid rgb(223, 230, 236);
}
.item-doubt{
  background:#c4c4c4;
  border-radius:50%;
  cursor:pointer;
}
.item-doubt:before{
  color:#fff; 
}
.block_bar {
    color: #4096ff;
    padding-top: 5px;
    border-top: 1px solid #dfe6ec;
}

.upload-img {
  display: inline-block;
  height: 100px;
  position: relative;

  img {
    height: 100%;
  }

  .progress {
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0
  }

  .m-icon {
    width: 50px;
    height: 50px;
    overflow: hidden;
    display: inline-block;
  }

  .m-icon-picture {
    background: url('../../../../../assets/icons/picture.svg') no-repeat center center;
    background-size: contain;
  }

  .el-icon-upload{
    font-size: 85%;
  }

  .icon-download{
    font-size: 85%;
  }
}
</style>
