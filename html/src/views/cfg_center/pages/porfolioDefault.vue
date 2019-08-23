<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select clearable v-model="search.companyId" placeholder="CompanyId">
            <el-option  
              v-for="item in companyMap"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>           
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <el-row class="toolbar">
      <el-button v-show="optAuth.add" @click="showDialog(1)" type="primary">新增</el-button>
    </el-row>

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
        width="100">
      </el-table-column>
      <el-table-column
        prop="companyId"
         :formatter="companyFmt"
        label="CompanyId"
        width="120">
      </el-table-column>
      <el-table-column
        prop="appId"       
        label="AppId"
        width="120">
      </el-table-column>
      <el-table-column
        prop="sort"
        label="Sort"
        width="100">
      </el-table-column>
      <el-table-column
        prop="proId"
        width="100"
        label="ProId">
      </el-table-column>
      <el-table-column
        prop="ushPips"
        width="200"
        label="UshPips">
      </el-table-column>
      <el-table-column
        prop="oilName"
        width="300"
        label="OilName">
      </el-table-column>
      <el-table-column
        prop="enName"
        width="100"
        label="EnName">
      </el-table-column>
       <el-table-column
        prop="bigName"
        width="150"
        label="BigName">
      </el-table-column>
       <el-table-column
        prop="precise"
        width="150"
        label="Precise">
      </el-table-column>
       <el-table-column
        prop="zoneId"
        width="150"
        label="ZoneId">
      </el-table-column>
       <el-table-column
        fixed="right"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.edit" @click.native.prevent="showDialog(2, scope.$index)"
                     type="info" icon='edit' size="mini"></el-button>
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
    <!-- /GTS2马甲包 -->

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="configForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="CompanyId：" prop="companyId">
              <el-select v-model="dialog.form.companyId" filterable placeholder="CompanyId">
                <el-option  
                  v-for="item in companyMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="AppId" prop="appId">
              <el-input v-model="dialog.form.appId" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
           <el-col :span="12">
            <el-form-item label="Sort" prop="sort">
              <el-input v-model="dialog.form.sort" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ProId" prop="proId">
              <el-input v-model="dialog.form.proId" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="UshPips" prop="ushPips">
              <el-input v-model="dialog.form.ushPips" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="OilName" prop="oilName">
              <el-input v-model="dialog.form.oilName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="EnName" prop="enName">
              <el-input v-model="dialog.form.enName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="BigName" prop="bigName">
              <el-input v-model="dialog.form.bigName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="GbName" prop="gbName">
              <el-input v-model="dialog.form.gbName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Precise" prop="precise">
              <el-input v-model="dialog.form.precise" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="ZoneId" prop="zoneId">
              <el-input v-model="dialog.form.zoneId" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm" type="primary">保 存</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'porfolioDefault',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        search: {
          companyId: '',
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
            companyId: '',
            appId: '',
            sort: '',
            proId: '',
            ushPips: '',
            oilName: '',
            enName: '',
            bigName: '',
            gbName: '',
            precise: '',
            zoneId: '',
          },
          rules: rules
        },
        companyMap: [],
      };
    },
    created (){
      this.getCompany();
    },
    mounted () {   
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'app_args_porfoliodefault_view',
          add: 'app_args_porfoliodefault_save',
          edit: 'app_args_porfoliodefault_update'
        });
      }
    },
    methods: {
      companyFmt (row) {
        return typeof row.companyId !== 'undefined' ? this.companyMap.find(c => c.value==row.companyId).label : '';
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['configForm'] && this.$refs['configForm'].resetFields) {
          this.$refs['configForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            companyId: '',
            appId: '',
            sort: '',
            proId: '',
            ushPips: '',
            oilName: '',
            enName: '',
            bigName: '',
            gbName: '',
            precise: '',
            zoneId: '',
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['configForm'].validate((valid) => {
          if (valid) {
              let params = Object.assign({}, this.dialog.form);
              if (this.dialog.type === 1) {
                // 新增
                api.addPorfolioDefault(params).then((res) => {
                  let data = res.data;
                  if (data && data.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '新增成功!'
                    });

                    this.dialog.show = false;
                    this.query();

                    // 记录日志
                    bsmp.log({
                      component: 'cfg_center',
                      type: 'add',
                      content: `[Versions] params: ${JSON.stringify(params)}`
                    });
                  }
                });
            } else {
                // 修改
                api.editPorfolioDefault(params).then((res) => {
                  let data = res.data;
                  if (data && data.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '编辑成功!'
                    });

                    this.dialog.show = false;
                    this.query();

                    // 记录日志
                    bsmp.log({
                      component: 'cfg_center',
                      type: 'modify',
                      content: `[Versions] params: ${JSON.stringify(params)}`
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
       * 查询
       */
      query () {
        this.loading = true;
        let params = Object.assign({}, this.search, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getPorfolioDefault(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === 0) {
            this.table.items = data.data.list;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: parseInt(data.data.pageNo, 10) + 1,
                total: data.data.total
              });
          } 
        }).catch(e => {
          this.loading = false;
        });
      },

      getCompany () {
        this.loading = true;
        api.getCompany().then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === 0) {
              let list = data.data.list
              list.forEach(item => {
                 this.companyMap.push({
                                  value: item.companyId,
                                  label: item.companyName
                                });
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

      cancelForm() {
        this.dialog.show = false;
      }
    }
  };
  // 表单规则
  let rules = {
    appId: [
      {required: true, message: '请输入AppId', trigger: 'blur'}
    ],
    companyId: [
      {required: true, message: '请输入CompanyId', trigger: 'blur'}
    ],
    sort:  [
      {required: true, message: '请输入Sort', trigger: 'blur'}
    ],
    proId:  [
      {required: true, message: '请输入ProId', trigger: 'blur'}
    ],
    ushPips: [
      {required: true, message: '请输入UshPips', trigger: 'blur'}
    ],
    oilName: [
      {required: true, message: '请输入OilName', trigger: 'blur'}
    ],
    enName: [
      {required: true, message: '请输入EnName', trigger: 'blur'}
    ],
    bigName: [
      {required: true, message: '请输入BigName', trigger: 'blur'}
    ],
    gbName: [
      {required: true, message: '请输入GbName', trigger: 'blur'}
    ],
    precise: [
      {required: true, message: '请输入Precise', trigger: 'blur'}
    ],
    zoneId: [
      {required: true, message: '请输入ZoneId', trigger: 'blur'}
    ],
  };
</script>
