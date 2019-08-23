<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.riskLabel" placeholder="标签"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.createWay" placeholder="创建方式">
            <el-option v-for="(val, key) in createWayMap" :label="val" :value="key"
                       :key="'search-type-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.riskMark" filterable clearable placeholder="案件标签">
            <el-option v-for="(val, key) in labelMap" :label="val[0]" :value="val[1]"
                       :key="'search-riskMark-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：" prop="createDate">
          <el-date-picker
            clearable
            v-model="search.createDate"
            type="daterange"
            placeholder="创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核时间：" prop="approveDate">
          <el-date-picker
            clearable
            v-model="search.approveDate"
            type="daterange"
            placeholder="审核时间">
          </el-date-picker>
        </el-form-item>
        <br>
        <el-form-item label="名单组：" prop="level">
          <el-select clearable v-model="search.level" placeholder="名单组">
            <el-option v-for="(val, key) in levelMap" :label="val" :value="key"
                       :key="'search-type-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态：" prop="status">
          <el-select clearable v-model="search.status" placeholder="审核状态">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                       :key="'search-status-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="clear">清空</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <el-row class="toolbar">
      <el-button v-show="optAuth.save" @click="showDialog(1)" type="primary">新增</el-button>
      <el-button v-show="optAuth.search" @click="query()" title="刷新" type="primary" size="small">
        <i class="icon-arrows-cw"></i>&nbsp;&nbsp;刷新
      </el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      stripe
      :max-height="height - 200"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="item">
          <el-form label-position="left" inline class="ele-table-expand" label-width="0px" style="width: 50%">
            <el-form-item>
              <span class="label">标签描述:</span>
              <span>{{ item.row.labelDesc }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">创建时间:</span>
              <span>{{item.row.createDate == null?'':item.row.createDate.substr(0, 19) }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">修改人员:</span>
              <span>{{ item.row.updateUser }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">修改时间:</span>
              <span>{{ item.row.updateDate == null?'':item.row.updateDate.substr(0, 19) }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">审核人员:</span>
              <span>{{ item.row.approveUser }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">审核描述:</span>
              <span>{{ item.row.approveRemark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="riskLabel"
        label="标签"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="riskMark"
        label="标签编码"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="level"
        :formatter="levelFmt"
        label="名单组"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="payMark"
        label="支付标记"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="verifyMark"
        label="验证标记"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        :formatter="statusFmt"
        prop="status"
        label="审核状态"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="approveDate"
        label="审核时间"
        :formatter="dateFmt"
        width="300"
        sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createUser"
        label="创建人员"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createWay"
        :formatter="createWayFmt"
        label="创建方式"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="labelDesc"
        label="标签描述"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="approveRemark"
        label="审核描述"
        width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="删除" v-show="optAuth.del && scope.row.status ===0 " type="danger" icon='delete' size="mini"
                     @click.native.prevent="deleteItem(scope.row.id)">
                      <i class="icon-trash-empty"></i>
                     </el-button>
          <el-button title="编辑" v-show="optAuth.update" size="mini"
                     @click.native.prevent="showDialog(2, scope.$index)">
                      <i class="icon-edit-square"></i>
                     </el-button>
          <el-button title="审核" v-show="optAuth.approve && scope.row.status ===0"  size="mini"
                     @click.native.prevent="showApproveDialog(3, scope.$index)"><i class="icon-ok-circled"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pull-right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="table.pager.page"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="table.pager.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="table.pager.total">
    </el-pagination>

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="labelForm" :model="dialog.form" :rules="dialog.rules" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标签：" prop="riskLabel">
              <el-input v-model="dialog.form.riskLabel" placeholder="标签"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标签编码" prop="riskMark">
              <el-input v-model="dialog.form.riskMark" placeholder="标签编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名单组" prop="level">
              <el-select clearable v-model="dialog.form.level">
                <el-option v-for="(val, key) in levelMap" :label="val" :value="key"
                           :key="'edit-level-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付标记：" prop="payMark">
              <el-input v-model="dialog.form.payMark" placeholder="支付标记"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验证标记：" prop="verifyMark">
              <el-input v-model="dialog.form.verifyMark" placeholder="验证标记"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标签描述：" prop="labelDesc">
              <el-input type="textarea" :rows="3" v-model="dialog.form.labelDesc"></el-input>
              <br>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 审核弹窗框 -->
    <el-dialog :title="approveDailog.title" v-model="approveDailog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="approveForm" :model="approveDailog.form" :rules="approveDailog.rules" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标签：" prop="riskLabel">
              <el-input v-model="approveDailog.form.riskLabel" placeholder="标签" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标签编码" prop="riskMark">
              <el-input v-model="approveDailog.form.riskMark" placeholder="标签编码" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名单组" prop="level">
              <el-select clearable v-model="approveDailog.form.level" :disabled="approveDailog.type === 3">
                <el-option v-for="(val, key) in levelMap" :label="val" :value="key"
                           :key="'approve-level-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付标记：" prop="payMark">
              <el-input v-model="approveDailog.form.payMark" placeholder="支付标记" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验证标记：" prop="verifyMark">
              <el-input v-model="approveDailog.form.verifyMark" placeholder="验证标记" :disabled="approveDailog.type === 3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标签描述：" prop="labelDesc">
              <el-input type="textarea" :rows="3" v-model="approveDailog.form.labelDesc" :disabled="approveDailog.type === 3"></el-input>
              <br>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审核状态：" prop="status">
              <el-select clearable v-model="approveDailog.form.status">
                <el-option v-for="(val, key) in statusMap" :label="val" :value="key"
                           :key="'approve-approveType-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-form-item label="审核描述：" prop="approveRemark">
              <el-input v-model="approveDailog.form.approveRemark" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelApproveForm">取 消</el-button>
        <el-button type="primary" @click="submitApproveForm(3)">确定</el-button>
      </div>
    </el-dialog>
    <!-- /审核弹窗框 -->
  </div>
</template>

<style lang="stylus" scoped>
  .ele-table-expand {

    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 34%;

      .label {
        display: inline-block;
        margin-left: 40px;
        width: 80px;
        color: #99a9bf;
      }
    }
  }
</style>

<script>
  import api from '../../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'risk_system_label_manage',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        labelMap: {},
        userInfo: null,
        loading: true,
        search: {
          createWay: '',
          level: '',
          riskLabel: '',
          riskMark: '',
          status: '',
          sort: 'approve_date',
          order: 'desc'
        },
        table: {
          items: [],
          pager: {
            pageSize: 10,
            pageNo: 1,
            total: 0
          }
        },
        levelMap: {
          '0': '白名单',
          '1': '黑名单',
          '2': '危险名单',
          '3': '正常名单',
          '4': '其他名单'
        },
        riskMarkMap: {
          'P1': 'P1',
          'P2': 'P2',
          'P3': 'P3',
          'P4': 'P4',
          'P5': 'P5'
        },
        createWayMap: {
          '1': '系统预设',
          '2': '自定义'
        },
        statusMap: {
          '0': '待审核',
          '1': '审核通过',
          '2': '审核不通过'
        },
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          title: '',
          form: {
            level: '',
            riskLabel: '',
            riskMark: '',
            labelDesc: '',
            createWay: '2',
            status: '0',
            payMark: '',
            verifyMark: ''
          },
          rules: rules
        },
        approveDailog: {
          show: false,
          type: 3, // 类型，3：审核
          title: '',
          form: {
            approveRemark: ''
          },
          rules: approve_rules
        }
      };
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      if (this.userInfo.loginName) {
        this.getLabelDic().then(() => {
          this.query();
        });
      }
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'risk_system_label',
          save: 'risk_system_label_save',
          update: 'risk_system_label_update',
          approve: 'risk_system_label_approve',
          del: 'risk_system_label_delete'
        });
      },
      company() {
        return bsmp.util.getCompany();
      },
      loginUser() {
        return bsmp.util.getUserInfo();
      }
    },
    watch: {
      'company': function (company) {
        if (this.userInfo.companyId === 'ALL' && company) {
          this.getLabelDic().then(() => {
            this.query();
          });
        }
      },
      'loginUser': function (loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
          this.getLabelDic().then(() => {
            this.query();
          });
        }
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteMultiple () {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的数据!'
          });
          return;
        }
        let ids = [];
        for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        this.deleteItem(ids.join(','));
      },
      /**
       * 审核状态格式化
       * @param row
       * @returns {string}
       */
      statusFmt (row) {
        return typeof row.status !== 'undefined' ? this.statusMap[row.status] : '';
      },
      /**
       * 创建方式格式化
       * @param row
       * @returns {string}
       */
      createWayFmt (row) {
        return typeof row.createWay !== 'undefined' ? this.createWayMap[row.createWay] : '';
      },
      /**
       * 名单组格式化
       * @param row
       * @returns {string}
       */
      levelFmt (row) {
        return typeof row.level !== 'undefined' ? this.levelMap[row.level] : '';
      },
      /**
       * 日期格式化
       * */
      dateFmt (row) {
        return row.approveDate ? bsmp.util.formatDate.format(new Date(row.approveDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['labelForm'] && this.$refs['labelForm'].resetFields) {
          this.$refs['labelForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.level = form.level + '';
          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            level: '',
            riskLabel: '',
            riskMark: '',
            labelDesc: '',
            payMark: '',
            verifyMark: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['labelForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              // 新增
              if (!this.getCompanyId()) {
                this.$message.error('请先选择公司！');
                return;
              }
              this.dialog.form.companyId = this.getCompanyId();

              api.saveRiskLabel(this.dialog.form).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'risk_system',
                    type: 'add',
                    content: `[RiskLabel] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            } else {
              // 修改
              let params = {
                id: this.dialog.form.id,
                level: this.dialog.form.level,
                riskLabel: this.dialog.form.riskLabel,
                riskMark: this.dialog.form.riskMark,
                labelDesc: this.dialog.form.labelDesc,
                payMark: this.dialog.form.payMark,
                verifyMark: this.dialog.form.verifyMark
              };

              api.updateRiskLabel(params).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'risk_system',
                    type: 'modify',
                    content: `[RiskLabel] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            }

            this.dialog.show = false;
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
          api.removeRiskLabel({ids:id}).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              if(data.data.result === '-1'){
                let errorMsg =  data.data.errorMsg;
                this.$message({
                  type: 'error',
                  message: errorMsg
                });
                return;
              }
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'risk_system',
                type: 'delete',
                content: `[RiskLabel] params: ${JSON.stringify({id: id})}`
              });
            }
          });
        }).catch(e => {
        });
      },
      /**
       * 取消弹窗
       * */
      cancelForm () {
        this.dialog.show = false;
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
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        if (this.getCompanyId()) {
          params.companyId = this.getCompanyId();
        }

        params = Object.assign({}, params, this.table.pager);
        // 创建时间处理
        if (params.createDate && params.createDate.length && params.createDate[0] && params.createDate[1]) {
          params.beginDate = bsmp.util.formatDate.format(params.createDate[0], 'yyyy-MM-dd hh:mm:ss');
          params.endDate = bsmp.util.formatDate.format(params.createDate[1], 'yyyy-MM-dd') + ' 23:59:59';
          delete params.createDate;
        }
        // 审核时间处理
        if (params.approveDate && params.approveDate.length && params.approveDate[0] && params.approveDate[1]) {
          params.approveDateStart = bsmp.util.formatDate.format(params.approveDate[0], 'yyyy-MM-dd hh:mm:ss');
          params.approveDateEnd = bsmp.util.formatDate.format(params.approveDate[1], 'yyyy-MM-dd') + ' 23:59:59';
          delete params.approveDate;
        }
        api.getRiskLabelList(params).then((res) => {
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
       * 清空
       */
      clear (){
        this.search = {
          riskLabel: '',
          status: '',
          level: '',
          riskMask: '',
          createWay: '',
          createDate: '',
          approveDate: '',
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
      /**
       * 审核弹窗
       * */
      showApproveDialog (type, index) {
        if (this.$refs['approveForm'] && this.$refs['approveForm'].resetFields) {
          this.$refs['approveForm'].resetFields();
        }
        if (this.approveDailog.type === 3 && index > -1) {
          this.approveDailog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.status = form.status + '';
          form.level = form.level + '';
          form.riskMark = form.riskMark + '';
          form.riskLabel = form.riskLabel + '';
          form.payMark == null?'': form.payMark;
          form.verifyMark == null?'': form.verifyMark;
          this.approveDailog.form = form;
        }
//        if (this.approveDailog.form.status != '1'){   //审核通过的记录不能再次审核
//          this.approveDailog.show = true;
//        }
        this.approveDailog.show = true;
      },
      submitApproveForm (type){
        this.$refs['approveForm'].validate((valid) => {
          if (valid) {
            if (this.approveDailog.type === 3) {
              // 审核
              if (!this.getCompanyId()) {
                this.$message.error('请先选择公司！');
                return;
              }
              this.approveDailog.form.companyId = this.getCompanyId();
              let action = '';
              if(this.approveDailog.form.status === '1'){
                action = 'approve';
              } else if(this.approveDailog.form.status === '2'){
                action = 'refuse';
              } else {
                this.$message({
                  type: 'info',
                  message: '审核状态未改变!'
                });
                return;
              }
              api.approveRiskLabel({ids:this.approveDailog.form.id,action:action, approveRemark:this.approveDailog.form.approveRemark}).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '审核成功!'
                  });
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'risk_system',
                    type: 'approve',
                    content: `[RiskLabel] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            }
            this.approveDailog.show = false;
          } else {
            return false;
          }
        });
      },
      /**
       * 取消弹窗
       * */
      cancelApproveForm () {
        this.approveDailog.show = false;
      },
      /**
       * 获取案件标签字典
       * */
      getLabelDic (){
        let params = {
          companyId: this.getCompanyId(),
          status:'',
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
    }
  };

  // 表单规则
  let rules = {
    level: [
      {required: true, message: '请选择名单组', trigger: 'blur'}
    ],
    riskLabel: [
      {required: true, message: '请输入标签', trigger: 'blur'}
    ],
    riskMark: [
      {required: true, message: '请选择标签编码', trigger: 'blur'}
    ]
  };
  //审核表单规则
  let approve_rules = {
    status: [
      {required: true, message: '请输入审核状态', trigger: 'blur'}
    ],
    approveRemark: [
      {required: true, message: '请输入审核描述', trigger: 'blur'}
    ]
  };
</script>
<style lang="stylus" scoped>
  .tpl-link
    word-break:break-all
  .rule-tip
    color: #ff4949
  .icon-arrows-cw
    font-size: 80%
</style>
