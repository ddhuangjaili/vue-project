<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.isEnable" placeholder="是否可用">
            <el-option v-for="(val, key) in isEnableMap" :label="val" :value="key"
                       :key="'search-isEnable-'+ key"></el-option>
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
        :show-overflow-tooltip="true"
        prop="name"
        label="名称"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="isEnable"
        label="是否可用"
        :formatter="isEnableFmt"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        width="200"
        label="创建时间">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="creator"
        width="150"
        label="创建人">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="modifiedTime"
        width="200"
        label="更新时间">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="modifier"
        label="更新人">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.edit" @click="showDialog(2, scope.$index)"
                     type="info" icon='edit' size="mini"></el-button>
          <el-button title="启用" @click="activeItem(scope.$index, '1')" v-show="optAuth.edit && scope.row.isEnable === 0" size="mini">
            <i class="icon-play"></i>
          </el-button>
          <el-button title="禁用" @click="activeItem(scope.$index, '0')" v-show="optAuth.edit && scope.row.isEnable === 1" size="mini">
            <i class="icon-stop"></i>
          </el-button>
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
      <el-form ref="adGroupForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="名称：" prop="name">
              <el-input v-model="dialog.form.name" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm" type="primary">保 存</el-button>
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
    name: 'adGroup',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        search: {
          name: '',
          isEnable: '1'
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
            isEnable: '1'
          },
          rules: rules
        },
        isEnableMap: {
          '1': '可用',
          '0': '不可用'
        }
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'app_args_adGroup_find',
          add: 'app_args_adGroup_save',
          edit: 'app_args_adGroup_update'
        });
      }
    },
    methods: {
      isEnableFmt(row) {
        return typeof row.isEnable !== 'undefined' ? this.isEnableMap[row.isEnable] : '';
      },

      activeItem(index, isEnable) {
        let form = Object.assign({}, this.table.items[index], {isEnable});
        api.editAdGroup(form).then((res) => {
          let data = res.data;
          if (data && data.code === 0) {
            this.$message({
              type: 'success',
              message: isEnable === '1' ? '启动成功!' : '禁用成功！'
            });
            this.query();

            // 记录日志
            bsmp.log({
              component: 'cfg_center',
              type: 'modify',
              content: `[AdGroup] params: ${JSON.stringify(form)}`
            });
          }
        });
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['adGroupForm'] && this.$refs['adGroupForm'].resetFields) {
          this.$refs['adGroupForm'].resetFields();
        }

        this.dialog.title = type === 1 ? '新增' : '编辑';
        this.dialog.type = type;

        // 编辑
        if (this.dialog.type === 2 && index > -1) {
          this.dialog.index = index;
          let form = Object.assign({}, this.table.items[index]);
          form.isEnable = form.isEnable + '';

          this.dialog.form = form;
        } else {
          this.dialog.index = -1;
          this.dialog.form = {
            name: '',
            isEnable: '1'
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['adGroupForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.dialog.form);

            if (this.dialog.type === 1) {
              // 新增
              api.addAdGroup(params).then((res) => {
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
                    content: `[AdGroup] params: ${JSON.stringify(params)}`
                  });
                }
              });
            } else {
              // 修改
              api.editAdGroup(params).then((res) => {
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
                    content: `[AdGroup] params: ${JSON.stringify(params)}`
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
          api.removeAdGroup({id: id}).then((res) => {
            let data = res.data;
            if (data && data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'cfg_center',
                type: 'delete',
                content: `[AdGroup] params: ${JSON.stringify({id: id, action: 'delete'})}`
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
        let params = Object.assign({}, this.search, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getAdGroup(params).then((res) => {
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
  // 表单规则
  let rules = {
    name: [
      {required: true, message: '请输入名称', trigger: 'blur'}
    ]
  };
</script>
