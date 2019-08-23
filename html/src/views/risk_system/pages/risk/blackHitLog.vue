<template>
  <div>
    <query-panel>
      <el-tabs type="border-card" v-model="stat.levelType" @tab-click="tabChange" v-show="optAuth.blackStat">
        <el-tab-pane label="库存黑名单数量统计" name="黑名单">
          <span v-for="(key,val) in levelItemMap" :key=key>
            {{key}}{{stat.items[val] ? stat.items[val] : 0}}&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </el-tab-pane>
        <el-tab-pane label="库存危险名单数量统计" name="危险名单">
          <span v-for="(key,val) in levelItemMap" :key=key>
            {{key}}{{stat.items[val] ? stat.items[val] : 0}}&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </el-tab-pane>
      </el-tabs>
      <br/>
      <el-form ref="searchForm" :inline="true" :model="search" class="demo-form-inline" :rules="rules">
        <el-form-item label="命中记录类型：" prop="level">
          <el-select clearable v-model="search.level" filterable placeholder="命中记录类型" @change="changeMark">
            <el-option v-for="(val, key) in levelMap" :label="val" :value="val"
                       :key="'search-level-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间：" prop="createDate">
          <el-date-picker
            clearable
            v-model="search.createDate"
            type="daterange"
            placeholder="时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="平台：">
          <el-select clearable v-model="search.tradePlatform" filterable placeholder="平台">
            <el-option v-for="(val, key) in tradePlatformMap" :label="key" :value="key"
                       :key="'search-tradePlatform-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签：" >
          <el-select clearable v-model="search.riskMark" filterable placeholder="标签">
            <el-option v-for="(val, key) in labelMap" :label="val[0]" :value="val[1]"
                        :key="'add-form-riskMark-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号：">
          <el-input v-model="search.accountNo" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="search.accountName" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="身份证：">
          <el-input v-model="search.idCard" placeholder="身份证"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="search.phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item label="IP地址：">
          <el-input v-model="search.ip" placeholder="IP地址"></el-input>
        </el-form-item>
        <el-form-item label="IMEI：">
          <el-input v-model="search.imei" placeholder="IMEI"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址：">
          <el-input v-model="search.email" placeholder="邮箱地址"></el-input>
        </el-form-item>
        <el-form-item label="银行卡：">
          <el-input v-model="search.bankCard" placeholder="银行卡"></el-input>
        </el-form-item>
        <el-form-item label="deviceID：">
          <el-input v-model="search.deviceId" placeholder="deviceID"></el-input>
        </el-form-item>
        <el-form-item label="UUID：">
          <el-input v-model="search.uuid" placeholder="UUID"></el-input>
        </el-form-item>
        <el-form-item label="IDFA：">
          <el-input v-model="search.idfa" placeholder="IDFA"></el-input>
        </el-form-item>
        <el-form-item label="cookie：">
          <el-input v-model="search.cookie" placeholder="cookie"></el-input>
        </el-form-item>
        <div class="times-item">高频命中记录类型：</div>
        <el-form-item label="高频账号次数：">
          <el-input-number v-model="search.accountNoFrequencyTimes" controls-position="right" :min="0" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="高频姓名次数：">
          <el-input-number v-model="search.accountNameFrequencyTimes" controls-position="right" :min="0" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="高频邮箱次数：">
          <el-input-number v-model="search.emailFrequencyTimes" controls-position="right" :min="0" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="高频手机次数：">
          <el-input-number v-model="search.phoneFrequencyTimes" controls-position="right" :min="0" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="高频身份证次数：">
          <el-input-number v-model="search.idCardFrequencyTimes" controls-position="right" :min="0" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="高频银行卡次数：">
          <el-input-number v-model="search.bankCardFrequencyTimes" controls-position="right" :min="0" size="small"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="clear">清空</el-button>
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
      :max-height="height - 460"
      style="width: 100%">
      <el-table-column type="index" label="序号" width="80">
      </el-table-column> 
      <el-table-column
        :show-overflow-tooltip="true"
        label="查询项"
        min-width="360">
        <template slot-scope="item">
          <span v-show="item.row.accountNameReq">
            <span class="label">姓名:</span>
            <span>{{ item.row.accountNameReq }}</span>
          </span>
          <span v-show="item.row.accountNoReq">
            <span class="label">账号:</span>
            <span>{{ item.row.accountNoReq }}</span>
          </span>
          <span v-show="item.row.ipReq">
            <span class="label">ip:</span>
            <span>{{ item.row.ipReq }}</span>
          </span>
          <span v-show="item.row.idCardReq">
            <span class="label">身份证:</span>
            <span>{{ item.row.idCardReq }}</span>
          </span>
          <span v-show="item.row.phoneReq">
            <span class="label">电话号码:</span>
            <span>{{ item.row.phoneReq }}</span>
          </span>
          <span v-show="item.row.bankCardReq">
            <span class="label">银行卡:</span>
            <span>{{ item.row.bankCardReq }}</span>
          </span>
          <span v-show="item.row.emailReq">
            <span class="label">邮箱:</span>
            <span>{{ item.row.emailReq }}</span>
          </span>
          <span v-show="item.row.imeiReq">
            <span class="label">imei:</span>
            <span>{{ item.row.imeiReq }}</span>
          </span>
          <span v-show="item.row.idfaReq">
            <span class="label">idfa:</span>
            <span>{{ item.row.idfaReq }}</span>
          </span>
          <span v-show="item.row.uuidReq">
            <span class="label">uuid:</span>
            <span>{{ item.row.uuidReq }}</span>
          </span>
          <span v-show="item.row.cookieReq">
            <span class="label">cookie:</span>
            <span>{{ item.row.cookieReq }}</span>
          </span>
          <span v-show="item.row.deviceIdReq">
            <span class="label">deviceID:</span>
            <span>{{ item.row.deviceIdReq }}</span>
          </span>
        </template>
      </el-table-column>      
      <el-table-column
        :show-overflow-tooltip="true"
        prop="tradePlatform"
        label="平台"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="level"
        :formatter="levelFmt"
        label="命中记录类型"
        width="120">
      </el-table-column>
      <el-table-column
        prop="createDate"
        :formatter="createDateFmt"
        label="命中时间"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="accountNo"
        label="帐号"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="idCard"
        label="身份证"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="phone"
        label="手机号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bankCard"
        label="银行卡"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="email"
        label="邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="ip"
        label="IP"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="accountName"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="imei"
        label="imei"
        width="250">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="idfa"
        label="idfa"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="uuid"
        label="uuid"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="cookie"
        label="cookie"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="deviceId"
        label="deviceID"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="riskMark"
        label="标签编码"
        width="200">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="风险备注"
        width="250">
      </el-table-column>
    </el-table>
    <div v-show="optAuth.hitSummary && statSummary.items" style="margin-top:10px">
      命中记录汇总：{{statSummary.level}}&nbsp;&nbsp;&nbsp;&nbsp;
      账号数：{{statSummary.items.accountNoCount ? statSummary.items.accountNoCount : 0}}&nbsp;&nbsp;&nbsp;&nbsp;
      姓名数：{{statSummary.items.accountNameCount ? statSummary.items.accountNameCount : 0}}&nbsp;&nbsp;&nbsp;&nbsp;
      身份证数： {{statSummary.items.idCardCount ? statSummary.items.idCardCount : 0}}&nbsp;&nbsp;&nbsp;&nbsp;
      手机号数：{{statSummary.items.phoneCount ? statSummary.items.phoneCount : 0}}&nbsp;&nbsp;&nbsp;&nbsp;
      银行卡数：{{statSummary.items.bankCardCount ? statSummary.items.bankCardCount : 0}}&nbsp;&nbsp;&nbsp;&nbsp;
      邮箱数：{{statSummary.items.emailCount ? statSummary.items.emailCount : 0}} &nbsp;&nbsp;&nbsp;&nbsp;
      imei数：{{statSummary.items.imeiCount ? statSummary.items.imeiCount : 0}}&nbsp;&nbsp;&nbsp;&nbsp;
      idfa数：{{statSummary.items.idfaCount ? statSummary.items.idfaCount : 0}} &nbsp;&nbsp;&nbsp;&nbsp;
      uuid数：{{statSummary.items.uuidCount ? statSummary.items.uuidCount : 0}}&nbsp;&nbsp;&nbsp;&nbsp;
      cookie数：{{statSummary.items.cookieCount ? statSummary.items.cookieCount : 0}} &nbsp;&nbsp;&nbsp;&nbsp;
      deviceID数：{{statSummary.items.deviceIdCount ? statSummary.items.deviceIdCount : 0}}&nbsp;&nbsp;&nbsp;&nbsp;
      IP数：{{statSummary.items.ipCount ? statSummary.items.ipCount : 0}}
    </div>
    <el-pagination class="pull-right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="table.pager.page"
                   :page-sizes="[10, 20, 50, 100, 1000, 5000]"
                   :page-size="table.pager.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="table.pager.total">
    </el-pagination>
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'risk_system_black_hit_log',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading:false,
        stat: {
          levelType: '黑名单',
          items: {

          }
        },
        labelMap: {

        },
        levelMap: {
          '1':'黑名单',
          '2':'危险名单',
        },
        levelItemMap: {
          'accountNoCount': '账号数：',
          'accountNameCount': '姓名数：',
          'idCardCount': '身份证数：',
          'phoneCount': '手机号数：',
          'bankCardCount': '银行卡数：',
          'emailCount': '邮箱数：',
          'imeiCount': 'imei数：',
          'idfaCount': 'idfa数：',
          'uuidCount': 'uuid数：',
          'cookieCount': 'cookie数：',
          'deviceIdCount': 'deviceID数：',
          'ipCount': 'ip数：'
        },
        tradePlatformMap: {
          'GTS':'GTS',
          'GTS2':'GTS2',
          'MT4':'MT4',
          'MT5':'MT5'
        },
        levelType: '黑名单',
        search:{
          level: '黑名单',
          createDate:'',
          tradePlatform:'',
          riskMark:'',
          accountNo:'',
          phone:'',
          ip:'',
          imei:'',
          email:'',
          bankCard:'',
          deviceId:'',
          uuid:'',
          idfa:'',
          cookie:'',
          accountNoFrequencyTimes:'',
          accountNameFrequencyTimes:'',
          emailFrequencyTimes:'',
          phoneFrequencyTimes:'',
          idCardFrequencyTimes:'',
          bankCardFrequencyTimes:'',
          createDateStart: '',
          createDateEnd: '',
          accountName:'',
          idCard:''
        },
        table: {
          items: [],
          pager: {
            pageSize: 10,
            pageNo: 1,
            total: 0
          }
        },
        statSummary: {
          level:'',
          items:{},
        },
        rules: {
          level: [
            { required: true, message: ' ', trigger: 'change' },
          ],
        }
      };
    },
    watch: {
      'company': function (company) {
        if (this.userInfo.companyId === 'ALL' && company) {
          this.getLabelDic().then(() => {
            this.query();
          });
          this.blackStat();
        }
      },
      'loginUser': function (loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
          this.getLabelDic().then(() => {
            this.query();
          });
          this.blackStat();
        }
      }
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      if (this.userInfo.loginName) {
        this.getLabelDic().then(() => {
          this.query();
        });
        this.blackStat();
      }
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'risk_system_black_findHitList',
          blackStat: 'risk_system_black_stat',
          hitSummary: 'risk_system_black_statHitSummary',
        });
      },
      company() {
        return bsmp.util.getCompany();
      },
      loginUser() {
        return bsmp.util.getUserInfo();
      }
    },
    methods: {
      /**
       * 命中记录类型格式化
       * @param row
       * @returns {string}
       */
      levelFmt (row) {
        return typeof row.level !== 'undefined' ? this.levelMap[row.level] : '';
      },
      /**
       * 命中日期格式化
       * */
      createDateFmt (row) {
        return row.createDate ? bsmp.util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      //tab切换获取库存数量统计
      tabChange(tab, event) {
        this.blackStat();
      },
      //改变命中记录获取标签
      changeMark(val){
        this.getLabelDic();
      },
      //获取库存数量统计
      blackStat() {
        let level = '';
        if(this.stat.levelType === '黑名单') {
          level = 1;
        }else if(this.stat.levelType === '危险名单'){
          level = 2;
        }
        api.getBlackStat({level:level}).then((res) => {
          this.loading = false;
          let data = res.data;
          if(data && data.code == '0'){
            this.stat.items = data.data
          }
        }).catch(e => {

        });
      },
      //命中记录汇总
      getStatHitSummary(){
        let level = '';
        if(this.search.level === '黑名单') {
          level = 1;
        }else if(this.search.level === '危险名单'){
          level = 2;
        }
        let params = {
          level: level,
          riskMark: this.search.riskMark,
          tradePlatform: this.search.tradePlatform,
          accountNo: this.search.accountNo,
          ip: this.search.ip,
          phone: this.search.phone,
          bankCard: this.search.bankCard,
          email: this.search.email,
          imei: this.search.imei,
          idfa: this.search.idfa,
          uuid: this.search.uuid,
          cookie: this.search.cookie,
          deviceId: this.search.deviceId,
          accountName: this.search.accountName,
          idCard: this.search.idCard,
          createDateStart: this.search.createDateStart,
          createDateEnd: this.search.createDateEnd,
          accountNoFrequencyTimes: this.search.accountNoFrequencyTimes,
          accountNameFrequencyTimes: this.search.accountNameFrequencyTimes,
          emailFrequencyTimes: this.search.emailFrequencyTimes,
          phoneFrequencyTimes: this.search.phoneFrequencyTimes,
          idCardFrequencyTimes: this.search.idCardFrequencyTimes,
          bankCardFrequencyTimes: this.search.bankCardFrequencyTimes,
        };
        api.getStatHitSummary(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.statSummary.level = this.search.level;
            this.statSummary.items = data.data;
          }
        }).catch(e => {
          this.loading = false;
        });
      },
      /**
       * 获取案件标签字典
       * */
      getLabelDic (){
        let level = 1;
        if(this.search.level === '黑名单') {
          level = 1;
        } else if(this.search.level === '危险名单'){
          level = 2;
        }
        let params = {
          companyId: this.getCompanyId(),
          status:'1',
          level:level,
          pageSize : 1000
        };
        return api.getRiskLabelList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            let labels = data.data;
            if(labels){
              const map = new Map();
              for (let item of labels.data) {
                map.set(item.riskLabel+"/"+item.riskMark, item.riskMark);
                this.labelMap = [...map];
              }
            }
          }
        }).catch(e => {
          console.error(e);
        });
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
        this.$refs['searchForm'].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = bsmp.util.deleteBlank(this.search);
            params = Object.assign({}, params, this.table.pager);
            // 创建时间处理
            if (params.createDate && params.createDate.length && params.createDate[0] && params.createDate[1]) {
              this.search.createDateStart = params.createDateStart = bsmp.util.formatDate.format(params.createDate[0], 'yyyy-MM-dd hh:mm:ss');
              this.search.createDateEnd = params.createDateEnd = bsmp.util.formatDate.format(params.createDate[1], 'yyyy-MM-dd') + ' 23:59:59';
              delete params.createDate;
            }
            if(params.level === '黑名单') {
              params.level = 1;
            } else if(params.level === '危险名单'){
              params.level = 2;
            }
            api.getFindHitList(params).then((res) => {
              this.loading = false;
              let data = res.data;
              if (data && data.code === '0') {
                this.table.items = data.data.data;
                this.table.pager = Object.assign({}, this.table.pager,
                  {
                    pageNo: data.data.pageNo,
                    total: data.data.total
                  });
                this.getStatHitSummary();
              }
            }).catch(e => {
              this.loading = false;
            });
          }
        })
      },
      //清空
      clear() {
        this.search = {
          level: '黑名单',
          createDate:'',
          tradePlatform:'',
          riskMark:'',
          accountNo:'',
          phone:'',
          ip:'',
          imei:'',
          email:'',
          bankCard:'',
          deviceId:'',
          uuid:'',
          idfa:'',
          cookie:'',
          accountNoFrequencyTimes:'',
          accountNameFrequencyTimes:'',
          emailFrequencyTimes:'',
          phoneFrequencyTimes:'',
          idCardFrequencyTimes:'',
          bankCardFrequencyTimes:'',
          createDateStart: '',
          createDateEnd: '',
          accountName:'',	
          idCard:'',
        }
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
    }
  };

  
</script>
<style lang="stylus" scoped>
.times-item
  padding:10px 0
  border-top:2px solid #eaeefb
</style>