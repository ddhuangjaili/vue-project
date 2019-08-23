<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="search.status" @change="query" placeholder="用户状态">
            <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                       :key="'search-status-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.roleCode" placeholder="角色">
            <el-option v-for="(r, key) in roleList" :label="r.roleName" :value="r.roleCode"
                       :key="'search-roleCode-'+ r.roleCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.loginName" placeholder="登录账号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.realName" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.companyName" placeholder="公司名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.dateTime"
            type="daterange"
            placeholder="注册时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
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
        prop="loginName"
        label="登录账号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="email"
        label="邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="status"
        :formatter="statusFmt"
        label="用户状态"
        width="120">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="roleCode"
        label="角色代码"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="leftTimes"
        label="查询剩余次数"
        width="150">
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
        prop="companyName"
        label="公司名称"
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
        label="注册IP"
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
    name: 'shield_office_user_approve_list',
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
          roleCode: '',
          loginName: '',
          email: '',
          realName: '',
          phone: '',
          companyName: '',
          dateTime: null
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
        multipleSelection: [],
        roleList: null
      }
    },
    mounted() {
      this.getRoles().then(() => {
        this.query();
      });
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'shield_office_user_approve_list_view',
          approve: 'shield_office_user_approve_list_approve'
        });
      }
    },
    methods: {
      statusFmt(row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
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
        api.approveUser(params).then((res) => {
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
              content: `[user] params: ${JSON.stringify(params)}`
            });
          }
        });
      },

      getRoles() {
        return api.getRoleList().then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.roleList = data.data;
          }
        }).catch(e => {
          this.loading = false;
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
      query() {
        let params = bsmp.util.deleteBlank(this.search);

        if (params.dateTime && params.dateTime.length && params.dateTime[0] && params.dateTime[1]) {
          params.beginDate = this.dateToStr(params.dateTime[0]);
          params.endDate = this.dateToStr(new Date(params.dateTime[1].setHours(23, 59, 59, 0)));
          delete params.dateTime;
        }

        this.loading = true;
        params = Object.assign({}, params, this.table.pager);
        api.getUserList(params).then((res) => {
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
</style>
