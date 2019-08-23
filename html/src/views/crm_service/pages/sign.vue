<template>
  <div>
  <query-panel>
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <el-select clearable v-model="search.type" filterable placeholder="请选择标签类别">
        <el-option v-for="(c, key) in signTypes" :label="c.name" :value="c.id"
                   :key="'form-group-'+ c.id"></el-option>
      </el-select>
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
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 50"
      style="width: 100%">
      <el-table-column prop="index" label="#" width="60">
      </el-table-column>
      <el-table-column
        prop="code"
        label="标签代码">
      </el-table-column>
      <el-table-column
        prop="name"
        label="标签名称">
      </el-table-column>
      <el-table-column
        prop="status"
        :formatter="typeFmt"
        label="标签类别"
        width="100">
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
    <el-dialog :title="dialog.title" v-model="dialog.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="signForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="标签类别：" prop="type">
              <el-select clearable v-model="dialog.form.type" filterable placeholder="请选择标签类别">
                <el-option v-for="(c, key) in signTypes" :label="c.name" :value="c.id"
                           :key="'form-group-'+ c.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="标签代码：" prop="code">
              <el-input v-model="dialog.form.code" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="标签名称：" prop="name">
              <el-input v-model="dialog.form.name" auto-complete="off"></el-input>
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
    name: 'crm_service_sign',
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
            type: ''
          },
          rules: rules
        },
        signTypes: [],
        search: {
          type: ''
        }
      };
    },
    mounted () {
      Promise.all([this.getSignTypes()]).then(() => {
              this.query();
      });
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'crm_service_sign_view',
          add: 'crm_service_sign_add',
          edit: 'crm_service_sign_edit',
          del: 'crm_service_sign_delete'
        });
      }
    },
    methods: {
      /**
       * 禁用格式化
       * */
      typeFmt (row) {
        let typeName = '';
        if(typeof row.type !== 'undefined'){
          for(var item of this.signTypes){
            if(item.id === row.type){
              typeName = item.name;
            }
          }
        }
        return  typeName;
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {

        if (this.$refs['signForm'] && this.$refs['signForm'].resetFields) {
          this.$refs['signForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '修改';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          this.dialog.form = Object.assign({}, this.table.items[index]);
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            name: '',
            code: '',
            type: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['signForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              // 新增
              api.addSign(this.dialog.form).then((res) => {
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
                    content: `[Sign] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            } else {
              // 修改
              api.editSign(this.dialog.form).then((res) => {
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
                    content: `[Sign] params: ${JSON.stringify(this.dialog.form)}`
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
          api.removeSign(id).then((res) => {
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
                content: `[Sign] params: ${JSON.stringify({id})}`
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
        api.getSignList(params).then((res) => {
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

       getSignTypes() {
         return api.getSignTypeListAll().then((res) => {
           let data = res.data;
           if (data && data.code === '0') {
             this.signTypes = data.data;
           }
         });
       }
    }
  };

  // 表单规则
  let rules = {
    type: [
          {required: true, message: '请输入标签类别', trigger: 'blur'}
      ],
    code: [
        {required: true, message: '请输入标签代码', trigger: 'blur'}
    ],
    name: [
      {required: true, message: '请输入标签名称', trigger: 'blur'}
    ]

  };
</script>
