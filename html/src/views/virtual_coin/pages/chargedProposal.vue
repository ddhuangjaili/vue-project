<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.accountCode" placeholder="账号编码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.status" placeholder="提案状态">
            <el-option v-for="(val, key) in proposalStatusMap" :label="val" :value="key"
                       :key="'search-publishStatus-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.createUser" placeholder="创建人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.updateUser" placeholder="更新人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.datetime"
            type="daterange"
            placeholder="时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <!-- <el-row class="toolbar">
      <el-button v-show="optAuth.batch" @click="deleteMultiple" type="danger">批量删除</el-button>
    </el-row> -->

    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 165"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        fixed
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="fromAccountCode"
        label="发起人账号"
        width="110">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="fromWalletUid"
        label="发起人钱包"
        width="110">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="toAccountCode"
        label="目标账号"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="toWalletUid"
        label="目标钱包"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="currencyCode"
        label="币种"
        width="80">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="amount"
        label="数量"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="status"
        label="提案状态"
        :formatter="proposalStatusFmt"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="审批理由"
        minWidth="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateUser"
        label="审批人"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateDate"
        :formatter="updateDateFmt"
        width="200"
        label="审批时间">
      </el-table-column>
       <el-table-column
        :show-overflow-tooltip="true"
        prop="executeStatus"
        label="转账状态"
        :formatter="executeStatusFmt"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="executeRemark"
        label="转账备注"
        minWidth="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="executeDate"
        :formatter="updateDateFmt"
        width="180"
        label="转账时间">
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
        :formatter="createDateFmt"
        width="180"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button title="编辑" v-show="optAuth.edit && scope.row.publishStatus === 0" @click="showDialog(2, scope.$index)"
                     type="info" icon='edit' size="mini"></el-button>
          <el-button title="删除" v-show="optAuth.del" type="danger" icon='delete' size="mini"
                     @click="deleteItem(scope.row.id)"></el-button> -->
          <el-button title="通过" v-show="optAuth.approved && scope.row.status === 0" @click="toApprove(scope.row)"
                     type="info" size="mini">通过</el-button>
          <el-button title="拒绝" v-show="optAuth.cancel && scope.row.status === 0" type="danger" size="mini"
                     @click="toReject(scope.row)">拒绝</el-button>
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

  </div>
</template>

<script>
  import api from '../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'chargedProposal',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        search: {
          accountCode: '',
          publishStatus: '',
          createUser: '',
          updateUser: '',
          datetime: null
        },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          }
        },
        accountMap: {},
        currencies: [],
        proposalStatusMap: {
          '0': '待审批',
          '1': '已批核',
          '2': '已拒绝'
        },
        executeStatusMap: {
          '1': '成功',
          '2': '失败'
        },
        multipleSelection: [],
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'virtual_coin_chargedProposal_view',
          approved:'vc_chargedProposal_approved',
          cancel:'vc_chargedProposal_cancel',
          del: 'virtual_coin_chargedProposal_del',
          batch: 'virtual_coin_chargedProposal_batch'
        });
      }
    },
    methods: {
      proposalStatusFmt(row) {
        return typeof row.status !== 'undefined' ? this.proposalStatusMap[row.status] : '';
      },
      executeStatusFmt(row) {
        return typeof row.executeStatus !== 'undefined' ? this.executeStatusMap[row.executeStatus] : '';
      },
      /**
       * 日期格式化
       * */
      createDateFmt (row) {
        return row.createDate ? bsmp.util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      updateDateFmt (row) {
        return row.updateDate ? bsmp.util.formatDate.format(new Date(row.updateDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      /**
       * 通过
       * */
      toApprove(row) {
        this.$prompt('请输入通过理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.handleApproval(row, 1, value);
        }).catch(() => {

        });
      },

      /**
       * 拒绝
       * */
      toReject(row) {
        this.$prompt('请输入拒绝理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.handleApproval(row, 2, value);
        }).catch(() => {

        });
      },

      /**
       * 处理审批请求
       * */
      handleApproval(form, status, remark) {
        let params = {
          id: form.id,
          currencyCode: form.currencyCode,
          status: status,
          remark: remark
        };
        api.editChargedProposal(params).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '审批成功，正执行钱包转账......'
              });
              let _this=this;
              api.executeWalletNotice({id:data.data}).then((resTmp) => {
                  let dataTmp = resTmp.data;
                  if (dataTmp && dataTmp.code == 0) {
                      _this.$message({
                        type: 'success',
                        message: '钱包转账成功!'
                      });
                  }else{
                        _this.$message({
                        type: 'success',
                        message: dataTmp.msg
                      });
                  }
                  this.query();
            });
          }
          // 记录日志
          bsmp.log({
            component: 'virtual_coin',
            type: status==2?'approve':'reject',
            content: `[chargedProposal] params: ${JSON.stringify(params)}`
          });
        });
      },

      /**
       * 显示弹窗
       * */
      showDialog (type, index) {

        this.dialog.title='查看';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.status = form.status + '';
          this.dialog.form = form;
        }

        this.dialog.show = true;
      },
      deleteMultiple () {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的角色!'
          });
          return;
        }
        let ids = [];
        for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteItem(ids.join(','), 2);
      },

      /**
       * 删除
       * */
      deleteItem (id, type) {
        this.$confirm(type === 1 ? '确定要删除该条记录?': '确定要删除所选记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let method = null;
          if (type && type === 2) {
            method = api.deletePublishCurs(id);
          } else {
            method = api.deletePublishCur(id);
          }
          // 删除
          method.then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'virtual_coin',
                type: 'delete',
                content: `[publishCur] params: ${JSON.stringify({id: id})}`
              });
            }
          });
        }).catch(e => {
        });
      },

      /**
       * 日期格式化
       * */
      dateToStr(date) {
        return bsmp.util.formatDate.format(date, 'yyyy-MM-dd hh:mm:ss');
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        params = Object.assign({}, params, this.table.pager);

        if (this.search.datetime && this.search.datetime.length) {
          if (this.search.datetime[0]) {
            params.startDate = this.dateToStr(this.search.datetime[0]);
          }
          if (this.search.datetime[1]) {
            params.endDate = this.dateToStr(new Date(this.search.datetime[1].setHours(23, 59, 59, 0)));
          }
        }
        delete params.datetime;

        api.getChargedProposalList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: parseInt(data.data.pageNo, 10),
                total: data.data.total
              });
          }
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
      }
    }
  };

</script>
