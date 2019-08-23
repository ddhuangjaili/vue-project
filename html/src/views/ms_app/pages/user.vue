<template>
  <div>
    <el-row class="toolbar">
      <el-button v-show="optAuth.search" @click="query()" title="刷新" type="primary" size="small">
        <i class="icon-arrows-cw"></i>&nbsp;&nbsp;刷新
      </el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 90"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="id"
        label="ID"
        width="250">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="nickname"
        label="用户昵称"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="uid"
        label="UID"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="token"
        label="Token"
        width="200">
      </el-table-column>
      <el-table-column
        label="手机号码"
        width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.personalInfo.phone">
            {{scope.row.personalInfo.phone}}
            <i v-if="scope.row.personalInfo.phoneStatus === 'verified'" title="已验证" class="icon icon-ok-circled enable-green"></i>
            <i v-else class="icon icon-attention-alt enable-red" title="未验证"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="邮箱"
        width="300">
        <template slot-scope="scope">
          <span v-if="scope.row.personalInfo.email">
            {{scope.row.personalInfo.email}}
            <i v-if="scope.row.personalInfo.emailStatus === 'verified'" title="已验证" class="icon icon-ok-circled enable-green"></i>
            <i v-else class="icon icon-attention-alt enable-red" title="未验证"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button title="查看详情" @click="showDialog(scope.$index)" size="mini"><i class="icon-eye"></i></el-button>
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
    <el-dialog title="用户详情" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="userForm" label-width="120px"
               class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="ID：">
              <el-input v-model="dialog.form.id" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称：">
              <el-input v-model="dialog.form.nickname" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="UID：">
              <el-input v-model="dialog.form.uid" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Token：">
              <el-input v-model="dialog.form.token" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="头像：">
              <img :src="dialog.form.avatar" class="min-img"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ID分组：">
              <el-input type="textarea" v-model="dialog.form.idGroup"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="dialog.form.personalInfo">
          <el-col :span="11">
            <el-form-item label="手机号码：">
              <el-input v-model="dialog.form.personalInfo.phone" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <i v-if="dialog.form.personalInfo.phoneStatus === 'verified'" title="已验证" class="icon icon-ok-circled enable-green"></i>
            <i v-else class="icon icon-attention-alt enable-red" title="未验证"></i>
          </el-col>
          <el-col :span="11">
            <el-form-item label="邮箱：">
              <el-input v-model="dialog.form.personalInfo.email" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <i v-if="dialog.form.personalInfo.emailStatus === 'verified'" title="已验证" class="icon icon-ok-circled enable-green"></i>
            <i v-else class="icon icon-attention-alt enable-red" title="未验证"></i>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="dialog.form.platforms">
          <el-col :span="24">
            <el-form-item label="第三方平台：">
              <table class="stat-table">
                <thead>
                <tr>
                  <th>平台名</th>
                  <th>状态</th>
                  <th>平台账号</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="p in dialog.form.platforms">
                  <td>{{p.name}}</td>
                  <td><span v-if="p.status === 'verified'">已验证</span><span v-else>未验证</span></td>
                  <td>{{p.value}}</td>
                </tr>
                </tbody>
              </table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'ms_app_user',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: false,
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
          index: -1, // 数据下标
          form: {
            id: '',
            nickname: 'enable',
            avatar: '',
            uid: '',
            token: '',
            platform: [],
            personalInfo: {
              phone: '',
              phoneStatus: '',
              email: '',
              emailStatus:''
            },
            idGroup: []
          }
        },
        statusMap: {
          'verified': '已验证',
          'unverified': '未验证'
        }
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'ms_app_user_view'
        });
      }
    },
    methods: {
      /**
       * 禁用格式化
       * */
      statusFmt (row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
      },
      /**
       * 显示弹窗
       * */
      showDialog (index) {

        this.dialog.index = index;
        let form = JSON.parse(JSON.stringify(this.table.items[index]));
        if (form.idGroup) {
          form.idGroup = form.idGroup.toString();
        }

        this.dialog.form = form;
        this.dialog.show = true;
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = Object.assign({}, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getUserList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
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
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .enable-red
    color: red
  .enable-green
    color: green

  .min-img
    width: auto;
    height: 50px;
    cursor: pointer;
  .stat-table
    width 100%
    thead
      color #5e6d82
      background-color #eff2f7
      th
        width 20%
        text-align center
        border 1px solid rgb(223, 230, 236)
    tbody
      td
        text-align center
        border 1px solid rgb(223, 230, 236)
</style>
