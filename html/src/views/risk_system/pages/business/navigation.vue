<template>
  <div class="form-co" :style="{height: (height - 20) + 'px'}">

    <el-form ref="accountForm" label-width="120px" class="b-form">
      <el-steps class="nav-step b-step" :space="140" :active="step" align-center simple>
        <el-step title="选择办理业务"></el-step>
        <el-step title="可选账户信息"></el-step>
        <el-step title="提交资料是否完整"></el-step>
        <el-step title="表单是否完整"></el-step>
        <el-step title="提交审核/未提交审核"></el-step>
      </el-steps>

      <template v-if="step === 1">
        <el-row :gutter="20">
          <el-col :span="22" :offset="1">
            <el-form-item label="选择业务类型：">
              <el-cascader
                :options="options"
                v-model="step1.applyAgency"
                @change="handleChange">
              </el-cascader>

            <el-radio-group v-model="step1.applyFormType" @change="changeType">
              <el-radio-button v-for="(item, index) in types" :label="item.applicationTypeId" :key="'applicationTypeId-' + index">{{item.applicationTypeName}}</el-radio-button>
            </el-radio-group>

            <el-select v-model="step1.businessType" v-if="this.typeMap[step1.applyFormType]" placeholder="请选择业务类型需求">
              <el-option
                v-for="item in this.typeMap[step1.applyFormType]"
                :key="item.applicationTypeId"
                :label="item.applicationTypeName"
                :value="item.applicationTypeId"
               >
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="b-tip-block" v-show="step1.businessType">
          <div class="title"><i class="icon icon-filesearch filesearch"></i>投资者风险识别能力和承受能力调查问卷</div>
          <div class="text-block">
            <div class="text-tip">提示</div>
            <div class="text-pop"><a>1</a>本问卷旨在协助投资者了解自身对投资风险的承受能力，为保护您的合法权益，请真实、准确、
            完整地填写本问卷，如因存在欺诈、隐瞒或其它不实陈述而导致调查结果与实际情况不符的，本基金管理人不承担任何责任。
            投资者应购买与其风险偏好相适应的基金产品，若所选择基金产品的风险等级高于其风险承受能力，经提示后仍选择投资的，
            视为投资者已充分了解该投资风险并愿意承担相应的风险。</div>
          </div>
        </div>

        <el-row :gutter="20"  v-show="step1.businessType">
          <template>
            <el-tabs v-model="activeName" type="card" class="nav-tabs">
              <el-tab-pane label="投资者风险识别能力和承受能力调查" name="danger">
                <div class="survey">
                  <div class="result">
                    <el-form label-width="102px" label-position="left" :rules="survey.rules" class="nav-item-form" style="padding: 10px 15px 0 15px;">
                      <el-row :gutter="20">
                        <el-col :span="6">
                          <el-form-item label="姓名：" prop="name">
                            <el-input placeholder="必填"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="出生日期：" prop="birthday">
                            <el-input placeholder="必填"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="性别：" prop="sex">
                            <el-input placeholder="必填"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="民族：" prop="nation">
                            <el-input placeholder="必填"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="20">
                        <el-col :span="6">
                          <el-form-item label="身份证：" prop="idNo">
                            <el-input placeholder="必填"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="电话号码：" prop="phone">
                            <el-input placeholder="必填"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="职业：" prop="profession">
                            <el-input placeholder="必填"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label="学历：" prop="education">
                            <el-input placeholder="必填"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>

                      <el-row :gutter="20">
                        <el-col :span="12">
                          <el-form-item label="证件地址：" prop="cardAddress">
                            <el-input placeholder="必填"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="详细地址：" prop="detailAddress">
                            <el-input placeholder="必填"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>

                    </el-form>
                  </div>
                  <div class="questions">
                    <div class="title">1.您的家庭可支配年收入为（折合成人民币）？</div>
                      <el-radio-group v-model="radio.nature1" class="options">
                      <el-radio :label="1" class="option">1)50万元以下</el-radio>
                      <el-radio :label="2" class="option">2)50万至100万元</el-radio>
                      <el-radio :label="3" class="option">3)100万至500万元</el-radio>
                      <el-radio :label="4" class="option">4)500万至1000万元</el-radio>
                      <el-radio :label="5" class="option">5)1000万元以上</el-radio>
                    </el-radio-group>
          
                    <div class="title">2.在您每年的家庭可支配收入中，可用于金融投资（储蓄存款除外）的比例为 ？</div>
                        <el-radio-group v-model="radio.nature2" class="options">
                        <el-radio :label="1" class="option">1)小于5%</el-radio>
                        <el-radio :label="2" class="option">2)5%至20%</el-radio>
                        <el-radio :label="3" class="option">3)20%至40%</el-radio>
                        <el-radio :label="4" class="option">4)40%至65%</el-radio>
                        <el-radio :label="5" class="option">5)大于60%</el-radio>
                      </el-radio-group>

                    <div class="title">3.您计划的投资期限是多久？</div>
                      <el-radio-group v-model="radio.nature3" class="options">
                        <el-radio :label="1" class="option">1)1年以内</el-radio>
                        <el-radio :label="2" class="option">2)1年至3年</el-radio>
                        <el-radio :label="3" class="option">3)3年至5年</el-radio>
                        <el-radio :label="4" class="option">4)5年至7年</el-radio>
                        <el-radio :label="5" class="option">5)7年以上</el-radio>
                      </el-radio-group>

                    <div class="title">4.您认为自己能承受的最大投资损失是多少？</div>
                      <el-radio-group v-model="radio.nature4" class="options">
                        <el-radio :label="1" class="option">1)10%以内</el-radio>
                        <el-radio :label="2" class="option">2)10%-20%</el-radio>
                        <el-radio :label="3" class="option">3)20%-40%</el-radio>
                        <el-radio :label="4" class="option">4)40%-60%</el-radio>
                        <el-radio :label="5" class="option">5)超过60%</el-radio>
                      </el-radio-group>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="20" :offset="7">
            <el-form-item>
              <el-button title="下一步" v-show="optAuth.step" @click="next" type="primary">下一步</el-button>
              <router-link :to="{path:'/risk_system/business/agency', 
              query:{applyAgency:step1.applyAgency,applyFormType: step1.applyFormType, businessType :step1.businessType}}">
                <el-button title="下一步" v-show="optAuth.step"  type="primary">页面跳转，并夹带参数</el-button>
              </router-link>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <template v-if="step === 2">
        <el-row :gutter="20">
          <el-col :span="4" :offset="4">
            <el-form-item label="开户类型：">
              <el-checkbox-group v-model="step2.accountType" class="block-checkbox">
                <el-checkbox label="资金账户"></el-checkbox>
                <el-checkbox label="证券账户"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="开户子类：">
              <el-checkbox-group v-model="step2.accountSubclass" class="block-checkbox">
                <el-checkbox label="深A"></el-checkbox>
                <el-checkbox label="深B"></el-checkbox>
                <el-checkbox label="沪A"></el-checkbox>
                <el-checkbox label="沪B"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="20" :offset="7">
            <el-form-item>
              <el-button title="上一步" v-show="optAuth.step" @click="back" type="primary">上一步</el-button>
              <el-button title="下一步" v-show="optAuth.step" @click="next" type="primary">下一步</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </template>

      <template v-if="step === 3">
        <el-row :gutter="20">
          <el-col :span="12" :offset="4">
            <el-form-item label="申请资料提交：">
              <template v-for="(item, index) in files">
                <div class="file-block" :key="'file' + index" v-if="item.isForm === 0">
                  <div class="upload-img">
                    <el-progress class="progress" v-if="progress[item.fileName] > 0" type="circle" :percentage="progress[item.fileName]"></el-progress>
                    <img @click="showImage(form[item.fileName])" v-if="form[item.fileName]" :src="form[item.fileName]">
                    <i v-else class="m-icon m-icon-picture"></i>
                  </div>
                  <el-upload
                    action="/api/risk_system/business/apply/step/upload"
                    :show-file-list="false"
                    :on-success="(response, file, fileList) => {avatarSuccess(response, file, fileList, item.fileName, item)}"
                    :before-upload="(file) => {beforeUpload(file, item.fileName)}"
                    :on-progress="(event, file, fileList) => {uploadprogress(event, file, fileList, item.fileName)}"
                    :on-error="avatarError"
                    :data="{token: token, fileName: item.fileName, fileId: item.fileId, applyNo: applyNo}">
                    <el-button size="small">{{item.fileName}}</el-button>
                  </el-upload>
                </div>
              </template>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="20" :offset="7">
            <el-form-item>
              <el-button title="上一步" v-show="optAuth.step" @click="back" type="primary">上一步</el-button>
              <el-button title="下一步" v-show="optAuth.step" @click="next" type="primary">下一步</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </template>

      <template v-if="step === 4">
        <el-row :gutter="20">
          <el-col :span="12" :offset="4">
            <el-form-item label="申请单填写：">
              <template v-for="(item, index) in files">
                <div class="file-block" :key="'file' + index" v-if="item.isForm === 1">
                  <!-- <div class="upload-img">
                    <el-progress class="progress" v-if="progress[item.fileName] > 0" type="circle" :percentage="progress[item.fileName]"></el-progress>
                    <img @click="showImage(form[item.fileName])" v-if="form[item.fileName]" :src="form[item.fileName]">
                    <i v-else class="m-icon m-icon-picture"></i>
                  </div> -->
                  <!-- <el-upload
                    action="/api/risk_system/business/apply/step/upload"
                    :show-file-list="false"
                    :on-success="(response, file, fileList) => {avatarSuccess(response, file, fileList, item)}"
                    :before-upload="(file) => {beforeUpload(file, item.fileName)}"
                    :on-progress="(event, file, fileList) => {uploadprogress(event, file, fileList, item.fileName)}"
                    :on-error="avatarError"
                    :data="{token: token, fileName: item.fileName, fileId: item.fileId, applyNo: applyNo}">
                    <el-button size="small">{{item.fileName}}</el-button>
                  </el-upload> -->
                  <el-button size="small" @click="formDialogShow(item)">{{item.fileName}}</el-button>

                </div>
              </template>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="20" :offset="7">
            <el-form-item>
              <el-button title="上一步" v-show="optAuth.step" @click="back" type="primary">上一步</el-button>
              <el-button title="下一步" v-show="optAuth.step" @click="next" type="primary">下一步</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </template>
    </el-form>
    <el-dialog title="表单填写"  v-model="formDialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
            <div slot="footer" class="dialog-footer">
                <el-button @click="formSubmit()"  type="primary">确 定</el-button>
                <el-button @click="formDialog.show = false">取 消</el-button>
            </div>
        </el-dialog>

  </div>
</template>

<script>
  import api from '../../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'business_navigation',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        token: bsmp.util.getToken(),
        loading: true,
        step: 1,
        applyNo: '',
        options: [],
        types: [],
        typeMap: {},
        step1: {
          applyAgency: [],
          applyFormType: '',
          businessType: ''
        },
        step2: {
          accountType: [],
          accountSubclass: []
        },
        step3: {
          applyMaterial: ''
        },
        step4: {
          applyForms: ''
        },
        files: [],
        progress: {},
        form: {},
        uploadFiles: [],
        formDialog:{
          show: false,
          file: null
        },
        radio: {
          nature1: -1,
          nature2: -1,
          nature3: -1,
          nature4: -1,
        },
        survey:{
          name: '',
          birthday: '',
          sex: '',
          nation: '',
          phone: '',
          profession: '',
          education: '',
          cardAddress: '',
          detailAddress: '',
          rules: rules
        },
        activeName: 'danger',
      };
    },
    mounted () {
      this.getAgencyList()
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          step: 'business_navigation_step',
          list: 'business_navigation_list',
          typeList: 'business_navigation_type_list'
        });
      }
    },
    methods: {
      next() {
        let params = {}
        switch (this.step) {
          case 1:
            params = {
              applyAgency: this.step1.applyAgency[this.step1.applyAgency.length - 1],
              applyFormType: this.step1.applyFormType,
              businessType: this.step1.businessType
            }
            break
          case 2:
            params = {
              applyNo: this.applyNo,
              accountType: this.step2.accountType.join(','),
              accountSubclass: this.step2.accountSubclass.join(',')
            }
            break
          case 3:
            let applyMaterial = this.uploadFiles.filter((item) => {
              return item.isForm === 0
            })
            let materials = []
            applyMaterial.forEach(item => {
              materials.push(item.fileId)
            })
            params = {
              applyNo: this.applyNo,
              applyMaterial: materials.join(',')
            }
            break
          case 4:
            let applyForms = this.uploadFiles.filter((item) => {
              return item.isForm === 1
            })
            let forms = []
            applyForms.forEach(item => {
              forms.push(item.fileId)
            })
            params = {
              applyNo: this.applyNo,
              applyForms: forms.join(',')
            }
            
            this.uploadFiles = [];
            break
        }
        api.saveApplyStep({...params, step: this.step}).then(res => {
          let data = res.data;
          if (data && data.code === "0") {
            this.step++
            if (this.step === 5) {
              this.$alert('信息提交成功！', '提示信息', {
                type: 'success',
                confirmButtonText: '确定',
                callback: action => {
                  this.reset()
                }
              });
            } else if (this.step === 3) {
              this.getFileConfigList()
            } else if (this.step === 2) {
              this.applyNo = data.data.applyNo
            }
          }
        });
      },
      back() {
        this.step--
      },
      reset() {
        this.step = 1
        this.applyNo = ''
        this.step1 = {
          applyAgency: [],
          applyFormType: '',
          businessType: ''
        }
        this.step2 = {
          accountType: [],
          accountSubclass: []
        }
        this.step3 = {
          applyMaterial: ''
        }
        this.step4 = {
          applyForms: ''
        }
      },
      handleChange(value) {
        console.log('agencyId:', value)
        if (value.length) {
          this.step1.applyFormType = ''
          this.step1.businessType = ''
          this.getApplicationTypeList(value[value.length - 1])
        }
      },
      changeType(value) {
        this.step1.businessType = ''
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
      getFileConfigList() {
        if (!this.step1.businessType) {
          return;
        }

        this.progress = {}
        this.form = {}
        this.files = []

        return api.getFileConfigList({applicationTypeId: this.step1.businessType}).then(res => {
          let data = res.data;
          if (data && data.code === "0") {
            this.files = data.data
          }
        }).catch(e => {
            console.error(e);
        });
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
      getApplicationTypeList(agencyId) {
        this.types = []
        api.getApplicationTypeList({agencyId}).then(res => {
          let data = res.data;
            if (data && data.code === "0") {
              this.types = data.data
              if (this.types && this.types.length) {
                this.types.forEach(item => {
                  this.typeMap[item.applicationTypeId] = item.children
                })
              }
            }
        })
      },
      showImage(url) {
        this.$msgbox({
          title: '图片预览',
          customClass: 'm-message-box-img',
          message: this.$createElement('img', {style: 'color: teal', attrs: {src: url}}),
        }).catch(() => {

        });
      },
      beforeUpload(file, type){
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
      uploadprogress(event, file, fileList, type) {
        if (event.percent) {
          this.$set(this.progress, type, parseInt(event.percent, 10))
          if (event.percent == 100) {
            setTimeout(() => {
              this.$set(this.progress, type, 0)
            }, 500);
          }
        }
        console.log('event:', event);
      },
      avatarSuccess(res, file, files, type, uploadFile){
        console.log(res);
        if (res.code != 0) {
          this.$message.error('上传图片失败' + res.msg);
          return;
        }
        this.$message.success('上传成功' + res.msg);
        this.$set(this.form, type, res.data.fileUrl)
        if(this.uploadFiles.indexOf(uploadFile) == -1){
          this.uploadFiles.push(uploadFile)
        }
        console.log(this.form)
      },
      avatarError(err, file, fileList) {
        this.$message.error('上传图片失败' + err);
      },
      formSubmit(){
        if(this.uploadFiles.indexOf(this.formDialog.file) == -1){
          this.uploadFiles.push(this.formDialog.file)
        }
        this.formDialog.show = false;
      },
      formDialogShow(file){
        this.formDialog.file = file;
        this.formDialog.show = true;
      }
    }
  };

let rules ={
  name: [
      {required: true, message: '请输入姓名', trigger: 'blur'}
  ],
  birthday: [
    {required: true, message: '请输入出生日期', trigger: 'blur'}
  ],
  sex: [
      {required: true, message: '请输入性别', trigger: 'blur'}
  ],
  idNo: [
    {required: true, message: '请输入身份证号码', trigger: 'blur'}
  ],
  nation: [
    {required: true, message: '请输入民族', trigger: 'blur'}
  ],
  phone: [
      {required: true, message: '请输入电话号码', trigger: 'blur'}
  ],
  profession: [
    {required: true, message: '请输入职业信息', trigger: 'blur'}
  ],
  education: [
      {required: true, message: '请输入学历信息', trigger: 'blur'}
  ],
  cardAddress: [
    {required: true, message: '请输入证件地址', trigger: 'blur'}
  ],
  detailAddress: [
    {required: true, message: '请输入详细居住地址', trigger: 'blur'}
  ]
}
</script>
<style lang="stylus" scoped>
  .form-co {
    overflow-y: scroll;

    .b-form {
      border: 1px solid #dfe6ec;
      border-radius: 4px;
      padding: 10px 20px 10px 10px;
      width: 100%;

      .b-step {
        margin-left: 300px;
        margin-bottom: 20px;
      }

      .block-checkbox {
        .el-checkbox {
          display: block !important;
          margin-left: 0 !important;
        }
      }

      .b-tip-block {
        text-align: left 
        padding: 5px 10px;
        border: 5px solid #ccc;

        .title {
          color: #687cae;
          font-size: 14px;

          .filesearch {
            color: #687cae;
            line-height: 30px
            font-size: 13px;
          }
        }

        .text-block {
          background: #f7f7f7;
          padding: 10px;
          border-radius: 10px;
          position relative

          .text-tip {
            border-radius: 12px;
            position absolute
            left 10px
            background #4170be
            font-size 13px
            color #fff
            padding 5px 8px
          }

          .text-pop {
            background #fff
            color #000400
            border 1px solid #e0e0e0
            border-radius 10px
            margin-left 65px
            padding 6px 8px

            &:before {
              position: absolute;
              content: '';
              left 70px
              top: 21px
              border-top: 1px solid;
              border-right: 1px solid;
              width: 10px;
              height: 10px;
              border-color: #e0e0e0;
              background #fff
              transform: rotate(-135deg);
            }

            a {
              display inline-block
              padding 0 5px
              background #d4d4d6
              color #fff
              margin 0 10px
              border-radius 5px
            }
          }
        }
      }

      .nav-tabs {
        .survey{
          margin-left: 60px
          margin-right: 60px

          .result {
            margin: 10px

            .title {
              color: #333333
              font-weight: bold  
            }

            .items {
              padding: 10px 0
            }

            .item {
              width: 25%
              float: left

              .label {
                color: #666666  
              }

              .txt {
                color: #ff0057  
              }
            }
          }

          .questions {
            margin: 10px 20px

            .title {
              color: #333333
              font-weight: bold
              padding: 10px 0
            }

            .options {
              width: 100%  

              .el-radio + .el-radio {
                margin-left: 0 !important
              }
            }

            .option {
              text-align: left
              width: 33%
              float: left
              padding: 10px 0
              padding-left: 60px
            }
          } 
        } 
      }
    }
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
  }

  .file-block {
    width: 200px;
    float: left;
    margin-bottom: 20px;
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

</style>
