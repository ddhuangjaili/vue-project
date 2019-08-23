<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-tabs type="border-card" v-model="tabFocus">
          <el-tab-pane name="list" label="条件类查询">
            <el-form-item prop="chineseName">
              <el-input v-model="search.list.chineseName" placeholder="客户姓名"></el-input>
            </el-form-item>
            <el-form-item prop="idCard">
              <el-input v-model="search.list.idCard" placeholder="身份证"></el-input>
            </el-form-item>
            <el-form-item prop="phone">
              <el-input v-model="search.list.phone" placeholder="手机号码"></el-input>
            </el-form-item>
            <el-form-item prop="bankCard">
              <el-input v-model="search.list.bankCard" placeholder="银行卡号"></el-input>
            </el-form-item>
            <el-form-item prop="email">
              <el-input v-model="search.list.email" placeholder="邮箱"></el-input>
            </el-form-item>
            <br/>
            <el-form-item>
              <el-date-picker
                :editable="false"
                :clearable="false"
                v-model="search.list.createDate"
                type="datetimerange"
                range-separator=" 至 "
                placeholder="开户时间">
              </el-date-picker>
            </el-form-item>
            <el-tooltip class="item item-doubt" effect="dark" content="请尽量缩小查询区间" placement="bottom">
              <i class="icon-info"></i>
            </el-tooltip>
            <el-form-item>
              <el-date-picker
                :editable="false"
                :clearable="false"
                v-model="search.list.activateDate"
                type="datetimerange"
                range-separator=" 至 "
                placeholder="激活时间">
              </el-date-picker>
            </el-form-item>
            <el-tooltip class="item item-doubt" effect="dark" content="请尽量缩小查询区间" placement="bottom">
              <i class="icon-info"></i>
            </el-tooltip>
            <br/>
            <el-form-item prop="customerNo">
              <el-input v-model="search.list.customerNo" placeholder="账户"></el-input>
            </el-form-item>
            <el-form-item prop="deviceId">
              <el-input v-model="search.list.deviceId" placeholder="DeviceID"></el-input>
            </el-form-item>
            <el-form-item prop="ip">
              <el-input v-model="search.list.ip" placeholder="IP"></el-input>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane name="statList" label="统计类查询">
            <el-form-item>
              <el-radio v-model="search.statList.statType" label="0">全量查找 = 手机DeviceID信息，并且 持有账户号 大于等于</el-radio>
            </el-form-item>
            <el-form-item prop="accountNoFrequencyTimes">
              <el-input-number v-model="search.statList['0'].accountNoFrequencyTimes"
                :min="1" style="width: 130px"></el-input-number>
            </el-form-item>
            <el-form-item prop="ipFrequencyTimes">
              并且 IP 大于等于 <el-input-number v-model="search.statList['0'].ipFrequencyTimes"
                :min="1" style="width: 130px"></el-input-number>
            </el-form-item>
            <br/>

            <el-form-item>
              <el-radio v-model="search.statList.statType" label="1">全量查找 = IP唯一标识信息，并且 持有账户号 大于等于</el-radio>
            </el-form-item>
            <el-form-item prop="accountNoFrequencyTimes">
              <el-input-number v-model="search.statList['1'].accountNoFrequencyTimes"
                :min="1" style="width: 130px"></el-input-number>
            </el-form-item>
            <el-form-item prop="deviceIdFrequencyTimes">
              并且 DeviceID 大于等于 <el-input-number v-model="search.statList['1'].deviceIdFrequencyTimes"
                :min="1" style="width: 130px"></el-input-number>
            </el-form-item>
            <br/>

            <el-form-item>
              <el-radio v-model="search.statList.statType" label="2">全量查找 = 账户唯一标识信息，并且 DeviceID 大于等于</el-radio>
            </el-form-item>
            <el-form-item prop="deviceIdFrequencyTimes">
              <el-input-number v-model="search.statList['2'].deviceIdFrequencyTimes"
                :min="1" style="width: 130px"></el-input-number>
            </el-form-item>
            <el-form-item prop="ipFrequencyTimes">
              并且 IP 大于等于 <el-input-number v-model="search.statList['2'].ipFrequencyTimes"
                :min="1" style="width: 130px"></el-input-number>
            </el-form-item>

            <el-form-item prop="bankCardFrequencyTimes">
              持有银行卡  大于等于 <el-input-number v-model="search.statList['2'].bankCardFrequencyTimes"
                :min="1" style="width: 130px"></el-input-number>
            </el-form-item>

          </el-tab-pane>
        </el-tabs>
        <div class="toolbar pull-right">
          <el-form-item>
            <el-button type="primary" @click="query"
              v-show="(tabFocus === 'list' && optAuth.list) || (tabFocus === 'statList' && optAuth.stat)">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="clear">清空</el-button>
          </el-form-item>
        </div>

      </el-form>
    </query-panel>

    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      stripe
      :max-height="height - 330"
      style="width: 100%">
      <el-table-column type="index" label="序号" width="80" fixed></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="customerNo"
        label="统一帐号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="交易帐号"
        width="150">
        <template slot-scope="scope">
          <span v-html="moreRowFmt(scope.row.accountNo)"></span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bu"
        label="事业部"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="accountStatus"
        label="账户状态"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="chineseName"
        label="客户姓名"
        width="150">
      </el-table-column>
	  <el-table-column
        :show-overflow-tooltip="true"
        label="手机号码"
        width="150">
        <template slot-scope="scope">
          <span v-html="moreRowFmt(scope.row.mobilePhone)"></span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="idDocumentNumber"
        label="身份证号"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="银行卡号"
        width="200">
        <template slot-scope="scope">
          <span v-html="moreRowFmt(scope.row.bankAccountNumber)"></span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="IP地址"
        width="150">
        <template slot-scope="scope">
          <span v-html="moreRowFmt(scope.row.ipAddress)"></span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="邮箱"
        width="150">
        <template slot-scope="scope">
          <span v-html="moreRowFmt(scope.row.email)"></span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="设备ID"
        width="300">
        <template slot-scope="scope">
          <span v-html="moreRowFmt(scope.row.deviceId)"></span>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="platform"
        label="平台"
        width="150">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="100"
        label="详情">
        <template slot-scope="scope">
          <el-button title="查看详情" v-show="optAuth.detail" v-loading="dialog.loading" @click="showDialog(scope.$index)" size="mini">
            <i class="icon-eye"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pull-right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="table.pager.page"
      :page-sizes="[10, 20]"
      :page-size="table.pager.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="table.pager.total">
    </el-pagination>

      <el-dialog title="详情" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
        <el-form ref="pointForm" label-width="150px" class="dialog-form detail" v-loading="dialog.loading" style="min-height: 400px;">

          <template v-if="dialog.detail && dialog.detail.riskResultV3 && dialog.detail.riskResultV3.length">
            <div class="title">客户信息</div>
            <div class="content" v-for="(result, i) in dialog.detail.riskResultV3" :key="'result-' + i">
              <div class="row">
                <div class="item">
                  <p class="label">风险类型：</p>
                  <p class="text">{{riskResultFmt(result.result)}}</p>
                </div>
                <div class="item">
                  <p class="label">用户标签：</p>
                  <p class="text">{{result.mark}}： {{result.label}}</p>
                </div>
              </div>

              <div class="risk" v-if="result.risks && result.risks.length"
                  v-for="(risk, j) in result.risks" :key="'result-' + i + '-risk-' + j">
                <div class="row">
                  <div class="item">
                    <p class="label">踩中黑名单类型：</p>
                    <p class="text">{{risk.type}}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="item">
                    <p class="label">踩中黑名单值：</p>
                    <p class="text">{{risk.value}}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="item">
                    <p class="label">风险原因：</p>
                    <p class="text">{{risk.reason}}</p>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="item">
                  <p class="label">账户风险备注：</p>
                  <p class="text">{{result.accountRiskRemark}}</p>
                </div>
              </div>

            </div>
          </template>

          <template v-if="dialog.detail && dialog.detail.phoneListCount">
            <div class="title">通讯录</div>
            <div class="content">
              <div class="row">
                <div class="item">
                  <p class="label">命中黑名单数量：</p>
                  <p class="text">{{dialog.detail.phoneListCount}}</p>
                </div>
              </div>
              <div class="row" v-if="dialog.detail.phoneList.length">
                <div class="item">
                  <p class="label">命中黑名单详情：</p>
                  <p class="text">{{dialog.detail.phoneList.join(', ')}}</p>
                </div>
              </div>
            </div>
          </template>

          <template v-if="dialog.detail && dialog.detail.callRecordsCount">
            <div class="title">通话记录</div>
            <div class="content">
              <div class="row" v-for="(r, index) in dialog.detail.callRecords" :key="'record-' + index">
                <div class="item">
                  <p class="label">Call状态：</p>
                  <p class="text">{{callTypeFmt(r.type)}}&nbsp;&nbsp;{{r.tel}}&nbsp;&nbsp;[{{r.time}}]</p>
                </div>
              </div>
            </div>
          </template>

          <div v-if="dialog.noRecord" class="no-record">
            暂无数据
          </div>
        </el-form>
      </el-dialog>
  </div>
</template>
<script>
import api from "../../api";
import bsmp  from "bsmp_main";

export default {
  name: "info_seek",
  props: {
    height: {
      type: Number
    }
  },
  data() {
    return {
      tabFocus: 'list',
      loading: false,
      downloading: false,
      search: {
        list: {
          chineseName: '',
          idCard: '',
          phone: '',
          bankCard: '',
          email: '',
          createDate: null,
          activateDate: null,
          customerNo: '',
          deviceId: '',
          ip: ''
        },
        statList: {
          statType: '0',
          '0': {
            accountNoFrequencyTimes: 0,
            ipFrequencyTimes: 0
          },
          '1': {
            accountNoFrequencyTimes: 0,
            deviceIdFrequencyTimes: 0
          },
          '2': {
            deviceIdFrequencyTimes: 0,
            ipFrequencyTimes: 0,
            bankCardFrequencyTimes: 0
          }
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
      dialog: {
        show: false,
        loading: false,
        index: -1, // 数据下标
        form: null,
        detail: null,
        noRecord: false
      },
      callTypeMap: {
        '0': '打入未接',
        '1': '打入接通',
        '2': '打出'
      },
      riskResultMap: {
        '-1': '无记录',
        '0': '白名单',
        '1': '黑名单',
        '2': '危险名单',
        '3': '正常名单'
      }
    }
  },
  mounted() {
    // this.query();
  },
  computed: {
    optAuth() {
      return bsmp.util.mapAuth({
        list: 'point_condition_list',
        stat: 'point_stat_list',
        detail: 'point_detail_info'
      });
    }
  },
  methods: {
    // 多行格式化
    moreRowFmt(str) {
      if (str) {
        return str.split(',').join('<br/>');
      }
      return '';
    },

    // 检查结果
    riskResultFmt(result) {
      return result ? this.riskResultMap[result] : '';
    },
    // 通话状态
    callTypeFmt(type) {
      return type ? this.callTypeMap[type] : '拒接';
    },

    /**
     * 显示详细弹窗
     */
    showDialog(index) {
      this.dialog.index = index;
      let form = Object.assign({}, this.table.items[index]);
      this.dialog.form = form;

      this.getDetail(form);

      this.dialog.show = true;
    },

    /**
     * 获取详情
     */
    getDetail(form) {
      let params = {};
      if (form.deviceId) {
        params.deviceIds = form.deviceId;
      }
      if (form.accountNo) {
        params.accountNo = form.accountNo;
      }
      if (form.mobilePhone) {
        params.phone = form.mobilePhone;
      }
      if (form.idDocumentNumber) {
        params.idCard = form.idDocumentNumber;
      }
      if (form.bankAccountNumber) {
        params.bankCard = form.bankAccountNumber;
      }
      if (form.email) {
        params.email = form.email;
      }
      if (form.ipAddress) {
        params.ip = form.ipAddress;
      }
      if (form.bu) {
        params.bu = form.bu;
      }

      this.dialog.loading = true;
      api.getPointDetailInfo(params).then(res => {
        this.dialog.loading = false;
        let data = res.data;
        if (data && data.code === '0') {
          this.dialog.detail = data.data;
          this.dialog.noRecord = false;

          // 无数据判断
          if (this.dialog.detail) {
            if ((!this.dialog.detail.riskResultV3 || this.dialog.detail.riskResultV3.length == 0)
              && this.dialog.detail.phoneListCount == 0 && this.dialog.detail.callRecordsCount == 0) {
              this.dialog.noRecord = true;
            }
          } else {
            this.dialog.noRecord = true;
          }

        }
      }).catch(e => {
        this.dialog.loading = false;
      });
    },

    /**
     * 清空
     */
    clear() {
      if (this.tabFocus === 'list') {
        this.search.list = {
          chineseName: '',
          idCard: '',
          phone: '',
          bankCard: '',
          email: '',
          createDate: null,
          activateDate: null,
          customerNo: '',
          deviceId: '',
          ip: ''
        };
      } else if (this.tabFocus === 'statList') {
        this.search.statList['0'] = {
          accountNoFrequencyTimes: 1,
          ipFrequencyTimes: 1
        };
        this.search.statList['1'] = {
          accountNoFrequencyTimes: 1,
          deviceIdFrequencyTimes: 1
        };
        this.search.statList['2'] = {
          deviceIdFrequencyTimes: 1,
          ipFrequencyTimes: 1,
          bankCardFrequencyTimes: 1
        };
      }
    },

    /**
     * 查询
     */
    query() {

      let params = {...this.table.pager}, method = null;
      if (this.tabFocus === 'list') {
        // 条件类查询
        params = Object.assign({}, params, bsmp.util.deleteBlank(this.search.list));

        if (params.createDate && params.createDate.length && params.createDate[0] && params.createDate[1]) {
          params.createDateStart = bsmp.util.formatDate.format(params.createDate[0], "yyyy-MM-dd hh:mm:ss");
          params.createDateEnd = bsmp.util.formatDate.format(params.createDate[1], "yyyy-MM-dd hh:mm:ss");
          delete params.createDate;
        }

        if (params.activateDate && params.activateDate.length && params.activateDate[0] && params.activateDate[1]) {
          params.activateDateStart = bsmp.util.formatDate.format(params.activateDate[0], "yyyy-MM-dd hh:mm:ss");
          params.activateDateEnd = bsmp.util.formatDate.format(params.activateDate[1], "yyyy-MM-dd hh:mm:ss");
          delete params.activateDate;
        }

        this.loading = true;
        method = api.getPointList(params);

      } else if (this.tabFocus === 'statList') {
        // 统计类查询
        params = Object.assign({statType: this.search.statList.statType}, params, this.search.statList[this.search.statList.statType]);

        if ((this.search.statList.statType === '0'
          && this.search.statList['0'].accountNoFrequencyTimes === 1
          && this.search.statList['0'].ipFrequencyTimes === 1) || (this.search.statList.statType === '1'
          && this.search.statList['1'].accountNoFrequencyTimes === 1
          && this.search.statList['1'].deviceIdFrequencyTimes === 1) || (this.search.statList.statType === '2'
          && this.search.statList['2'].deviceIdFrequencyTimes === 1
          && this.search.statList['2'].ipFrequencyTimes === 1 && this.search.statList['2'].bankCardFrequencyTimes === 1)) {
            this.$message.warning("至少一项参数大于等于2！");
            return;
          }

        this.loading = true;
        method = api.getPointStatList(params);
      }

      method.then(res => {
        this.loading = false;
        let data = res.data;
        if (data && data.code === '0') {
          this.table.items = data.data.data;
          this.table.pager = Object.assign({}, this.table.pager, {
            pageNo: data.data.pageNo,
            total: data.data.total
          });

        } else {
          this.table.items = [];
          this.table.pager = {
            pageSize: 10,
            pageNo: 1,
            total: 0
          };
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
}
</script>
<style lang="stylus" scoped>
  .item-doubt{
    background:#c4c4c4;
    border-radius:50%;
    cursor:pointer;
  }
  .item-doubt:before{
    color:#fff;
  }
  .toolbar {
    margin-top: 5px;
  }

  .no-record {
    text-align: center;
    color: #909399;
    font-size: 16px;
  }

  .detail {
    .title {
      padding: 0 20px;
      height: 40px;
      line-height: 40px;
      color: #409eff;
      border-bottom: 1px solid #dfe6ec;
    }

    .content {
      line-height: 30px;
      .risk {
        border: 1px solid #ccc;
        radius: 5px;
        margin: 10px;
      }
      .row {
        display: flex;
        .item {
          flex: 1;
          .label {
            width: 150px;
            display: inline-block;
            text-align: right;
            color: #909399;
            padding: 0 10px;
          }
          .text {
            display: inline-block;
            padding: 0 10px;
          }
        }
      }
    }
  }
</style>
