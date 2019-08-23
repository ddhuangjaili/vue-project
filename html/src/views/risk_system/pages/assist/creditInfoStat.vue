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
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.createDate"
            type="daterange"
            placeholder="创建时间">
          </el-date-picker>
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
      :max-height="height - 100"
      style="width: 100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="channelName"
        label="外部数据源"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="serviceTypeName"
        label="验证类型">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="totalCount"
        label="使用次数"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="successCount"
        label="成功次数"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="artificialCount"
        label="人工调用成功次数"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="systemCount"
        label="系统调用成功次数"
        width="200">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from "../../api";
import bsmp  from "bsmp_main";

export default {
  name: "credit_info_stat",
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
        createDate: null,
        channelCode: ""
      },
      table: {
        items: [],
        pager: {
          pageSize: 10,
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
      channels: []
    };
  },

  mounted() {
    this.query();
  },
  computed: {
    optAuth() {
      return bsmp.util.mapAuth({
        search: "credit_info_stat_search"
      });
    }
  },
  methods: {
    serviceTypeFmt(row) {
      return row.serviceType ? this.serviceTypeMap[row.serviceType] : '';
    },
    handleServiceTypeCheck() {
      this.search.channelCode = "";
      this.channels = [];
      this.getChannelDic();
    },

    /**
     * 查询
     */
    query() {
      this.loading = true;
      let params = bsmp.util.deleteBlank(this.search);
      params = Object.assign({}, params, this.table.pager);

      if (params.createDate && params.createDate.length && params.createDate[0] && params.createDate[1]) {
        params.statDateBegin = bsmp.util.formatDate.format(params.createDate[0], "yyyy-MM-dd hh:mm:ss");
        params.statDateEnd = bsmp.util.formatDate.format(params.createDate[1], "yyyy-MM-dd") + " 23:59:59";
        delete params.createDate;
      }

      api.getCreditInfoStat(params).then(res => {
        this.loading = false;
        let data = res.data;
        if (data && data.code === "0") {
          this.table.items = data.data;
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
