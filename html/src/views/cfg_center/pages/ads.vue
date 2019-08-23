<template>
  <div>
    <el-row>
      <el-col :span="18">
        <el-tabs v-model="activeName" @tab-click="switchTab">
          <el-tab-pane label="启动页" name="start_page"></el-tab-pane>
          <el-tab-pane label="全屏广告" name="full_screen"></el-tab-pane>
          <el-tab-pane label="广告位" name="advertising"></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col v-show="optAuth.publish" :span="6" class="publish-row">
        {{publishTimeStr}}&nbsp;&nbsp;
        <el-button title="发布" type="info" @click="publish">
          <i class="icon-paper-plane"></i>&nbsp;&nbsp;发布
        </el-button>
      </el-col>
    </el-row>

    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.adGroup" placeholder="广告分组">
            <el-option label="默认分组" value="0"></el-option>
            <el-option v-for="(group, index) in adGroups" :label="group.name" :value="group.id"
                       :key="'search-adGroup-'+ index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.clientType" placeholder="应用类型">
            <el-option v-for="(val, key) in clientTypeMap" :label="val" :value="key"
                       :key="'search-clientType-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.validType" placeholder="有效期">
            <el-option v-for="(val, key) in validTypeMap" :label="val" :value="key"
                       :key="'search-validType-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.isEnable" placeholder="状态">
            <el-option v-for="(val, key) in isEnableMap" :label="val" :value="key"
                       :key="'search-isEnable-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.packageType" placeholder="包类型">
            <el-option v-for="(val, key) in packageTypeMap" :label="val" :value="key"
                       :key="'search-packageType-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="activeName === 'advertising'">
          <el-select clearable v-model="search.customerType" placeholder="适用账户">
            <el-option v-for="(val, key) in customerTypeMap" :label="val" :value="key"
                       :key="'search-customerType-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="activeName === 'advertising'">
          <el-select clearable v-model="search.displayPos" placeholder="广告显示位置">
            <el-option v-for="(val, key) in adDisplayPosMap" :label="val" :value="key"
                       :key="'search-displayPos-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="activeName === 'advertising'">
          <el-select clearable v-model="search.category" placeholder="广告类别">
            <el-option v-for="(val, key) in categoryMap" :label="val" :value="key"
                       :key="'search-category-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="optAuth.channel">
          <el-select clearable v-model="search.channel" placeholder="渠道">
            <el-option v-for="ch in channels" :label="ch.channel" :value="ch.channel"
                       :key="'search-channel-'+ ch.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button v-show="optAuth.view" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-row class="toolbar">
      <el-button v-show="optAuth.curd" @click="showDialog(1)" type="primary">新增</el-button>
      <el-button v-show="optAuth.batch" @click="multiple('delete')" type="danger">删除</el-button>
      <el-button v-show="optAuth.batch" @click="multiple('enable')" type="primary">启用</el-button>
      <el-button v-show="optAuth.batch" @click="multiple('disable')">停用</el-button>
    </el-row>

    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 260"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        fixed
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="ID"
        width="60">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        label="名称"
        width="180" sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="validType"
        label="状态"
        width="80">
        <template slot-scope="scope">
          <i v-if="scope.row.validType === 'active'" class="icon icon-ok-circled enable-green"></i>
          <i v-else class="icon icon-attention-alt enable-red"></i>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="isPublish"
        label="发布状态"
        width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.isPublish === 1">已发布</span>
          <span v-else>未发布</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="adGroup"
        :formatter="adGroupFmt"
        label="广告分组"
        width="120">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="clientType"
        label="应用平台"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="channels"
        label="渠道"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="displayPos"
        label="位置"
        :formatter="positionName"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="category"
        label="类别"
        :formatter="categoryFmt"
        width="80">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="vestName"
        label="包类型"
        width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.vestName">马甲包</span>
          <span v-else>主包</span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="customerType"
        label="适用账户"
        :formatter="customerTypeFmt"
        width="150">
      </el-table-column>
      <el-table-column
        width="150"
        label="图片">
        <template slot-scope="scope">
          <img v-if="scope.row.adPics" v-for="item in scope.row.adPics"
               v-show="item.url"
               :src="item.url"
               :key="'ad-img' + item.url"
               class="min-img"
               @click="showImage(item)"
          ></template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="validStart"
        label="有效期"
        width="150"
        :formatter="validTime">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="publishTime"
        width="200"
        label="发布时间">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="modifiedTime"
        width="200"
        label="更新时间">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="modifier"
        width="150"
        label="更新人">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.curd" @click="showDialog(2, scope.$index)" type="info" icon='edit'
                     size="mini"></el-button>
          <el-button title="启用" @click="activeItem(scope.row.id)" v-show="optAuth.batch && scope.row.isEnable === 0" size="mini">
            <i class="icon-play"></i>
          </el-button>
          <el-button title="禁用" @click="disableItem(scope.row.id)" v-show="optAuth.batch && scope.row.isEnable === 1" size="mini">
            <i class="icon-stop"></i>
          </el-button>
          <el-button title="删除" v-show="optAuth.batch" @click="deleteItem(scope.row.id)" type="danger" icon='delete'
                     size="mini"></el-button>
          <el-button title="下载文件" v-show="scope.row.isPublish === 1" type="primary" size="small"><a
            :href="scope.row.jsonFilePath" target="_blank" class="download-link" download="w3logo"><i
            class="icon-download"></i>下载</a></el-button>
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
      <el-form ref="adsForm" :model="dialog.form" :rules="rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="广告名称：" prop="name">
              <el-input v-model="dialog.form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="应用平台：" prop="clientType">
              <el-radio class="radio" v-model="dialog.form.clientType"
                        v-for="(val, key) in clientTypeMap"
                        :key="'add-form-clientType-'+ key"
                        :label="key">{{val}}
              </el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="启动：" prop="isEnable">
              <el-switch
                v-model="dialog.form.isEnable"
                on-text="开启"
                off-text="停用"
                :on-value="1"
                :off-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="有效期：" prop="expiryDateType">
              <el-radio class="radio" v-model="dialog.form.expiryDateType" :label="1">不过期</el-radio>
              <el-radio class="radio" v-model="dialog.form.expiryDateType" :label="2">自定义时间</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="dialog.form.expiryDateType === 2" :gutter="20">
          <el-col :span="12" :offset="2">
            <el-form-item>
              <el-date-picker
                v-model="dialog.form.expiryDate"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                placeholder="选择日期范围">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="14">
            <el-form-item label="适用账户：" prop="customerType">
              <el-checkbox-group v-model="dialog.form.customerType">
                <!-- <el-checkbox v-for="(val, key) in customerTypeMap" :label="key" :disabled="activeName !== 'advertising'"
                             :key="'add-form-customerType-'+ key">{{val}}
                </el-checkbox> -->
                <el-checkbox v-for="(val, key) in customerTypeMap" :label="key" :disabled="checkedCustomerType" :key="'add-form-customerType-'+ key">{{val}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="广告分组：" prop="adGroup">
              <el-select v-model="dialog.form.adGroup" filterable placeholder="广告分组">
                <el-option label="默认分组" value="0"></el-option>
                <el-option v-for="(group, index) in adGroups" :label="group.name" :value="group.id"
                           :key="'add-form-adGroup-'+ index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="广告位置：" prop="displayPos">
              <el-select v-model="dialog.form.displayPos" filterable placeholder="广告位置"
                         :disabled="activeName !== 'advertising'">
                <el-option v-for="(val, key) in displayPosMap" :label="val" :value="key"
                           :key="'add-form-displayPos-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="广告类别：" prop="category">
              <el-select v-model="dialog.form.category" filterable placeholder="广告类别"
                         :disabled="activeName !== 'advertising'">
                <el-option v-for="(val, key) in categoryMap" :label="val" :value="key"
                           :key="'add-form-category-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="包类型：">
              <el-select clearable v-model="dialog.form.packageType" placeholder="包类型" :disabled="dialog.type === 2">
                <el-option v-for="(val, key) in packageTypeMap" :label="val" :value="key"
                           :key="'add-form-packageType-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="dialog.form.packageType === 'vest'">
            <el-form-item label="马甲包：">
              <el-select v-model="dialog.form.vestName" filterable clearable
                         placeholder="马甲包">
                <el-option v-for="config in configs" :label="config.vestName" :value="config.vestName"
                           :key="'add-form-vestName-'+ config.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="渠道：" prop="channels">
              <el-input v-model="dialog.form.channels" placeholder="多渠道以,号间隔" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="dialog.form.remark" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="广告类型：" prop="type">
              <el-radio class="radio" v-model="dialog.form.type"
                        v-for="(val, key) in typeMap"
                        :key="'add-form-type-'+ key"
                        :label="key">{{val}}
              </el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="标题：" prop="title">
              <el-input v-model="dialog.form.title" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="内容：" prop="content">
              <el-input v-model="dialog.form.content" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-show="dialog.form.type === '1'">
          <el-col :span="20">
            <el-form-item label="外链URL地址：" prop="link">
              <el-input v-model="dialog.form.linkUrl" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="row" v-show="dialog.form.type === '2'">
          <el-col :offset="5" :span="14" class="tip-msg">{{showImgTipMsg}}</el-col>
        </el-row>
        <el-row :gutter="20" v-show="dialog.form.type === '2'">
          <el-col :span="22">
            <el-form-item label="图片：">
              <el-row class="img-row" :gutter="10" v-for="(item, index) in dialog.form.adPics"
                      :key="'add-form-adPics-'+ index">
                <el-col :span="12">
                  <div class="upload-img">
                    <img v-if="item.url" :src="item.url">
                    <img v-else src="static/images/ewm.png">
                  </div>
                </el-col>
                <el-col :span="7" prop="imgUrl">
                  <el-form-item>
                    <el-upload
                      v-show="optAuth.upload"
                      :action="uploadFile.uploadFileUrl"
                      :show-file-list="false"
                      :on-success="(response, file, fileList) => {avatarSuccess(response, file, fileList, item)}"
                      :before-upload="beforeUpload"
                      :on-error="avatarError"
                      :data="uploadFile.uploadFileImg"
                    >
                      <el-button size="small">选择图片</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-button type="primary" icon="plus" size="small"
                             @click="addImage('plus',item)"></el-button>
                  <el-button v-if="index !== 0" type="warning" icon="delete" size="small"
                             @click="addImage('delete',item)"></el-button>
                </el-col>
                <el-col :span="20">
                  <el-form-item label="标题：" label-width="60px">
                    <el-input v-model="item.title" placeholder="点击图片后显示的标题"></el-input>
                  </el-form-item>
                  <el-form-item label="地址：" label-width="60px">
                    <el-input v-model="item.link" placeholder="图片链接至的URL地址"></el-input>
                  </el-form-item>
                  <el-form-item label="排序：" label-width="60px">
                    <el-input-number v-model="item.sort" :min="0"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
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
  export default {
    name: 'ads',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        activeName: 'start_page',
        channels: null,
        publishTime: null,
        search: {
          clientType: null,
          validType: null,
          isEnable: null,
          packageType: null,
          name: '',
          customerType: null,
          displayPos: null,
          category: null,
          channel: null,
          adGroup: null
        },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          }
        },
        rules: rules,
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          title: '',
          form: {
            id: null,
            clientType: null,
            adType: null,
            channels: '',
            displayPos: null,
            name: '',
            isEnable: 1,
            customerType: [],
            expiryDateType: 1,
            expiryDate: null,
            validStart: null,
            validEnd: null,
            remark: '',
            content: '',
            category: '1',
            packageType: 'main',
            vestName: '',
            type: '',
            title: '',
            adGroup: '0',
            adPics: [{
              url: '',
              link: '',
              title: '',
              sort: 0
            }],
            linkUrl: ''
          }
        },
        uploadFile: {
          uploadFileUrl: api.uploadUrl,
          uploadFileImg: {
            type: "AD",
            token: bsmp.util.getToken()
          }
        },
        clientTypeMap: {
          'ios': 'IOS',
          'android': 'Android',
          'pcui': 'PCUI',
          'cj_ios': 'CJ_IOS',
          'cj_android': 'CJ_Android'
        },
        validTypeMap: {
          'active': '有效',
          'unactive': '未生效',
          'expired': '已过期'
        },
        isEnableMap: {
          '0': '禁用',
          '1': '启用'
        },
        customerTypeMap: {
          'real':'真实',
          'realA':'真实A',
          'realN':'真实N',
          'simulation': '模拟',
          'guest': '游客'
        },
        displayPosMap: {},
        otherDisplayPosMap: {},
        adDisplayPosMap: {},
        categoryMap: {
          '1': '链接',
          '2': '分享'
        },
        packageTypeMap: {
          'main': '主包',
          'vest': '马甲包'
        },
        typeMap: {
          '1': '文字广告',
          '2': '图片广告'
        },
        configs: [],
        adGroups: null,
        multipleSelection: [],
      };
    },
    mounted () {
      this.getChannels();
      this.getPublishTime();
      this.getConfigs();
      Promise.all([this.getAdGroups(), this.getAdSiteList()]).then(() => {
        this.switchTab();
      });
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          view: 'app_args_ads_view',
          curd: 'app_args_ads_curd',
          publish: 'app_args_ads_publish',
          batch: 'app_args_ads_batch',
          channel: 'app_args_ads_channel',
          upload: 'app_args_ads_upload'
        });
      },
      checkedCustomerType() {
        let companyId=bsmp.util.getUserInfo().companyId;
        if(["hx","hxfx","8bx"].includes(companyId)){
           return false;
        }else{
           delete this.customerTypeMap['realA'];
           delete this.customerTypeMap['realN'];
        }
        return this.activeName !== 'advertising';
      },
      publishTimeStr() {
        let time = '最新发布时间：';
        if (!this.publishTime) {
          return time;
        }
        switch (this.activeName) {
          case 'start_page':
            time = time + this.publishTime['startPage'];
            break;
          case 'full_screen':
            time = time + this.publishTime['fullScreen'];
            break;
          case 'advertising':
            time = time + this.publishTime['advertising'];
            break;
        }
        return time;
      },
      showImgTipMsg(){
        let imgTipMsg = {
          "1": {
            android: '1张，尺寸：720*1152',
            ios: '1张，尺寸：1080*1920',
          },
          "2": {
            android: '5张轮播，可视需要添加有头部，尺寸：720*200无头部，尺寸：720*267',
            ios: '5张轮播，可视需要添加有头部，尺寸：1080*300无头部，尺寸：1080*400',
          },
          "3": {
            android: '1张，尺寸：720*100',
            ios: '1张，尺寸：1080*150',
          },
          "4": {
            android: '1张，尺寸：600*800',
            ios: '1张，尺寸：720*960',
          },
          "5": {
            android: '1张，尺寸：720*1152',
            ios: '1张，尺寸：1080*1920',
          },
          "6": {
            android: '1张，尺寸：720*1152',
            ios: '1张，尺寸：1080*1920',
          },
          "7": {
            android: '1张，尺寸：720*1152',
            ios: '1张，尺寸：1080*1920',
          },
          "8": {
            android: '1张，尺寸：720*1152',
            ios: '1张，尺寸：1080*1920',
          },
          "9": {
            android: '1张，尺寸：720*1152',
            ios: '1张，尺寸：1080*1920',
          },
        };
        if (this.dialog.form.displayPos) {
          if (imgTipMsg[this.dialog.form.displayPos]) {
            return imgTipMsg[this.dialog.form.displayPos][this.dialog.form.clientType];
          }
        }
        return '';
      }
    },
    methods: {
      beforeUpload(file){
//        let isImg = (file.type === 'image/jpeg' || file.type === 'image/png');
//        if (!isImg) {
//          this.$message.error('上传图片格式只能是png或者jpg!');
//        }
        if (this.optAuth.upload) {
          return true;
        } else {
          this.$message.warning('无上传图片权限！');
          return false;
        }
      },
      avatarSuccess(res, file, files, item){
        if (res.code !== 0) {
          this.$message.error('上传图片失败' + res.msg);
          return;
        }
        this.$message.success('上传成功' + res.msg);
        item.url = res.data.url;
      },
      avatarError(err, file, fileList) {
        this.$message.error('上传图片失败' + err);
      },
      addImage(type, data) {
        if (type === "plus") {
          this.dialog.form.adPics.push({
            url: null,
            link: null,
            title: null,
            sort: this.dialog.form.adPics.length
          })
        } else if (type === "delete") {
          this.dialog.form.adPics.splice(this.dialog.form.adPics.indexOf(data), 1);
        }
      },
      /**
       * 格式化
       * */
      positionName (row) {
        return typeof row.displayPos !== 'undefined' ? this.displayPosMap[row.displayPos] : '';
      },
      validTime(row) {
        return row.validStart ? row.validStart + '-' + row.validEnd : '不过期';
      },
      customerTypeFmt(row) {
        let result = [];
        if (row.customerType) {
          let arr = row.customerType.split(",");
          arr.forEach(item => {
            result.push(this.customerTypeMap[item]);
          })
        }

        return result.join(',');
      },
      adGroupFmt(row) {
        let group = '默认分组';
        if (row.adGroup && this.adGroups && this.adGroups.length) {
          for (let i = 0, len = this.adGroups.length; i < len; i++) {
            if (row.adGroup === this.adGroups[i].id) {
              group = this.adGroups[i].name;
              break;
            }
          }
        }
        return group;
      },
      categoryFmt (row) {
        return typeof row.category !== 'undefined' ? this.categoryMap[row.category] : '';
      },

      /**
       * 广告位置列表
       * */
      getAdSiteList() {
        return api.getAdSiteList({pageNo: 0, pageSize: 1000, status: 1}).then((res) => {
          let data = res.data;
          if (data && data.code === 0) {

            let items = data.data.list;
            items.forEach((item) => {
              if (item.siteCode === 4 || item.siteCode === 5) {
                this.otherDisplayPosMap[item.siteCode] = item.siteName;
              } else {
                this.adDisplayPosMap[item.siteCode] = item.siteName;
              }
            });
          }
        });
      },

      /**
       * 广告位置字典
       * */
      getDisplayPosDict() {
        return bsmp.util.getDictByCode('ad_display_pos').then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            let displayPos = data.data;
            if (displayPos) {
              displayPos.forEach((item) => {
                if (item.value === '4' || item.value === '5') {
                  this.otherDisplayPosMap[item.value] = item.name;
                } else {
                  this.adDisplayPosMap[item.value] = item.name;
                }
              });
            }
          }
        });
      },

      switchTab() {
        this.table.items = [];
        this.table.pager.pageNo = 1;
        this.table.pager.total = 0;

        if (this.activeName === 'start_page' || this.activeName === 'full_screen') {
          this.displayPosMap = this.otherDisplayPosMap;
          this.categoryMap = {
            '1': '链接'
          };
        } else {
          this.displayPosMap = this.adDisplayPosMap;
          this.categoryMap = {
            '1': '链接',
            '2': '分享'
          };
        }
        this.query();
      },
      showImage(row) {
        this.$msgbox({
          title: '图片预览',
          customClass: 'm-message-box-img',
          message: this.$createElement('img', {style: 'color: teal', attrs: {src: row.url}}),
        }).catch(() => {

        });
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        this.dialog.show = true;

        if (this.$refs['adsForm'] && this.$refs['adsForm'].resetFields) {
          this.$refs['adsForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '编辑';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = JSON.parse(JSON.stringify(this.table.items[index]));

          if (form.customerType) {
            form.customerType = form.customerType.split(',');
          }
          if (!form.validStart) {
            form.expiryDateType = 1;
            form.expiryDate = null;
          } else {
            form.expiryDateType = 2;
            form.expiryDate = [];
            form.expiryDate[0] = bsmp.util.formatDate.parse(form.validStart.replace('.0', ''), 'yyyy-MM-dd hh:mm:ss');
            form.expiryDate[1] = bsmp.util.formatDate.parse(form.validEnd.replace('.0', ''), 'yyyy-MM-dd hh:mm:ss');
          }

          // 空图片列表
          if (form.adPics.length <= 0) {
            form.adPics.push({
              url: null,
              link: null,
              title: null,
              sort: 0
            });
          }

          if (!form.type) {
            form.type = '2';
          }

          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          let form = {
            clientType: null,
            adType: null,
            channels: '',
            displayPos: null,
            name: '',
            isEnable: 1,
            customerType: [],
            expiryDateType: 1,
            expiryDate: null,
            validStart: null,
            validEnd: null,
            remark: '',
            content: '',
            category: '1',
            packageType: 'main',
            vestName: '',
            type: '',
            title: '',
            adGroup: '0',
            adPics: [{
              url: '',
              link: '',
              title: '',
              sort: 0
            }],
            linkUrl: ''
          };

          if (this.activeName === 'start_page') {
            form.displayPos = '4';
          } else if (this.activeName === 'full_screen') {
            form.displayPos = '5';
          }

          if (this.activeName !== 'advertising') {
            form.customerType = ['real', 'simulation', 'guest'];
          }

          this.dialog.form = form;
        }

      },
      submitForm() {
        this.$refs['adsForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.dialog.form);

            if (params.packageType === 'vest' && !params.vestName) {
              this.$message.warning('请选马甲包！');
              return;
            }
            // 有效期方式，自定义时间
            if (params.expiryDateType === 2) {
              if (params.expiryDate) {
                params.validStart = bsmp.util.formatDate.format(params.expiryDate[0], 'yyyy-MM-dd hh:mm:ss');
                params.validEnd = bsmp.util.formatDate.format(params.expiryDate[1], 'yyyy-MM-dd hh:mm:ss');
              } else {
                this.$message.warning('请选择自定义时间！');
                return;
              }
            } else {
              params.validStart = '';
              params.validEnd = '';
            }
            params.customerType = params.customerType.join(',');

            if (this.dialog.type === 1) {
              params.adType = this.activeName;
              params.action = 'create';

              // 新增
              api.curdAds(params).then((res) => {
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
                    content: `[Ads] params: ${JSON.stringify(params)}`
                  });
                }
              });
            } else {
              // 修改
              params.action = 'update';
              api.curdAds(params).then((res) => {
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
                    content: `[Ads] params: ${JSON.stringify(params)}`
                  });
                }
              });
            }
          } else {
            return false;
          }
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      publish() {
        api.publish({adType: this.activeName}).then((res) => {
          let data = res.data;
          if (data && data.code === 0) {
            this.$message.success('发布成功!');
            this.query();

            // 记录日志
            bsmp.log({
              component: 'cfg_center',
              type: 'publish',
              content: `[Ads] params: ${JSON.stringify({adType: this.activeName})}`
            });

            this.getPublishTime();
          }
        });
      },
      multiple (action) {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要操作的记录!'
          });
          return;
        }

        let compareKey = 'isEnable', compareVal = 0, hasError = false;
        if (action === 'enable') {
          compareKey = 'isEnable';
          compareVal = 1;
        } else if (action === 'disable') {
          compareKey = 'isEnable';
          compareVal = 0;
        }

        let ids = [];
        for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
          if (compareKey && this.multipleSelection[i][compareKey] === compareVal) {
            hasError = true;
            break;
          }
          ids.push(this.multipleSelection[i].id);
        }

        if (hasError) {
          this.$message.warning('您选择的数据中包含已经' + (action === 'enable' ? '启动' : '禁用') + '的记录！');
          return;
        }
        this.$confirm('确定要处理选中记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.batch({action, ids: ids.join(',')}).then((res) => {
            let data = res.data;
            if (data && data.code === 0) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'cfg_center',
                type: 'batch',
                content: `[Ads] params: ${JSON.stringify({action, ids: ids.join(',')})}`
              });
            }
          });
        }).catch(e => {
        });

      },

      /**
       * 启用
       * */
      activeItem (id) {
        this.$confirm('确定要启用该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.batch({ids: id, action: 'enable'}).then((res) => {
            let data = res.data;
            if (data && data.code === 0) {
              this.$message({
                type: 'success',
                message: '启用成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'cfg_center',
                type: 'batch',
                content: `[Ads] params: ${JSON.stringify({ids: id, action: 'enable'})}`
              });
            }
          });
        }).catch(e => {
        });
      },
      /**
       * 禁用
       * */
      disableItem (id) {
        this.$confirm('确定要禁用该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.batch({ids: id, action: 'disable'}).then((res) => {
            let data = res.data;
            if (data && data.code === 0) {
              this.$message({
                type: 'success',
                message: '禁用成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'cfg_center',
                type: 'batch',
                content: `[Ads] params: ${JSON.stringify({ids: id, action: 'disable'})}`
              });
            }
          });
        }).catch(e => {
        });
      },
      /**
       * 删除
       * */
      deleteItem (id) {
        this.$confirm('确定要删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.batch({ids: id, action: 'delete'}).then((res) => {
            let data = res.data;
            if (data && data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'cfg_center',
                type: 'batch',
                content: `[Ads] params: ${JSON.stringify({ids: id, action: 'delete'})}`
              });
            }
          });
        }).catch(e => {
        });
      },
      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        params.adType = this.activeName;

        if (this.activeName === 'advertising') {
          if (this.search.customerType) {
            params.customerType = this.search.customerType;
          }
          if (this.search.displayPos) {
            params.displayPos = this.search.displayPos;
          }
        }

        params = Object.assign({}, params, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getAds(params).then((res) => {
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
      getAdGroups() {
        api.getAdGroupList().then((res) => {
          let data = res.data;
          if (data && data.code === 0) {
            this.adGroups = data.data
          }
        });
      },
      getChannels() {
        api.getChannels().then((res) => {
          let data = res.data;
          if (data && data.code === 0) {
            this.channels = data.data.list;
          }
        });
      },
      getConfigs() {
        let types = ['vest', 'vest_p'];
        types.forEach((type) => {
          api.getConfigs({type, pageNo: 0, pageSize: 10000}).then((res) => {
            let data = res.data;
            if (data && data.code === 0) {
              this.configs = this.configs.concat(data.data.list);
            }
          });
        });
      },
      getPublishTime() {
        api.getPublishTime('ad').then((res) => {
          let data = res.data;
          if (data && data.code === 0) {
            this.publishTime = data.data;
          }
        });
      },
      cancelForm() {
        this.dialog.show = false;
      }
    }
  };

  // 表单规则
  let rules = {
    name: [{required: true, message: '内容不能为空', trigger: 'blur'}],
    clientType: [
      {required: true, message: '请选应用平台', trigger: 'change'}
    ],
    expiryDateType: [
      {required: true, type: 'number', message: '请选有效期方式', trigger: 'change'}
    ],
    customerType: [
      {type: 'array', required: true, message: '请至少选择一个适用账户', trigger: 'change'}
    ],
    displayPos: [
      {required: true, message: '请选择广告显示位置', trigger: 'change'}
    ],
    category: [
      {required: true, message: '请选择广告类别', trigger: 'change'}
    ],
    imgUrl: [
      {required: true, message: '请选择图片', trigger: 'change'}
    ],
    type: [
      {required: true, message: '请选广告类型', trigger: 'change'}
    ]
  };
</script>
<style lang="stylus" scoped>
  .enable-red
    color: red

  .enable-green
    color: green

  .tip-msg
    padding: 5px 5px 20px 5px;

  .min-img
    width: auto;
    height: 50px;
    cursor: pointer;

  .upload-img
    display: inline-block;
    width: 150px;
    height: auto;
    img
      width: 100%;
      height: 100%;

  .img-row
    border: 1px solid #dfe6ec;
    border-radius: 4px;
    padding: 10px;
    margin: 10px;
    .el-form-item
      padding-bottom: 10px;
      font-size: 10px;
  .publish-row
    padding: 0 16px
    height: 42px
    box-sizing: border-box
    line-height: 42px
    border-bottom: 1px solid rgb(209, 219, 229)
</style>
