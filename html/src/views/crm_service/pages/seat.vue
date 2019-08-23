<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.seatId" placeholder="客服编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.seatName" placeholder="客服昵称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-row class="toolbar">
      <el-button v-show="optAuth.add" @click="showDialog(1)" type="primary">新增</el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading="loading"
      :data="table.items"
      border
      :max-height="height - 235"
      style="width: 100%">
      <el-table-column
        prop="index"
        label="#"
        width="60">
      </el-table-column>
      </el-table-column>
      <el-table-column
        prop="seatId"
        label="登录账号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="level"
        width="100"
        :formatter="roleCodeFmt"
        label="角色">
      </el-table-column>
      <el-table-column
        prop="seatName"
        width="100"
        label="客服昵称">
      </el-table-column>
       <el-table-column
        prop="level"
        width="100"
        :formatter="levelFmt"
        label="客服等级">
       </el-table-column>
        <el-table-column
         prop="callLimit"
         width="100"
         label="接待客户上线">
        </el-table-column>
        <el-table-column
         prop="phoneNo"
         width="100"
         label="电话">
        </el-table-column>
        <el-table-column
         prop="email"
         width="100"
         label="邮箱">
        </el-table-column>
      <el-table-column
        prop="groups"
        label="客服组" :formatter="groupsFmt">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="scope.row.status !== -1 && optAuth.edit" type="info" icon='edit' size="mini"
                     @click.native.prevent="showDialog(2, scope.$index)"></el-button>
          <el-button title="删除" v-show="scope.row.status !== -1 && optAuth.del" type="danger" icon='delete' size="mini"
                     @click="deleteItem(scope.row.id)"></el-button>
           <el-button v-show="scope.row.status !== -1 && optAuth.del" title="重置密码"
                                @click.native.prevent="showResetForm(scope.row.seatId)"
                                size="mini"><i class="icon-key"></i></el-button>
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
      <el-form ref="seatForm" :model="dialog.form" v-loading="dialog.loading" :rules="dialog.rules" label-width="120px" class="dialog-form">
          <el-row :gutter="20"  v-if="dialog.type===1">
            <el-col :span="12">
              <el-form-item label="登录账号：" prop="seatId">
                <el-input v-model="dialog.form.seatId" auto-complete="off" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="密码：" prop="password">
                <el-input v-model="dialog.form.password" type="password" auto-complete="off" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
         </el-row>
         <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="姓名：" prop="userName">
                <el-input v-model="dialog.form.userName" auto-complete="off" :maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色：" prop="roleCode">
                <el-select clearable v-model="dialog.form.roleCode" filterable placeholder="请选择角色">
                  <el-option v-for="(r, key) in roleList" :label="r.name" :value="r.code"
                             :key="'form-roleCode-'+ r.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
         </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="昵称：" prop="seatName">
              <el-input v-model="dialog.form.seatName" auto-complete="off" :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客服等级：" prop="level">
              <el-select clearable v-model="dialog.form.level" filterable placeholder="请选择客服等级">
                 <el-option v-for="(c, key) in levels" :label="c.name" :value="c.code"
                                            :key="'form-level-'+ c.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="技能组：" prop="groups">
              <el-select clearable v-model="dialog.form.groups" filterable placeholder="请选择技能组">
                <el-option v-for="(c, key) in groups" :label="c.name" :value="c.code"
                           :key="'form-group-'+ c.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
           <el-form-item label="最大接待人数：">
             <el-input-number v-model="dialog.form.callLimit" :min="0"></el-input-number>
           </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
             <el-form-item label="电话：" prop="phoneNo">
               <el-input v-model="dialog.form.phoneNo" auto-complete="off" :maxlength="20"></el-input>
             </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
             <el-form-item label="Email：" prop="email">
               <el-input v-model="dialog.form.email" auto-complete="off" :maxlength="20"></el-input>
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

   <!-- 弹窗框 -->
      <el-dialog title="重置密码" v-model="reset.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
        <el-form ref="resetForm" :model="reset.form" label-width="120px" class="dialog-form">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item prop="newPwd" label="重置密码：" :rules="{required: true, message: '密码不能为空', trigger: 'blur'}">
                <el-input type="password" v-model="reset.form.newPwd" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submitResetForm" type="primary">保 存</el-button>
          <el-button @click="reset.show = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp from 'bsmp_main';
  import {VueEditor} from 'vue2-editor';
  import axios from 'axios';
  export default {
    name: 'crm_service_seat',
    components: {
      VueEditor
    },
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        userInfo: null,
        roleList:[],
        loading: false,
        focus: null,
        groups: null,
        levels:[
          {'code':'0','name':'初级客服'},
          {'code':'1','name':'中级客服'},
          {'code':'2','name':'高级客服'},
          {'code':'3','name':'资深客服'}
        ],
        search: {
            seatId: '',
            seatName: ''
        },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          }
        },
        reset: {
         show: false,
         form: {
           loginName: '',
           newPwd: ''
         }
        },
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          seatName: '',
          loading: false,
          form: {
            seatId: '',
            password: '',
            userName: '',
            roleCode: '',
            seatName: '',
            groups: '',
            level: '',
            phoneNo: '',
            email: '',
            callLimit: ''
          },
          rules: rules
        }
      };
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      Promise.all([this.getSeatGroups(),this.getRoles()]).then(() => {
        this.query();
      });
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'crm_service_seat_view',
          get: 'crm_service_seat_get',
          add: 'crm_service_seat_add',
          edit: 'crm_service_seat_edit',
          del: 'crm_service_seat_delete'
        });
      },
      loginUser() {
        return bsmp.util.getUserInfo();
      }
    },
    watch: {
      'loginUser'(loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
        }
      }
    },
    methods: {
      /**
       * 状态格式化
       * */
      groupsFmt (row) {
        for(var item of this.groups){
          if(item.code===row.groups){
            return item.name;
          }
        }
        return '';
      },
      levelFmt (row) {
        for(var item of this.levels){
          if(item.code===row.level){
            return item.name;
          }
        }
        return '';
      },
      roleCodeFmt (row) {
        for(var item of this.roleList){
          if(item.code===row.roleCode){
            return item.name;
          }
        }
        return '';
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['seatForm'] && this.$refs['seatForm'].resetFields) {
          this.$refs['seatForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          this.dialog.form = Object.assign({"roleCode":""}, this.table.items[index]);
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            seatId: '',
            password: '',
            userName: '',
            roleCode: '',
            seatName: '',
            groups: '',
            level: '',
            phoneNo: '',
            email: '',
            callLimit: ''
          };
        }
        this.dialog.show = true;
      },

      submitForm () {
        this.$refs['seatForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.dialog.form);
            if (this.dialog.type === 1) {
              // 新增
              api.addSeat(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  delete params.content;
                  bsmp.log({
                    component: 'crm_service_seat',
                    type: 'add',
                    content: `[Seat] params: ${JSON.stringify(params)}`
                  });
                }
              });
            } else {
              // 修改
              api.editSeat(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  delete params.content;
                  bsmp.log({
                    component: 'crm_service_seat',
                    type: 'modify',
                    content: `[Seat] params: ${JSON.stringify(params)}`
                  });
                }
              });
            }
          } else {
            return false;
          }
        });
      },

      /**
       * 删除
       * */
      deleteItem (id) {
        this.$confirm('确定要删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除
          api.removeSeat(id).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'crm_service',
                type: 'delete',
                content: `[Seat] params: ${JSON.stringify({id})}`
              });
            }
          });
        }).catch(e => {
        });
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params =bsmp.util.deleteBlank(this.search);
        params = Object.assign({}, params, this.table.pager, {pageNo: this.table.pager.pageNo - 1});

        api.getSeatList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
            this.table.items.map((item, i) => {
              item.index = i + 1 + params.pageNo * params.pageSize;
              return item;
            });
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: data.data.pageNo + 1,
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

      getSeatGroups() {
        return api.getSeatGroupListAll().then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.groups = data.data;
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
      showResetForm(seatId) {
        if (this.$refs['resetForm'] && this.$refs['resetForm'].resetFields) {
          this.$refs['resetForm'].resetFields();
        }

        this.reset.form.loginName = seatId;
        this.reset.form.newPwd = '';
        this.reset.show = true;
      },
      submitResetForm() {
        this.$refs['resetForm'].validate((valid) => {
          if (valid) {
            api.resetPwd(this.reset.form).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '密码重置成功!'
                });

                this.reset.show = false;
                // 记录日志
                bsmp.log({
                  component: 'crm_service',
                  type: 'resetPwd',
                  content: `[Seat] params: ${JSON.stringify(this.reset.form)}`
                });
              }
            });
          } else {
            return false;
          }
        });
      }
    }
  }

  // 表单规则
  let rules = {
    groups: [
      {required: true, message: '请选择分组', trigger: 'change'}
    ],
    seatId: [
      {required: true, message: '请输入登录账号', trigger: 'blur'}
    ],
    password: [
      {required: true, message: '请输入密码', trigger: 'blur'}
    ],
    userName: [
      {required: true, message: '请输入姓名', trigger: 'blur'}
    ],
    roleCode: [
      {required: true, message: '请选择角色', trigger: 'change'}
    ],
    seatName: [
      {required: true, message: '请输入昵称', trigger: 'blur'}
    ],
    level: [
      {required: true, message: '请选择客服等级', trigger: 'change'}
    ]
  };
</script>
<style lang="stylus" scoped>
  .cat-block
    background #eef1f6
    padding 5px
    margin 10px 0
    span
      cursor pointer
      display inline-block
      padding 5px 10px
      margin 5px
      border 1px solid #ff4949
      &.active
        color #fff
        background #20a0ff
</style>
