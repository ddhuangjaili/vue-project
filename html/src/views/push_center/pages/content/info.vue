<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select clearable v-model="search.pushSpot" placeholder="推送位置">
            <el-option v-for="s in spotMap" :label="s.name" :value="s.code"
                       :key="'search-pushSpot-'+ s.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.pushType" placeholder="推送位置">
            <el-option v-for="s in typeMap" :label="s.name" :value="s.code"
                       :key="'search-pushType-'+ s.code"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-select v-model="search.timeType" placeholder="时间">-->
        <!--<el-option label="发布时间" :value="1"></el-option>-->
        <!--<el-option label="推送时间" :value="2"></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.date"
            type="daterange"
            placeholder="发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.approvalStatus" placeholder="审核状态">
            <el-option v-for="(val, key) in approvalStatusMap" :label="val" :value="key"
                       :key="'search-approvalStatus-'+ val"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
          <el-button @click="clearSearch" type="primary">重置</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-tabs v-model="activeName" @tab-click="switchTab">
      <el-tab-pane label="所有的" name="all"></el-tab-pane>
      <el-tab-pane label="我发布的" name="publisher"></el-tab-pane>
      <el-tab-pane label="我审批的" name="approver"></el-tab-pane>
      <el-tab-pane label="我执行的" name="executor"></el-tab-pane>
    </el-tabs>
    <el-row class="toolbar">
      <el-button v-show="optAuth.add" @click="showDialog(1)" type="primary">新增</el-button>
      <el-button v-show="optAuth.batchDel" @click="batchDelete()" type="danger">删除</el-button>
      <el-button v-show="optAuth.add" @click="toggleImportXlsx()" type="primary"><i class="icon-upload"></i>&nbsp;&nbsp;导入</el-button>
      <a id="download-btn" download="内容推送.xls" href="#"
         @click="exportExcel"
         class="el-button el-button--small el-button--small export-btn"><i class="icon-download"></i>&nbsp;&nbsp;导出</a>

      <el-button v-show="optAuth.execute && activeName === 'executor'" title="发送" @click="toExecute()" type="info"
                 class="handle-btn">
        <i class="icon-paper-plane"></i>&nbsp;&nbsp;发送

      </el-button>
      <el-button v-show="optAuth.approve && activeName === 'approver'" @click="toApprove('cancel')" title="审核不通过"
                 type="danger" class="handle-btn">
        <i class="icon-attention-alt"></i>&nbsp;&nbsp;审核不通过

      </el-button>
      <el-button v-show="optAuth.approve && activeName === 'approver'" @click="toApprove('approve')" title="审核通过"
                 type="success" class="handle-btn">
        <i class="icon-ok-circled"></i>&nbsp;&nbsp;审核通过

      </el-button>
      <el-button v-show="optAuth.add" @click="isOpenPushConfigMamager=true" type="primary"><i class="icon-upload"></i>&nbsp;&nbsp;推送配置管理</el-button>
    </el-row>

    <el-table
      id="tableExcel"
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 225"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        fixed
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createDate"
        label="发布时间"
        width="120"
        :formatter="createDateFmt">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="channel"
        label="推送渠道"
        width="200"
        :formatter="channelFmt">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="pushSpot"
        label="推送位置"
        width="200"
        :formatter="spotFmt">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="pushTime"
        label="推送时间"
        width="120"
        :formatter="pushTimeFmt">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="pushType"
        label="推送类型"
        width="200"
        :formatter="typeFmt">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="clientType"
        label="客户类型"
        width="200"
        :formatter="clientTypeFmt">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="title"
        label="标题"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="content"
        :formatter="contentFmt"
        label="内容"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="publisher"
        label="发布人"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="approver"
        label="审核人"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="executor"
        label="执行人"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="approvalStatus"
        label="审核状态"
        width="150"
        :formatter="approvalStatusFmt">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="sendStatus"
        label="发送状态"
        width="150"
        :formatter="sendStatusFmt">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注"
        width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button :title="scope.row.approvalStatus == 1 ? '已审核不允许编辑' : '编辑'" v-show="optAuth.edit" type="info" icon='edit' size="mini" :disabled="scope.row.approvalStatus == 1"
                     @click="showDialog(2, scope.$index)"></el-button>
          <el-button title="删除" v-show="optAuth.del" type="danger" icon='delete' size="mini"
                     @click="deleteItem(scope.row._id)"></el-button>
          <el-button @click="showDialog(3, scope.$index)" size="mini" title="查看详情"><i class="icon-eye"></i></el-button>
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

    <!-- 内容详情弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" @open="updateAttachFileName" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="infoForm" v-loading="dialog.loading" :model="dialog.form" :rules="dialog.rules" label-width="90px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="状态：">
              <span v-if="dialog.form.approvalStatus === 0">待审核</span>
              <span v-else-if="dialog.form.approvalStatus === 2">已取消</span>
              <span v-else-if="dialog.form.approvalStatus === 1 && dialog.form.sendStatus === 0">未发送</span>
              <span v-else-if="dialog.form.approvalStatus === 1 && dialog.form.sendStatus === 1">已发送</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布时间：">
              <span>{{dialogTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布人：" prop="publisher">
              <el-input v-model="dialog.form.publisher" auto-complete="off" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="标题：" prop="title">
              <el-input v-model="dialog.form.title" auto-complete="off" :maxlength="30"
                        :readonly="dialog.type === 3"></el-input>
              <span v-show="dialog.form.title" class="input-tip">已输入{{dialog.form.title.length}}个字符</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审核人：" prop="approver">
              <el-select clearable v-model="dialog.form.approver" :disabled="dialog.type === 3" placeholder="审核人">
                <el-option v-for="u in approvers" :label="u.userName" :value="u.loginName"
                           :key="'add-form-approver-'+ u.loginName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行人：" prop="executor">
              <el-select clearable v-model="dialog.form.executor" :disabled="dialog.type === 3" placeholder="执行人">
                <el-option v-for="u in executors" :label="u.userName" :value="u.loginName"
                           :key="'add-form-executor-'+ u.loginName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="推送类型：" prop="pushType">
              <el-select clearable multiple v-model="dialog.form.pushType" :disabled="dialog.type === 3"
                         placeholder="推送类型">
                <el-option v-for="c in typeMap" :label="c.name" :value="c.code"
                           :key="'add-form-pushType-'+ c.code" v-show="c.isActive === 1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="推送配置：">
            <el-table
              v-show="dialogPushConfigList.length > 0"
              show-header
              fit
              :data="dialogPushConfigList">
              <el-table-column
                prop="channel"
                :formatter="(a, b, val)=>channelMap[val] ? channelMap[val].name: val"
                label="推送渠道"
                ></el-table-column>
              <el-table-column
                prop="pushSpot"
                :formatter="(a, b, val)=>spotMap[val] ? spotMap[val].name: val"
                label="推送位置"
                ></el-table-column>
              <el-table-column
                prop="clientType"
                :formatter="(a, b, val)=>clientTypeMap[val]?clientTypeMap[val].name:val"
                label="客户类型"
                ></el-table-column>
              <el-table-column
                width="100"
                label="操作">
                <template slot-scope="scope">
                  <el-button type="danger" icon="delete" @click="deletePushConfig(scope.$index)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-col :span="7" v-show="dialog.type != 3">
              <el-select clearable v-model="dialog.pushConfig.channel"
                        @change="dialog.pushConfig.pushSpot='';dialog.pushConfig.clientType='';"
                         placeholder="推送渠道">
                <el-option v-for="c in channelMap" :label="c.name" :value="c.code"
                           :key="'add-form-channel-'+ c.code" v-show="c.isActive === 1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7" v-show="dialog.type != 3">
              <el-select clearable 
                        v-model="dialog.pushConfig.pushSpot"
                        @change="dialog.pushConfig.clientType='';"
                        :disabled="dialog.pushConfig.channel==''"
                        placeholder="推送位置">
                <el-option v-for="c in spotMap" v-if="c.parentCode == dialog.pushConfig.channel" :label="c.name" :value="c.code"
                           :key="'add-form-spot-'+ c.code" v-show="c.isActive === 1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="7" v-show="dialog.type != 3">
              <el-select clearable 
                        v-model="dialog.pushConfig.clientType"
                        :disabled="dialog.pushConfig.pushSpot==''"
                        placeholder="客户类型">
                <el-option v-for="c in clientTypeMap" v-if="c.parentCode == dialog.pushConfig.pushSpot" :label="c.name" :value="c.code"
                           :key="'add-form-type-'+ c.code" v-show="c.isActive === 1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="3" v-show="dialog.type != 3">
              <el-button type="primary" icon="plus" @click="addPushConfig">增加</el-button>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="7">
            <el-form-item label="推送时间：" prop="timeType">
              <el-select v-model="dialog.form.pushTime.timeType" :disabled="dialog.type === 3" placeholder="推送时间">
                <el-option label="展示型" :value="1"></el-option>
                <el-option label="推送型" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="17">
            <el-form-item label-width="0px" v-show="dialog.form.pushTime.timeType === 1">
              <el-date-picker
                :readonly="dialog.type === 3"
                clearable
                v-model="dialog.form.daterange"
                type="datetimerange"
                placeholder="选择日期范围">
              </el-date-picker>
            </el-form-item>
            <el-form-item label-width="0px" v-show="dialog.form.pushTime.timeType === 2">
              <el-date-picker
                :readonly="dialog.type === 3"
                clearable
                v-model="dialog.form.date"
                type="datetime"
                placeholder="选择日期范围">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="附件文档：">
              <el-upload
                 v-show="dialog.form.attachmentUrl==''"
                :action="uploadFile.uploadFileUrl"
                :show-file-list="false"
                :on-success="avatarSuccess"
                :before-upload="beforeUpload"
                :on-error="avatarError"
                :data="uploadFile.uploadFileData"
              >
                <el-button v-show="dialog.type !== 3" type="primary" size="small"><i class="icon-upload"></i>&nbsp;&nbsp;上传</el-button>
              </el-upload>
              <div v-show="dialog.form.attachmentUrl!=''" class="el-upload-list__item is-success">
                    <a class="el-upload-list__item-name" target="_blank" :href="dialog.form.attachmentUrl">
                      <i class="el-icon-document"></i>{{dialog.form.attachFileName}}
                    </a>
                    <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-circle-check"></i></label>
                    <i class="el-icon-close" @click="resetUpload(dialog.form)"></i>
                  </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="dialog.form.remark" v-show="dialog.type !== 3" type="textarea"></el-input>
              <p v-show="dialog.type === 3">
                <span v-show="dialog.form.updateUser">【{{dialog.form.updateUser}}】</span>{{dialog.form.remark}}
              </p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-show="dialog.form.approvalStatus === 2 && dialog.form.approvalRemark">
          <el-col :span="24">
            <el-form-item label="取消原因：" prop="approvalRemark">
              <span class="warning-tip"
                  v-show="dialog.form.approvalStatus === 2">【{{dialog.form. approver}}】{{dialog.form.approvalRemark}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="内容：" prop="content">
              <vue-editor v-show="dialog.type !== 3" useCustomImageHandler @imageAdded="handleImageAdded"
                          placeholder="请输入内容"
                          v-model="dialog.form.content"></vue-editor>
              <span v-show="dialogContentLen > 0 && dialog.type !== 3" class="input-tip">已输入{{dialogContentLen}}个字符</span>
              <p v-show="dialog.type === 3" v-html="dialog.form.content"></p>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-show="optAuth.execute && dialog.form._id && dialog.form.approvalStatus === 1 && dialog.type !== 3 && dialog.form.executor === userInfo.loginName"
          @click="toExecute(dialog.form)" title="发送" type="info">
          <i class="icon-paper-plane"></i>&nbsp;&nbsp;发送

        </el-button>
        <el-button
          v-show="optAuth.approve && dialog.form._id  && dialog.type !== 3 && dialog.form.approver === userInfo.loginName"
          @click="toApprove('cancel', dialog.form)"
          title="审核不通过" type="danger">
          <i class="icon-attention-alt"></i>&nbsp;&nbsp;审核不通过

        </el-button>
        <el-button
          v-show="optAuth.approve  && dialog.form._id  && dialog.type !== 3 && dialog.form.approver === userInfo.loginName"
          @click="toApprove('approve', dialog.form)"
          title="审核通过" type="success">
          <i class="icon-ok-circled"></i>&nbsp;&nbsp;审核通过

        </el-button>
        <el-button v-show="optAuth.edit && dialog.type === 2" @click="submitForm" type="primary">修 改</el-button>
        <el-button v-show="dialog.type === 4" @click="submitForm" type="primary">修 改</el-button>
        <el-button v-show="optAuth.add && dialog.type === 1" @click="submitForm" type="primary">保 存</el-button>
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button v-show="dialog.type === 3" @click="toNextRow()" type="primary">下一条</el-button>
      </div>
    </el-dialog>
    <!-- /内容详情弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog :title="dictDialog.title" v-model="dictDialog.show" :close-on-press-escape="false"
               :close-on-click-modal="false">
      <el-row class="toolbar">
        <el-button @click="showDictFormDialog()" type="primary">新增</el-button>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-transfer :render-content="renderContent" :titles="['未选'+dictDialog.title, '已选'+dictDialog.title]" v-model="dictDialog.value"
                       :data="dictDialog.items"
                       @change="transferChange"></el-transfer>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitDictForm" type="primary">保 存</el-button>
        <el-button @click="dictDialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog :title="dictDialog.form.title" v-model="dictDialog.form.show" size="tiny" :close-on-press-escape="false"
               :close-on-click-modal="false">
      <el-form ref="dictForm" :model="dictDialog.form.item" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="名称：" prop="name" :rules="{required: true, message: '名称不能为空', trigger: 'blur'}">
              <el-input v-model="dictDialog.form.item.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="operateDict('add')" type="primary">确 定</el-button>
        <el-button @click="dictDialog.form.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
    <import-xlsx
    @dialogClose="onImportXlsxClose"
    @showFormDialog="showDialog"
     :isActive="isImportXlsx"
     :channelMap="channelMap"
     :clientTypeMap="clientTypeMap"
     :typeMap="typeMap"
     :spotMap="spotMap"
     :userInfo="this.userInfo"></import-xlsx>
    <push-config-manager
      @onSaveConfig="getDictList();"
      @dialogClose="isOpenPushConfigMamager = false"
      :isActive="isOpenPushConfigMamager"
      :dictList="dictList"
    ></push-config-manager>
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp  from 'bsmp_main';
  import transferItem from '../transferItem.vue';
  import importXlsx from '../importXlsx.vue';
  import pushConfigManager from '../pushConfigManager.vue';
  import {VueEditor} from 'vue2-editor';
  import axios from 'axios';
  export default {
    name: 'push_center_content_info',
    components: {
      VueEditor,
      transferItem,
      importXlsx,
      pushConfigManager
    },
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        activeName: 'all',
        userInfo: null,
        isImportXlsx: false,
        isOpenPushConfigMamager: false,
        loading: false,
        uploadFile: {
          uploadFileUrl: bsmp.util.uploadFileCfg.uploadFileUrl,
          uploadFileData: {
            channel: 'backoffice',
            accountNo: '',
            companyId: '',
            encryptKey: bsmp.util.uploadFileCfg.encryptKey
          }
        },
        search: {
          pushSpot: '',
          pushType: '',
//          timeType: 1,
          date: null,
          approvalStatus: null
        },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          }
        },
        accounts: null,
        approvers: null,
        executors: null,
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑, 4: 仅编辑不提交到服务器
          index: -1, // 数据下标
          title: '',
          loading: false,
          data: null, //用于提交到服务器的数据
            pushConfig: {
              channel: '',
              pushSpot: '',
              clientType: ''
            },
          
          form: {
            approvalStatus: 0,
            sendStatus: 0,
            title: '',
            publisher: '',
            approver: '',
            executor: '',
            channel: [],
            clientType: [],
            pushType: [],
            pushSpot: [],
            pushTime: {
              timeType: 1,
              from: null,
              to: null
            },
            daterange: null,
            date: null,
            attachmentUrl: '',
            attachFileName: '',
            remark: '',
            content: ''
          },
          rules: rules
        },
        dictList: null,
        dictDialog: {
          show: false,
          title: '',
          fieldCode: '',
          map: null,
          items: [],
          value: [],
          form: {
            show: false,
            title: '新增',
            item: {
              code: null,
              name: '',
              isActive: 0
            }
          }
        },
        multipleSelection: [],
        channelMap: {},
        clientTypeMap: {},
        typeMap: {},
        spotMap: {},
        approvalStatusMap: {
          '0': '待审核',
          '1': '已审核',
          '2': '已取消'
        },
        sendStatusMap: {
          '0': '未发送',
          '1': '已发送'
        },
        emailMap: {},
        emails: []
      };
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      if (this.userInfo.loginName) {
        this.ready();
      }

      // 所有邮件用户
      this.getUsersByCode('hx_pms_admin');
      // 审批用户
      this.getUsersBySource('hx_pms_admin', 'push_center_content_info_approve').then((res) => {
        let data = res.data;
        if (data && data.code === '0') {
          this.approvers = data.data;
        }
      });
      // 发送用户
      this.getUsersBySource('hx_pms_admin', 'push_center_content_info_execute').then((res) => {
        let data = res.data;
        if (data && data.code === '0') {
          this.executors = data.data;
        }
      });
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'push_center_content_info_view',
          add: 'push_center_content_info_add',
          edit: 'push_center_content_info_edit',
          del: 'push_center_content_info_delete',
          dict: 'push_center_content_info_dict',
          batchDel: 'push_center_content_info_batch_delete',
          approve: 'push_center_content_info_approve',
          execute: 'push_center_content_info_execute',
          email: 'push_center_content_info_email'
        });
      },
      company() {
        return bsmp.util.getCompany();
      },
      loginUser() {
        return bsmp.util.getUserInfo();
      },
      dialogTime() {
        let date = null;
        if (this.dialog.form.createDate) {
          date = new Date(this.dialog.form.createDate);
        } else {
          date = new Date();
        }
        return bsmp.util.formatDate.format(date, 'yyyy-MM-dd hh:mm');
      },
      dialogContentLen() {
        return this.delHtmlTag(this.dialog.form.content).length;
      },
      dialogPushConfigList(){
        let form = this.dialog.form;
        let list = [];
        let length = Math.max(form.channel.length, form.pushSpot.length, form.clientType.length);
        let i = 0;
        while(i < length){
          let item = {};
          item.channel = form.channel[i] || form.channel[0] || "";
          item.pushSpot = form.pushSpot[i] || form.pushSpot[0] || "";
          item.clientType = form.clientType[i] || form.clientType[0] || "";
          list.push(item);
          i++;
        }
        return list;
      }
    },
    watch: {
      'company': function (company) {
        if (this.userInfo.companyId && this.userInfo.companyId === 'ALL' && company) {
          this.ready();
        }
      },
      'loginUser': function (loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
          this.ready();
        }
      }
    },
    methods: {
      renderContent(h, {key, label, isActive}) {
        return this.$createElement('transferItem', {
          props: {
            val: key + '',
            label,
            isActive
          },
          on: {
            'trash': (data) => {
              this.operateDict('delete', data);
            }
          }
        });
      },
      beforeUpload(file){
        if (!file) {
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.$message.warning('上传单张图片不能大于5M！');
          return;
        }
        if (this.userInfo.loginName) {
          this.uploadFile.uploadFileData.accountNo = this.userInfo.loginName;
          this.uploadFile.uploadFileData.companyId = this.userInfo.companyId;
        }
      },
      avatarSuccess(res, file, files){
        if (res.code !== '0') {
          this.$message.error('上传图片失败' + res.msg);
          return;
        }
        this.$message.success('上传成功' + res.msg);
        this.dialog.form.attachmentUrl = res.data.fileAbsolutePath;
        this.dialog.form.attachFileName = res.data.fileName;
      },
      resetUpload(){
        this.dialog.form.attachmentUrl = '';
      },
      avatarError(err, file, fileList) {
        this.$message.error('上传图片失败' + err);
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
          Editor.insertEmbed(cursorLocation, 'image', url);
          this.dialog.loading = false;
        }).catch((err) => {
          this.dialog.loading = false;
          console.error(err);
        });
      },
      delHtmlTag(str) {
        return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
      },
      contentFmt(row) {
        return row.content ? this.delHtmlTag(row.content) : '';
      },
      channelFmt (row) {
        if (row.channel && row.channel.length) {
          return row.channel.map((c) => {
            return this.channelMap[c] ? this.channelMap[c].name : '';
          }).join(',');
        }
        return '';
      },
      spotFmt (row) {
        if (row.pushSpot && row.pushSpot.length) {
          return row.pushSpot.map((c) => {
            return this.spotMap[c] ? this.spotMap[c].name : '';
          }).join(',');
        }
        return '';
      },
      typeFmt (row) {
        if (row.pushType && row.pushType.length) {
          return row.pushType.map((c) => {
            return this.typeMap[c] ? this.typeMap[c].name : '';
          }).join(',');
        }
        return '';
      },
      clientTypeFmt (row) {
        if (row.clientType && row.clientType.length) {
          return row.clientType.map((c) => {
            return this.clientTypeMap[c] ? this.clientTypeMap[c].name : '';
          }).join(',');
        }
        return '';
      },
      approvalStatusFmt (row) {
        return typeof row.approvalStatus !== 'undefined' ? this.approvalStatusMap[row.approvalStatus] : '';
      },
      sendStatusFmt (row) {
        return typeof row.sendStatus !== 'undefined' ? this.sendStatusMap[row.sendStatus] : '未发送';
      },
      createDateFmt(row) {
        return row.createDate ? bsmp.util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd') : '';
      },
      pushTimeFmt(row) {
        if(!row.pushTime || row.pushTime == ""){
          return "";
        }
        let from = "", to = "";
        if (row.pushTime.from) {
          from = bsmp.util.formatDate.format(new Date(row.pushTime.from), 'yyyy-MM-dd');
          from = from + " - "
        }
        to = bsmp.util.formatDate.format(new Date(row.pushTime.to), 'yyyy-MM-dd');
        return `${from}${to}`;
      },
      clearSearch() {
        this.search = {
          pushSpot: '',
          pushType: '',
          timeType: 1,
          date: null,
          approvalStatus: null
        };
      },
      switchTab() {
        this.query();
      },

      exportExcel() {
        return bsmp.util.excellentExport.excel('download-btn', 'tableExcel', '知识库');
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      getCompanyId() {
        let companyId = '';
        if (this.userInfo.companyId) {
          if (this.userInfo.companyId === 'ALL') {
            if (this.company) {
              companyId = this.company.companyId;
            }
          } else {
            companyId = this.userInfo.companyId;
          }
        }
        return companyId;
      },

      ready() {
        this.getDictList().then(() => {
          this.query();
        });
      },

      getDictList() {
        return api.getDictList({systemCategory: this.getCompanyId()}).then((res) => {
          let data = res.data;
          if (data && data.code === 0) {
            let items = data.data;
            this.dictList = items;
            if (items && items.length) {
              items.forEach((item) => {
                let map = {};
                if (map && item.items && item.items.length) {
                  item.items.forEach((i) => {
                    map[i.code || i.name] = i;
                  });
                }
                switch (item.fieldCode) {
                  case 'p_channel':
                    this.channelMap = map;
                    break;
                  case 'p_clientType':
                    this.clientTypeMap = map;
                    break;
                  case 'p_type':
                    this.typeMap = map;
                    break;
                  case 'p_spot':
                    this.spotMap = map;
                    break;
                }
              });
            }
          }
        });
      },

      /**
       * 获取角色用户
       * */
      getUsersByCode(roleCode) {
        return api.getUsers(roleCode).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.accounts = data.data;
            this.accounts.forEach((item) => {
              if (item.email) {
                this.emailMap[item.loginName.trim()] = item.email;
                this.emails.push(item.email);
              }
            });
          }
        });
      },

      /**
       * 查询拥有资源id权限的用户列表
       *
       * */
      getUsersBySource(roleCode, ids) {
        return api.getUsersBySource({roleCode, id: ids});
      },

      transferChange () {
        let selected = this.dictDialog.value, item;
        for (let key in this.dictDialog.map) {
          item = this.dictDialog.map[key];
          if (selected.indexOf(item.code) > -1) {
            item.isActive = 1;
          } else {
            item.isActive = 0;
          }
        }

        let mapData = this.getDictMapData(this.dictDialog.map);
        this.dictDialog.items = mapData.items;
        this.dictDialog.value = mapData.value;
      },

      getDictMapData(map) {
        let items = [], value = [], item;
        for (let key in map) {
          item = map[key];
          items.push({key: item.code || item.name, label: item.name, isActive: item.isActive});
          if (item.isActive === 1) {
            value.push(item.code);
          }
        }
        return {map, items, value};
      },

      showDictDialog(code) {
        let title = '', map = null;
        switch (code) {
          case 'p_channel':
            title = '推送渠道列表';
            map = this.channelMap;
            break;
          case 'p_clientType':
            title = '客户类型列表';
            map = this.clientTypeMap;
            break;
          case 'p_type':
            title = '推送类型列表';
            map = this.typeMap;
            break;
          case 'p_spot':
            title = '推送位置列表';
            map = this.spotMap;
            break;
        }

        this.dictDialog.fieldCode = code;
        this.dictDialog.title = title;
        this.dictDialog.map = Object.assign({}, map);
        let mapData = this.getDictMapData(this.dictDialog.map);

        this.dictDialog.items = mapData.items;
        this.dictDialog.value = mapData.value;
        this.dictDialog.show = true;
      },

      showDictFormDialog() {
        if (this.$refs['dictForm'] && this.$refs['dictForm'].resetFields) {
          this.$refs['dictForm'].resetFields();
        }

        this.dictDialog.form.item = {
          code: Date.now(),
          name: '',
          isActive: 0
        };

        this.dictDialog.form.show = true;
      },

      operateDict(type, param) {
        if (type === 'add') {
          this.dictDialog.map[this.dictDialog.form.item.code] = Object.assign({}, this.dictDialog.form.item);
          this.dictDialog.form.show = false;
        } else if (type === 'delete') {
          delete this.dictDialog.map[param];
        }

        let mapData = this.getDictMapData(this.dictDialog.map);
        this.dictDialog.items = mapData.items;
        this.dictDialog.value = mapData.value;
      },

      submitDictForm() {
        let items = [];
        for (let key in this.dictDialog.map) {
          items.push(this.dictDialog.map[key]);
        }
        let params = {
          fieldCode: this.dictDialog.fieldCode,
          items
        };
        api.updateDict(params).then((res) => {
          let data = res.data;
          if (data && data.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });

            this.getDictList().then(() => {
              this.query();
              this.dictDialog.show = false;
            });

            // 记录日志
            bsmp.log({
              component: 'push_center',
              type: 'modify',
              content: `[Dict] params: ${JSON.stringify(params)}`
            });
          }
        });
      },
      toNextRow(){
        let newIndex = this.dialog.index + 1;
        if(newIndex === this.table.items.length){
          this.$message.info('到底了，从第一条重新开始。');
          this.dialog.index = 0;
          newIndex = 0;
        }
        this.showDialog(3, newIndex, this.dialog.sourceItems);
      },
      showDialogForImport(type, formData){
        let title = '';
        if (type === 2) {
          title = '修改';
        } else if(type === 3) {
          title = '查看详情';
        }
        this.dialog.title = title;
        this.dialog.type = type;

        let form = this.formatFormDataForDisplay(formData);
        this.dialog.form = form;
        this.dialog.show = true;
      },
      formatFormDataForDisplay(formData){
          let form = JSON.parse(JSON.stringify(formData));
          if (form.pushTime.timeType === 1 && form.pushTime.from && form.pushTime.to) {
            form.daterange = [];
            form.daterange[0] = new Date(form.pushTime.from);
            form.daterange[1] = new Date(form.pushTime.to);
            form.date = null;
          } else if (form.pushTime.timeType === 2 && form.pushTime.to) {
            form.daterange = null;
            form.date = new Date(form.pushTime.to);
          }

          // 数字数组转为字符数组
          if (form.channel instanceof Array && form.channel && form.channel.length) {
            form.channel = form.channel.map((c) => {
              return c + '';
            });
          }
          if (form.clientType instanceof Array && form.clientType && form.clientType.length) {
            form.clientType = form.clientType.map((c) => {
              return c + '';
            });
          }
          if (form.pushType instanceof Array && form.pushType && form.pushType.length) {
            form.pushType = form.pushType.map((c) => {
              return c + '';
            });
          }
          if (form.pushSpot instanceof Array && form.pushSpot && form.pushSpot.length) {
            form.pushSpot = form.pushSpot.map((c) => {
              return c + '';
            });
          }

          form.approvalStatus = form.approvalStatus || 0;
          form.sendStatus = form.sendStatus || 0;
          return form;
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index, sourceItems) {
          this.dialog.sourceItems = sourceItems || this.table.items;
        if (this.$refs['infoForm'] && this.$refs['infoForm'].resetFields) {
          this.$refs['infoForm'].resetFields();
        }

        let title = '';
        if (type === 1) {
          title = '新增';
        } else if (type === 2 || type === 4) {
          title = '修改';
        } else {
          title = '查看详情';
        }
        this.dialog.title = title;
        this.dialog.type = type;

        // 编辑
        if ((this.dialog.type === 2 || this.dialog.type === 3) && index > -1) {
          this.dialog.index = index;
          let form = this.formatFormDataForDisplay(this.dialog.sourceItems[index]);
          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            approvalStatus: 0,
            sendStatus: 0,
            title: '',
            publisher: this.userInfo.loginName,
            approver: '',
            executor: '',
            channel: [],
            clientType: [],
            pushType: [],
            pushSpot: [],
            pushTime: {
              timeType: 1,
              from: null,
              to: null
            },
            daterange: null,
            date: null,
            attachmentUrl: '',
            remark: '',
            content: ''
          };
        }
        this.dialog.show = true;
      },
      updateAttachFileName(){
        let _this = this;
        if(this.dialog.form.attachmentUrl != ""){
          api.getFileNameByFilePath({
            channel: 'backoffice',
            accountNo: this.userInfo.loginName,
            companyId: this.userInfo.companyId,
            filePath: this.dialog.form.attachmentUrl
          }).then(res => {
            let data = res.data.data;
            let item = null;
            if("list" in data && data.list.length > 0){
              item = data.list[0];
              _this.$set( _this.dialog.form, 'attachFileName', item.fileName );
            }
          }).catch(e => {
            this.$message.warning("获取文件名失败：", e.message);
          });
        }
      },
      submitForm () {
        this.$refs['infoForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.dialog.form);
            // 有效期方式，自定义时间
            if (params.pushTime.timeType === 1) {
              if (params.daterange) {
                params.pushTime.from = params.daterange[0].getTime();
                params.pushTime.to = params.daterange[1].getTime();
              } else {
                this.$message.warning('请选择推送时间！');
                return;
              }
            } else if (params.pushTime.timeType === 2) {
              if (params.date) {
                params.pushTime.to = params.date.getTime();
              } else {
                this.$message.warning('请选择推送时间！');
                return;
              }
            }

            delete params.daterange;
            delete params.date;

            if (this.dialog.type === 1) {
              // 新增
              api.addContent(params).then((res) => {
                let data = res.data;
                if (data && data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });

                  // 发送Email
                  if (this.optAuth.email && data.data._id && this.emailMap[params.approver.trim()]) {
                    this.sendEmail(data.data._id, 'create', this.emailMap[params.approver.trim()]);
                  }

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  delete params.content;
                  bsmp.log({
                    component: 'push_center',
                    type: 'add',
                    content: `[ContentInfo] params: ${JSON.stringify(params)}`
                  });
                }
              });
            } else {
              params.id = params._id;
              delete params._id;
              // 修改
              api.editContent(params).then((res) => {
                let data = res.data;
                if (data && data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  delete params.content;
                  bsmp.log({
                    component: 'push_center',
                    type: 'modify',
                    content: `[ContentInfo] params: ${JSON.stringify(params)}`
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
       * 发送Email
       * */
      sendEmail(id, action, to) {
        api.sendEmail({id, action, to});
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
          api.removeContent({id}).then((res) => {
            let data = res.data;
            if (data && data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'push_center',
                type: 'delete',
                content: `[ContentInfo] params: ${JSON.stringify({id})}`
              });
            }
          });
        }).catch(e => {
        });
      },

      /**
       * 批量删除
       * */
      batchDelete() {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要操作的记录!'
          });
          return;
        }
        let items = this.multipleSelection.map((item) => {
          return item._id;
        });

        this.$confirm('确定要批量删除这些条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {ids: items.join(',')};
          api.batchDelete(params).then((res) => {
            let data = res.data;
            if (data && data.code === 0) {
              this.$message({
                type: 'success',
                message: '批量删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'push_center',
                type: 'batchDelete',
                content: `[ContentInfo] params: ${JSON.stringify(params)}`
              });
            }
          });
        }).catch(e => {
        });
      },
      toggleImportXlsx(){
        this.isImportXlsx = !this.isImportXlsx;
      },
      onImportXlsxClose(importedIds){
        let _this = this;
        this.isImportXlsx = false;
        let emails = this.approvers.map(approver => approver.email);
        if(importedIds){
          this.query();
          importedIds.forEach(id => {//import成功需要发邮件给所有审批人。
            _this.sendEmail(id, 'create', emails.join(','));
          });
        }
      },
      toApprove(action, item) {
        let items = [];
        if (item) {
          // 单个审核
          items.push({id: item._id, approver: item.approver, publisher: item.publisher, executor: item.executor});
        } else {
          // 批量审核
          if (!this.multipleSelection.length) {
            this.$message({
              type: 'warning',
              message: '请选择要操作的记录!'
            });
            return;
          }
          items = this.multipleSelection.map((i) => {
            return {id: i._id, approver: i.approver, publisher: i.publisher, executor: i.executor};
          });
        }
        this.batchApprove(action, items);
      },

      batchApprove(action, items) {
        let approvalStatus, title;
        switch (action) {
          case 'approve':
            approvalStatus = 1;
            title = '审核通过';
            break;
          case 'cancel':
            approvalStatus = 2;
            title = '审核取消';
            break;
        }

        if (action === 'cancel') {
          this.$prompt(`确定要${title}提案吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请您描述一下审核不通过的原因.....',
            inputValidator: (val) => {
              return !!val;
            },
            inputErrorMessage: '请您描述一下审核不通过的原因'
          }).then(({value}) => {
            items.map((item) => {
              item.approvalRemark = value;
              item.approvalStatus = approvalStatus;
              return item;
            });
            this.batchSetApproval(action, items);
          }).catch(e => {
          });
        } else {
          this.$confirm(`确定要${title}提案吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            items.map((item) => {
              item.approvalStatus = approvalStatus;
              return item;
            });
            this.batchSetApproval(action, items);
          }).catch(e => {
          });
        }
      },

      batchSetApproval(action, items) {
        api.batchSetApproval({items}).then((res) => {
          let data = res.data;
          if (data && data.code === 0) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.dialog.show = false;
            this.query();

            // 记录日志
            bsmp.log({
              component: 'push_center',
              type: 'batchSetApproval',
              content: `[ContentInfo] params: ${JSON.stringify(items)}`
            });

            if (action === 'cancel') {
              // 取消审核邮件只提醒发起人
              items.forEach((item) => {
                // 发送Email
                if (this.optAuth.email && item.id && this.emailMap[item.publisher.trim()]) {
                  this.sendEmail(item.id, 'approve', this.emailMap[item.publisher.trim()]);
                }
              });
            } else {
              // 审核通过邮件提醒相关所有人
              let emails = [];
              items.forEach((item) => {
                emails = [];
                // 发送Email
                if (this.optAuth.email && item.id) {
                  this.emailMap[item.approver.trim()] && emails.push(this.emailMap[item.approver.trim()]);
                  this.emailMap[item.executor.trim()] && emails.push(this.emailMap[item.executor.trim()]);
                  this.emailMap[item.publisher.trim()] && emails.push(this.emailMap[item.publisher.trim()]);

                  this.sendEmail(item.id, 'approve', emails.join(','));
                }
              });
            }
          }
        });
      },

      toExecute(item) {
        let ids = [], errorMsg = '', items = [];
        if (item) {
          // 单个审核
          ids.push(item._id);
          items.push(item);
        } else {
          // 批量审核
          if (!this.multipleSelection.length) {
            this.$message({
              type: 'warning',
              message: '请选择要操作的记录!'
            });
            return;
          }
          ids = this.multipleSelection.map((i) => {
            if (i.approvalStatus === 0) {
              errorMsg = '不能选择待审核的记录';
            } else if (i.approvalStatus === 2) {
              errorMsg = '不能选择取消审核的记录';
            } else {
              items.push(i);
              return i._id;
            }
          });
        }
        if (errorMsg) {
          this.$message.warning(errorMsg);
          return;
        }

        this.$confirm(`确定要发送提案吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {ids: ids.join(',')};
          api.executeApproval(params).then((res) => {
            let data = res.data;
            if (data && data.code === 0) {
              this.$message({
                type: 'success',
                message: '发送成功!'
              });
              this.dialog.show = false;
              this.query();

              // 记录日志
              bsmp.log({
                component: 'push_center',
                type: 'executeApproval',
                content: `[ContentInfo] params: ${JSON.stringify(params)}`
              });

              // 发送邮件提醒相关所有人
              let emails = [];
              items.forEach((item) => {
                emails = [];
                // 发送Email
                if (this.optAuth.email && item._id) {

                  this.emailMap[item.approver.trim()] && emails.push(this.emailMap[item.approver.trim()]);
                  this.emailMap[item.executor.trim()] && emails.push(this.emailMap[item.executor.trim()]);
                  this.emailMap[item.publisher.trim()] && emails.push(this.emailMap[item.publisher.trim()]);

                  this.sendEmail(item._id, 'execute', emails.join(','));
                }
              });
            }
          });
        }).catch(e => {
        });
      },

      /**
       * 查询
       */
      query() {
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        if (this.activeName !== 'all') {
          params[this.activeName] = this.userInfo.loginName;
        }

        if (params.date && params.date.length && params.date[0] && params.date[1]) {
          params.createDateStart = params.date[0].getTime();
          params.createDateEnd = params.date[1].getTime();
          delete params.date;
        }
        params = Object.assign({}, params, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getContentList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === 0) {
            this.table.items = data.data;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: data.pageNo + 1,
                total: data.totalRecords
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
      deletePushConfig(index){
        let form = this.dialog.form;
        form.channel.splice(index, 1);
        form.pushSpot.splice(index, 1);
        form.clientType.splice(index, 1);
      },
      addPushConfig(){
        let pushConfig = this.dialog.pushConfig;
        this.dialog.form.channel.push(pushConfig.channel);
        this.dialog.form.pushSpot.push(pushConfig.pushSpot);
        this.dialog.form.clientType.push(pushConfig.clientType);
        this.dialog.pushConfig.channel = '';
        this.dialog.pushConfig.pushSpot = '';
        this.dialog.pushConfig.clientType = '';
      }
    }
  };

  // 表单规则
  let rules = {
    content: [
      {required: true, message: '请输入内容', trigger: 'blur'}
    ],
    executor: [
      {required: true, message: '请选择执行人', trigger: 'change'}
    ],
    channel: [
      {required: true, type: 'array', message: '请选择推送渠道', trigger: 'change'}
    ],
    clientType: [
      {required: true, type: 'array', message: '请选择客户类型', trigger: 'change'}
    ],
    pushType: [
      {required: true, type: 'array', message: '请选择推送类型', trigger: 'change'}
    ],
    pushSpot: [
      {required: true, type: 'array', message: '请选择推送位置', trigger: 'change'}
    ],
  };
</script>
<style lang="stylus" scoped>
  .handle-btn
    float right
    margin 0 3px !important

  .export-btn
    text-decoration none
    background #20a0ff
    color #fff

  .dict-link
    color #20a0ff
    cursor pointer
  .input-tip
    color #ff4949
    font-size 12px
    line-height 1
    padding-top 4px
    position absolute
    top 100%;
    right 0
  .warning-tip
    color #FF4949
  .el-form-item__content .el-upload-list__item
    display inline-block
    width auto
</style>
