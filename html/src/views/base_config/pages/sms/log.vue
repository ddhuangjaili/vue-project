<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.appCode" placeholder="应用方" class="inputStyle"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.phone" placeholder="手机号" class="inputStyle"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.content" placeholder="短信内容" class="inputStyle"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.channel" clearable filterable placeholder="发送渠道">
            <el-option v-for="b in smsChannels" :label="b.dictName" :value="b.dictCode"
                       :key="'form-channel-'+ b.dictCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="clear">清空</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.download" type="primary" @click="handleDownload" title="导出" :loading="downloading"><i class="icon-download"></i>&nbsp;&nbsp;导出</el-button>
        </el-form-item>
<!--        <a id="download-btn" download="短信发送记录.xls" href="#"
           @click="exportExcel"
           class="el-button el-button&#45;&#45;small export-btn"><i class="icon-download"></i>导出</a>-->
        <br>
        <el-form-item>
          <el-select clearable v-model="search.status" placeholder="发送状态">
            <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                       :key="'search-status-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="search.startDate"
            type="date"
            class="inputStyle"
            :clearable="true"
            placeholder="发送开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到">
          <el-date-picker
            v-model="search.endDate"
            type="date"
            class="inputStyle"
            :clearable="true"
            placeholder="发送结束时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-table
      id="tableExcel"
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      stripe
      :max-height="height - 165"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="appCode"
        label="应用方"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="phone"
        label="手机号"
        width="150">
      </el-table-column>
<!--      <el-table-column
        :show-overflow-tooltip="true"
        prop="code"
        label="短信验证码"
        width="150">
      </el-table-column>-->
      <el-table-column
        :show-overflow-tooltip="true"
        prop="content"
        label="短信内容"
        width="300">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="channel"
        :formatter="channelFmt"
        label="发送渠道"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="sendtime"
        :formatter="dateFmt"
        label="发送时间"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="status"
        :formatter="statusFmt"
        label="发送状态"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="respCode"
        label="返回状态码">
      </el-table-column>
    </el-table>
    <el-pagination class="pull-right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="table.pager.page"
                   :page-sizes="[20, 50, 100, 200]"
                   :page-size="table.pager.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="table.pager.total">
    </el-pagination>
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'base_config_sms_log',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        userInfo: null,
        loading: true,
        downloading: false,
        search: {
          appCode: '',
          phone: '',
          content: '',
          channel: '',
          status: '',
          startDate: null,
          endDate: null,
          sort: 'sendtime',
          order: 'desc'
        },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            page: 1,
            total: 0
          }
        },
        smsChannels:[],
        smsChannelMap: {},
        statusMap: {
          'Y': '成功',
          'N': '失败'
        }
      };
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      if (this.userInfo.loginName) {
        this.getSmsChannels().then(() => {
          this.query();
        });
      }
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'base_config_sms_log_list',
          download: 'base_config_sms_log_download'
        });
      },
      company() {
        return bsmp.util.getCompany();
      },
      loginUser() {
        return bsmp.util.getUserInfo();
      }
    },
    watch: {
      'company': function (company) {
        if (this.userInfo.companyId === 'ALL' && company) {
          this.getSmsChannels().then(() => {
            this.query();
          });
        }
      },
      'loginUser': function (loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
          this.getSmsChannels().then(() => {
            this.query();
          });
        }
      }
    },
    methods: {
      /**
       * 日期格式化
       * */
      dateFmt (row) {
        return row.sendtime ? bsmp.util.formatDate.format(new Date(row.sendtime), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      /**
       * 日期格式化
       * */
      statusFmt (row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
      },
      /**
       * 渠道格式化
       * */
      channelFmt (row) {
        return typeof row.channel !== 'undefined' ? this.smsChannelMap[row.channel] : '';
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

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        if (this.getCompanyId()) {
          params.companyId = this.getCompanyId();
        }
        if(this.search.startDate){
          params.startDate = bsmp.util.formatDate.format(this.search.startDate, 'yyyy-MM-dd');
        }
        if(this.search.endDate){
          params.endDate = bsmp.util.formatDate.format(this.search.endDate, 'yyyy-MM-dd');
        }
        if(params.startDate > params.endDate){
          this.$message({
            type: 'error',
            message: '开始时间不能大于结束时间!'
          });
          this.loading = false;
          return;
        }
        params = Object.assign({}, params, this.table.pager);
        api.getSmsLogList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.list;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                page: data.data.pageNum,
                total: data.data.total
              });
          }
        }).catch(e => {
          this.loading = false;
        });
      },
      /**
       *获取短信发送渠道
       * */
      getSmsChannels() {
        return api.getDict({parentDictCode: 'SmsChannel',companyId: this.getCompanyId()}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.smsChannels = data.data;
            if (this.smsChannels && this.smsChannels.length) {
              this.smsChannels.forEach((item) => {
                this.smsChannelMap[item.dictCode] = item.dictName;
              });
            }
          }
        });
      },
      /**
       * 清空
       */
      clear (){
        this.search = {
            appCode: '',
            phone: '',
            content: '',
            channel: '',
            status: '',
            startDate: null,
            endDate: null

        }
      },
      /**
       * 下载
       */
      handleDownload() {
        let params = bsmp.util.deleteBlank(this.search);
        if (this.getCompanyId()) {
          params.companyId = this.getCompanyId();
        }
        if(this.search.startDate){
          params.startDate = bsmp.util.formatDate.format(this.search.startDate, 'yyyy-MM-dd');
        }
        if(this.search.endDate){
          params.endDate = bsmp.util.formatDate.format(this.search.endDate, 'yyyy-MM-dd');
        }
        if(params.startDate > params.endDate){
          this.$message({
            type: 'error',
            message: '开始时间不能大于结束时间!'
          });
          this.loading = false;
          return;
        }
        this.downloading = true;
        params = Object.assign({}, params, this.table.pager);
        api.downloadSmsLogList(params).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            const filedHeader = ['序号', '应用方', '手机号', '短信内容', '发送渠道', '返回状态码', '发送状态', '发送时间'];
            const fieldNames = ['id', 'appCode', 'phone', 'content', 'channel', 'respCode', 'statusStr', 'sendtimeStr'];
            let filedData = bsmp.util.excellentExport.formatJson(fieldNames, data.data);
            bsmp.util.excellentExport.csvByData('短信发送记录.csv', filedHeader, filedData);
          }
          this.downloading = false;
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
        if (this.table.pager.page) {
          this.table.pager.page = val;
          this.query();
        }
      },
      /**
       * 分页下载
       */
      exportExcel() {
        return bsmp.util.excellentExport.excel('download-btn', 'tableExcel', '邮件发送记录');
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .inputStyle
    width: 215px
  .export-btn
    text-decoration none
    background #20a0ff
    color #fff
</style>
