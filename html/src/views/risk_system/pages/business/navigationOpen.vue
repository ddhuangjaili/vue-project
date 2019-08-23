<template>
  <div class="form-co" :style="{height: (height - 20) + 'px'}">

    <el-form ref="accountForm" label-width="120px" class="b-form">
      <el-steps class="nav-step b-step" :space="140" :active="step" align-center simple>
        <el-step title="客户信息"></el-step>
        <el-step title="关联信息"></el-step>
        <el-step title="适当性信息"></el-step>
        <el-step title="风险测评"></el-step>
        <el-step title="账户信息"></el-step>
        <el-step title="影像采集"></el-step>
      </el-steps>

      <div class="b-tip-block">
        <div class="title"><i class="icon icon-filesearch filesearch"></i>业务准入标准</div>
        <div class="text-block">
          <div class="text-tip">提示</div>
          <div class="text-pop"><a>1</a>请向客户揭示本业务风险并进行投资者教育。</div>
        </div>
      </div>

      <template v-if="step == 1">
        <el-form label-width="102px" label-position="left" class="nav-item-form" style="padding: 10px 15px 0 15px;">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="开户机构：">
                <el-select v-model="select[0]" placeholder="必填">
                  <el-option
                    label="0203 深圳区域中心"
                    value="">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户模板：">
                <el-select v-model="select[1]" placeholder="必填">
                  <el-option
                    label="242-机构账户"
                    value="">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户代码：">
                <el-input placeholder="必填">
                  <template slot="append">
                    <el-button>生成</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-collapse v-model="activeNames" class="nav-collapse">
          <el-collapse-item title="基本信息" name="1-1">
            <el-form label-width="102px" label-position="left" class="nav-item-form">
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item label="机构全称：">
                    <el-input placeholder="必填" v-model="this.detectMap.business_license.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="机构简称：">
                    <el-input placeholder="必填" v-model="this.detectMap.business_license.name"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="有效证明文件：">
                    <el-select v-model="select[2]" placeholder="必填">
                      <el-option
                        label="10-工商营业执照"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件号码：">
                    <el-input placeholder="必填" v-model="this.detectMap.business_license.no"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="证件开始日期：">
                    <el-date-picker style="width: 160px"
                      type="date" v-model="detectMap.foundDate"
                      format="yyyy年MM月dd日"
                      value-format="yyyy年MM月dd日"
                      @change = "test"
                      placeholder="必填">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="证件结束日期：">
                    <el-date-picker style="width: 160px"
                      type="date">
                    </el-date-picker>
                    <el-checkbox checked>长期</el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item label="证件地址：">
                    <el-input placeholder="必填" v-model="this.detectMap.business_license.address"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="注册国家：">
                    <el-select v-model="select[3]" placeholder="必填">
                      <el-option
                        label="CHN-中国"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" class="dashed-line">
                <el-col :span="8">
                  <el-form-item label="注册地：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="注册资金：">
                    <el-input placeholder="必填">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="注册日期：">
                    <el-date-picker style="width: 160px"
                      type="date" v-model="detectMap.foundDate"
                      placeholder="必填">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="主体身份：">
                    <el-select v-model="select[4]" placeholder="必填">
                      <el-option
                        label="0-普通"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="境内外标识：">
                    <el-select v-model="select[5]" placeholder="必填">
                      <el-option
                        label="0-境内"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="法人类别：">
                    <el-select v-model="select[6]" placeholder="必填">
                      <el-option
                        label="0-内资企业法人"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="机构类别：">
                    <el-select v-model="select[7]" placeholder="必填">
                      <el-option
                        label="21-普通合伙企业"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="行业类别：">
                    <el-select v-model="select[8]" placeholder="必填">
                      <el-option
                        label="0-烟草"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" class="dashed-line">
                <el-col :span="16">
                  <el-form-item label="经营范围：">
                    <el-input placeholder="必填" v-model="detectMap.business_license.businessScope"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="客户分组：">
                    <el-select v-model="select[9]" placeholder="必填">
                      <el-option
                        label="0-普通户"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开通协议：">
                    <el-select v-model="select[10]" placeholder="必填">
                      <el-option
                        label="0-0H外围开放式基金账户"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="操作渠道：">
                    <el-select v-model="select[11]" placeholder="必填">
                      <el-option
                        label="0-柜台系统-1-电话委托"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="投资者分类：">
                    <el-select v-model="select[12]" placeholder="必填">
                      <el-option
                        label="0-普通投资者"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="投资者来源：">
                    <el-select v-model="select[13]" placeholder="必填">
                      <el-option
                        label="00-普通投资者"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

            </el-form>
          </el-collapse-item>
        </el-collapse>

        <div>
          <el-button title="下一步" @click="next" type="primary" class="next-btn">下一步</el-button>
        </div>
      </template>

      <template v-if="step == 2">
        <el-collapse v-model="activeNames" class="nav-collapse">
          <el-collapse-item title="执行事务合伙人或负责人信息" name="2-1">
            <el-form label-width="102px" label-position="left" class="nav-item-form">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="名  称：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件类型：">
                    <el-select v-model="select[14]" placeholder="必填">
                      <el-option
                        label="10-工商营业执照"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件号码：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item label="证件有效期：">
                    <el-date-picker style="width: 160px"
                      type="date"
                      placeholder="必填">
                    </el-date-picker>
                    <el-checkbox checked>长期</el-checkbox>
                    <el-button class="radius-btn">读卡</el-button>
                    <el-button class="radius-btn">公安联网校验</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>

          <el-collapse-item title="合伙企业法人委派代表信息" name="2-2">
            <el-form label-width="102px" label-position="left" class="nav-item-form">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="名  称：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件类型：">
                    <el-select v-model="select[15]" placeholder="必填">
                      <el-option
                        label="00-身份证"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件号码：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item label="证件有效期：">
                    <el-date-picker style="width: 160px"
                      type="date"
                      placeholder="必填">
                    </el-date-picker>
                    <el-checkbox checked>长期</el-checkbox>
                    <el-button class="radius-btn">读卡</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>

          <el-collapse-item title="控股股东信息" name="2-3">
            <el-form label-width="102px" label-position="left" class="nav-item-form">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label-width="0">
                    <el-checkbox>与执行事务合伙人或者负责人信息一致</el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="名  称：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件类型：">
                    <el-select v-model="select[16]" placeholder="必填">
                      <el-option
                        label="00-身份证"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件号码：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item label="证件有效期：">
                    <el-date-picker style="width: 160px"
                      type="date"
                      placeholder="必填">
                    </el-date-picker>
                    <el-checkbox checked>长期</el-checkbox>
                    <el-button class="radius-btn">读卡</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>

          <el-collapse-item title="联系人信息" name="2-4">
            <el-form label-width="102px" label-position="left" class="nav-item-form">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="姓  名：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件类型：">
                    <el-select v-model="select[17]" placeholder="必填">
                      <el-option
                        label="00-身份证"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件号码：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="10">
                  <el-form-item label="证件有效期：">
                    <el-date-picker style="width: 160px"
                      type="date"
                      placeholder="必填">
                    </el-date-picker>
                    <el-checkbox checked>长期</el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item label="联系电话：">
                    <el-input placeholder="必填" style="width: 200px"></el-input>
                    <el-button class="radius-btn">读卡</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>

          <el-collapse-item title="合伙人信息" name="2-5">
            <el-form label-width="102px" label-position="left" class="nav-item-form">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="名  称：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件类型：">
                    <el-select v-model="select[18]" placeholder="必填">
                      <el-option
                        label="00-身份证"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件号码：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="证件有效期：">
                    <el-date-picker style="width: 160px"
                      type="date"
                      placeholder="必填">
                    </el-date-picker>
                    <el-checkbox checked>长期</el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="责任承担方式：">
                    <el-select v-model="select[19]" placeholder="必填">
                      <el-option
                        label="2-有限责任"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>

          <el-collapse-item title="开户经办人信息" name="2-6">
            <el-form label-width="102px" label-position="left" class="nav-item-form">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="姓  名：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件类型：">
                    <el-select v-model="select[20]" placeholder="必填">
                      <el-option
                        label="00-身份证"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="证件号码：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="16">
                  <el-form-item label="证件有效期：">
                    <el-date-picker style="width: 160px"
                      type="date"
                      placeholder="必填">
                    </el-date-picker>
                    <el-checkbox checked>长期</el-checkbox>
                    <el-button class="radius-btn">读卡</el-button>
                    <el-button class="radius-btn">公安联网校验</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="手机号码：">
                    <el-input placeholder="必填"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="联系电话：">
                    <el-input style="width: 60px"></el-input>
                    -
                    <el-input style="width: 150px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>

        </el-collapse>

        <div>
          <el-button title="上一步" @click="back" type="text" class="back-btn">&lt;&nbsp;&nbsp;上一步</el-button>
          <el-button title="下一步" @click="next" type="primary" class="next-btn">下一步</el-button>
        </div>
      </template>

       <template v-if="step == 3">
        <el-collapse v-model="activeNames" class="nav-collapse">
          <el-collapse-item title="不良诚信记录信息" name="3-1">
            <el-form label-width="102px" label-position="left" class="nav-item-form">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="不良诚信记录来源：">
                    <el-select v-model="select[21]">
                      <el-option
                        label="10-网络"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="加扣分：">
                    <el-input></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="不良诚信备注：">
                    <el-input></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="客户涉税信息" name="3-2">
            <el-form label-width="102px" label-position="left" class="nav-item-form">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="税收居民身份：">
                    <el-select v-model="select[22]">
                      <el-option
                        label="1-仅为中国税收居民"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="消极非金融机构标识：">
                    <el-select v-model="select[23]">
                      <el-option
                        label="3-其他机构"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="取得投资人声明标识：">
                    <el-select v-model="select[24]">
                      <el-option
                        label="1-是"
                        value="">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </el-collapse>

        <div>
          <el-button title="上一步" @click="back" type="text" class="back-btn">&lt;&nbsp;&nbsp;上一步</el-button>
          <el-button title="下一步" @click="next" type="primary" class="next-btn">下一步</el-button>
        </div>
      </template>

      <template v-if="step == 4">
        <el-tabs v-model="activeName" type="card" class="nav-tabs">
          <el-tab-pane label="26-机构风险测评试题" name="danger">
            <div class="result">
              <p class="title">预作答测评信息</p>
              <div class="items">
                <div class="item"><span class="label">测评分数：</span><span class="txt">80</span></div>
                <div class="item"><span class="label">测评结果：</span><span class="txt">积极型(中高)</span></div>
                <div class="item"><span class="label">测评时间：</span><span class="txt">2018年07月24日</span></div>
                <div class="item"><span class="label">测评有效期：</span><span class="txt">2020年07月23日</span></div>
              </div>
            </div>

            <div class="questions">
              <div class="title">1.贵单位的性质</div>
              <el-radio-group v-model="radio.nature" class="options">
                <el-radio :label="1" class="option">1)国有企事业单位</el-radio>
                <el-radio :label="2" class="option">2)非上市民营企业</el-radio>
                <el-radio :label="3" class="option">3)外资企业</el-radio>
                <el-radio :label="4" class="option">4)上市公司</el-radio>
              </el-radio-group>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div>
          <el-button title="上一步" @click="back" type="text" class="back-btn">&lt;&nbsp;&nbsp;上一步</el-button>
          <el-button title="下一步" @click="next" type="primary" class="next-btn">下一步</el-button>
        </div>
      </template>

      <template v-if="step == 5">
         <el-collapse v-model="activeNames" class="nav-collapse">
          <el-collapse-item title="股东账户" name="5-1">
            <table class="account-table">
              <thead class="dashed-line">
                <tr>
                  <th width="15%">交易板块</th>
                  <th width="35%" style="padding-left: 30px;">操作</th>
                  <th width="15%">交易板块</th>
                  <th width="35%" style="padding-left: 30px;">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <el-checkbox checked>深A</el-checkbox>
                  </td>
                  <td>
                    <el-button class="opt-btn active">新开</el-button>
                    <el-button class="opt-btn">加挂</el-button>
                    <el-select v-model="select[25]" style="width: 130px">
                      <el-option
                        label="000700【主】"
                        value="">
                      </el-option>
                    </el-select>
                  </td>
                  <td>
                    <el-checkbox checked>沪A</el-checkbox>
                  </td>
                  <td>
                    <el-button class="opt-btn active">新开</el-button>
                    <el-button class="opt-btn">加挂</el-button>
                    <el-select v-model="select[26]" style="width: 130px">
                      <el-option
                        label="61040【主】"
                        value="">
                      </el-option>
                    </el-select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <el-checkbox disabled>深B</el-checkbox>
                  </td>
                  <td>
                    <el-button class="opt-btn" :disabled="true">新开</el-button>
                    <el-button class="opt-btn" :disabled="true">加挂</el-button>
                  </td>
                  <td>
                    <el-checkbox disabled>沪B</el-checkbox>
                  </td>
                  <td>
                    <el-button class="opt-btn" :disabled="true">新开</el-button>
                    <el-button class="opt-btn" :disabled="true">加挂</el-button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <el-checkbox>股转A</el-checkbox>
                  </td>
                  <td>
                    <el-button class="opt-btn" :disabled="true">加挂</el-button>
                  </td>
                  <td>
                    <el-checkbox disabled>股转B</el-checkbox>
                  </td>
                  <td>
                    <el-button class="opt-btn" :disabled="true">加挂</el-button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <el-checkbox>深基金</el-checkbox>
                  </td>
                  <td>
                    <el-button class="opt-btn" :disabled="true">新开</el-button>
                    <el-button class="opt-btn" :disabled="true">加挂</el-button>
                  </td>
                  <td>
                    <el-checkbox>沪基金</el-checkbox>
                  </td>
                  <td>
                    <el-button class="opt-btn" :disabled="true">新开</el-button>
                    <el-button class="opt-btn" :disabled="true">加挂</el-button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="zd-search">
              <div class="title">中登查询结果</div>
              <table class="zd-table" border="0">
                <thead>
                  <tr>
                    <th>一码通</th>
                    <th>证券账户类型</th>
                    <th>证券账户账号</th>
                    <th>证券账户状态</th>
                    <th>关联关系确认</th>
                    <th>指定交易</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div>
          <el-button title="上一步" @click="back" type="text" class="back-btn">&lt;&nbsp;&nbsp;上一步</el-button>
          <el-button title="下一步" @click="next" type="primary" class="next-btn">下一步</el-button>
        </div>
      </template>

      <template v-if="step == 6">
        <div class="collect">
          <div class="types">
            <p class="block-title">影像扫描</p>
            <ul>
              <li v-for="(type, index) in types" :key="'type-' + index" @click="typeChange(index)" :class="{'active': photo.type == index}">
                <span :title="type"><i>*</i>{{type.name}}</span>
                <a v-if="type.img">已采集</a>
                <a v-else>未采集</a>
              </li>
            </ul>
          </div>
          <div class="photo">
            <p class="title">{{types[photo.type].name}}</p>
            <div class="content">
              <img @click="showImage(types[photo.type].img)" v-if="types[photo.type].img" :src="types[photo.type].img"/>
            </div>
            <el-upload
              class="btn-group"
              action="/api/risk_system/business/common/upload"
              :show-file-list="false"
              :on-success="avatarSuccess"
              :before-upload="beforeUpload"
              :on-progress="uploadprogress"
              :on-error="avatarError"
              :data="{type: 'other'}">
              <el-button size="small" type="primary">上传</el-button>
              <el-button style="margin-left: 10px;" size="small" type="primary">拍照</el-button>
            </el-upload>
          </div>
          <div class="result">
            <p class="block-title">扫描结果</p>
            <ul v-if="types[photo.type].img">
              <li v-for="(result, index) in types[photo.type].result" :key="'result-' + index">
                {{result.label}}：{{result.value}}
              </li>
            </ul>
          </div>
        </div>
        <div style="margin-top: 20px;">
          <el-button title="完成" @click="next" type="primary" class="next-btn">完成</el-button>
        </div>
      </template>

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
        orderNo: '',
        types: [
          { name: '证券账户开立申请表', img: '', result: [] },
          { name: '营业执照', img: '', 
            result: [
              { label: '统一社会信用代码', value: '293029399' },
              { label: '名称', value: '深圳腾讯有限公司' },
              { label: '类型', value: '有限责任公司' },
              { label: '住所', value: '深圳南山深港合作区B栋301室' },
              { label: '法定代表人', value: '马化腾' },
              { label: '注册资本', value: '10亿' },
              { label: '成立日期', value: '2003-10-20' },
              { label: '营业开始日期', value: '2003-10-20' },
              { label: '营业截止日期', value: '2023-10-20' },
              { label: '经营范围', value: '计算机软件' },
              { label: '登记机关', value: '深圳市场监督管理局' },
              { label: '登记日期', value: '2003-10-20' },
              { label: '公司印鉴', value: '有' },
              { label: '登记机关印鉴', value: '有' }
            ] 
          },
          { name: '外商投资企业批准证书', img: '', result: [] },
          { name: '创投企业备案文件', img: '', result: [] },
          { name: '组织机构代码证', img: '', result: [] },
          { name: '国税或地税税务登记证', img: '', result: [] },
          { name: '法定代表人证明书', img: '', result: [] },
          { name: '执行事务合伙人或负责人有效身份证明文件', img: '', result: [] },
          { name: '合伙协议', img: '', result: [] },
          { name: '投资各方签署的创投企业合同及章程', img: '', result: [] },
          { name: '法定代表人授权委托书原件', img: '', result: [] },
          { name: '执行事务合伙人或负责人对经办人的授权委托书原件', img: '', result: [] },
          { name: '境外法人还需提供董事会或董事、主要股东授权委托书（原件）', img: '', result: [] },
          { name: '经办人有效身份证明文件原件，验原件，留复印件', img: '', result: [] },
          { name: '全体合伙人或投资者名单、有效身份证明文件', img: '', result: [] },
          { name: '证券资产权属证明文件（可选）', img: '', result: [] },
          { name: '机构留存印鉴（原件）', img: '', result: [] }
        ],
        photo: {
          type: 0
        },
        step: 1,
        activeNames: ['1-1', '2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '3-1', '3-2', '5-1'],
        activeName: 'danger',
        select: [
          '', // 0
          '', // 1
          '', // 2
          '', // 3
          '', // 4
          '', // 5
          '', // 6
          '', // 7
          '', // 8
          '', // 9
          '', // 10
          '', // 11
          '', // 12
          '', // 13
          '', // 14
          '', // 15
          '', // 16
          '', // 17
          '', // 18
          '', // 19
          '', // 20
          '', // 21
          '', // 22
          '', // 23
          '', // 24
          '', // 25
          '', // 26
          ''],
        radio: {
          nature: 2
        },
        detectMap: {
          foundDate: '2012月12年01日',
          business_license:{
            foundDate: '2012-12-01'
          }
        },
      };
    },
    mounted () {
      
    },
    created(){
      if(this.$route.query.orderNo && this.$route.query.orderNo !== 0){
          this.orderNo = this.$route.query.orderNo;
          this.findFileDetect();
      }
      
    },
    methods: {
      test(){
        console.log(this.detectMap.foundDate)
      },

      next() {
        this.step++

        if (this.step === 6) {
          this.typeChange(0)
        }
      },
      typeChange (index) {
        this.photo.type = index
        this.photo.typeName = this.types[this.photo.type].name
      },
      back() {
        this.step--
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
        this.types[this.photo.type].img = res.data.url
        this.$message.success('上传成功' + res.msg);
      },
      avatarError(err, file, fileList) {
        this.$message.error('上传图片失败' + err);
      },
      findFileDetect(){
        let params = {}
        params['fileType'] = 'all'
        params['orderNo'] = this.orderNo
        api.getFileDetect(params).then(res => {
          let data = res.data.data;
          if(data){
            // 获取所有识别的信息列表
            let list = data.result;
            list.forEach(item=>{
              this.detectMap[item.type] = item.data
            })
            console.log(list)
            console.log(this.detectMap.business_license.foundDate)
          }
        });
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .form-co {
    overflow-y: scroll;

    .b-form {
      // border: 1px solid #dfe6ec;
      // border-radius: 4px;
      padding: 10px 0;
      width: 100%;
      text-align center

      .b-step {
        margin-left: 150px;
        margin-bottom: 20px;
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

      .nav-item-form {
        width 80% 
        text-align left 

        .radius-btn {
          border-radius 15px
        }
      }
    }

    .back-btn {
      width 100px  
      border-radius 15px
    }

    .next-btn {
      width 250px  
      background #3e72be
      border-radius 15px
    }

    .nav-tabs {

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
          width: 48%
          float: left
          padding: 10px 0
        }
      }  
    }

    .dashed-line {
      border-bottom 1px dashed #ccc
      margin-bottom 10px
    }

    .account-table {
      width: 100%;
      background: #ede9e8
      border-radius: 5px
      padding: 10px 20px
      color: #2c2930

      th {
        border-bottom 1px dashed #e1dddc
        line-height: 40px
      }
      tbody {
        line-height: 40px

        .opt-btn {
          border-radius: 15px
          &.active {
            background: #3b73bd
            color: #fff  
          }
        }
      }
    }

    .zd-search {

      .title {
        color: #333333
        font-weight: bold
        padding: 10px 0
      }

      .zd-table {
        width: 100%
        line-height: 30px
        border-collapse: collapse
      
        thead {
          background: #4274bd
          color: #fff

          th {
            padding-left: 10px
            position: relative

            &:after {
              content: ''
              position: absolute
              right: 0
              top: 5px
              height: 20px
              width: 1px
              background: #5788cb
            }
          }
        }
      }
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
        height: 100%
        width: 25%
        float: left
        border: 2px solid #d8d8d8

        ul {
          height: calc(100% - 50px)
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

        ul {
          list-style: none;
          line-height: 30px;
          padding: 10px;
        }
      }
    }
  }

</style>
