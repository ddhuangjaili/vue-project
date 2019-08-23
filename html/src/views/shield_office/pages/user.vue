<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
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
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 215"
      style="width: 100%">
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
      <el-table-column
        fixed="right"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.edit" type="info" icon='edit' size="mini"
                     @click.native.prevent="showDialog(2, scope.$index)"></el-button>
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

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="userForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="真实姓名：" prop="realName">
              <el-input v-model="dialog.form.realName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司名称：" prop="companyName">
              <el-input v-model="dialog.form.companyName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号码：" prop="phone">
              <el-input v-model="dialog.form.phone" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="dialog.form.email" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色：" prop="roleCode">
              <el-select clearable v-model="dialog.form.roleCode" placeholder="角色">
                <el-option v-for="(r, key) in roleList" :label="r.roleName" :value="r.roleCode"
                           :key="'form-roleCode-'+ r.roleCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="dialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'shield_office_user',
    props: {
      height: {
        type: Number
      }
    },
    data() {
      return {
        loading: true,
        search: {
          status: '1',
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
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          title: '',
          form: {
            name: '',
            code: '',
            remark: ''
          },
          rules: rules
        },
        statusMap: {
          '0': '待审核',
          '1': '审核通过',
          '2': '审核不通过'
        },
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
          search: 'shield_office_user_view',
          edit: 'shield_office_user_edit'
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
      /**
       * 显示弹窗
       * */
      showDialog(type, index) {
        if (this.$refs['userForm'] && this.$refs['userForm'].resetFields) {
          this.$refs['userForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          this.dialog.form = Object.assign({}, this.table.items[index]);
        }

        this.dialog.show = true;
      },
      submitForm() {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            let params = {
              id: this.dialog.form.id,
              roleCode: this.dialog.form.roleCode,
              email: this.dialog.form.email,
              realName: this.dialog.form.realName,
              phone: this.dialog.form.phone,
              companyName: this.dialog.form.companyName,
            };
            api.editUser(params).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });

                this.dialog.show = false;
                this.query();

                // 记录日志
                bsmp.log({
                  component: 'shield_office',
                  type: 'modify',
                  content: `[user] params: ${JSON.stringify(params)}`
                });
              }
            });
          } else {
            return false;
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

  let validatePhone = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入手机号码'));
    } else {
      if (bsmp.util.isMobile(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的手机号码'));
      }
    }
  };
  // 表单规则
  let rules = {
    realName: [
      {required: true, message: '请输入真实姓名', trigger: 'blur'}
    ],
    companyName: [
      {required: true, message: '请输入公司名称', trigger: 'blur'}
    ],
    email: [
      {required: true, message: '请输入邮箱', trigger: 'blur'},
      {type: 'email', message: '请输入正确的邮箱', trigger: 'blur,change'}
    ],
    phone: [
      {required: true, validator: validatePhone, trigger: 'blur'},
    ],
    roleCode: [
      {required: true, message: '请选择角色', trigger: 'change'}
    ]
  };
</script>
<style lang="stylus" scoped>
  .handle-btn
    margin 8px 3px !important
</style>
