<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="search.approveStatus" clearable filterable placeholder="审批状态">
            <el-option label="审批状态" value></el-option>
            <el-option
              v-for="(val, key) in approveStatusMap"
              :label="val"
              :value="key"
              :key="'search-approveStatus-' + key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.ruleExcuteStatus" clearable filterable placeholder="决策状态">
            <el-option label="决策状态" value></el-option>
            <el-option
              v-for="(val, key) in ruleExcuteStatusMap"
              :label="val"
              :value="key"
              :key="'search-ruleExcuteStatus-' + key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="search.name" placeholder="客户姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.idNo" placeholder="身份证"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.applyNo" placeholder="进件申请单"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker clearable v-model="search.createDate" type="daterange" placeholder="创建时间"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      stripe
      :max-height="height - 170"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="applyNo" label="进件申请单" width="200"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="idNo" label="身份证" width="200"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="phone" label="手机号码" width="200"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="approveStatus"
        :formatter="approveStatusFmt"
        label="进件状态"
        width="200"
      ></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="ruleExcuteStatus"
        :formatter="ruleExcuteStatusFmt"
        label="决策状态"
        min-width="200"
      ></el-table-column>
      <el-table-column fixed="right" width="100" label="详情">
        <template slot-scope="scope">
          <el-button
            v-show="optAuth.detail"
            title="查看详情"
            @click="showDialog(scope.$index)"
            size="mini"
          >
            <i class="icon-eye"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pull-right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="table.pager.page"
      :page-sizes="[2, 10, 50, 100, 200, 500, 1000]"
      :page-size="table.pager.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="table.pager.total"
    ></el-pagination>

    <!-- 详细信息 -->
    <el-dialog
      title="详情"
      v-model="dialog.show"
      size="full"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-row class="toolbar">
        <el-button
          @click="showEdit"
          v-show="optAuth.edit"
          :disabled="dialog.edit"
          title="编辑"
          type="primary"
        >编辑</el-button>
        <el-button
          @click="edit"
          v-show="optAuth.edit"
          :disabled="!dialog.edit"
          title="提交审核"
          type="warning"
        >提交审核</el-button>
        <el-button
          @click="showApproveDialog()"
          v-show="optAuth.approve"
          title="审批确认"
          type="danger"
        >审批确认</el-button>
      </el-row>

      <el-form
        v-if="dialog.form"
        v-loading="dialog.loading"
        ref="detailForm"
        :model="dialog.form"
        :rules="rules"
        label-width="140px"
        class="dialog-form"
      >
        <div class="result" v-if="dialog.ruleInfo">
          <div class="title">合规审核</div>
          <div class="content">
            <div class="label" v-if="dialog.ruleInfo.code == 1">{{ dialog.ruleInfo.result }}：</div>
            <div class="label" v-else>{{ dialog.ruleInfo.result }}</div>
            <div class="list" v-if="dialog.ruleInfo.code == 1">
              <span class v-for="(item, index) in dialog.ruleInfo.reason" :key="'reason' + index">
                <b v-if="index > 0">，</b>
                {{ item.ruleName }}
              </span>
            </div>
          </div>
        </div>

        <div class="detail">
          <el-col :span="16" class="media_box">
            <div class="form_status">表单基础状态</div>
            <el-row :span="7" class="operate-box">
              <el-row class="row-co clearfix" :gutter="20">
                <el-col class="label" :span="3">开户类型：</el-col>
                <el-col class="text" :span="5">{{ dialog.form.openAccountType }}&nbsp;&nbsp;</el-col>
                <el-col class="label" :span="3">申请单号：</el-col>
                <el-col class="text" :span="5">{{ dialog.form.applyNo }}&nbsp;&nbsp;</el-col>
                <el-col class="label" :span="3">入口渠道：</el-col>
                <el-col class="text" :span="5">{{ dialog.form.channel }}&nbsp;&nbsp;</el-col>
              </el-row>
              <el-row class="row-co" :gutter="20">
                <el-col class="label" :span="3">开户方式：</el-col>
                <el-col class="text" :span="5">{{ dialog.form.openAccountWay }}&nbsp;&nbsp;</el-col>
                <el-col class="label" :span="3">业务方人员：</el-col>
                <el-col class="text" :span="5">{{ dialog.form.operator }}&nbsp;&nbsp;</el-col>
                <el-col class="label" :span="3">审核状态：</el-col>
                <el-col class="text" :span="5">{{ approveStatusFmt(dialog.form) }}&nbsp;&nbsp;</el-col>
              </el-row>
              <el-row class="row-co" :gutter="20">
                <!-- <el-col class="label" :span="3">&nbsp;&nbsp;</el-col>
                <el-col class="text" :span="5">&nbsp;&nbsp;</el-col>
                <el-col class="label" :span="3">&nbsp;&nbsp;</el-col>
                <el-col class="text" :span="5">&nbsp;&nbsp;</el-col> -->
                <el-col class="label" :span="3">决策状态：</el-col>
                <el-col class="text" :span="5">{{ ruleExcuteStatusFmt(dialog.form) }}&nbsp;&nbsp;</el-col>
              </el-row>
            </el-row>
            <div class="block_bar">账户基本信息</div>
            <el-row :span="16" :offset="1">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="姓名：" prop="name">
                    <el-input :readonly="!dialog.edit" v-model="dialog.form.name" placeholder="姓名"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="出生日期：" prop="birthday">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.birthday"
                      placeholder="出生日期"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="性别：" prop="gender">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.gender"
                      placeholder="性别"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="民族：" prop="nation">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.nation"
                      placeholder="民族"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="身份证：" prop="idNo">
                    <el-input :readonly="!dialog.edit" v-model="dialog.form.idNo" placeholder="身份证"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="电话号码：" prop="phone">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.phone"
                      placeholder="电话号码"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="行业：" prop="industry">
                    <el-select v-model="dialog.form.industry" placeholder="请选择" :disabled="!dialog.edit">
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
                  <el-form-item label="职业：" prop="profession">
                    <el-input :readonly="!dialog.edit" v-model="dialog.form.profession" placeholder="职业"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="工作单位：" prop="companyName">
                      <el-select v-model="dialog.form.companyName" placeholder="请选择" :disabled="!dialog.edit">
                        <el-option
                          v-for="(val, key) in companyName"
                          :label="val"
                          :value="val"
                          :key="'companyName-' + key">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="职务：" prop="position">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.position"
                      placeholder="职务"
                    ></el-input>
                  </el-form-item>
                </el-col>                
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="银行：" prop="bankName">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.bankName"
                      placeholder="银行"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="卡号：" prop="bankCardNo">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.bankCardNo"
                      placeholder="卡号"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="年收入：" prop="income">
                      <el-input
                        :readonly="!dialog.edit"
                        v-model="dialog.form.income"
                        placeholder="年收入"
                      ></el-input>
                    </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="税收居民类型：" prop="inhabitantType">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.inhabitantType"
                      placeholder="税收居民类型"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="控制人：" prop="controlPerson">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.controlPerson"
                      placeholder="控制人"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="学历：" prop="education">
                      <el-input
                        :readonly="!dialog.edit"
                        v-model="dialog.form.education"
                        placeholder="学历"
                      ></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item label="证件地址：" prop="address">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.address"
                      placeholder="证件地址"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item label="联系地址：" prop="contactAddress">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.contactAddress"
                      placeholder="联系地址"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item label="详细地址：" prop="detailAddress">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.detailAddress"
                      placeholder="详细地址"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <div class="block_bar">账户类型选择</div>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="沪A：" prop="huA">
                    <el-select v-model="dialog.form.huA" placeholder="请选择" :disabled="!dialog.edit">
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
                  <el-form-item label="原股东号：" prop="huShareholderNum">
                    <el-input :readonly="!dialog.edit" v-model="dialog.form.huShareholderNum" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="深A：" prop="shenA">
                    <el-select v-model="dialog.form.shenA" placeholder="请选择" :disabled="!dialog.edit">
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
                  <el-form-item label="原股东号：" prop="shenShareholderNum">
                    <el-input :readonly="!dialog.edit" v-model="dialog.form.shenShareholderNum" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="深TA基金账户：" prop="shenTAAccount">
                    <el-select v-model="dialog.form.shenTAAccount" placeholder="请选择" :disabled="!dialog.edit">
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
                    <el-select v-model="dialog.form.secondBoardMarket" placeholder="请选择" :disabled="!dialog.edit">
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
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.messageChannel"
                      placeholder="信息渠道"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="第二联系人：" prop="secondContactName">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.secondContactName"
                      placeholder="第二联系人"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="联系方式：" prop="secondContactPhone">
                    <el-input v-model="dialog.form.secondContactPhone" :readonly="!dialog.edit" placeholder="联系方式"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="本人关系 " prop="relationship">
                    <el-input v-model="dialog.form.relationship" :readonly="!dialog.edit" placeholder="风险等级"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="委托方式：" prop="entrustWay">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.entrustWay"
                      placeholder="委托方式"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="不良诚信记录：" prop="badCreditRecord">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.badCreditRecord"
                      placeholder="不良诚信记录"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="评测分数：" prop="evaluationScore">
                    <el-input
                      :readonly="!dialog.edite"
                      v-model="dialog.form.evaluationScore"
                      placeholder="评测分数"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item label="风险等级：" prop="riskLevel">
                    <el-input
                      :readonly="!dialog.edite"
                      v-model="dialog.form.riskLevel"
                      placeholder="风险等级"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="密码：" prop="accountPwd">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.accountPwd"
                      placeholder="密码"
                    ></el-input>
                  </el-form-item>
                </el-col> -->
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="居住身份申报：" prop="residentType">
                    <el-select v-model="dialog.form.residentType" placeholder="请选择" :disabled="!dialog.edit">
                      <el-option
                        v-for="(val, key) in residentType"
                        :label="val"
                        :value="val"
                        :key="'residentType-' + key">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

            <div class="block_bar">审核意见</div>
              <el-row :gutter="20">
                <el-col :span="24">
                  <el-form-item label="审核意见：" prop="approveOpinion">
                    <el-input
                      :readonly="!dialog.edit"
                      v-model="dialog.form.approveOpinion"
                      type="textarea"
                      placeholder="审核意见"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
          </el-col>

          <!-- <el-col :span="8" :offset="1"> -->
          <el-col :span="8" >
            <!-- *********************************身份证OCR部分***************************** -->
            <el-row class="media_box">
              <div class="block_bar">身份证OCR检验</div>
              <el-row>
              <el-col :span="12">
                <div class="upload-img">
                  <img
                    @click="
                      showImage(dialog.creditInfo.idOcrDetail.idCardHeadUrl)
                    "
                    v-if="dialog.creditInfo.idOcrDetail.idCardHeadUrl"
                    :src="dialog.creditInfo.idOcrDetail.idCardHeadUrl"
                  >
                </div>
              </el-col>
              <el-col :span="12">
                <div class="upload-img">
                  <img
                    @click="
                      showImage(dialog.creditInfo.idOcrDetail.idCardEmblemUrl)
                    "
                    v-if="dialog.creditInfo.idOcrDetail.idCardEmblemUrl"
                    :src="dialog.creditInfo.idOcrDetail.idCardEmblemUrl"
                  >
                </div>
              </el-col>
              </el-row>
              <el-row :span="24">
                <p>身份证：{{ dialog.creditInfo.idOcrDetail.cardNo }}</p>
                <p>姓名：{{ dialog.creditInfo.idOcrDetail.name }}</p>
                <p>民族：{{ dialog.creditInfo.idOcrDetail.folk }}</p>
                <p>身份证地址：{{ dialog.creditInfo.idOcrDetail.address }}</p>
                <p>签证机关：{{ dialog.creditInfo.idOcrDetail.authority }}</p>
                <p>
                  有效期：{{
                  dialog.creditInfo.idOcrDetail.validdate1
                  }}
                  &nbsp;-&nbsp; {{ dialog.creditInfo.idOcrDetail.validdate2 }}
                </p>
                <el-col :span="12">
                  <p>
                    头像面翻拍检测：
                    <span>{{ dialog.creditInfo.idOcrDetail.headType }}</span>
                  </p>
                  <p>
                    头像面遮挡程度：
                    <span v-if="dialog.creditInfo.idOcrDetail.headQuality">
                      {{
                      dialog.creditInfo.idOcrDetail.headQuality.occluded
                      | keepTwoNum
                      }}
                    </span>
                  </p>
                  <p>
                    头像面模糊程度：
                    <span v-if="dialog.creditInfo.idOcrDetail.headQuality">
                      {{
                      dialog.creditInfo.idOcrDetail.headQuality.blurry
                      | keepTwoNum
                      }}
                    </span>
                  </p>
                  <p>
                    头像面强光程度：
                    <span v-if="dialog.creditInfo.idOcrDetail.headQuality">
                      {{
                      dialog.creditInfo.idOcrDetail.headQuality.highLight
                      | keepTwoNum
                      }}
                    </span>
                  </p>
                  <p>
                    头像面弱光程度：
                    <span v-if="dialog.creditInfo.idOcrDetail.headQuality">
                      {{
                      dialog.creditInfo.idOcrDetail.headQuality.dimLight
                      | keepTwoNum
                      }}
                    </span>
                  </p>
                  <p>
                    头像面不完整程度：
                    <span v-if="dialog.creditInfo.idOcrDetail.headQuality">
                      {{
                      dialog.creditInfo.idOcrDetail.headQuality.incomplete
                      | keepTwoNum
                      }}
                    </span>
                  </p>
                </el-col>
                <el-col :span="12">
                  <p>
                    国徽面翻拍检测：{{
                    dialog.creditInfo.idOcrDetail.emblemType
                    }}
                  </p>
                  <p>
                    国徽面遮挡程度：
                    <span v-if="dialog.creditInfo.idOcrDetail.headQuality">
                      {{
                      dialog.creditInfo.idOcrDetail.emblemQuality.occluded
                      | keepTwoNum
                      }}
                    </span>
                  </p>
                  <p>
                    国徽面模糊程度：
                    <span v-if="dialog.creditInfo.idOcrDetail.headQuality">
                      {{
                      dialog.creditInfo.idOcrDetail.emblemQuality.blurry
                      | keepTwoNum
                      }}
                    </span>
                  </p>
                  <p>
                    国徽面强光程度：
                    <span v-if="dialog.creditInfo.idOcrDetail.headQuality">
                      {{
                      dialog.creditInfo.idOcrDetail.emblemQuality.highLight
                      | keepTwoNum
                      }}
                    </span>
                  </p>
                  <p>
                    国徽面弱光程度：
                    <span v-if="dialog.creditInfo.idOcrDetail.headQuality">
                      {{
                      dialog.creditInfo.idOcrDetail.emblemQuality.dimLight
                      | keepTwoNum
                      }}
                    </span>
                  </p>
                  <p>
                    国徽面不完整程度：
                    <span v-if="dialog.creditInfo.idOcrDetail.headQuality">
                      {{
                      dialog.creditInfo.idOcrDetail.emblemQuality.incomplete
                      | keepTwoNum
                      }}
                    </span>
                  </p>
                  <br>
                </el-col>
              </el-row>
            </el-row>

            <!-- *********************************人脸识别部分***************************** -->
            <el-row class="media_box">
              <div class="block_bar">活体检测&人脸比对</div>
              <el-row>
                <el-row>
                  <el-col :span="12">
                    <div class="upload-img-video">
                      <video
                        v-if="dialog.creditInfo.livenessDetail.livenessVideoUrl"
                        width="100%"
                        height="100%"
                        object-fit:
                        fill
                        :src="dialog.creditInfo.livenessDetail.livenessVideoUrl"
                        controls="controls"
                      >您的浏览器不支持 video 标签。</video>
                    </div>
                  </el-col>
                  <el-col :span="11" :offset="1">
                    <div class="upload-img-video">
                      <img
                        @click="
                          showImage(dialog.creditInfo.livenessDetail.faceImgUrl)
                        "
                        v-if="dialog.creditInfo.livenessDetail.faceImgUrl"
                        :src="dialog.creditInfo.livenessDetail.faceImgUrl"
                      >
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <p>
                    活体检测结果：{{
                    dialog.creditInfo.livenessDetail.livenessStatus
                    }}
                  </p>
                  <p>
                    头像图片与视频比对得分：{{
                    dialog.creditInfo.livenessDetail.score | keepTwoNum
                    }}
                  </p>
                  <p>
                    视频语音检测结果：{{
                    dialog.creditInfo.audioDetail.verifyMsg
                    }}
                  </p>
                  <p>视频语音内容：{{ dialog.creditInfo.audioDetail.words }}</p>
                  <el-col :span="12">
                    <p>
                      视频人脸个数：
                      <span>
                        {{
                        dialog.creditInfo.livenessDetail.faceNumInVideo
                        }}
                      </span>
                    </p>
                    <p>
                      视频人脸光亮程度：
                      <span v-if="dialog.creditInfo.livenessDetail.videoQaulity">
                        {{
                        dialog.creditInfo.livenessDetail.videoQaulity
                        .brightness | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      视频人脸完整程度：
                      <span v-if="dialog.creditInfo.livenessDetail.videoQaulity">
                        {{
                        dialog.creditInfo.livenessDetail.videoQaulity
                        .sharpness | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      视频右眼遮挡程度：
                      <span v-if="dialog.creditInfo.livenessDetail.videoQaulity">
                        {{
                        dialog.creditInfo.livenessDetail.videoQaulity
                        .occlusion.left_eye | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      视频左眼遮挡程度：
                      <span v-if="dialog.creditInfo.livenessDetail.videoQaulity">
                        {{
                        dialog.creditInfo.livenessDetail.videoQaulity
                        .occlusion.right_eye | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      视频五官遮挡程度：
                      <span v-if="dialog.creditInfo.livenessDetail.videoQaulity">
                        {{
                        dialog.creditInfo.livenessDetail.videoQaulity
                        .occlusion.total | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      视频人脸倾斜角：
                      <span v-if="dialog.creditInfo.livenessDetail.videoQaulity">
                        {{
                        dialog.creditInfo.livenessDetail.videoQaulity.pose
                        .roll | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      视频人脸俯仰角：
                      <span v-if="dialog.creditInfo.livenessDetail.videoQaulity">
                        {{
                        dialog.creditInfo.livenessDetail.videoQaulity.pose
                        .pitch | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      视频人脸水平角：
                      <span v-if="dialog.creditInfo.livenessDetail.videoQaulity">
                        {{
                        dialog.creditInfo.livenessDetail.videoQaulity.pose
                        .yaw | keepTwoNum
                        }}
                      </span>
                    </p>
                  </el-col>
                  <el-col :span="12">
                    <p>
                      头像图片中人脸个数：
                      <span>
                        {{
                        dialog.creditInfo.livenessDetail.faceNumInPic
                        }}
                      </span>
                    </p>
                    <p>
                      头像图片光亮程度：
                      <span v-if="dialog.creditInfo.livenessDetail.faceQuality">
                        {{
                        dialog.creditInfo.livenessDetail.faceQuality
                        .brightness | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      头像图片完整程度：
                      <span v-if="dialog.creditInfo.livenessDetail.faceQuality">
                        {{
                        dialog.creditInfo.livenessDetail.faceQuality
                        .sharpness | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      头像图片右眼遮挡程度：
                      <span v-if="dialog.creditInfo.livenessDetail.faceQuality">
                        {{
                        dialog.creditInfo.livenessDetail.faceQuality.occlusion
                        .left_eye | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      头像图片左眼遮挡程度：
                      <span v-if="dialog.creditInfo.livenessDetail.faceQuality">
                        {{
                        dialog.creditInfo.livenessDetail.faceQuality.occlusion
                        .right_eye | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      头像图片五官遮挡程度：
                      <span v-if="dialog.creditInfo.livenessDetail.faceQuality">
                        {{
                        dialog.creditInfo.livenessDetail.faceQuality.occlusion
                        .total | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      头像图片倾斜角：
                      <span v-if="dialog.creditInfo.livenessDetail.faceQuality">
                        {{
                        dialog.creditInfo.livenessDetail.faceQuality.pose
                        .roll | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      头像图片俯仰角：
                      <span v-if="dialog.creditInfo.livenessDetail.faceQuality">
                        {{
                        dialog.creditInfo.livenessDetail.faceQuality.pose
                        .pitch | keepTwoNum
                        }}
                      </span>
                    </p>
                    <p>
                      头像图片水平角：
                      <span v-if="dialog.creditInfo.livenessDetail.faceQuality">
                        {{
                        dialog.creditInfo.livenessDetail.faceQuality.pose.yaw
                        | keepTwoNum
                        }}
                      </span>
                    </p>
                    <br>
                  </el-col>
                </el-row>
              </el-row>
            </el-row>

            <!-- *********************************银行卡OCR部分***************************** -->
            <el-row class="media_box">
              <div class="block_bar">银行卡OCR</div>
              <el-row>
                <el-row>
                  <div class="upload-img">
                    <img
                      @click="
                        showImage(dialog.creditInfo.bankOcrDetail.bankCardUrl)
                      "
                      v-if="dialog.creditInfo.bankOcrDetail.bankCardUrl"
                      :src="dialog.creditInfo.bankOcrDetail.bankCardUrl"
                    >
                  </div>
                </el-row>
                <el-row>
                  <p>
                    识别结果：{{
                    dialog.creditInfo.bankOcrDetail.bankName
                    }}
                    &nbsp;&nbsp; {{ dialog.creditInfo.bankOcrDetail.cardNo }}
                  </p>
                </el-row>
              </el-row>
            </el-row>

            <!-- *********************************表单部分部分***************************** -->
            <el-row class="media_box">
              <div class="block_bar">表单OCR</div>
              <el-row>
                <el-row>
                  <div class="upload-img-video">
                    <img
                      @click="
                        showImage(
                          dialog.creditInfo.openAccountFormDetail
                            .openAccountFileUrl
                        )
                      "
                      v-if="
                        dialog.creditInfo.openAccountFormDetail
                          .openAccountFileUrl
                      "
                      :src="
                        dialog.creditInfo.openAccountFormDetail
                          .openAccountFileUrl
                      "
                    >
                  </div>
                </el-row>
                <el-row>
                  <p>
                    识别结果：{{
                    dialog.creditInfo.openAccountFormDetail.verifyMsg
                    }}
                  </p>
                </el-row>
              </el-row>
            </el-row>
          </el-col>

          <!-- <el-row class="medio-row">
          <el-col :span="12">
            
          </el-col>

          <el-col :span="12">
            
          </el-col>
        </el-row>

        <el-row class="medio-row">
          <el-col :span="12">
            
          </el-col>
          <el-col :span="12">
            
          </el-col>
          </el-row>-->

          <!-- <el-row class="medio-row">
          <el-col :span="24">
            <div class="block_bar">视频音频转义</div>
            <el-row>
              <el-col :span="6">
                <div class="upload-img">
                  <audio v-if="dialog.creditInfo.audioDetail.audioUrl" 
                    :src="dialog.creditInfo.audioDetail.audioUrl" controls="controls">
                    您的浏览器不支持 audio 标签。
                  </audio>
                </div>
              </el-col>
              <el-col :span="6">
                <p>识别结果：{{dialog.creditInfo.audioDetail.verifyMsg}}</p>
                <p>拆解内容：{{dialog.creditInfo.audioDetail.words}}</p>
              </el-col>
            </el-row>
          </el-col>
          </el-row>-->
        </div>
      </el-form>
    </el-dialog>

    <!-- 弹窗框 -->
    <el-dialog
      title="审核"
      v-model="approve.show"
      size="tiny"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <el-form
        ref="approveForm"
        :model="approve.form"
        :rules="approve.rules"
        label-width="120px"
        class="dialog-form"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="审批状态：" prop="approveStatus">
              <el-select v-model="approve.form.approveStatus" placeholder="审核状态">
                <el-option
                  v-for="(val, key) in approveStatusMap"
                  :label="val"
                  :value="key"
                  :key="'approveStatus-' + key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitApproveForm" type="primary">保 存</el-button>
        <el-button @click="approve.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
import api from "../../api";
import bsmp from "bsmp_main";

export default {
  name: "business_account",
  props: {
    height: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      search: {
        approveStatus: "",
        ruleExcuteStatus: "",
        name: "",
        idNo: "",
        applyNo: "",
        createDate: null
      },
      dialog: {
        show: false,
        loading: false,
        edit: false,
        index: -1, // 数据下标
        form: null,
        ruleInfo: null,
        creditInfo: {
          idOcrDetail: {
            depInfo: "",
            effBeginDate: "",
            effEndDate: "",
            depInfo: "",
            idCardHeadUrl: "",
            idCardEmblemUrl: "",
            idNo: "",
            name: "",
            emblemQuality: {},
            headQuality: {}
          },
          bankOcrDetail: {
            bankName: "",
            cardNo: "",
            bankCardUrl: ""
          },
          livenessDetail: {
            verifyMsg: "",
            faceImgUrl: "",
            livenessVideoUrl: ""
          },
          audioDetail: {
            verifyMsg: "",
            words: "",
            audioUrl: ""
          },
          openAccountFormDetail: {
            verifyMsg: "",
            openAccountFileUrl: ""
          }
        }
      },
      approve: {
        show: false,
        form: {
          sno: null,
          approveStatus: ""
        },
        rules: {
          approveStatus: [
            { required: true, message: "请选择审批状态", trigger: "change" }
          ]
        }
      },
      table: {
        items: [],
        pager: {
          pageSize: 10,
          pageNo: 1,
          total: 0
        }
      },
      rules: rules,
      approveStatusMap: {
        "9999": "待审批",
        "0": "审批通过",
        "1": "审批拒绝"
      },
      ruleExcuteStatusMap: {
        "9999": "执行中",
        "-1": "执行失败",
        "1": "拦截",
        "0": "放行"
      },
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
  filters: {
    keepTwoNum: function(value) {
      value = Number(value);
      return value.toFixed(2);
    }
  },

  mounted() {
    this.query();
  },
  computed: {
    optAuth() {
      return bsmp.util.mapAuth({
        search: "business_account_search",
        detail: "business_account_detail",
        approve: "business_account_approve",
        edit: "business_account_edit"
      });
    }
  },
  methods: {
    approveStatusFmt(row) {
      return row.approveStatus ? this.approveStatusMap[row.approveStatus] : "";
    },
    ruleExcuteStatusFmt(row) {
      return row.ruleExcuteStatus
        ? this.ruleExcuteStatusMap[row.ruleExcuteStatus]
        : "";
    },

    showApproveDialog() {
      if (this.$refs["approveForm"] && this.$refs["approveForm"].resetFields) {
        this.$refs["approveForm"].resetFields();
      }

      this.approve.form = {
        sno: this.dialog.form.sno,
        approveStatus: this.dialog.form.approveStatus
      };
      this.approve.show = true;
    },

    submitApproveForm() {
      this.$refs["approveForm"].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.approve.form);
          api.approveBusinessAccount(params).then(res => {
            let data = res.data;
            if (data && data.code === "0") {
              this.$message({
                type: "success",
                message: "审核成功!"
              });
              this.approve.show = false;
              this.dialog.show = false;

              this.query();

              // 记录日志
              bsmp.log({
                component: "risk_system",
                type: "approve",
                content: `[Business] params: ${JSON.stringify(params)}`
              });
            }
          });
        }
      });
    },

    edit() {
      this.$refs["detailForm"].validate(valid => {
        if (valid) {
          let params = {
            sno: this.dialog.form.sno,
            idNo: this.dialog.form.idNo,
            name: this.dialog.form.name,
            gender: this.dialog.form.gender,
            birthday: this.dialog.form.birthday,
            nation: this.dialog.form.nation,
            phone: this.dialog.form.phone,
            bankName: this.dialog.form.bankName,
            bankCardNo: this.dialog.form.bankCardNo,
            profession: this.dialog.form.profession,
            companyName: this.dialog.form.companyName,
            education: this.dialog.form.education,
            income: this.dialog.form.income,
            inhabitantType: this.dialog.form.inhabitantType,
            address: this.dialog.form.address,
            shenA: this.dialog.form.shenA,
            huA: this.dialog.form.huA,
            entrustWay: this.dialog.form.entrustWay,
            badCreditRecord: this.dialog.form.badCreditRecord,
            riskLevel: this.dialog.form.riskLevel,
            evaluationScore: this.dialog.form.evaluationScore,
            accountPwd: this.dialog.form.accountPwd,
            openAccountWay: this.dialog.form.openAccountWay,
            controlPerson: this.dialog.form.controlPerson,
            channel: this.dialog.form.channel,
            openAccountType: this.dialog.form.openAccountType
          };

          // 新增
          api.editBusinessAccount(params).then(res => {
            let data = res.data;
            if (data && data.code === "0") {
              this.$message({
                type: "success",
                message: "编辑成功!"
              });

              this.dialog.show = false;
              this.query();

              // 记录日志
              bsmp.log({
                component: "risk_system",
                type: "edit",
                content: `[Business] params: ${JSON.stringify(params)}`
              });
            }
          });
        }
      });
    },

    showEdit() {
      this.dialog.edit = true;
    },

    // 显示详细弹窗
    showDialog(index) {
      this.dialog.index = index;
      let form = Object.assign({}, this.table.items[index]);
      this.dialog.form = form;

      (this.dialog.ruleInfo = null),
        (this.dialog.creditInfo = {
          idOcrDetail: {
            depInfo: "",
            effBeginDate: "",
            effEndDate: "",
            idCardHeadUrl: "",
            idCardEmblemUrl: "",
            idNo: "",
            name: ""
          },
          bankOcrDetail: {
            bankName: "",
            cardNo: "",
            bankCardUrl: ""
          },
          livenessDetail: {
            verifyMsg: "",
            faceImgUrl: "",
            livenessVideoUrl: ""
          },
          audioDetail: {
            verifyMsg: "",
            words: "",
            audioUrl: ""
          },
          openAccountFormDetail: {
            verifyMsg: "",
            openAccountFileUrl: ""
          }
        });

      this.dialog.show = true;
      this.dialog.edit = false;
      this.getDetail();
    },

    showImage(url) {
      this.$msgbox({
        title: "图片预览",
        customClass: "m-message-box-img",
        message: this.$createElement("img", {
          style: "color: teal",
          attrs: { src: url }
        })
      }).catch(() => {});
    },

    /**
     * 查询
     */
    getDetail() {
      this.dialog.loading = true;
      let params = { sno: this.dialog.form.sno };

      api
        .getBusinessAccount(params)
        .then(res => {
          this.dialog.loading = false;
          let data = res.data;
          if (data && data.code === "0" && data.data && data.data.accountInfo) {
            this.dialog.form = { ...this.form, ...data.data.accountInfo };
            if (data.data.ruleInfo) {
              this.dialog.ruleInfo = data.data.ruleInfo;
            }

            if (data.data.creditInfo) {
              this.dialog.creditInfo = {
                ...this.form,
                ...data.data.creditInfo
              };
            }
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },

    /**
     * 查询
     */
    query() {
      this.loading = true;
      let params = bsmp.util.deleteBlank(this.search);
      params = Object.assign({}, params, this.table.pager);

      if (
        params.createDate &&
        params.createDate.length &&
        params.createDate[0] &&
        params.createDate[1]
      ) {
        params.beginDate = bsmp.util.formatDate.format(
          params.createDate[0],
          "yyyy-MM-dd hh:mm:ss"
        );
        params.endDate =
          bsmp.util.formatDate.format(params.createDate[1], "yyyy-MM-dd") +
          " 23:59:59";
        delete params.createDate;
      }

      api
        .getBusinessAccountList(params)
        .then(res => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === "0") {
            this.table.items = data.data.data;
            this.table.pager = Object.assign({}, this.table.pager, {
              pageNo: data.data.pageNo,
              total: data.data.total
            });
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },

    /**
     * 每页显示条数变化
     * @param val
     */
    handleSizeChange(val) {
      this.table.pager.pageSize = val;
      this.query();
    },

    /**
     * 页码变化
     * @param val
     */
    handleCurrentChange(val) {
      if (this.table.pager.pageNo) {
        this.table.pager.pageNo = val;
        this.query();
      }
    }
  }
};

// 表单规则
let rules = {
  applyNo: [{ required: true, message: "请输入申请单号", trigger: "blur" }],
  idNo: [{ required: true, message: "请输入身份证", trigger: "blur" }],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  phone: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
  openAccountWay: [
    { required: true, message: "请输入开户方式", trigger: "blur" }
  ],
  operator: [{ required: true, message: "请输入业务方人员", trigger: "blur" }],
  channel: [{ required: true, message: "请输入入口渠道", trigger: "blur" }],
  openAccountType: [
    { required: true, message: "请输入开户类型", trigger: "blur" }
  ]
};
</script>
<style lang="stylus" scoped>
.row-co {
  padding: 5px;

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
    left: 0;
  }
}

.upload-img-video {
  display: inline-block;
  height: 200px;
  position: relative;

  img {
    height: 100%;
  }

  .progress {
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0;
  }
}

.media_box {
  border: 1px solid #dfe6ec;
  border-radius: 4px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 5px;
}

.block_bar {
  color: #4096ff;
  padding: 10px 0;
  border-top: 1px solid #dfe6ec;
}

.result {
  border-bottom: 1px solid #dfe6ec;
  margin-bottom: 10px;
  color: #E00202;
  line-height: 25px;

  .title {
    padding-bottom: 5px;
    font-weight: bold;
    background: #eff2f7;
    padding: 0 20px;
  }

  .content {
    padding: 0 20px;
    display: flex;

    .label {
      flex: 8;
    }

    .list {
      flex: 92;
    }
  }
}

.detail {
  border-bottom: 1px solid #dfe6ec;
  margin-bottom: 10px;
  height: 1300px;

  .media {
    .block_bar {
      padding-left: 10px;
    }

    .el-row {
      padding-left: 10px;
    }
  }

  .operate-box{
    border: 1px solid #dfe6ec;
    border-radius: 4px;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
  }

  .form_status{
    margin-top: 20px;
    margin-bottom: 10px;
    color: #4096ff;
  }

  .el-select  {
    width: 100%;
  }
}
</style>

