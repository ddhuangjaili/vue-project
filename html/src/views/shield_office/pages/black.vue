<template>
  <div>
    <query-panel>
      <el-form :inline="true" :rules="rules" :model="search" ref="searchForm" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="search.status" @change="query" placeholder="黑名单状态">
            <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                       :key="'search-status-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.type" placeholder="黑名单类型">
            <el-option v-for="(val, key) in typeMap" :label="val" :value="key"
                       :key="'search-type-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="createUser">
          <el-input v-model="search.createUser" placeholder="上传人"></el-input>
        </el-form-item>
        <el-form-item prop="idcardOrPassport">
          <el-input v-model="search.idcardOrPassport" placeholder="身份证号或护照号"></el-input>
        </el-form-item>
        <el-form-item prop="realName">
          <el-input v-model="search.realName" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="search.phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="search.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.dateTime"
            type="daterange"
            placeholder="上传时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="submitForm('searchForm')">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-row class="toolbar">
      <el-button :disabled="search.status !== '0'" v-show="optAuth.approve" @click="toApprove('approve')" title="审核通过"
                 type="success" class="handle-btn">
        <i class="icon-ok-circled"></i>&nbsp;&nbsp;审核通过
      </el-button>
      <el-button :disabled="search.status !== '0'" v-show="optAuth.approve" @click="toApprove('cancel')" title="审核不通过"
                 type="danger" class="handle-btn">
        <i class="icon-attention-alt"></i>&nbsp;&nbsp;审核不通过
      </el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 215"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        fixed
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        width="60">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="address"
        label="地址"
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
        prop="phone"
        label="手机号码"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="realName"
        label="真实姓名"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="status"
        :formatter="statusFmt"
        label="黑名单状态"
        width="120">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="idcardOrPassport"
        label="身份证号或护照号"
        width="250">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="ip"
        label="IP"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="type"
        :formatter="typeFmt"
        label="黑名单类型"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="typeDesc"
        label="黑名单类型描述"
        width="250">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="source"
        label="用户来源"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createUser"
        label="创建人"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createDate"
        label="创建时间"
        :formatter="createDateFmt"
        width="180">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createIp"
        label="创建人IP"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateUser"
        label="更新人"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateDate"
        label="更新时间"
        :formatter="updateDateFmt"
        width="180">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        width="200">
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
  </div>
</template>

<script>
  import api from '../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'shield_office_black',
    props: {
      height: {
        type: Number
      }
    },
    data() {
      return {
        loading: true,
        search: {
          status: '0',
          type: '',
          createUser: '',
          idcardOrPassport: '',
          email: '',
          realName: '',
          phone: '',
          dateTime: null
        },
            rules: {
                createUser:{
                    pattern: /(^[\u4e00-\u9fa5]{1,6}$)|(^[a-zA-Z]+$)/,
                    message: "不像是姓名哦，请重新输入！"
                },
                realName:{
                    pattern: /(^[\u4e00-\u9fa5]{1,6}$)|(^[a-zA-Z]+$)/,
                    message: "不像是姓名哦，请重新输入！"
                },
                idcardOrPassport:{
                    pattern: /(^\d{6,20}$)|(^\d{17}(\d|X|x)$)/,
                    message: "不像是身份证号或护照号哦！"
                },
                phone: {
                    pattern: /^[0-9]{8,20}$/,
                    message: "不像是电话哦，请重新输入！"
                },
                email: {
                    pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
                    message: "不像是邮箱地址哦，请重新输入！"
                }
            },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          }
        },
        statusMap: {
          '0': '待审核',
          '1': '审核通过',
          '2': '审核不通过'
        },
        typeMap: {
          'dczs': '大仓重手',
          'jbfwq': '举报服务器',
          'sd': '刷单',
          'bcyqbd': '爆仓要求补点',
          'zcbc': '重仓爆仓',
          'syj': '刷佣金',
          'nbdc': '内部对冲',
          'wgjy': '违规交易',
          'zptld': '钻平台漏洞',
          'xykqz': '信用卡欺诈',
          'syjsf': '使用假身份',
          'zjqz': '赠金欺诈',
          'dc': '对冲',
          'djg': '打价格',
          'ycbj': '延迟报价',
          'gpjy': '高频交易',
          'eywq': '恶意维权',
          'qt': '其他'
        },
        multipleSelection: []
      }
    },
    mounted() {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'shield_office_black_view',
          approve: 'shield_office_black_approve'
        });
      }
    },
    methods: {
      statusFmt(row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
      },
      typeFmt(row) {
        return typeof row.type !== 'undefined' ? this.typeMap[row.type] : '';
      },
      /**
       * 日期格式化
       * */
      createDateFmt(row) {
        return row.createDate ? bsmp.util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      updateDateFmt(row) {
        return row.updateDate ? bsmp.util.formatDate.format(new Date(row.updateDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      toApprove(action) {
        let items = [];
        // 批量审核
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要操作的记录!'
          });
          return;
        }
        items = this.multipleSelection.map((i) => {
          return i.id;
        });
        this.batchApprove(action, items);
      },

      batchApprove(action, items) {
        let status, title;
        switch (action) {
          case 'approve':
            status = 1;
            title = '审核通过';
            break;
          case 'cancel':
            status = 2;
            title = '审核不通过';
            break;
        }

        if (action === 'cancel') {
          this.$prompt(`确定要${title}吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请您描述一下审核不通过的原因.....',
            inputValidator: (val) => {
              return !!val;
            },
            inputErrorMessage: '请您描述一下审核不通过的原因'
          }).then(({value}) => {
            this.batchSetApproval({ids: items.join(','), status, remark:value});
          }).catch(e => {
          });
        } else {
          this.$confirm(`确定要${title}吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.batchSetApproval({ids: items.join(','), status});
          }).catch(e => {
          });
        }
      },

      batchSetApproval(params) {
        api.approveBlack(params).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.query();

            // 记录日志
            bsmp.log({
              component: 'shield_office',
              type: 'approve',
              content: `[black] params: ${JSON.stringify(params)}`
            });
          }
        });
      },

      /**
       * 日期格式化
       * */
      dateToStr(date) {
        return bsmp.util.formatDate.format(date, 'yyyy-MM-dd hh:mm:ss');
      },
      submitForm(formName) {
            let _this = this;
            this.$refs[formName].validate((valid) => {
            if (valid) {
                _this.query();
            } else {
                _this.$message({
                  type: 'warn',
                  message: '查询字段非法，不能往下执行！'
                });
                return false;
            }
            });
        },
      /**
       * 查询
       */
      query() {
        let params = bsmp.util.deleteBlank(this.search);

        if (params.dateTime && params.dateTime.length && params.dateTime[0] && params.dateTime[1]) {
          params.beginDate = this.dateToStr(params.dateTime[0]);
          params.endDate = this.dateToStr(new Date(params.dateTime[1].setHours(23, 59, 59, 0)));
          delete params.dateTime;
        }

        this.loading = true;
        params = Object.assign({}, params, this.table.pager);
        api.getBlackList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
            this.table.pager = Object.assign({}, this.table.pager,
              {
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
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .handle-btn
    margin 8px 3px !important
  .query-block .el-form-item
    margin-bottom: 20px;
</style>
