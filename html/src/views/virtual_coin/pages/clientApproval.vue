<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.name" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.mobileNo" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.status" placeholder="提案状态">
            <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                       :key="'search-status-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.approveType" placeholder="提案类型">
            <el-option v-for="(val, key) in approveTypeMap" :label="val" :value="key"
                       :key="'search-approveType-'+ key"></el-option>
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

    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 165"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="80">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="mobileNo"
        label="电话号码"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="realName"
        label="真实姓名"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="cardNo"
        label="身份证号码"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="approveType"
        label="提案类型"
        :formatter="approveTypeFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="randomNo"
        label="随机码"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bankName"
        :formatter="bankNameFmt"
        label="银行名称"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bankBranch"
        label="支行名称"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bankAccountNumber"
        label="银行账号"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        :formatter="approvalFmt"
        label="通过/拒绝理由"
        width="400">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注信息"
        width="200">
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
        width="200"
        label="创建时间">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateUser"
        label="更新人"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateDate"
        :formatter="updateDateFmt"
        width="200"
        label="更新时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="通过" @click="toApprove(scope.row)" v-show="optAuth.approval && scope.row.status === 0"
                     type="info" size="mini">通过</el-button>
          <el-button title="拒绝" @click="toReject(scope.row)" v-show="optAuth.approval && scope.row.status === 0"
                     type="danger" size="mini">拒绝</el-button>
          <el-button title="查看详情" @click="showDialog(scope.$index)" v-show="optAuth.approval && scope.row.approveType === 2" size="mini"><i class="icon-eye"></i></el-button>
          <el-button v-show="scope.row.approveType == 4" type="primary" size="small"><a :href="'/dfs_file/'+scope.row.videoAuthUrl" target="_blank" class="download-link" download="w3logo"><i class="icon-download"></i>下载</a></el-button>
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
      <table class="stat-table file-table">
        <thead>
        <tr>
          <th width="100">文件名</th>
          <th width="300">预览</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>身份证（正面）</td>
          <td><img :src="imagesMap.back.url" width="300"/></td>
        </tr>
        <tr>
          <td>身份证（反面）</td>
          <td><img :src="imagesMap.front.url" width="300"/></td>
        </tr>
        <tr>
          <td>身份证（手持）</td>
          <td><img :src="imagesMap.holdon.url" width="300"/></td>
        </tr>
        </tbody>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp  from 'bsmp_main';
  import {getBankName} from '../api/bankList';

  export default {
    name: 'clientApproval',
    props: {
      height: {
        type: Number
      }
    },
    data() {
      return {
        loading: true,
        search: {
          nickName: '',
          mobileNo: '',
          status: '0',
          approveType: '',
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
        statusMap: {
          '0': '待审批',
          '1': '已审批',
          '2': '已拒绝'
        },
        approveTypeMap: {
          '1': '实名认证',
          '2': '身份认证',
          '3': '绑定银行卡',
		  '4': '视频认证'
        },
        uploadFile: {
          uploadFileUrl: api.configUploadUrl + 'upload',
          uploadFileData: null
        },
        dialog: {
          show: false,
          index: -1, // 数据下标
          title: '身份认证信息',
        },
        imagesMap: {
          front: {
            url: ''
          },
          back: {
            url: ''
          },
          holdon: {
            url: ''
          }
        },
      }
    },
    mounted() {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'virtual_coin_client_approval_view',
          approval: 'virtual_coin_publishCur_approval',
        });
      }
    },
    methods: {
      approveTypeFmt(row) {
        return typeof row.approveType !== 'undefined' ? this.approveTypeMap[row.approveType] : '';
      },
      bankNameFmt(row) {
        if (row.bankName) {
          return getBankName(row.bankName);
        }
        return '';
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
      approvalFmt(row) {
        if (row.status === 1) {
          return `审核人：【${row.approveUser}】 状态：【通过】 备注：${row.approveRemark}`;
        } else if (row.status === 2) {
          return `审核人：【${row.cancelUser}】 状态：【拒绝】 备注：${row.cancelRemark}`;
        }
        return '';
      },

      /**
       * 上传文件配置信息
       * */
      getUploadFileConfig(clientCode) {
        return api.getUploadFileConfig({clientCode}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.uploadFile.uploadFileData = {...data.data};
          }
        });
      },

      /**
       * 获取指定证件的照片
       * */
      getAccountFileList(fileType, businessType) {
        let params = {...this.uploadFile.uploadFileData};
        params.fileType = fileType;
        params.businessType = businessType;

        return api.getAccountFileList(params).then((res) => {
          let data = res.data;
          if (data && data.code === 'OK' && data.data) {
            let imgUrl = data.data.pop();
            if (fileType === 'front' && imgUrl) {
              this.imagesMap.front.url = imgUrl;
            } else if (fileType === 'back' && imgUrl) {
              this.imagesMap.back.url = imgUrl
            } else if (fileType === 'holdon' && imgUrl) {
              this.imagesMap.holdon.url = imgUrl;
            }
          }
        });
      },

      /**
       * 显示弹窗
       * */
      showDialog(index) {
        this.imagesMap = {
          front: {
            url: ''
          },
          back: {
            url: ''
          },
          holdon: {
            url: ''
          }
        };
        let form = {...this.table.items[index]};

        this.loading = true;
        // 获取上传文件配置
        this.getUploadFileConfig(form.clientCode).then((res) => {

          this.loading = false;
          this.dialog.show = true;

          // 获取证件图片信息
          this.getAccountFileList('front', 'idCard');
          this.getAccountFileList('back', 'idCard');
          this.getAccountFileList('holdon', 'idCard');
        });
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

      deleteProp(form, props) {
        props.forEach((prop) => {
          delete form[prop];
        });
        return form;
      },

      /**
       * 处理审批请求
       * */
      handleApproval(form, status, remark) {
        let params = {...form};

        params = this.deleteProp(params, [
          'createUser', 'createIp', 'createDate',
          'updateUser', 'updateIp', 'updateDate',
          'companyId', 'deleted'
        ]);

        params.status = status;

        let userInfo = bsmp.util.getUserInfo();
        if (status === 1) {
          params.approveRemark = remark;
          params.approveUser = userInfo.loginName;
        } else if (status === 2) {
          params.cancelRemark = remark;
          params.cancelUser = userInfo.loginName;
        }

        api.editClient(params).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });

            this.query();

            // 记录日志
            bsmp.log({
              component: 'virtual_coin',
              type: 'approve',
              content: `[clientApproval] params: ${JSON.stringify(params)}`
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

      /**
       * 查询
       */
      query() {
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
        params.status = this.search.status;

        api.getClientCPList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
            this.table.pager.total = data.data.total;
          } else {
            this.table.items = [];
            this.table.pager = {
              pageNo: 1,
              total: 0
            };
          }
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
  .stat-table
    width 100%
    line-height 30px
    thead
      color #5e6d82
      background-color #eff2f7
      th
        text-align center
        border 1px solid rgb(223, 230, 236)
    tbody
      td
        text-align center
        border 1px solid rgb(223, 230, 236)
</style>

