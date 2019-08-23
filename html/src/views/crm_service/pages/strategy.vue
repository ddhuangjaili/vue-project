<template>
  <div>
    <el-row class="toolbar">
      <el-button v-show="optAuth.add" @click="showDialog(1)" type="primary">新增</el-button>
      <el-button v-show="optAuth.search" @click="query()" title="查询" type="primary" size="small">
        <i class="icon-arrows-cw"></i>&nbsp;&nbsp;查询
      </el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 50"
      style="width: 100%">
      <el-table-column prop="index" label="#" width="60">
      </el-table-column>
      <el-table-column
        prop="code"
        label="策略代码">
      </el-table-column>
      <el-table-column
        prop="name"
        label="策略名称">
      </el-table-column>
      <el-table-column
        prop="status"
        :formatter="statusFmt"
        label="状态"
        width="100">
      </el-table-column>
      <el-table-column
          width="200"
          label="当前策略">
          <template slot-scope="scope">
            <i class="el-icon-star-on" v-if = "scope.row.status==1"></i>
            <i class="el-icon-star-off" v-if = "scope.row.status==0" @click="changeStrategy(scope.row.id)"></i>
          </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.edit" type="info" icon='edit' size="mini"
                     @click.native.prevent="showDialog(2, scope.$index)"></el-button>
          <el-button title="删除" v-show="optAuth.del" type="danger" icon='delete' size="mini"
                     @click="deleteItem(scope.row.id)"></el-button>
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
      <el-form ref="strategyForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="策略代码：" prop="code">
              <el-input v-model="dialog.form.code" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="策略名称：" prop="name">
              <el-input v-model="dialog.form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="目标规则配置：">
              <el-button @click="addSourceModel(dialog.form.targetModelList)" title="新建" type="primary" size="small" class="pull-right">
                <i class="icon-plus"></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-for="(item,index) in dialog.form.targetModelList" :key="'target1'+index">
          <el-col :span="24">
            <el-form-item label="">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span style="line-height: 36px;">
                    <el-select clearable v-model="item.type" filterable placeholder="请选择规则类型" @change="selectRule(item)" value="">
                       <el-option v-for="(c, key) in ruleType" :label="c.name" :value="c.code"
                        :key="'form-level-'+ c.code" ></el-option>
                    </el-select>
                  </span>
                  <el-button @click="removeModel(dialog.form.targetModelList,index)" title="删除" type="primary" size="small" style="float: right;"><i class="icon-minus"></i></el-button>
                </div>
                <div v-if="item.type==1||item.type==2" v-for="(o,_index) in item.levels" :key="'o_'+_index" class="text item">
                  <el-form-item  :label="o.name+':'">
                      <el-input type="number" v-model="o.value" auto-complete="off" ></el-input>
                  </el-form-item>
                </div>
              </el-card>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input v-model="dialog.form.remark" auto-complete="off" type="textarea" :rows="3"></el-input>
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
  import bsmp from 'bsmp_main';
  export default {
    name: 'crm_service_strategy',
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
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          title: '',
          form: {
            name: '',
            code: '',
            sourceModelList: [],
            targetModelList: []
          },
          rules: rules
        },
        statusMap: {
          '1': '可用',
          '0': '禁用',
          '-1': '删除'
        },
       levels:[
          {'code':'0','name':'初级客服','value':0},
          {'code':'1','name':'中级客服','value':0},
          {'code':'2','name':'高级客服','value':0},
          {'code':'3','name':'资深客服','value':0}
       ],
        ruleType: [
          {'code':'1','name':'会话上限'},
          {'code':'2','name':'N客户优先级'}
       ]
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'crm_service_strategyConfig_list',
          add: 'crm_service_strategyConfig_add',
          edit: 'crm_service_strategyConfig_edit',
          del: 'crm_service_strategyConfig_del'
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
      showDialog (type, index) {

        if (this.$refs['strategyForm'] && this.$refs['strategyForm'].resetFields) {
          this.$refs['strategyForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          this.dialog.form = Object.assign({}, this.toJson(this.table.items[index]));
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            name: '',
            code: '',
            sourceModelList: [],
            targetModelList: []
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['strategyForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              // 新增
              api.addStrategy(this.toString(this.dialog.form)).then((res) => {
                let data = res.data;
                if (data && data.code === '0') {
                  this.$message({
                    type: 'success',
                    message: '新增成功!'
                  });

                  this.dialog.show = false;
                  this.query();

                  // 记录日志
                  bsmp.log({
                    component: 'crm_service',
                    type: 'add',
                    content: `[Strategy] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            } else {
              // 修改
              api.editStrategy(this.toString(this.dialog.form)).then((res) => {
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
                    component: 'crm_service',
                    type: 'modify',
                    content: `[Strategy] params: ${JSON.stringify(this.dialog.form)}`
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
          api.removeStrategy(id).then((res) => {
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
                content: `[Strategy] params: ${JSON.stringify({id})}`
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
        let params = bsmp.util.deleteBlank(this.search);
        params = Object.assign({}, params, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        this.loading = true;
        api.getStrategyList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
            this.table.items.map((item, i) => {
              item.index = i + 1 + params.pageNo * params.pageSize;
              return item;
            });
            console.log(this.table.items);
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
      changeStrategy (id) {
        this.$confirm('确定要将此策略设为当前使用的策略吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.enableStrategy(id).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.query();
            }
          });
        }).catch(e => {
        })
      },
      addSourceModel (modelList) {
       modelList.push({"type":"","value":""});
      },
      removeModel (modelList,index) {
       modelList.splice(index, 1);
      },
      selectRule (item) {
       this.$set(item,"levels",this.levels);
      },
      toString(obj) {
        for(var i=0;i< obj.targetModelList.length;i++){
           obj.targetModelList[i].value = JSON.stringify(obj.targetModelList[i].levels);
        }
        return obj;
      },
      toJson(obj) {
       for(var i=0;i< obj.targetModelList.length;i++){
         obj.targetModelList[i].levels = JSON.parse(obj.targetModelList[i].value);
       }
       return obj
     }
    }
  };

  // 表单规则
  let rules = {
    code: [
        {required: true, message: '请输入策略代码', trigger: 'blur'}
    ],
    name: [
      {required: true, message: '请输入策略名称', trigger: 'blur'}
    ]
  };
</script>
<style lang="stylus" scoped>
 .clearfix:before,
   .clearfix:after {
       display: table;
       content: "";
   }
   .clearfix:after {
       clear: both
   }
</style>
