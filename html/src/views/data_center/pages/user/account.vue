<template>
  <div>
    <query-panel @switchQuery="switchQuery">
      <el-form :model="search" :inline="true" class="demo-form-inline">
        <el-row>
          <el-col :span="1" class="search-label">
            <el-checkbox v-model="select.account">账号</el-checkbox>
          </el-col>
          <el-col :span="23" class="search-ctx">
            <el-select v-model="search.account.accounttype" clearable placeholder="账号类型">
              <el-option v-for="(val, key) in accountTypeMap" :label="val" :value="key"
                         :key="'search-accounttype-'+ key"></el-option>
            </el-select>
            <el-select v-model="search.account.accountlevel" clearable placeholder="账号等级">
              <el-option v-for="(val, key) in accountLevelMap" :label="val" :value="key"
                         :key="'search-accountlevel-'+ key"></el-option>
            </el-select>
            <el-select v-model="search.account.platform" clearable placeholder="交易平台">
              <el-option v-for="(val, key) in platformMap" :label="val" :value="key"
                         :key="'search-platform-'+ key"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="1" class="search-label">
            <el-checkbox v-model="select.open">开户</el-checkbox>
          </el-col>
          <el-col :span="23" class="search-ctx">
            <el-date-picker
              clearable
              v-model="search.open.demofirstaccountopentime"
              type="daterange"
              placeholder="模拟开户时间">
            </el-date-picker>
            <el-date-picker
              clearable
              v-model="search.open.accountopentime"
              type="daterange"
              placeholder="真实开户时间">
            </el-date-picker>
            <br>
            <el-form-item label="模拟开户-激活的间隔：">
              <el-input type="number" size="small" v-model="search.open.startdemoactiveintervaltime"
                        :min="0"></el-input>
            </el-form-item>
            <el-form-item label="-">
              <el-input type="number" size="small" v-model="search.open.enddemoactiveintervaltime" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="天  真实开户-激活的间隔：">
              <el-input type="number" size="small" v-model="search.open.startrealactiveintervaltime"
                        :min="0"></el-input>
            </el-form-item>
            <el-form-item label="-">
              <el-input type="number" size="small" v-model="search.open.endrealactiveintervaltime" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="天"></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="1" class="search-label">
            <el-checkbox v-model="select.active">激活</el-checkbox>
          </el-col>
          <el-col :span="23" class="search-ctx">
            <el-date-picker
              clearable
              v-model="search.active.activetime"
              type="daterange"
              placeholder="激活时间">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="1" class="search-label">
            <el-checkbox v-model="select.cashin">入金</el-checkbox>
          </el-col>
          <el-col :span="23" class="search-ctx">
            <el-date-picker
              clearable
              v-model="search.cashin.firstcashintime"
              type="daterange"
              placeholder="首次存款时间">
            </el-date-picker>
            <el-date-picker
              clearable
              v-model="search.cashin.lastcashintime"
              type="daterange"
              placeholder="最后存款时间">
            </el-date-picker>
            <el-form-item label="净入金：">
              <el-input type="number" v-model="search.cashin.starthtynetdeposit" size="small" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="-">
              <el-input type="number" v-model="search.cashin.endhtynetdeposit" size="small" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="美元"></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="1" class="search-label">
            <el-checkbox v-model="select.cashout">出金</el-checkbox>
          </el-col>
          <el-col :span="23" class="search-ctx">
            <el-date-picker
              clearable
              v-model="search.cashout.firstcashouttime"
              type="daterange"
              placeholder="首次取款时间">
            </el-date-picker>
            <el-date-picker
              clearable
              v-model="search.cashout.lastcashouttime"
              type="daterange"
              placeholder="最后取款时间">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="1" class="search-label">
            <el-checkbox v-model="select.trade">交易</el-checkbox>
          </el-col>
          <el-col :span="23" class="search-ctx">
            <el-date-picker
              clearable
              v-model="search.trade.firstordertime"
              type="daterange"
              placeholder="首次交易时间">
            </el-date-picker>
            <el-date-picker
              clearable
              v-model="search.trade.lastordertime"
              type="daterange"
              placeholder="最后交易时间">
            </el-date-picker>
            <br>
            <el-form-item label="历史开仓次数：">
              <el-input type="number" v-model="search.trade.starthtyopencnt" size="small" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="-">
              <el-input type="number" v-model="search.trade.endhtyopencnt" size="small" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="次  历史平仓次数：">
              <el-input type="number" v-model="search.trade.starthtyclosecnt" size="small" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="-">
              <el-input type="number" v-model="search.trade.endhtyclosecnt" size="small" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="次  历史强平次数：">
              <el-input type="number" v-model="search.trade.starthtycompelclosecnt" size="small" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="-">
              <el-input type="number" v-model="search.trade.endhtycompelclosecnt" size="small" :min="0"></el-input>
            </el-form-item>
            <el-form-item label="次"></el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="1" class="search-label">
            <el-checkbox v-model="select.login">登录</el-checkbox>
          </el-col>
          <el-col :span="23" class="search-ctx">
            <el-date-picker
              clearable
              v-model="search.login.lastoperatetime"
              type="daterange"
              placeholder="最近登录时间">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="search-btn">
            <el-form-item class="pull-right">
              <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
              <el-button type="primary" @click="clear()">清空</el-button>
              <el-button v-show="optAuth.download" type="primary" @click="handleDownload" title="导出"
                         :loading="downloading"><i class="icon-download"></i>&nbsp;&nbsp;导出
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </query-panel>
    <el-popover
      ref="popover"
      placement="top"
      width="400"
      v-model="popoverVisible">
      <p class="head-check">
        <el-checkbox-group v-model="checkedHeaders">
          <el-checkbox v-for="h in originals" :label="h.prop" :key="'check-header-' + h.prop" :checked="true">{{h.label}}</el-checkbox>
        </el-checkbox-group>
      </p>
      <div style="text-align: right; margin: 0">
        <el-button type="primary" @click="popoverVisible = false">确定</el-button>
      </div>
    </el-popover>
    <el-row class="toolbar">
      <el-button size="mini" type="text" class="head-switch pull-right" v-popover:popover>调整栏目</el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :height="tableHeight"
      style="width: 100%">
      <el-table-column
        v-for="head in headers"
        :key="'head_' + head.prop"
        :show-overflow-tooltip="true"
        :prop="head.prop"
        :label="head.label"
        :formatter="head.formatter ? head.formatter : null"
        :label-class-name="head.cls ? head.cls : null"
        :width="head.width">
      </el-table-column>
    </el-table>
    <el-pagination class="pull-right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="table.pager.pageNo"
                   :page-sizes="[50, 100, 200, 500]"
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
    name: 'data_center_user_account',
    props: {
      height: {
        type: Number
      }
    },
    data() {
      return {
        loading: false,
        queryOpen: true,
        userInfo: null,
        downloading: false,
        popoverVisible: false,
        select: {
          account: false,
          open: false,
          active: false,
          cashin: false,
          cashout: false,
          trade: false,
          login: false
        },
        search: {
          account: {
            platform: '',
            accounttype: '',
            accountlevel: '',
          },
          open: {
            demofirstaccountopentime: null,
            accountopentime: null,
            startdemoactiveintervaltime: null,
            enddemoactiveintervaltime: null,
            startrealactiveintervaltime: null,
            endrealactiveintervaltime: null,
          },
          active: {
            activetime: null,
          },
          cashin: {
            firstcashintime: null,
            lastcashintime: null,
            starthtynetdeposit: null,
            endhtynetdeposit: null,
          },
          cashout: {
            firstcashouttime: null,
            lastcashouttime: null,
          },
          trade: {
            firstordertime: null,
            lastordertime: null,
            starthtyopencnt: null,
            endhtyopencnt: null,
            starthtyclosecnt: null,
            endhtyclosecnt: null,
            starthtycompelclosecnt: null,
            endhtycompelclosecnt: null,
          },
          login: {
            lastoperatetime: null
          }
        },
        table: {
          items: [],
          pager: {
            pageSize: 50,
            pageNo: 1,
            total: 0
          }
        },
        companyMap: {
          'fx': '1', // 外汇
          'hx': '2', // 恒信
          'pm': '3', // 贵金属
          'cf': '8' // 创富
        },
        platformMap: {},
        accountTypeMap: {
          'N': '真实用户',
          'A': '激活用户',
          'D': '模拟用户'
        },
        accountLevelMap: {
          'MIN': '迷你',
          'STD': '标准',
          'VIP': '高端'
        },
        checkedHeaders: [],
        originals: [
          {
            prop: 'accountno',
            label: '账号',
            width: '120'
          },
          {
            prop: 'platform',
            label: '交易平台',
            width: '100'
          },
          {
            prop: 'accountlevel',
            label: '账号等级',
            width: '100',
            formatter: this.accountlevelFmt
          },
          {
            prop: 'accounttype',
            label: '账号类型',
            width: '100'
          },
          {
            prop: 'accountopentime',
            label: '开户时间',
            width: '180'
          },
          {
            prop: 'activetime',
            label: '激活时间',
            width: '180'
          },
          {
            prop: 'firstcashintime',
            label: '首次存款时间',
            width: '180'
          },
          {
            prop: 'firstcashouttime',
            label: '首次取款时间',
            width: '180'
          },
          {
            prop: 'lastcashintime',
            label: '最后存款时间',
            width: '180'
          },
          {
            prop: 'lastcashouttime',
            label: '最后取款时间',
            width: '180'
          },
          {
            prop: 'firstoperatetime',
            label: '首次登录时间',
            width: '180'
          },
          {
            prop: 'lastoperatetime',
            label: '最后登录时间',
            width: '180'
          },
          {
            prop: 'firstordertime',
            label: '首次交易时间',
            width: '180'
          },
          {
            prop: 'lastordertime',
            label: '最后交易时间',
            width: '180'
          },
          {
            prop: 'htyopencnt',
            label: '开仓次数',
            width: '100'
          },
          {
            prop: 'htyclosecnt',
            label: '平仓次数',
            width: '100'
          },
          {
            prop: 'htycompelclose_cnt',
            label: '强平次数',
            width: '100'
          },
          {
            prop: 'equity',
            label: '账号净值',
            width: '150'
          }]
      };
    },
    mounted() {
      this.userInfo = bsmp.util.getUserInfo();
      this.getPlatformDict();
      if (this.userInfo.loginName) {
        this.query();
      }
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'data_center_user_account_view',
          download: 'data_center_user_account_download'
        });
      },
      company() {
        return bsmp.util.getCompany();
      },
      loginUser() {
        return bsmp.util.getUserInfo();
      },
      tableHeight() {
        return this.queryOpen ? this.height - 545 : this.height - 106;
      },
      headers() {
        if (!this.checkedHeaders.length) {
          return this.originals;
        } else {
          return this.originals.filter(item => {
            return this.checkedHeaders.indexOf(item.prop) > -1;
          });
        }
      }
    },
    watch: {
      'company': function (company) {
        if (this.userInfo.companyId === 'ALL' && company) {
          this.query();
        }
      },
      'loginUser': function (loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
          this.query();
        }
      }
    },
    methods: {
      accountlevelFmt(row) {
        if (typeof row.accountlevel !== 'undefined') {
          let level = this.accountLevelMap[row.accountlevel];
          return level ? level : row.accountlevel;
        }
        return '';
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

      switchQuery(open) {
        this.queryOpen = open;
      },
      /**
       * 日期格式化
       * */
      dateToStr(date) {
        return bsmp.util.formatDate.format(date, 'yyyy-MM-dd hh:mm:ss');
      },

      getPlatformDict() {
        return bsmp.util.getDictByCode('pms_platform').then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            let platforms = data.data;
            if (platforms) {
              platforms.forEach((item) => {
                this.platformMap[item.value] = item.name;
              });
            }
          }
        });
      },
      dateRangeParse(daterange, start, end) {
        let params = {};
        if (daterange && daterange.length) {
          if (daterange[0]) {
            params[start] = this.dateToStr(daterange[0]);
          }
          if (daterange[1]) {
            params[end] = this.dateToStr(new Date(daterange[1].setHours(23, 59, 59, 0)));
          }
        }
        return params;
      },

      clear() {
        this.select = {
          account: false,
          open: false,
          active: false,
          cashin: false,
          cashout: false,
          trade: false,
          login: false
        };

        this.search = {
          account: {
            platform: '',
            accounttype: '',
            accountlevel: '',
          },
          open: {
            demofirstaccountopentime: null,
            accountopentime: null,
            startdemoactiveintervaltime: null,
            enddemoactiveintervaltime: null,
            startrealactiveintervaltime: null,
            endrealactiveintervaltime: null,
          },
          active: {
            activetime: null,
          },
          cashin: {
            firstcashintime: null,
            lastcashintime: null,
            starthtynetdeposit: null,
            endhtynetdeposit: null,
          },
          cashout: {
            firstcashouttime: null,
            lastcashouttime: null,
          },
          trade: {
            firstordertime: null,
            lastordertime: null,
            starthtyopencnt: null,
            endhtyopencnt: null,
            starthtyclosecnt: null,
            endhtyclosecnt: null,
            starthtycompelclosecnt: null,
            endhtycompelclosecnt: null,
          },
          login: {
            lastoperatetime: null
          }
        };
      },
      handleDownload() {
        if (!this.getCompanyId()) {
          return;
        }

        if (!this.table.items.length) {
          this.$message.warning('查询结果为空，没有可导出的数据！');
          return;
        }
        let params = this.getQueryParams();
        params.pageNumber = 1;
        params.pageSize = 1000000;

        this.downloading = true;
        api.getAccountList(params).then((res) => {
          let data = res.data, items = [];

          if (data && data.status === '0') {
            if (data.result instanceof Array) {
              items = data.result;
              let filedHeader = [], fieldNames = [];
              this.headers.forEach(item => {
                filedHeader.push(item.label);
                fieldNames.push(item.prop);
              });
              let filedData = bsmp.util.excellentExport.formatJson(fieldNames, items, {accountlevel: {map: this.accountLevelMap}});
              bsmp.util.excellentExport.csvByData('账户数据提取.csv', filedHeader, filedData);
            }
            this.downloading = false;
          }
        });
      },

      /**
       * 查询参数
       * */
      getQueryParams() {
        let params = {
          pageNumber: this.table.pager.pageNo,
          pageSize: this.table.pager.pageSize
        };
        if (this.getCompanyId()) {
          params.companyId = this.companyMap[this.getCompanyId()];
        }

        // 账户
        if (this.select.account) {
          let account = bsmp.util.deleteBlank(this.search.account);
          params = Object.assign(params, account);
        }

//        open: {
//          demofirstaccountopentime: null,
//            accountopentime: null,
//            startdemoactiveintervaltime: 0,
//            enddemoactiveintervaltime: 0,
//            startrealactiveintervaltime: 0,
//            endrealactiveintervaltime: 0,
//        },
        if (this.select.open) {

          params = Object.assign(params, this.dateRangeParse(
            this.search.open.demofirstaccountopentime,
            'startdemofirstaccountopentime', 'enddemofirstaccountopentime'));

          params = Object.assign(params, this.dateRangeParse(
            this.search.open.accountopentime,
            'startaccountopentime', 'endaccountopentime'));

          if (this.search.open.startdemoactiveintervaltime) {
            params.startdemoactiveintervaltime = this.search.open.startdemoactiveintervaltime * 24 * 60;
          }
          if (this.search.open.enddemoactiveintervaltime) {
            params.startdemoactiveintervaltime = this.search.open.startdemoactiveintervaltime * 24 * 60;
            params.enddemoactiveintervaltime = this.search.open.enddemoactiveintervaltime * 24 * 60;
          }

          if (this.search.open.startrealactiveintervaltime) {
            params.startrealactiveintervaltime = this.search.open.startrealactiveintervaltime * 24 * 60;
          }
          if (this.search.open.endrealactiveintervaltime) {
            params.startrealactiveintervaltime = this.search.open.startrealactiveintervaltime * 24 * 60;
            params.endrealactiveintervaltime = this.search.open.endrealactiveintervaltime * 24 * 60;
          }
        }

//        active: {
//          activetime: null,
//        },
        if (this.select.active) {
          params = Object.assign(params, this.dateRangeParse(
            this.search.active.activetime,
            'startactivetime', 'endactivetime'));
        }

//        cashin: {
//          firstcashintime: null,
//            lastcashintime: null,
//            starthtynetdeposit: 0,
//            endhtynetdeposit: 0,
//        },
        if (this.select.cashin) {
          params = Object.assign(params, this.dateRangeParse(
            this.search.cashin.firstcashintime,
            'startfirstcashintime', 'endfirstcashintime'));

          params = Object.assign(params, this.dateRangeParse(
            this.search.cashin.lastcashintime,
            'startlastcashintime', 'endlastcashintime'));

          if (this.search.cashin.starthtynetdeposit) {
            params.starthtynetdeposit = this.search.cashin.starthtynetdeposit;
          }
          if (this.search.cashin.endhtynetdeposit) {
            params.starthtynetdeposit = this.search.cashin.starthtynetdeposit;
            params.endhtynetdeposit = this.search.cashin.endhtynetdeposit;
          }
        }

//        cashout: {
//          firstcashouttime: null,
//            lastcashouttime: null,
//        },
        if (this.select.cashout) {
          params = Object.assign(params, this.dateRangeParse(
            this.search.cashout.firstcashouttime,
            'startfirstcashouttime', 'endfirstcashouttime'));

          params = Object.assign(params, this.dateRangeParse(
            this.search.cashout.lastcashouttime,
            'startlastcashouttime', 'endlastcashouttime'));
        }

//        trade: {
//          firstordertime: null,
//            lastordertime: null,
//            starthtyopencnt: 0,
//            endhtyopencnt: 0,
//            starthtyclosecnt: 0,
//            endhtyclosecnt: 0,
//            starthtycompelclosecnt: 0,
//            endhtycompelclosecnt: 0,
//        },

        if (this.select.trade) {
          params = Object.assign(params, this.dateRangeParse(
            this.search.trade.firstordertime,
            'startfirstordertime', 'endfirstordertime'));

          params = Object.assign(params, this.dateRangeParse(
            this.search.trade.lastordertime,
            'startlastordertime', 'endlastordertime'));

          if (this.search.trade.starthtyopencnt) {
            params.starthtyopencnt = this.search.trade.starthtyopencnt;
          }
          if (this.search.trade.endhtyopencnt) {
            params.starthtyopencnt = this.search.trade.starthtyopencnt;
            params.endhtyopencnt = this.search.trade.endhtyopencnt;
          }

          if (this.search.trade.starthtyclosecnt) {
            params.starthtyclosecnt = this.search.trade.starthtyclosecnt;
          }
          if (this.search.trade.endhtyclosecnt) {
            params.starthtyclosecnt = this.search.trade.starthtyclosecnt;
            params.endhtyclosecnt = this.search.trade.endhtyclosecnt;
          }

          if (this.search.trade.starthtycompelclosecnt) {
            params.starthtycompelclosecnt = this.search.trade.starthtycompelclosecnt;
          }
          if (this.search.trade.endhtycompelclosecnt) {
            params.starthtycompelclosecnt = this.search.trade.starthtycompelclosecnt;
            params.endhtycompelclosecnt = this.search.trade.endhtycompelclosecnt;
          }
        }

//        login: {
//          lastoperatetime: null
//        }
        if (this.select.login) {
          params = Object.assign(params, this.dateRangeParse(
            this.search.login.lastoperatetime,
            'startlastoperatetime', 'endlastoperatetime'));
        }

        return params;
      },
      /**
       * 查询
       */
      query() {
        if (!this.getCompanyId()) {
          return;
        }

        let params = this.getQueryParams();
        this.loading = true;
        api.getAccountList(params).then((res) => {
          this.loading = false;
          let data = res.data;

          if (data && data.status === '0') {
            if (data.result instanceof Array) {
              this.table.items = data.result;
            } else {
              this.table.items = [];
            }
            this.table.pager = Object.assign({}, this.table.pager,
              {
                page: data.pageNumber,
                total: data.total
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
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .search-label
    background rgb(238, 241, 246)
    padding 10px 0 5px 5px
    font-weight bold
    position absolute
    height 100%
    width 70px
    border-bottom solid 1px #3091f2

  .search-ctx
    background #fff
    margin-left 70px
    padding 5px
    border-bottom solid 1px #3091f2

  .search-btn
    padding 5px 0

  .head-switch
    display inline-block
    padding 5px 10px
    text-decoration none
  .head-check
    label
      width 120px
    .el-checkbox + .el-checkbox
      margin-left 0 !important
</style>
