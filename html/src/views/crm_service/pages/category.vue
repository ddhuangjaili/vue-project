<template>
  <div>
    <el-row class="toolbar">
      <el-button v-show="optAuth.add" @click="showDialog(1)" type="primary">新增</el-button>
      <el-button v-show="optAuth.search" @click="query()" title="刷新" type="primary" size="small">
        <i class="icon-arrows-cw"></i>&nbsp;&nbsp;刷新
      </el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 50"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        prop="status"
        :formatter="statusFmt"
        label="状态"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        label="分类名字">
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

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="categoryForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="分类名称：" prop="name">
              <el-input v-model="dialog.form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="图标id：" prop="iconID">
              <el-input-number v-model="dialog.form.iconID" :min="0"></el-input-number>
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
    name: 'crm_service_category',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: false,
        table: {
          items: []
        },
        dialog: {
          show: false,
          type: 1, // 类型，1：新增，2：编辑
          index: -1, // 数据下标
          title: '',
          form: {
            name: '',
            iconID: 0
          },
          rules: rules
        },
        statusMap: {
          '1': '可用',
          '0': '禁用',
          '-1': '删除'
        }
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'crm_service_category_view',
          add: 'crm_service_category_add',
          edit: 'crm_service_category_edit',
          del: 'crm_service_category_delete'
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

        if (this.$refs['categoryForm'] && this.$refs['categoryForm'].resetFields) {
          this.$refs['categoryForm'].resetFields();
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
            iconID: 0
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['categoryForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              // 新增
              api.addCategory(this.dialog.form).then((res) => {
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
                    content: `[Category] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            } else {
              // 修改
              api.editCategory(this.dialog.form).then((res) => {
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
                    content: `[Category] params: ${JSON.stringify(this.dialog.form)}`
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
          api.removeCategory(id).then((res) => {
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
                content: `[Category] params: ${JSON.stringify({id})}`
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
        api.getCategoryList().then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data;
          }
        }).catch(e => {
          this.loading = false;
        });
      }
    }
  };

  // 表单规则
  let rules = {
    name: [
      {required: true, message: '请输入分类名称', trigger: 'blur'}
    ]
  };
</script>
