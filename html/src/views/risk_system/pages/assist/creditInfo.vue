<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="search.serviceType" clearable filterable placeholder="验证类型"
             @change="handleServiceTypeCheck">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(val, key) in serviceTypeMap" :label="val" :value="key"
                       :key="'search-serviceType-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.channelCode" clearable filterable placeholder="外部数据源">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="channel in channels" :label="channel.channelName" :value="channel.channelCode"
                       :key="'search-channel-'+ channel.channelCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="search.name" placeholder="客户姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.idNo" placeholder="身份证"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.cardNo" placeholder="银行卡"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.batchQueryId" placeholder="批量查询id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            :editable="false"
            :clearable="false"
            v-model="search.createDate"
            type="datetimerange"
            range-separator=" 至 "
            placeholder="记录时间">
          </el-date-picker>
        </el-form-item>
        
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <a v-show="optAuth.export" class="el-button el-button--primary" download="验证记录查询.xlsx" :href="downloadUrl" title="查询结果导出"
           ><i class="icon-download"></i>导出查询结果</a>
          <el-tooltip class="item item-doubt" effect="dark" content="单次导出最大10000条记录，可调整查询时间点导出相应内容" placement="bottom">
            <i class="icon-help"></i>
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
      :max-height="height - 170"
      style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        label="客户姓名"
        width="120">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="idNo"
        label="身份证号"
        width="180">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="cardNo"
        label="银行卡号"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="phone"
        label="手机号码"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="batchQueryId"
        label="批量查询ID"
        width="180">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createDate"
        :formatter="createDateFmt"
        label="记录时间"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="serviceTypeName"
        label="验证类型"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="channelName"
        label="外部数据源"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="verifyMsg"
        label="验证结果"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="thirdResult"
        :formatter="thirdResultFmt"
        label="查询输出"
        min-width="250">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="100"
        label="详情">
        <template slot-scope="scope">
          <el-button title="查看详情" v-show="scope.row.queryInputList || scope.row.queryOutputList" @click="showDialog(scope.$index)" size="mini"><i class="icon-eye"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="table.pager.page"
          :page-sizes="[50, 100, 200, 500, 1000]"
          :page-size="table.pager.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="table.pager.total">
    </el-pagination>

    <!-- 详细信息 -->
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
  </div>
</template>

<script>
import api from "../../api";
import bsmp  from "bsmp_main";

export default {
  name: "credit_info",
  props: {
    height: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      search: {
        serviceType: "",
        createDate: [
          new Date(bsmp.util.formatDate.format(new Date(), "yyyy-MM-dd") + ' 00:00:00'), 
          new Date(bsmp.util.formatDate.format(new Date(), "yyyy-MM-dd") + ' 23:59:59')
        ],
        channelCode: "",
        name: "",
        idNo: "",
        cardNo: "",
        phone: "",
        batchQueryId: ""
      },
      table: {
        items: [],
        pager: {
          pageSize: 50,
          pageNo: 1,
          total: 0
        }
      },
      serviceTypeMap: {
        phone_name:'手机二要素验证',
        phone:'手机三要素验证',
        id:'身份二要素验证',
        bank_2:'银行卡二要素验证',
        bank_3:'银行卡三要素验证',
        bank_4:'银行卡四要素验证',
        phone_time:'手机号在网时长查询',
        phone_status:'手机号在网状态查询',
        phone_city_check:'手机号当前城市核验',
        card_his:'银行历史交易记录查询',
        suit_info:'个人诉讼信息查询',
        multi_loan:'多平台借贷情况：网贷/银行',
        multi_loan_all:'多平台借贷情况：网贷/银行（全景升级版）',
        overdue:'逾期贷款记录',
        hit_list:'命中行业失信记录',
        phone_mark:'手机号标签（暗网信息-WXLR）',
        phone_mark_net:'手机号标签（互联网信息-SM）',
        total_debt:'当前共债情况',
        video_verify:'WEB视频认证',
        face_compare:'APP视频认证',
        ocr_id:'身份证正面OCR',
        ocr_id_back:'身份证反面OCR',
        ocr_bank:'银行卡OCR',
        ip:'IP定位查询',
        phone_address:'手机归属地查询',
        multi_loan_baidu:'多平台借贷情况：网贷/银行（百度版）',
        risk_list_baidu:'风险名单查询（百度版）',
        black_industry_baidu:'用户关联黑产分析（百度版）',
      },
      channels: [],
      dialog: {
        show: false,
        index: -1, // 数据下标
        form: null
      },
      queryInputActive: 'queryInput',
      queryOutputActive: 'queryOutput'
    };
  },

  mounted() {
    this.query();
  },
  computed: {
    optAuth() {
      return bsmp.util.mapAuth({
        search: "credit_info_search",
        export: "credit_info_export"
      });
    },
    downloadUrl() {
      let params = this.getQueryParams();
      params.token = bsmp.util.getToken();
      let keyVals = [];
      for (let key in params) {
        keyVals.push(`${key}=${params[key]}`);
      }
      return `${api.path}/credit/info/exportFile?${keyVals.join('&')}`;
    }
  },
  methods: {
    createDateFmt(row) {
      return typeof row.createDate !== 'undefined' ? row.createDate.replace('.0', '') : "";
    },
    serviceTypeFmt(row) {
      return row.serviceType ? this.serviceTypeMap[row.serviceType] : "";
    },
    thirdResultFmt(row) {
      return row.thirdResult
    },
    handleServiceTypeCheck() {
      this.search.channelCode = "";
      this.channels = [];
      this.getChannelDic();
    },

    getToken() {
      let user = window.sessionStorage.getItem('user'),
        token = null;
      if (user) {
        user = JSON.parse(user);
        if (user.code && user.code === '0'
          && user.data && user.data.tokenVal && user.data.tokenVal.token) {
          token = user.data.tokenVal.token;
        }
      }
    },

    getQueryParams(type) {
      let params = bsmp.util.deleteBlank(this.search);
      //查询校验数据格式
      if(type){
        if (this.search.idNo !== ""
          && /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.search.idNo) == false) {
          this.$message.warning("请输入正确的身份证！");
          return null;
        }
        if (this.search.phone !== "" && bsmp.util.isMobile(this.search.phone) == false) {
          this.$message.warning("请输入正确的手机号码！");
          return null;
        }
        if (this.search.cardNo !== "" && /^\d{16}|\d{19}$/.test(this.search.cardNo) == false) {
          this.$message.warning("请输入正确的银行卡号！");
          return null;
        }
      }
      if (params.createDate && params.createDate.length && params.createDate[0] && params.createDate[1]) {
        params.beginDate =  bsmp.util.formatDate.format(params.createDate[0], "yyyy-MM-dd hh:mm:ss");
        params.endDate = bsmp.util.formatDate.format(params.createDate[1], "yyyy-MM-dd hh:mm:ss");
        delete params.createDate;
      }
      return params;
    },

    //显示详细弹窗
    showDialog(index) {
      this.dialog.index = index;
      let form = Object.assign({}, this.table.items[index]);
      this.dialog.form = form;
      this.dialog.show = true;
    },

    /**
     * 查询
     */
    query() {
      let params = this.getQueryParams(true);
       params = Object.assign({}, params, this.table.pager);

      this.loading = true;
      api.getCreditInfo(params).then(res => {
        this.loading = false;
        let data = res.data;
        if (data && data.code === "0") {
          this.table.items = data.data.data;
          this.table.pager = Object.assign({}, this.table.pager, {
            pageNo: data.data.pageNo,
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
    },

    /**
     * 获取通道源字典
     * */
    getChannelDic() {
      if (!this.search.serviceType) {
        return;
      }
      return api.getChannelDic({ serviceTypes: this.search.serviceType }).then(res => {
        let data = res.data;
        if (data && data.code === "0") {
          this.channels = data.data;
        }
      }).catch(e => {
        console.error(e);
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.stat-table 
  width: 100%;
  line-height: 30px;
  thead 
    color: #5e6d82;
    background-color: #eff2f7;
    th 
      width: 50%;
      text-align: center;
      border: 1px solid rgb(223, 230, 236);
  tbody 
    td 
      text-align: center;
      border: 1px solid rgb(223, 230, 236);

.item-doubt
  background:#c4c4c4;
  border-radius:50%;
  cursor:pointer;
  &:before
    color:#fff; 
    margin-right:0.25rem;
</style>
