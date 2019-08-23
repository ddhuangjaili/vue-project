<template>
  <div>
    <query-panel @switchQuery="switchQuery">
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item prop="companyId">
          <el-select v-model="search.companyId" filterable placeholder="公司">
            <el-option v-for="(c, key) in companies" :label="c.name" :value="c.companyId"
                       :key="'search-companyId-'+ c.companyId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="search.type" filterable placeholder="级别">
            <el-option v-for="(val, key) in searchTypeMap" :label="val" :value="key"
                       :key="'search-type-'+ key"></el-option>
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
      :height="tableHeight"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        prop="companyId"
        label="公司"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        prop="appId"
        label="appId"
        width="200" sortable>
      </el-table-column>
      <el-table-column
        prop="appScret"
        label="appScret"
        width="200" sortable>
      </el-table-column>
      <el-table-column
        prop="expires"
        label="过期时间（秒）"
        width="150">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        :formatter="status"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createDate"
        label="创建时间"
        :formatter="dateFmt">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="服务URI授权" v-show="optAuth.edit" @click.native.prevent="showAppUriDialog(scope.row)"
                     size="mini"><i class="icon-key"></i>
          </el-button>
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
                   :current-page="table.pager.pageNo"
                   :page-sizes="[20, 50, 100, 200]"
                   :page-size="table.pager.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="table.pager.total">
    </el-pagination>

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="scretForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="appId：" prop="appId">
              <el-input v-model="dialog.form.appId" auto-complete="off" :disabled="dialog.type === 2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="appScret：" prop="appScret">
              <el-input v-model="dialog.form.appScret" auto-complete="off" :disabled="dialog.type === 2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司：" prop="companyId">
              <el-select v-model="dialog.form.companyId" filterable placeholder="公司">
                <el-option v-for="(c, key) in companies" :label="c.name" :value="c.companyId"
                           :key="'form-type-'+ c.companyId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过期时间(秒)：" prop="expires">
              <el-input-number v-model="dialog.form.expires" :min="-1"></el-input-number>
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
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog title="配置服务URI" v-model="appUri.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="appUriForm" label-width="50px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="类型：" prop="type">
              <el-select @change="transferMap" v-model="appUri.type" filterable placeholder="类型">
                <el-option v-for="(val, key) in typeMap" :label="val" :value="key"
                           :key="'appUri-type-'+ key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-transfer
              :titles="['未选URI', '已选URI']"
              v-model="appUri.value"
              :data="appUri.data"
              filterable
              :filter-method="filterMethod"
               @change="transferChange">
            </el-transfer>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAppUri">确 定</el-button>
        <el-button @click="appUri.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import api from '../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'app_scret',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        userInfo: null,
        loading: false,
        queryOpen: true,
        search: {
          type: '0',
          companyId: ''
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
            companyId: null,
            appId: '',
            appScret: '',
            expires: 0,
            remark: ''
          },
          rules: rules
        },
        appUriLoaded: false,
        appUri: {
          form: null,
          show: false,
          type: '1',
          value: [],
          data: []
        },
        appUriMap: {},
        selectUriMap: {},
        statusMap: {
          0: '启动',
          1: '停用'
        },
        typeMap: {},
        searchTypeMap: {
          '0': '应用级别',
          '1': '用户级别'
        }
      };
    },
    mounted () {
      this.userInfo = bsmp.util.getUserInfo();
      if (this.userInfo.loginName) {
        this.getDictByPid('system_flag').then(() => {
          this.search.companyId = this.getCompanyId();
          this.query();
        });
      }
    },
    computed: {
      ...mapGetters(['companies']),
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'service_scret_appScret_view',
          add: 'service_scret_appScret_add',
          edit: 'service_scret_appScret_edit',
          del: 'service_scret_appScret_delete',
          getUri: 'service_scret_uriMng_getUri'
        });
      },
      company() {
        return bsmp.util.getCompany();
      },
      loginUser() {
        return bsmp.util.getUserInfo();
      },
      tableHeight() {
        return this.queryOpen ? this.height - 165 : this.height - 116;
      }
    },
    watch: {
      'company': function (company) {
        if (this.userInfo.companyId && this.userInfo.companyId === 'ALL' && company) {
          this.getDictByPid('system_flag').then(() => {
            this.search.companyId = this.getCompanyId();
            this.query();
          });
        }
      },
      'loginUser': function (loginUser) {
        if (loginUser && loginUser.loginName) {
          this.userInfo = bsmp.util.getUserInfo();
          this.getDictByPid('system_flag').then(() => {
            this.search.companyId = this.getCompanyId();
            this.query();
          });
        }
      }
    },
    methods: {
      filterMethod(query, item) {
        return item.key.indexOf(query) > -1;
      },
      switchQuery(open) {
        this.queryOpen = open;
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
        if (!companyId && this.companies && this.companies.length) {
          companyId = this.companies[0].companyId;
        }
        return companyId;
      },
      transferMap () {
        if (!this.appUriMap[this.appUri.type]) {
          this.getServiceURIs();
        } else {

          // 处理选中的Url，不在Url列表中存在
          let typeUrls = [].concat(this.appUriMap[this.appUri.type] || []),
            selectUris = [].concat(this.selectUriMap[this.appUri.type] || []);

//          console.log('typeUrls:', typeUrls);
//          console.log('selectUris:', selectUris);

          if (selectUris && selectUris.length) {
            let index = -1;
            selectUris.forEach((val) => {
              index = -1;
              if (typeUrls && typeUrls.length) {
                typeUrls.forEach((item, i) => {
                  if (item.key === val) {
                    index = i;
                  }
                });
              }

              if (index < 0 && val) {
                typeUrls.push({
                  key: val,
                  label: val
                });
                console.log('plus:', val);
              } else {
//                console.log(val);
              }
            });
          }

          this.appUri.data = typeUrls;
          this.appUri.value = selectUris;
        }
      },
      transferChange () {
        this.selectUriMap[this.appUri.type] = this.appUri.value;
      },
      showAppUriDialog (row) {
        this.appUri.show = true;
        this.appUri.form = row;

        this.selectUriMap = {};
        let item, type;
        if (this.appUri.form.appUri && this.appUri.form.appUri.length) {
          for (let i = 0, len = this.appUri.form.appUri.length; i < len; i++) {
            item = this.appUri.form.appUri[i];
            type = item.type;
            this.selectUriMap[type] = item.uris;
          }
        }

        this.appUri.type = '1';
        if (!this.appUriMap[this.appUri.type] && this.optAuth.getUri) {
          this.getServiceURIs();
        } else {
          this.transferMap();
        }
      },
      submitAppUri () {
        let appUri = [];
        for (let key in this.selectUriMap) {
          appUri.push({type: key, uris: this.selectUriMap[key]});
        }

        // 修改
        let params = {
          id: this.appUri.form.id,
          appUri: appUri,
          expires: this.appUri.form.expires,
          remark: this.appUri.form.remark
        };
        api.editAppScret(params).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.$message({
              type: 'success',
              message: '服务Uri授权成功!'
            });
            this.appUri.show = false;
            this.query();

            // 记录日志
            bsmp.log({
              component: 'service_scret',
              type: 'modify',
              content: `[AppScret] params: ${JSON.stringify(params)}`
            });
          }
        });
      },
      /**
       * 格式化有效性
       * @param row
       * @returns {string}
       */
      status (row) {
        return this.statusMap[row.status];
      },
      /**
       * 日期格式化
       * */
      dateFmt (row) {
        if (row.createDate) {
          return bsmp.util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd hh:mm:ss');
        }
        return '';
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
      getServiceURIs () {
        api.getServiceURIByType({type: this.appUri.type}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            let items = data.data;
            this.appUriMap[this.appUri.type] = [];
            for (let i = 0, len = items.length; i < len; i++) {
              this.appUriMap[this.appUri.type].push({
                key: items[i],
                label: items[i]
              });
            }
            this.transferMap();
          }
        });
      },
      /**
       * 显示弹窗
       * */
      showDialog (type, index) {
        if (this.$refs['scretForm'] && this.$refs['scretForm'].resetFields) {
          this.$refs['scretForm'].resetFields();
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
            companyId: null,
            appId: '',
            appScret: '',
            expires: 0,
            remark: ''
          };
        }

        this.dialog.show = true;
      },
      submitForm () {
        this.$refs['scretForm'].validate((valid) => {
          if (valid) {
            if (this.dialog.type === 1) {
              // 新增
              api.addAppScret(this.dialog.form).then((res) => {
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
                    content: `[AppScret] params: ${JSON.stringify(this.dialog.form)}`
                  });
                }
              });
            } else {
              // 修改
              let params = {
                id: this.dialog.form.id,
                expires: this.dialog.form.expires,
                appUri: this.dialog.form.appUri,
                remark: this.dialog.form.remark
              };
              api.editAppScret(params).then((res) => {
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
                    content: `[AppScret] params: ${JSON.stringify(this.dialog.form)}`
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
          api.removeAppScret(id).then((res) => {
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
                content: `[AppScret] params: ${JSON.stringify({id: id})}`
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
       * 查询
       */
      query () {
        if (!this.search.companyId) {
          return;
        }
        this.loading = true;
        let params = Object.assign({}, this.search, this.table.pager, {pageNo: this.table.pager.pageNo - 1});
        api.getAppScretList(params).then((res) => {
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
    appId: [
      {required: true, message: '请输入appId', trigger: 'blur'}
    ],
    appScret: [
      {required: true, message: '请输入appScret', trigger: 'blur'}
    ],
    expires: [
      {type: 'number', message: '过期时间必须为整数', trigger: 'blur'}
    ],
    companyId: [
      {required: true, message: '请选择公司', trigger: 'change'}
    ]
  };
</script>
