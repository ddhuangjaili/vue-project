<template>
  <div class="form-co" :style="{height: (height - 20) + 'px'}">
    <el-row class="toolbar">
      <el-button title="提交审核" v-show="optAuth.add" @click="submitForm" type="warning">提交审核</el-button>
    </el-row>

    <el-form ref="accountForm" :model="form" :rules="rules" label-width="120px" class="b-form">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="业务申请单号：" prop="applyNo">
            <el-input v-model="form.applyNo" placeholder="业务申请单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户类型：" prop="openAccountType">
            <el-input v-model="form.openAccountType" placeholder="开户类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户方式：" prop="openAccountWay">
            <el-input v-model="form.openAccountWay" placeholder="开户类型"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="规则场景：" prop="scene">
            <el-select v-model="form.scene">
              <el-option v-for="(val, key) in sceneMap" :label="val" :value="key"
                        :key="'form-scene-'+ key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入口渠道：" prop="channel">
            <el-input v-model="form.channel" placeholder="入口渠道"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="业务方人员：" prop="operator">
            <el-input v-model="form.operator" placeholder="业务方人员"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="form.name" placeholder="姓名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出生日期：" prop="birthday">
            <el-input v-model="form.birthday" placeholder="出生日期"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别：" prop="gender">
            <el-input v-model="form.gender" placeholder="性别"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="民族：" prop="nation">
            <el-input v-model="form.nation" placeholder="民族"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证：" prop="idNo">
            <el-input v-model="form.idNo" placeholder="身份证"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话号码：" prop="phone">
            <el-input v-model="form.phone" placeholder="电话号码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="银行：" prop="bankName">
            <el-input v-model="form.bankName" placeholder="银行"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="卡号：" prop="bankCardNo">
            <el-input v-model="form.bankCardNo" placeholder="卡号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职业：" prop="profession">
            <el-input v-model="form.profession" placeholder="职业"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="学历：" prop="education">
            <el-input v-model="form.education" placeholder="学历"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工作单位：" prop="companyName">
            <el-input v-model="form.companyName" placeholder="工作单位"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年收入：" prop="income">
            <el-input v-model="form.income" placeholder="年收入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="税收居民类型：" prop="inhabitantType">
            <el-input v-model="form.inhabitantType" placeholder="税收居民类型"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="控制人：" prop="controlPerson">
            <el-input v-model="form.controlPerson" placeholder="控制人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件地址：" prop="address">
            <el-input v-model="form.address" placeholder="证件地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="行业：" prop="industry">
            <el-select v-model="form.industry" placeholder="请选择">
                      <el-option
                         v-for="(val, key) in industry"
                        :label="val"
                        :value="val"
                        :key="'industry-' + key">
                      </el-option>
                    </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职务：" prop="position">
            <el-input v-model="form.position" placeholder="职务"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="联系地址：" prop="contactAddress">
            <el-input v-model="form.contactAddress" placeholder="联系地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="详细地址：" prop="detailAddress">
            <el-input v-model="form.detailAddress" placeholder="详细地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      

      <div class="block_bar">账户类型选择</div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="沪A：" prop="huA">
            <el-select v-model="form.huA" placeholder="请选择">
                        <el-option
                          v-for="(val, key) in accountType"
                          :label="val"
                          :value="val"
                          :key="'huA-' + key">
                        </el-option>
                      </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="原股东号：" prop="shenShareholderNum">
            <el-input v-model="form.shenShareholderNum" placeholder="股东号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="深A：" prop="shenA">
            <el-select v-model="form.shenA" placeholder="请选择">
                        <el-option
                          v-for="(val, key) in accountType"
                          :label="val"
                          :value="val"
                          :key="'shenA-' + key">
                        </el-option>
                      </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="原股东号：" prop="huShareholderNum">
            <el-input v-model="form.huShareholderNum" placeholder="股东号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="委托方式：" prop="entrustWay">
            <el-input v-model="form.entrustWay" placeholder="委托方式"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="深TA基金账户：" prop="shenTAAccount">
            <el-select v-model="form.shenTAAccount" placeholder="请选择">
                      <el-option
                        v-for="(val, key) in accountType"
                        :label="val"
                        :value="val"
                        :key="'shenTAAccount-' + key">
                      </el-option>
                    </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="创业板：" prop="secondBoardMarket">
            <el-select v-model="form.secondBoardMarket" placeholder="请选择">
                        <el-option
                          v-for="(val, key) in accountType"
                          :label="val"
                          :value="val"
                          :key="'secondBoardMarket-' + key">
                        </el-option>
                      </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="信息渠道：" prop="messageChannel">
            <el-input v-model="form.messageChannel" placeholder="信息渠道"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="第二联系人" prop="secondContactName">
            <el-input v-model="form.secondContactName" placeholder="第二联系人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="联系方式：" prop="secondContactPhone">
            <el-input v-model="form.secondContactPhone" placeholder="联系方式"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="本人关系 " prop="relationship">
            <el-input v-model="form.relationship" placeholder="本人关系"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="委托方式：" prop="entrustWay">
            <el-input v-model="form.entrustWay" placeholder="委托方式"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="不良诚信记录：" prop="badCreditRecord">
            <el-input v-model="form.badCreditRecord" placeholder="不良诚信记录"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="评测分数：" prop="evaluateScore">
            <el-input v-model="form.evaluateScore" placeholder="评测分数"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="居住身份申报：" prop="residentType">
            <el-select v-model="form.residentType" placeholder="请选择">
                        <el-option
                          v-for="(val, key) in residentType"
                          :label="val"
                          :value="val"
                          :key="'residentType-' + key">
                        </el-option>
                      </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="风险等级：" prop="riskLevel">
            <el-input v-model="form.riskLevel" placeholder="风险等级"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="密码：" prop="accountPwd">
            <el-input v-model="form.accountPwd" placeholder="密码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="block_bar">身份OCR检验</div>
      <el-row :gutter="20">
        <el-col :span="7">
          <div class="upload-img">
            <el-progress class="progress" v-if="progress.mediaIdCardHeadUrl > 0" type="circle" :percentage="progress.mediaIdCardHeadUrl"></el-progress>
            <img @click="showImage(form.mediaIdCardHeadUrl)" v-if="form.mediaIdCardHeadUrl" :src="form.mediaIdCardHeadUrl">
            <i v-else class="m-icon m-icon-picture"></i>
          </div>
        </el-col>
        <el-col :span="3">
          <el-upload
            action="/api/risk_system/business/common/upload"
            :show-file-list="false"
            :on-success="(response, file, fileList) => {avatarSuccess(response, file, fileList, 'mediaIdCardHeadUrl')}"
            :before-upload="(file) => {beforeUpload(file, 'mediaIdCardHeadUrl')}"
            :on-progress="(event, file, fileList) => {uploadprogress(event, file, fileList, 'mediaIdCardHeadUrl')}"
            :on-error="avatarError"
            :data="{type: 'id_card_head'}">
            <el-button size="small">选择头像面</el-button>
          </el-upload>
        </el-col>
        <el-col :span="7">
          <div class="upload-img">
            <el-progress class="progress" v-if="progress.mediaIdCardEmblemUrl > 0" type="circle" :percentage="progress.mediaIdCardEmblemUrl"></el-progress>
            <img @click="showImage(form.mediaIdCardEmblemUrl)" v-if="form.mediaIdCardEmblemUrl" :src="form.mediaIdCardEmblemUrl">
            <i v-else class="m-icon m-icon-picture"></i>
          </div>
        </el-col>
        <el-col :span="3">
          <el-upload
            action="/api/risk_system/business/common/upload"
            :show-file-list="false"
            :on-success="(response, file, fileList) => {avatarSuccess(response, file, fileList, 'mediaIdCardEmblemUrl')}"
            :before-upload="(file) => {beforeUpload(file, 'mediaIdCardEmblemUrl')}"
            :on-progress="(event, file, fileList) => {uploadprogress(event, file, fileList, 'mediaIdCardEmblemUrl')}"
            :on-error="avatarError"
            :data="{type: 'id_card_emblem'}">
            <el-button size="small">选择国徽面</el-button>
          </el-upload>
        </el-col>
      </el-row>

      <div class="block_bar">银行卡OCR</div>
      <el-row :gutter="20">
        <el-col :span="7">
          <div class="upload-img">
            <el-progress class="progress" v-if="progress.mediaBankCardUrl > 0" type="circle" :percentage="progress.mediaBankCardUrl"></el-progress>
            <img @click="showImage(form.mediaBankCardUrl)" v-if="form.mediaBankCardUrl" :src="form.mediaBankCardUrl">
            <i v-else class="m-icon m-icon-picture"></i>
          </div>
        </el-col>
        <el-col :span="9">
          <el-upload
            action="/api/risk_system/business/common/upload"
            :show-file-list="false"
            :on-success="(response, file, fileList) => {avatarSuccess(response, file, fileList, 'mediaBankCardUrl')}"
            :before-upload="(file) => {beforeUpload(file, 'mediaBankCardUrl')}"
            :on-progress="(event, file, fileList) => {uploadprogress(event, file, fileList, 'mediaBankCardUrl')}"
            :on-error="avatarError"
            :data="{type: 'bank_card'}">
            <el-button size="small">选择图片</el-button>
          </el-upload>
        </el-col>
      </el-row>

      <div class="block_bar">表单OCR</div>
      <el-row :gutter="20">
        <el-col :span="7">
          <div class="upload-img">
            <el-progress class="progress" v-if="progress.mediaOpenAccountFileUrl > 0" type="circle" :percentage="progress.mediaOpenAccountFileUrl"></el-progress>
            <img @click="showImage(form.mediaOpenAccountFileUrl)" v-if="form.mediaOpenAccountFileUrl" :src="form.mediaOpenAccountFileUrl">
            <i v-else class="m-icon m-icon-picture"></i>
          </div>
        </el-col>
        <el-col :span="9">
          <el-upload
            action="/api/risk_system/business/common/upload"
            :show-file-list="false"
            :on-success="(response, file, fileList) => {avatarSuccess(response, file, fileList, 'mediaOpenAccountFileUrl')}"
            :before-upload="(file) => {beforeUpload(file, 'mediaOpenAccountFileUrl')}"
            :on-progress="(event, file, fileList) => {uploadprogress(event, file, fileList, 'mediaOpenAccountFileUrl')}"
            :on-error="avatarError"
            :data="{type: 'open_account_file'}">
            <el-button size="small">选择图片</el-button>
          </el-upload>
        </el-col>
      </el-row>

      <div class="block_bar">活体检测&人脸比对</div>
      <el-row :gutter="20">
        <el-col :span="7">
          <div class="upload-img">
            <el-progress class="progress" v-if="progress.mediaLivenessVideoUrl > 0" type="circle" :percentage="progress.mediaLivenessVideoUrl"></el-progress>
            <video v-if="form.mediaLivenessVideoUrl" width="150px"
              :src="form.mediaLivenessVideoUrl" controls="controls">
              您的浏览器不支持 video 标签。
            </video>
            <i v-else class="m-icon m-icon-video"></i>
          </div>
        </el-col>
        <el-col :span="3">
          <el-upload
            action="/api/risk_system/business/common/upload"
            :show-file-list="false"
            :on-success="(response, file, fileList) => {avatarSuccess(response, file, fileList, 'mediaLivenessVideoUrl')}"
            :before-upload="(file) => {beforeUpload(file, 'mediaLivenessVideoUrl')}"
            :on-progress="(event, file, fileList) => {uploadprogress(event, file, fileList, 'mediaLivenessVideoUrl')}"
            :on-error="avatarError"
            :data="{type: 'liveness_video'}">
            <el-button size="small">选择视频</el-button>
          </el-upload>
        </el-col>
        <el-col :span="7">
          <div class="upload-img">
            <el-progress class="progress" v-if="progress.mediaFaceImgUrl > 0" type="circle" :percentage="progress.mediaFaceImgUrl"></el-progress>
            <img @click="showImage(form.mediaFaceImgUrl)" v-if="form.mediaFaceImgUrl" :src="form.mediaFaceImgUrl">
            <i v-else class="m-icon m-icon-picture"></i>
          </div>
        </el-col>
        <el-col :span="3">
          <el-upload
            action="/api/risk_system/business/common/upload"
            :show-file-list="false"
            :on-success="(response, file, fileList) => {avatarSuccess(response, file, fileList, 'mediaFaceImgUrl')}"
            :before-upload="(file) => {beforeUpload(file, 'mediaFaceImgUrl')}"
            :on-progress="(event, file, fileList) => {uploadprogress(event, file, fileList, 'mediaFaceImgUrl')}"
            :on-error="avatarError"
            :data="{type: 'face_img'}">
            <el-button size="small">选择图片</el-button>
          </el-upload>
        </el-col>
      </el-row>

      <!-- <div class="block_bar">视频音频转义</div>
      <el-row :gutter="20">
        <el-col :span="7">
          <div class="upload-img">
            <el-progress class="progress" v-if="progress.mediaAudioUrl > 0" type="circle" :percentage="progress.mediaAudioUrl"></el-progress>
            <audio v-if="form.mediaAudioUrl" 
              :src="form.mediaAudioUrl" controls="controls">
              您的浏览器不支持 audio 标签。
            </audio>
            <i v-else class="m-icon m-icon-audio"></i>
          </div>
        </el-col>
        <el-col :span="9">
          <el-upload
            action="/api/risk_system/business/common/upload"
            :show-file-list="false"
            :on-success="(response, file, fileList) => {avatarSuccess(response, file, fileList, 'mediaAudioUrl')}"
            :before-upload="(file) => {beforeUpload(file, 'mediaAudioUrl')}"
            :on-progress="(event, file, fileList) => {uploadprogress(event, file, fileList, 'mediaAudioUrl')}"
            :on-error="avatarError"
            :data="{type: 'audio'}">
            <el-button size="small">选择音频</el-button>
          </el-upload>
        </el-col>
      </el-row> -->

    </el-form>

  </div>
</template>

<script>
  import api from '../../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'business_accountDetail',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        sceneMap: {
          'SceneJK4Z1E': '开户OCR识别',
          'SceneMEQGXM': '开户视频检测',
          'SceneDTXWDA': '开户初审'
        },
        progress: {
          mediaAudioUrl: 0,
          mediaBankCardUrl: 0,
          mediaIdCardHeadUrl: 0,
          mediaIdCardEmblemUrl: 0,
          mediaFaceImgUrl: 0,
          mediaLivenessVideoUrl: 0,
          mediaOpenAccountFileUrl: 0
        },
        form: {
          openAccountType: '人工',
          applyNo: '',
          openAccountWay: '人工',
          scene: 'SceneJK4Z1E',
          channel: '互联网',
          operator: '李白',
          name: '林很',
          birthday: '1988-10-10',
          gender: '男',
          nation: '汉',
          idNo: '441522198404060718',
          phone: '13723728036',
          bankName: '中国建设银行',
          bankCardNo: '6227007200480482142',
          profession: '工人',
          education: '本科',
          income: '1万',
          companyName: '民营',
          inhabitantType: '普通',
          controlPerson: '杜普',
          address: '深圳市南山区科技生态园',
          shenA: '新开账号',
          shenShareholderNum: 'shenA001',
          huA: '新开账号',
          huShareholderNum: 'huA001',
          entrustWay: '人工',
          badCreditRecord: '无',
          riskLevel: '低',
          evaluationScore: '90',
          accountPwd: '1234567890',
          residentType: '中国税收居民',
          evaluateScore: '80',
          relationship: '朋友',
          secondContactPhone: '12345678910',
          secondContactName: 'li',
          messageChannel: '短信',
          secondBoardMarket: '新开账号',
          shenTAAccount: '新开账号',
          detailAddress: '广东省深圳市南山区科技生态园',
          contactAddress: '广东省深圳市南山区科技生态园XX-XX',
          industry: '房地产',
          position: '打杂',
          mediaAudioUrl: '',
          mediaBankCardUrl: '',
          mediaIdCardHeadUrl: '',
          mediaIdCardEmblemUrl: '',
          mediaFaceImgUrl: '',
          mediaLivenessVideoUrl: '',
          mediaOpenAccountFileUrl: ''
        },
        rules: rules,
        industry: [
          "房地产",
          "律师会计",
          "批发零售",
          "进出口贸易",
          "卡拉OK",
          "彩票销售",
          "贵金属，珠宝行",
          "艺术品，古董行",
          "汇款机构，外币",
          "金融业",
          "餐饮业",
          "农、林、渔业",
          "学生",
          "自由业",
          "退休",
          "国家机关政党"
        ],
        companyName: [
          "私企",
          "民营",
          "国企",
          "事业单位",
          "个体户",
          "政府机构"
        ],
        accountType: [
          "无",
          "新开账号",
          "下挂股东号"
        ],
        residentType: [
          "中国税收居民",
          "非中国税收居民"
        ]
      };
    },
    mounted () {
      
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          add: 'business_accountAdd_add'
        });
      }
    },
    methods: {
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
          this.progress[type] = parseInt(event.percent, 10);
          if (event.percent == 100) {
            setTimeout(() => {
              this.progress[type] = 0;
            }, 500);
          }
        }
        console.log('event:', event);
      },
      avatarSuccess(res, file, files, type){
        console.log(res);
        if (res.code != 0) {
          this.$message.error('上传图片失败' + res.msg);
          return;
        }
        this.$message.success('上传成功' + res.msg);
        this.form[type] = res.data.url;
      },
      avatarError(err, file, fileList) {
        this.$message.error('上传图片失败' + err);
      },

      submitForm() {
        this.$refs["accountForm"].validate(valid => {
          if (valid) {
            let params = Object.assign({}, this.form);

            // 新增
            api.addBusinessAccount(params).then(res => {
              let data = res.data;
              if (data && data.code === "0") {
                this.$message({
                  type: "success",
                  message: "新增成功!"
                });

                this.$router.push('/risk_system/business/account');

                // 记录日志
                bsmp.log({
                  component: "risk_system",
                  type: "add",
                  content: `[Business] params: ${JSON.stringify(params)}`
                });
              }
            });
          }
        })
      }
    }
  };

  // 表单规则
  let rules = {
    applyNo: [
      {required: true, message: '请输入申请单号', trigger: 'blur'}
    ],
    idNo: [
      {required: true, message: '请输入身份证', trigger: 'blur'}
    ],
    name: [
      {required: true, message: '请输入姓名', trigger: 'blur'}
    ],
    phone: [
      {required: true, message: '请输入电话号码', trigger: 'blur'}
    ],
    openAccountWay: [
      {required: true, message: '请输入开户方式', trigger: 'blur'}
    ],
    operator: [
      {required: true, message: '请输入业务方人员', trigger: 'blur'}
    ],
    channel: [
      {required: true, message: '请输入入口渠道', trigger: 'blur'}
    ],
    openAccountType: [
      {required: true, message: '请输入开户类型', trigger: 'blur'}
    ]
  };
</script>
<style lang="stylus" scoped>
  .form-co {
    overflow-y: scroll;
  }

  .row-co {
    padding: 10px;

    .label {
      text-align: right;
    }

    .text {
      text-align: left;
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

  .block_bar {
    color: #4096ff;
    padding-top: 5px;
    border-top: 1px solid #dfe6ec;
  }

  .b-form {
    border: 1px solid #dfe6ec;
    border-radius: 4px;
    padding: 10px 20px 10px 10px;
    width: 90%;
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

  .m-icon-video {
    background: url('../../../../../assets/icons/video.svg') no-repeat center center;
    background-size: contain;
  }

  .m-icon-audio {
    background: url('../../../../../assets/icons/audio.svg') no-repeat center center;
    background-size: contain;
  }

  .el-select  {
    width: 100%;
  }

</style>
