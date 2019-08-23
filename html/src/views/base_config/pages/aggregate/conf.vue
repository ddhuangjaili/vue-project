<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="search.aggregateSupplierId" clearable filterable placeholder="供应商">
            <el-option v-for="(val, key) in supplierMap" :label="val" :value="key"
                       :key="'search-supplier-'+ key"></el-option>
          </el-select>
          <!--<el-input v-model="search.aggregateSupplierId" placeholder="聚合供应商id"></el-input>-->
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.switcher" clearable filterable placeholder="开关">
            <el-option v-for="(val, key) in switcherMap" :label="val" :value="key"
                       :key="'search-switcher-'+ key"></el-option>
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
      <el-button v-show="optAuth.del" @click="deleteMultiple" type="danger">批量删除</el-button>
      <el-button v-show="optAuth.order" @click="orderMultiple" type="primary">调整优先级</el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      stripe
      :max-height="height - 165"
      @selection-change="handleSelectionChange">
      <el-table-column
        fixed
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="index" width="70" label="序号">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="businessType"
        label="应用方"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="aggregateSupplierId"
        :formatter="supplierFmt"
        label="聚合供应商"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="orderId"
        label="优先级"
        width="250">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.orderId" :min="1"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="switcher"
        :formatter="switcherFmt"
        label="开关"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注"
        width="300">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateDate"
        label="最后更新时间"
        :formatter="dateFmt"
        sortable>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button v-show="optAuth.save" title="编辑" type="info" icon='edit' size="mini"
                     @click.native.prevent="showDialog(2, scope.$index)"></el-button>
          <el-button v-show="optAuth.del" title="删除" type="danger" icon='delete' size="mini"
                     @click.native.prevent="deleteItem(scope.row.id)"></el-button>
          <el-button @click="updateStatus(scope.row.id, scope.row.companyId, 'on')" v-show="optAuth.status && scope.row.switcher === 'off'" size="mini"
                     title="启用">
            <i class="icon-play"></i>
          </el-button>
          <el-button @click="updateStatus(scope.row.id, scope.row.companyId, 'off')" v-show="optAuth.status && scope.row.switcher === 'on'" size="mini"
                     title="禁用">
            <i class="icon-stop"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pull-right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="table.pager.page"
                   :page-sizes="[20, 50, 100, 200]"
                   :page-size="table.pager.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="table.pager.total">
    </el-pagination>

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="aggregateConfForm" :model="dialog.form" :rules="dialog.rules" label-width="140px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="应用方：" prop="businessType">
              <el-input v-model="dialog.form.businessType" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="聚合供应商：" prop="aggregateSupplierId">
              <!--<el-input-number v-model="dialog.form.aggregateSupplierId" :min="0"></el-input-number>-->
             <el-select v-model="dialog.form.aggregateSupplierId" filterable placeholder="聚合供应商">
                <el-option v-for="(val, key) in supplierMap" :label="val" :value="key"
                           :key="'form-aggregateSupplierId-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="优先级：" prop="orderId">
              <el-input-number v-model="dialog.form.orderId" :min="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开关：" prop="switcher">
              <el-switch
                v-model="dialog.form.switcher"
                on-text="开"
                off-text="关"
                on-value="on"
                off-value="off"
              >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea" :rows="3" v-model="dialog.form.remark"></el-input>
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
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'base_config_aggregate_conf',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        userInfo: null,
        loading: true,
        search: {
          businessType: '',
          aggregateSupplierId: '',
          switcher: '',
          sort: 'updateDate',
          order: 'desc'
        },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            page: 1,
            total: 0
          }
        },
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          title: '',
          form: {
            businessType: '',
            aggregateSupplierId: '',
            switcher: '',
            orderId: '',
            remark: ''
          },
          rules: rules
        },
        suppliers:[],
        supplierMap:{},
        switcherMap: {
          'on': '开',
          'off': '关'
        },
        multipleSelection: []
      };
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      if (this.userInfo.loginName) {
        this.getSupplierDic().then(() => {
          this.query();
        });
      }
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'base_config_aggregate_conf_list',
          save: 'base_config_aggregate_conf_save',
          del: 'base_config_aggregate_conf_delete',
          order: 'base_config_aggregate_conf_order',
          status: 'base_config_aggregate_conf_status'
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
          this.getSupplierDic().then(() => {
            this.query();
          });
        }
      },
      'loginUser': function (loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
          this.getSupplierDic().then(() => {
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
      orderMultiple () {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要更新优先级的记录!'
          });
          return;
        }
        let reqDTOList = [], item = null;
        for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
          item = this.multipleSelection[i];
          reqDTOList.push({id: item.id, orderId: item.orderId, companyId: item.companyId});
        }

        api.updateAggregateOrder({reqDTOList}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.$message.success('操作成功');
            this.query();

            // 记录日志
            bsmp.log({
              component: 'base_config',
              type: 'modify',
              content: `[AggregateConf] params: ${JSON.stringify(reqDTOList)}`
            });
          }
        });
      },
      updateStatus(ids, companyId, switcher) {
        api.updateAggregateStatus({ids: ids + '', companyId, switcher}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.$message.success('操作成功');
            this.query();

            // 记录日志
            bsmp.log({
              component: 'base_config',
              type: 'modify',
              content: `[AggregateConf] params: ${JSON.stringify({ids, companyId, switcher})}`
            });
          }
        });
      },
      /**
       * 日期格式化
       * */
      dateFmt (row) {
        return row.updateDate ? bsmp.util.formatDate.format(new Date(row.updateDate), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      /**
       * 格式化开关
       * @param row
       * @returns {string}
       */
      switcherFmt (row) {
        return typeof row.switcher !== 'undefined' ? this.switcherMap[row.switcher] : '';
      },
      /**
       * 格式化供应商
       * @param row
       * @returns {string}
       */
      supplierFmt (row){
        return typeof row.aggregateSupplierId !== 'undefined' ? this.supplierMap[row.aggregateSupplierId] : '';
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['aggregateConfForm'] && this.$refs['aggregateConfForm'].resetFields) {
          this.$refs['aggregateConfForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;
        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.aggregateSupplierId = form.aggregateSupplierId + '';
          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            businessType: '',
            aggregateSupplierId: '',
            switcher: 'on',
            orderId: '',
            remark: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['aggregateConfForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              // 新增
              if (!this.getCompanyId()) {
                this.$message.error('请先选择公司！');
                return;
              }
              this.dialog.form.companyId = this.getCompanyId();

              api.saveAggregate(this.dialog.form).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'base_config',
                    type: 'add',
                    content: `[AggregateConf] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            } else {
              // 修改
              api.saveAggregate(this.dialog.form).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  });
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'base_config',
                    type: 'modify',
                    content: `[AggregateConf] params: ${JSON.stringify(this.dialog.form)}`
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
          api.removeAggregate(id).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'base_config',
                type: 'delete',
                content: `[AggregateConf] params: ${JSON.stringify({id: id})}`
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
      /**
       * 清空
       */
      clear (){
        this.search = {
          businessType: '',
          aggregateSupplierId: '',
          switcher: ''
        }
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
       * 获取所有供应商
       *
       * */
      getSupplierDic(){
        return api.getSupplierDic(this.getCompanyId()).then((res) => {
          this.loading = false;
          let data = res.data;
          if(data && data.code === '0'){
            this.suppliers = data.data;
            if(this.suppliers && this.suppliers.length){
              this.suppliers.forEach((item) => {
                let infCodeName;
                if (item.infCode === "mobile_auth"){
                  infCodeName = "手机认证";
                } else if (item.infCode === "idcard_auth") {
                  infCodeName = "身份证认证";
                } else{
                  infCodeName = "";
                }
                this.supplierMap[item.id] = item.supplier + "["+infCodeName+"]";
              });
            }
          }
        }).catch(e => {
          this.loading = false;
        });
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
        api.getAggregateList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.list;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                page: data.data.pageNum,
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
        if (this.table.pager.page) {
          this.table.pager.page = val;
          this.query();
        }
      }
    }
  };

  // 表单规则
  let rules = {
    businessType: [
      {required: true, message: '请输入应用方', trigger: 'blur'}
    ],
    aggregateSupplierId: [
      {required: true, message: '请输入聚合供应商ID', trigger: 'blur'}
    ]
  };
</script>
