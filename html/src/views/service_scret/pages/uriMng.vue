<template>
  <div>
    <query-panel @switchQuery="switchQuery">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item prop="type">
          <el-select clearable v-model="search.type" filterable placeholder="类型">
            <el-option v-for="(val, key) in typeMap" :label="val" :value="key"
                       :key="'search-type-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
          <el-button v-show="optAuth.search" @click="query()" title="刷新" type="primary">
            <i class="icon-arrows-cw"></i>&nbsp;&nbsp;刷新
          </el-button>
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
      :height="tableHeight"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        :formatter="typeFmt"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        prop="uri"
        label="地址"
        width="400" sortable>
      </el-table-column>
      <el-table-column
        prop="alias"
        label="别名"
        width="200" sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="编辑" v-show="optAuth.edit" type="info" icon='edit' size="mini"
                     @click.native.prevent="showDialog(2, scope.$index)"></el-button>
          <el-button title="删除" v-show="optAuth.del" type="danger" icon='delete' size="mini"
                     @click.native.prevent="deleteItem(scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pull-right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="table.pager.page"
                   :page-sizes="[50, 100, 200, 500]"
                   :page-size="table.pager.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="table.pager.total">
    </el-pagination>

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="uriForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="地址：" prop="uri">
              <el-input v-model="dialog.form.uri" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="别名：" prop="alias">
              <el-input v-model="dialog.form.alias" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="类型：" prop="type">
              <el-select v-model="dialog.form.type" filterable placeholder="类型">
                <el-option v-for="(val, key) in typeMap" :label="val" :value="key"
                           :key="'form-type-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea" :rows="3" v-model="dialog.form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'uri_mng',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        queryOpen: true,
        search: {
          type: ''
        },
        table: {
          items: [],
          pager: {
            pageSize: 50,
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
            uri: '',
            alias: '',
            type: '',
            remark: ''
          },
          rules: rules
        },
        typeMap: {}
      };
    },
    mounted () {
      this.getDictByPid('system_flag').then(() => {
        this.query();
      });
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'service_scret_uriMng_view',
          add: 'service_scret_uriMng_add',
          edit: 'service_scret_uriMng_edit',
          del: 'service_scret_uriMng_delete'
        });
      },
      tableHeight() {
        return this.queryOpen ? this.height - 165 : this.height - 116;
      }
    },
    methods: {
      switchQuery(open) {
        this.queryOpen = open;
      },
      /**
       * 格式化有效性
       * @param row
       * @returns {string}
       */
      typeFmt (row) {
        return typeof row.type !== 'undefined' ? this.typeMap[row.type] : '';
      },
      getDictByPid (code) {
        return bsmp.util.getDictByCode(code).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.systemFlags = data.data;
            if (this.systemFlags) {
              this.systemFlags.forEach((item) => {
                this.typeMap[item.value] = item.name;
              });
            }
          }
        });
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['uriForm'] && this.$refs['uriForm'].resetFields) {
          this.$refs['uriForm'].resetFields();
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
            uri: '',
            alias: '',
            type: '',
            remark: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['uriForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              // 新增
              api.addServiceURI(this.dialog.form).then((res) => {
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
                    component: 'service_scret',
                    type: 'add',
                    content: `[UriMng] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            } else {
              // 修改
              let params = {
                id: this.dialog.form.id,
                uri: this.dialog.form.uri,
                alias: this.dialog.form.alias,
                type: this.dialog.form.type,
                remark: this.dialog.form.remark
              };
              api.editServiceURI(params).then((res) => {
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
                    component: 'service_scret',
                    type: 'modify',
                    content: `[UriMng] params: ${JSON.stringify(params)}`
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
          api.removeServiceURI(id).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'service_scret',
                type: 'delete',
                content: `[UriMng] params: ${JSON.stringify({id: id})}`
              });
            }
          });
        }).catch(e => {});
      },
      /**
       * 取消弹窗
       * */
      cancelForm () {
        this.dialog.show = false;
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = Object.assign({}, this.search, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getServiceURIList(params).then((res) => {
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

  // 表单规则
  let rules = {
    uri: [
      {required: true, message: '请输入地址', trigger: 'blur'}
    ],
    alias: [
      {required: true, message: '请输入别名', trigger: 'blur'}
    ],
    type: [
      {required: true, message: '请输入类型', trigger: 'blur'}
    ]
  };
</script>
