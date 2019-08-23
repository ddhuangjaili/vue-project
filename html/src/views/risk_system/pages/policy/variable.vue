<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="search.variableEl" clearable filterable placeholder="维度">
            <el-option v-for="(item, key) in variableElMap" :label="item.dimDesc" :value="key"
                       :key="'search-variableEl-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.variableIdentify" placeholder="编码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.createDate"
            type="daterange"
            placeholder="创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.variableType" clearable filterable placeholder="类型">
            <el-option v-for="(val, key) in variableTypeMap" :label="val" :value="key"
                       :key="'search-variableType-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <br/>
        <el-form-item>
          <el-select v-model="search.variableStatus" clearable filterable placeholder="审核状态">
            <el-option v-for="(val, key) in variableStatusMap" :label="val" :value="key"
                       :key="'search-variableStatus-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.variableName" placeholder="名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clear">清空</el-button>
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
      stripe
      :max-height="height - 200"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="item">
          <el-form label-position="left" inline class="ele-table-expand" label-width="0px" style="width: 90%">
            <el-form-item>
              <span class="label">名称:</span>
              <span>{{ item.row.variableName }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">类型:</span>
              <span>{{ variableTypeFmt(item.row) }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">编码:</span>
              <span>{{ item.row.variableIdentify }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">维度:</span>
              <span>{{ variableElFmt(item.row) }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">格式:</span>
              <span>{{ valueTypeFmt(item.row) }}</span>
            </el-form-item>
            <el-form-item v-show="item.row.variableType == '3'">
              <span class="label">方法:</span>
              <span>{{ funNameFmt(item.row.funId) }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">审批状态:</span>
              <span>{{ variableStatusFmt(item.row) }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">审批备注:</span>
              <span>{{ item.row.approveRemark }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">编辑人员:</span>
              <span>{{ item.row.updateUser }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">编辑时间:</span>
              <span>{{ dateFmt(item.row.updateDate) }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">审核人员:</span>
              <span>{{ item.row.approveUser }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">审核时间:</span>
              <span>{{ dateFmt(item.row.approveDate) }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">创建人员:</span>
              <span>{{ item.row.createUser }}</span>
            </el-form-item>
            <el-form-item>
              <span class="label">创建时间:</span>
              <span>{{ dateFmt(item.row.createDate) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="variableIdentify"
        label="编码"
        width="250">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="variableEl"
        :formatter="variableElFmt"
        label="维度"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="variableName"
        label="名称"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="valueType"
        :formatter="valueTypeFmt"
        label="格式"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="variableStatus"
        :formatter="variableStatusFmt"
        label="状态"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="variableType"
        :formatter="variableTypeFmt"
        label="类型"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createDate"
        :formatter="createDateFmt"
        label="创建时间"
        min-width="200">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="删除" v-show="optAuth.delete && scope.row.variableStatus !== 1" size="mini"
            @click.native.prevent="deleteItem(scope.row.variableId)">
            <i class="icon-trash-empty"></i>
          </el-button>
          <el-button title="编辑" v-show="optAuth.edit" size="mini" @click.native.prevent="showDialog(2, scope.$index)">
            <i class="icon-edit-square"></i>
          </el-button>
          <el-button title="审核" v-show="optAuth.approve && scope.row.variableStatus === 0" size="mini"
            @click.native.prevent="showApproveDialog(scope.row)"><i class="icon-ok-circled"></i></el-button>
        </template>
      </el-table-column>
      </el-table>
      <el-pagination class="pull-right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="table.pager.page"
        :page-sizes="[20, 50, 100, 500]"
        :page-size="table.pager.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="table.pager.total">
      </el-pagination>

    <!-- 弹窗框 -->
    <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="variableForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名称：" prop="variableName">
              <el-input v-model="dialog.form.variableName" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型：" prop="variableType">
              <el-select v-model="dialog.form.variableType" filterable placeholder="变量类型">
                  <el-option v-for="(val, key) in variableTypeMap" :label="val" :value="key"
                             :key="'form-variableType-'+ key"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="维度：" prop="variableEl">
              <el-select v-model="dialog.form.variableEl" filterable placeholder="维度">
                  <el-option v-for="(item, key) in variableElMap" :label="item.dimDesc" :value="key"
                             :key="'form-variableEl-'+ key"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码：" prop="variableIdentify">
              <el-input v-model="dialog.form.variableIdentify" auto-complete="off">
                <template slot="prepend" v-if="dialog.form.variableEl">
                  {{dialog.form.variableEl ? variableElMap[dialog.form.variableEl].dimPrefix + '_' : ''}}
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="格式：" prop="valueType">
              <el-select v-model="dialog.form.valueType" filterable placeholder="格式">
                  <el-option v-for="(val, key) in valueTypeMap" :label="val" :value="key"
                             :key="'form-valueType-'+ key"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="dialog.form.variableType === '3'" :span="12">
            <el-form-item label="方法：" prop="funId">
              <el-cascader
                clearable
                v-loading="variableCalParams.loading" 
                @change="changeAddFunId" 
                v-model="dialog.form.funId"
                placeholder="计算方式"
                :options="variableCalTree">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" class="select-block">
            <div class="item" v-for="(params, key) in variableCalParams.items" :key="'form-params' + key">
              <span class="label">{{params.paramName}}：</span>
              <el-cascader
                clearable
                :options="variableDimTree"
                v-model="dialog.form.variableRel[key]">
              </el-cascader>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm" type="primary">保 存</el-button>
        <el-button @click="dialog.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

    <!-- 弹窗框 -->
    <el-dialog title="审核" v-model="approve.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="approveForm" :model="approve.form" :rules="approve.rules" label-width="120px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="审批状态：" prop="variableStatus">
                <el-select @change="changeApproveStatus" v-model="approve.form.variableStatus" placeholder="审核状态">
                  <el-option v-for="(val, key) in variableSelectMap" :label="val" :value="key"
                             :key="'approve-variableStatus-'+ key"></el-option>
                </el-select>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="审批备注：" prop="variableRemark" ref="variableRemark">
              <el-input v-model="approve.form.variableRemark" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitApproveForm" type="primary">保 存</el-button>
        <el-button @click="approve.show = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->

  </div>
</template>

<script>
import api from "../../api";
import bsmp  from "bsmp_main";

export default {
  name: "risk_system_policy_variable",
  props: {
    height: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      search: {
        variableEl: "",
        variableIdentify: "",
        variableType: "",
        variableStatus: "",
        variableName: "",
        createDate: null
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
          variableIdentify: '',
          variableName: '',
          variableType: '2',
          valueType: '0',
          variableEl: '',
          funId: null,
          variableRel: {}
        },
        rules: rules
      },
      approve: {
        show: false,
        form: {
          variableIds: null,
          variableStatus: '',
          variableRemark: ''
        },
        rules: {
          variableStatus: [
            { required: true, message: '请选择审批状态', trigger: 'change' }]
        }
      },
      variableCalTree: null,
      variableCalMap: {},
      variableCalParams: {
        loading: false,
        items: null
      },
      variableDimTree: null,
      variableDimMap: {},
      variableElMap: {},
      variableTypeMap: {
        "2": "基础变量",
        "3": "衍生变量"
      },
      valueTypeMap: {
        '0': '布尔值（真/假)',
        '1': '字符',
        '2': '日期',
        '3': '货币',
        '4': '整数',
        '5': 'IP地址',
        '6': '设备ID（MAC/IMEI）',
        '7': '浮点小数2位',
        '8': '银行卡',
        '9': '性别',
        '10': '网络类型',
        '11': '支付方式',
        '12': '渠道类型',
        '13': '邮箱',
        '14': '地理位置',
        '15': '姓名',
        '16': 'QQ号',
        '17': '微信号',
        '18': '家庭/公司地址',
        '19': '手机号码',
        '20': '家庭电话',
        '21': '网址URL',
        '22': '文件'
      },
      variableStatusMap: {
        '0': '待审批',
        '1': '审批通过',
        '2': '审批失败'
      },
      variableSelectMap: {
        '1': '审批通过',
        '2': '审批失败'
      }
    };
  },
  mounted() {
    this.getVariableDimList();
    this.getVariableDimTree();
    this.getVariableCalList().then((res) => {
      this.query();
    });
  },
  computed: {
    optAuth() {
      return bsmp.util.mapAuth({
        search: "risk_system_policy_variable_list",
        add: "risk_system_policy_variable_add",
        edit: "risk_system_policy_variable_edit",
        delete: "risk_system_policy_variable_delete",
        approve: "risk_system_policy_variable_approve"
      });
    },
  },
  methods: {
    variableElFmt(row) {
      return typeof row.variableEl !== 'undefined' && this.variableElMap[row.variableEl] ? this.variableElMap[row.variableEl].dimDesc : "";
    },
    variableTypeFmt(row) {
      return typeof row.variableType !== 'undefined' ? this.variableTypeMap[row.variableType] : "";
    },
    valueTypeFmt(row) {
      return typeof row.valueType !== 'undefined' ? this.valueTypeMap[row.valueType] : "";
    },
    variableStatusFmt(row) {
      return typeof row.variableStatus !== 'undefined' ? this.variableStatusMap[row.variableStatus] : "";
    },
    createDateFmt(row) {
      return typeof row.createDate !== 'undefined' ? this.dateFmt(row.createDate) : "";
    },
    dateFmt(date) {
      if (date) {
        return date.replace('.0', '');
      }
      return '';
    },
    funNameFmt(funId) {
      let funName = '';
      if (funId && this.variableCalMap[funId]) {
        funName = this.variableCalMap[funId].label;
      }
      return funName;
    },
    showDialog(type, index) {
      if (this.$refs['variableForm'] && this.$refs['variableForm'].resetFields) {
        this.$refs['variableForm'].resetFields();
      }

      this.dialog.title = type === 1 ? '新增' : '编辑';
      this.dialog.type = type;

      // 编辑
      if (this.dialog.type === 2 && index > -1) {
        this.dialog.index = index;
        let form = Object.assign({}, this.table.items[index]);
        form.variableType = form.variableType + '';
        form.valueType = form.valueType + '';
        form.variableEl = form.variableEl + '';

        if (form.variableEl) {
          form.variableIdentify = form.variableIdentify.replace(this.variableElMap[form.variableEl].dimPrefix + '_', '');
        }

        if (form.funId) {
          form.funId = [this.variableCalMap[form.funId].super, form.funId];
        }

        this.dialog.form = form;
      } else {
        this.dialog.index = -1;
        this.dialog.form = {
          variableIdentify: '',
          variableName: '',
          variableType: '2',
          valueType: '0',
          variableEl: '',
          funId: [],
          variableRel: {}
        };
      }

      this.changeAddFunId();
      this.dialog.show = true;
    },
    submitForm() {
      this.$refs["variableForm"].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.dialog.form);
          params.variableIdentify = this.variableElMap[params.variableEl].dimPrefix + '_' + params.variableIdentify;

          let rels = [];
          for (let key in params.variableRel) {
            if (params.variableRel[key].length) {
              rels.push(key + ',' + params.variableRel[key][1]);
            }
          }
          if (rels.length) {
            params.variableRel = rels.join('|');
          }

          if (params.funId && params.funId.length) {
            params.funId = params.funId[1];
          }

          if (this.dialog.type === 1) {
            // 新增
            api.saveVariable(params).then(res => {
              let data = res.data;
              if (data && data.code === "0") {
                this.$message({
                  type: "success",
                  message: "新增成功!"
                });

                this.dialog.show = false;
                this.query();

                // 记录日志
                bsmp.log({
                  component: "risk_system",
                  type: "add",
                  content: `[Variable] params: ${JSON.stringify(params)}`
                });
              }
            });
          } else {
            // 编辑
            api.editVariable(params).then((res) => {
              let data = res.data;
              if (data && data.code === '0') {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                });

                this.dialog.show = false;
                this.query();

                // 记录日志
                bsmp.log({
                  component: 'risk_system',
                  type: 'modify',
                  content: `[Variable] params: ${JSON.stringify(params)}`
                });
              }
            });
          }
          
        } else {
          return false;
        }
      });
    },
    deleteItem(id) {
      this.$confirm("确定要删除该条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 删除
        api.removeVariable({ variableIds: id }).then(res => {
          let data = res.data;
          if (data && data.code === "0") {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.query();

            // 记录日志
            bsmp.log({
              component: "risk_system",
              type: "delete",
              content: `[Variable] params: ${JSON.stringify({
                variableIds: id
              })}`
            });
          }
        });
      }).catch(e => { });
    },
    showApproveDialog(row) {
      if (this.$refs['approveForm'] && this.$refs['approveForm'].resetFields) {
        this.$refs['approveForm'].resetFields();
      }

      this.approve.form = {
        variableIds: row.variableId,
        variableStatus: '',
        variableRemark: ''
      };
      this.approve.show = true;
    },
    changeApproveStatus() {
      if (this.approve.form.variableStatus === '2') {
        this.approve.rules = {
          variableStatus: [
            { required: true, message: '请选择审批状态', trigger: 'change' }],
          variableRemark: [
            { required: true, message: '请输入审批备注', trigger: 'blur' }]
          
        }
      } else {
        this.approve.rules = {
          variableStatus: [
            { required: true, message: '请选择审批状态', trigger: 'change' }]
          
        }
      }
      this.$refs["variableRemark"].resetField();
    },
    submitApproveForm() {
      this.$refs["approveForm"].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.approve.form);
          api.approveVariable(params).then(res => {
            let data = res.data;
            if (data && data.code === "0") {
              this.$message({
                type: "success",
                message: "审核成功!"
              });
              this.approve.show = false;
              this.query();

              // 记录日志
              bsmp.log({
                component: "risk_system",
                type: "approve",
                content: `[Variable] params: ${JSON.stringify(params)}`
              });
            }
          });
        }
      });
    },
    changeAddFunId() {
      this.dialog.form.variableRel = {};
      if (!this.dialog.form.funId || !this.dialog.form.funId.length) {
        this.variableCalParams.items = null;
        return;
      }

      let promise = this.getVariableCalParams(this.dialog.form.funId[1])
      if (promise) {
        promise.then((res) => {
          let relMap = {};
          for (let key in this.variableCalParams.items) {
            relMap[key] = [];
          }

          if (this.dialog.type === 2 && this.dialog.index > -1 
            && typeof this.table.items[this.dialog.index].variableRel === 'string') {
            let rels = this.table.items[this.dialog.index].variableRel.split('|');
            rels.forEach(rel => {
              let ids = rel.split(',');
              if (ids.length > 1) {
                relMap[ids[0]] = [this.variableDimMap[ids[1]].super, parseInt(ids[1], 10)];
              }
            });
          }

          this.dialog.form.variableRel = Object.assign({}, relMap);
        });
      }
    },
    query() {
      this.loading = true;
      let params = bsmp.util.deleteBlank(this.search);
      params = Object.assign({}, params, this.table.pager);

      if (params.createDate && params.createDate.length && params.createDate[0] && params.createDate[1]) {
        params.createDateStart = bsmp.util.formatDate.format(params.createDate[0], "yyyy-MM-dd hh:mm:ss");
        params.createDateEnd = bsmp.util.formatDate.format(params.createDate[1], "yyyy-MM-dd") + " 23:59:59";
      }
      delete params.createDate;

      this.loading = true;
      api.getVariableList(params).then(res => {
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
    },

    clear() {
      this.search = {
        variableEl: "",
        variableIdentify: "",
        variableType: "",
        variableStatus: "",
        variableName: "",
        createDate: null
      };
    },

    getVariableCalList() {
      return api.getVariableCalList({funType: 0}).then(res => {
        let data = res.data;
        if (data && data.code === "0") {
          if (data.data) {
            this.variableCalTree = [];
            let node = null;

            data.data.forEach(item => {
              node = {
                value: item.classId,
                label: item.classDesc,
                children: []
              };

              if (item.list && item.list.length) {
                item.list.forEach(i => {
                  node.children.push({
                    value: i.funId,
                    label: i.funName,
                  });

                  // map 方便查找编辑显示
                  this.variableCalMap[i.funId] = {
                    value: i.funId,
                    label: i.funName,
                    super: item.classId
                  };
                });
              }

              this.variableCalTree.push(node);
            });
          }
        }
      });
    },
    getVariableCalParams(funId) {
      if (funId) {
        this.variableCalParams.loading = true;
        return api.getVariableCalParams({funId: funId}).then(res => {
          this.variableCalParams.loading = false;
          let data = res.data;
          if (data && data.code === "0") {
            this.variableCalParams.items = {};
            data.data.forEach(item => {
              this.variableCalParams.items[item.id] = item;
            });
          }
        });
      } else {
        this.variableCalParams.items = null;
      }
    },
    getVariableDimList() {
      return api.getVariableDimList().then(res => {
        let data = res.data;
        if (data && data.code === "0" && data.data && data.data.length) {
          let map = {};
          data.data.forEach(item => {
            map[item.dimId] = item;
          });
          this.variableElMap = Object.assign({}, map);
        }
      });
    },
    getVariableDimTree() {
      return api.getVariableDimTree({needDerivative: 0}).then(res => {
        let data = res.data;
        if (data && data.code === "0") {
          if (data.data) {
            this.variableDimTree = [];
            let node = null;
            data.data.forEach(item => {
              node = {
                value: item.value,
                label: item.desc,
                children: []
              };
              if (item.varList && item.varList.length) {
                item.varList.forEach(i => {
                  node.children.push({
                    value: i.variableId,
                    label: i.variableName,
                  });

                  // map 方便查找编辑显示
                  this.variableDimMap[i.variableId] = {
                    value: i.variableId,
                    label: i.variableName,
                    super: item.value
                  };
                });
              }

              this.variableDimTree.push(node);
            });
          }
        }
      });
    },
  }
  
};

// 表单规则
let rules = {
  variableName: [
    { required: true, message: "请输入名称", trigger: "blur" }
  ],
  variableEl: [
    {required: true, message: '请选择维度', trigger: 'blur,change'}
  ],
  variableIdentify: [
    { required: true, message: "请输入编码", trigger: "blur" },
    { pattern: /^[0-9a-zA-Z_]{1,}$/, message: "只允许输入字母数字下划线"}
  ],
  valueType: [
    {required: true, message: '请选择格式', trigger: 'blur,change'}
  ],
};
</script>
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

  .select-block {
    border-radius: 5px;
    background-color: #f3f3f3;
    margin: 0 0 10px 20px;
    .item {
      float: left;
      width: 350px;
      padding: 10px;
      .label {
        display: inline-block;
        width: 80px;
        text-align: right;
      }
    }
  }
</style>
