<template>
  <div class="form-co" :style="{height: (height - 20) + 'px'}">

    <el-form ref="accountForm" label-width="120px" class="b-form">
      <el-row :gutter="20" class="dashed-line">
        <el-col :span="24">
          <el-form-item label="选择业务类型：">
            <el-cascader
              :options="options"
              v-model="step1.applyAgency"
              @change="handleChange">
            </el-cascader>

            <el-radio-group v-model="step1.applyFormType" @change="changeType">
              <el-radio-button v-for="(item, index) in applyTypes" :label="item.applicationTypeId" :key="'applicationTypeId-' + index">{{item.applicationTypeName}}</el-radio-button>
            </el-radio-group>

            <el-select v-model="step1.businessType" v-if="this.applyTypeMap[step1.applyFormType]" placeholder="请选择业务类型需求"
             @change="handelBusinessType">
              <el-option
                v-for="item in this.applyTypeMap[step1.applyFormType]"
                :key="item.applicationTypeId"
                :label="item.applicationTypeName"
                :value="item.applicationTypeId"
               >
              </el-option>
            </el-select>

          </el-form-item>
        </el-col>
      </el-row>

      <div class="collect">
        <div class="types">
          <p class="block-title">影像扫描</p>
          <ul>
            <li v-for="(type, index) in types" :key="'type-' + index" @click="typeChange(index)" :class="{'active': photo.type == index}">
              <span :title="type"><i>*</i>{{type.name}}</span>
              <a v-if="type.img" style="color:green; border: 1px solid green">已采集</a>
              <a v-else>未采集</a>
            </li>
          </ul>
          <div class = "btn-group">
            <router-link :to="{path:'/risk_system/business/navigationOpen', 
              query:{orderNo : this.orderNo}}">
                <el-button  style="margin-left: 10px;" size="small" type="primary">上传信息完毕，进行下一步操作</el-button>
          </router-link>
          
          </div>
        </div>
        <div class="photo">
          <p class="title">{{types[photo.type].name}}</p>
          <div class="content">
            <img @click="showImage(types[photo.type].img)" v-if="types[photo.type].img" :src="types[photo.type].img" />
          </div>
          <el-upload
            action="/api/risk_system/business/institution/uploadAndCheck"
            class="btn-group"
            :name = types[photo.type].fileType
            :show-file-list="false"
            :on-success="avatarSuccess"
            :before-upload="beforeUpload"
            :on-progress="uploadprogress"
            :on-error="avatarError"
            :data="{fileType: types[photo.type].fileType, orderNo:this.orderNo, token:this.token}">
            <el-button size="small" type="primary">上传</el-button>
            <el-button style="margin-left: 10px;" size="small" type="primary">拍照</el-button>
          </el-upload>  
        </div>
        <div class="result">
          <p class="block-title">扫描结果</p>
          <!-- <ul v-if="types[photo.type].img">
            <li v-for="(result, index) in types[photo.type].result" :key="'result-' + index">
              {{result.label}}：<el-input v-model="result.value" ></el-input>
            </li>
          </ul> -->
          <el-form label-width="100px" label-position="right" class="nav-item-form" ref="fileDetectForm" :model="fileDetectForm.fileDetectResult">
              <el-row :gutter="5" v-for="(result, index) in types[photo.type].result" :key="'result-' + index">
                <el-col :span="24">
                  <el-form-item :label="result.label" :prop="result.param">
                    <el-input type='textarea' autosize v-model="fileDetectForm.fileDetectResult[result.param]"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
          </el-form>
          <div class = "btn-group">
          <el-button size="small" type="primary" @click="updateFileDetect">保存</el-button>
          </div>
        </div>
      </div>

    </el-form>

  </div>
</template>

<script>
  import api from '../../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'business_navigation_open',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        token: bsmp.util.getToken(),
        orderNo: "",
        options: [],
        applyTypes: [],
        applyTypeMap: {},
        step1: {
          applyAgency: [],
          applyFormType: '',
          businessType: '',
          applicationTypeId: ''
        },
        types: [
          {}
          // { name: '', img: '', result: [] },
          // { name: '证券账户开立申请表', img: '', result: [] },
          // { name: '营业执照', img: '', 
          //   result: [
          //     { label: '统一社会信用代码', value: '293029399' },
          //     { label: '名称', value: '深圳腾讯有限公司' },
          //     { label: '类型', value: '有限责任公司' },
          //     { label: '住所', value: '深圳南山深港合作区B栋301室' },
          //     { label: '法定代表人', value: '马化腾' },
          //     { label: '注册资本', value: '10亿' },
          //     { label: '成立日期', value: '2003-10-20' },
          //     { label: '营业开始日期', value: '2003-10-20' },
          //     { label: '营业截止日期', value: '2023-10-20' },
          //     { label: '经营范围', value: '计算机软件' },
          //     { label: '登记机关', value: '深圳市场监督管理局' },
          //     { label: '登记日期', value: '2003-10-20' },
          //     { label: '公司印鉴', value: '有' },
          //     { label: '登记机关印鉴', value: '有' }
          //   ] 
          // },
          // { name: '外商投资企业批准证书', img: '', result: [] },
          // { name: '创投企业备案文件', img: '', result: [] },
          // { name: '组织机构代码证', img: '', result: [] },
          // { name: '国税或地税税务登记证', img: '', result: [] },
          // { name: '法定代表人证明书', img: '', result: [] },
          // { name: '执行事务合伙人或负责人有效身份证明文件', img: '', result: [] },
          // { name: '合伙协议', img: '', result: [] },
          // { name: '投资各方签署的创投企业合同及章程', img: '', result: [] },
          // { name: '法定代表人授权委托书原件', img: '', result: [] },
          // { name: '执行事务合伙人或负责人对经办人的授权委托书原件', img: '', result: [] },
          // { name: '境外法人还需提供董事会或董事、主要股东授权委托书（原件）', img: '', result: [] },
          // { name: '经办人有效身份证明文件原件，验原件，留复印件', img: '', result: [] },
          // { name: '全体合伙人或投资者名单、有效身份证明文件', img: '', result: [] },
          // { name: '证券资产权属证明文件（可选）', img: '', result: [] },
          // { name: '机构留存印鉴（原件）', img: '', result: [] }
        ],
        photo: {
          type: 0
        },
        fileDetectForm: {
          fileType: '',
          fileDetectResult:{}
        }
      };
    },
    mounted () {
      this.getAgencyList();
      // this.orderNo = 123456;
      this.orderNo = this.uuid();
    },
    created(){
      this.applicationTypeSet();
      this.businessTypeSet();
    },
    methods: {
      applicationTypeSet(){
        if(this.$route.query.applyAgency && this.$route.query.applyAgency.length !== 0){
          let array = [];
          this.$route.query.applyAgency.forEach(item=>{
            array.push(parseInt(item))
          })
          this.step1.applyAgency = array;
          this.handleChange(this.step1.applyAgency);
        };
        
      },
      businessTypeSet(){
        if(this.$route.query.applyFormType && this.$route.query.applyFormType !== 0){
          this.step1.applyFormType = this.$route.query.applyFormType;
        }
        if(this.$route.query.businessType && this.$route.query.businessType.length !== 0){
          this.step1.businessType = parseInt(this.$route.query.businessType);
          this.handelBusinessType(this.step1.businessType)
        }
      },
      getAgencyList() {
        return api.getAgencyList().then(res => {
          let data = res.data;
          if (data && data.code === "0") {
            let items = data.data;

            let options = []
            if (items.length) {
              items.forEach(e => {
                let p = {
                  value: e.agencyId,
                  label: e.agencyName
                }

                if (e.children && e.children.length) {
                  p.children = this.handleOption(e)
                }

                options.push(p)
              });

              this.options = options
            }
          }
        }).catch(e => {
            console.error(e);
        });
      },
      handleOption(item) {
        if (item.children && item.children.length) {
          let children = []
          item.children.forEach(e => {
            let child = {
              value: e.agencyId,
              label: e.agencyName
            }

            if (e.children && e.children.length) {
              child.children = this.handleOption(e)
            }

            children.push(child)
          })
          return children
        }
      },
      handleChange(value) {
        console.log('agencyId:', value)
        if (value.length) {
          this.step1.applyFormType = ''
          this.step1.businessType = ''
          this.step1.applicationTypeId = ''
          this.getApplicationTypeList(value[value.length - 1])
        }
      },
      getApplicationTypeList(agencyId) {
        this.applyTypes = []
        api.getApplicationTypeList({agencyId}).then(res => {
          let data = res.data;
            if (data && data.code === "0") {
              this.applyTypes = data.data
              if (this.applyTypes && this.applyTypes.length) {
                this.applyTypes.forEach(item => {
                  this.applyTypeMap[item.applicationTypeId] = item.children
                })
              }
            }
        })
      },
      handelBusinessType(item){
          api.getFileConfigList({applicationTypeId : item}).then(res => {
              let data = res.data;
              let files = [];
              if (data && data.code === "0" && data.data) {
                  let items = data.data;
                  items.forEach(item => {
                    let file = {
                      name: item.fileName,
                      img: '',
                      result: [],
                      fileType: item.fileType
                      };
                    files.push(file);
                  });
              }
              this.types = files;
          }).catch(e => {
              console.error(e);
          })
      },
      changeType(value) {
        this.step1.businessType = ''
      },
      typeChange (index) {
        
        this.photo.type = index
        this.photo.typeName = this.types[this.photo.type].name
        this.fileDetectForm.fileType = this.types[this.photo.type].fileType
        this.fileDetectForm.fileDetectResult = {}

        let params = {}
        params['fileType'] = this.fileDetectForm.fileType
        params['orderNo'] = this.orderNo
        api.getFileDetect(params).then(res => {
          let data = res.data.data;
          if(data){
            data.result[0].data.describList.forEach(item=>{
              this.fileDetectForm.fileDetectResult[item.param] = item.value 
            })
            this.types[this.photo.type].img =data.result[0].url
            this.types[this.photo.type].result = data.result[0].data.describList
          }
        });
        

      },
      showImage(url) {
        this.$msgbox({
          title: '图片预览',
          customClass: 'm-message-box-img',
          message: this.$createElement('img', {style: 'color: teal; max-width: 800px; max-height: 800px', attrs: {src: url}}),
        }).catch(() => {

        });
      },
      beforeUpload(file){
        // let isImg = (file.type === 'image/jpeg' || file.type === 'image/png');
        // if (!isImg) {
        //   this.$message.error('上传图片格式只能是png或者jpg!');
        // }
        // if (this.optAuth.upload) {
        //   return true;
        // } else {
        //   this.$message.warning('无上传图片权限！');
        //   return false;
        // }
        return true;
      },
      uploadprogress(event, file, fileList) {
        
      },
      avatarSuccess(res, file, files){
        if (res.code != 0) {
          this.$message.error('上传图片失败' + res.msg);
          return;
        }
        
        let describList = res.data.result[0].data.describList
        this.types[this.photo.type].img = res.data.result[0].url
        this.types[this.photo.type].result = describList
        
        this.fileDetectForm['fileType'] = this.types[this.photo.type].fileType
        describList.forEach(item=>{
          this.fileDetectForm.fileDetectResult[item.param] = item.value 
        })
        
        this.$message.success('上传成功' + res.msg);
      },
      avatarError(err, file, fileList) {
        this.$message.error('上传图片失败' + err);
      },
      updateFileDetect(){
        this.$refs["fileDetectForm"].validate(valid => {
          if (valid) {
            let params = Object.assign({}, this.fileDetectForm.fileDetectResult)
            params['fileType'] = this.fileDetectForm.fileType
            params['orderNo'] = this.orderNo
            api.updateFileDetect(params).then(res => {
              let data = res.data;
              if (data && data.code === "0") {
                this.$message({
                  type: "success",
                  message: "修改成功!"
                });

                typeChange(this.photo.type)

                // 记录日志
                bsmp.log({
                  component: "business",
                  type: "updateFileDetect",
                  content: `[Business] params: ${JSON.stringify(params)}`
                });
              }
            });
          } 
        }); 
      },
      uuid(){
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); 
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
      }

  }
};
</script>
<style lang="stylus" scoped>
  .form-co {
    overflow-y: scroll;
    overflow-x: hidden;

    .b-form {
      padding: 10px 0;
      width: 100%;
      text-align left
    }

    .dashed-line {
      border-bottom 1px dashed #e1dddc
      line-height: 40px
    }

    .collect {
      margin-top: 10px
      text-align left
      height: 500px

      .block-title {
        height: 40px
        padding: 5px 0
        color: #001611
        background: #d2d1cf
        font-size: 16px
        text-align center
        position: relative

          &:before {
            content: ''
            position: absolute
            left: 30px
            top: 15px
            width: 50px
            height: 3px
            background: #c4c2c3
          }

          &:after {
            content: ''
            position: absolute
            right: 30px
            top: 15px
            width: 50px
            height: 3px
            background: #c4c2c3
          }
      }

      .types {
        // margin-bottom: 10px
        height: 100%
        width: 25%
        float: left
        // border: 2px solid #d8d8d8

        ul {
          margin-bottom: 0px
          height: calc(100% - 80px)
          overflow-y: scroll
          li {
            color: #695765
            display: flex
            cursor: pointer

            i {
              color: #df6939
              padding: 8px
              font-weight: bold
            }

            a {
              margin: 5px
              height: 20px
              padding: 0 2px
              text-align center
              border-radius 15px
              border: 1px solid #df6939
              color: #df6939
              font-size: 12px
              flex: 3
            }

            span {
              white-space: nowrap
              overflow: hidden
              text-overflow: ellipsis
              margin: 2px 0
              padding: 5px 5px 5px 0
              flex: 10
            }
          }

          li:nth-child(even) {
            background: #ede9e8
          }
          li:nth-child(odd) {
            background: #fff
          }

          li.active {
            color: #fff
            background: #4373bd

            a {
              border: 1px solid #fff
              color: #fff
            }
          }

          li:not(.active):hover {
            background: #f7f7f7
          }
        }
        .btn-group {
          background: #d2d1cf
          text-align: center
          padding: 6px 0
        }
      }

      .photo {
        height: 100%
        width: 50%
        float: left

        .title {
          background: #a6a5a3
          color: #fff
          height: 40px
          padding: 10px 0
          text-align center
          font-weight: bold
        }

        .content {
          height: calc(100% - 80px)
          background: #f7f7f7
          justify-content: center
          align-items: center
          display: flex
          overflow: hidden

          img {
            width: 100%
            cursor: pointer
          }
        }

        .btn-group {
          background: #a6a5a3
          text-align: center
          padding: 6px 0
        }
      }

      .result {
        height: 100%
        width: 25%
        float: left

        // ul {
        //   list-style: none;
        //   line-height: 30px;
        //   padding: 10px;
        // }
        .nav-item-form {
          height: calc(100% - 80px)
          overflow-y: scroll
          overflow-x: hidden

        }

        .btn-group {
          background: #d2d1cf
          text-align: center
          padding: 6px 0
        }
      }
    }
  }

</style>
