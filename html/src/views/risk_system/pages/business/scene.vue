<template>
    <div>
        <query-panel>
            <el-form :inline="true" :model="search" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="search.sceneName" placeholder="业务场景名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker clearable v-model="search.createDate" type="daterange" placeholder="创建时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button v-show="optAuth.scene_search " type="primary" @click="query">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="clear">清空</el-button>
                </el-form-item>
            </el-form>
        </query-panel>
        <el-row class="toolbar">
            <el-button v-show="optAuth.scene_add" @click="showDialog(1)" type="primary" style="margin: 5px 10px">新增</el-button>
        </el-row>
       <el-table highlight-current-row v-loading.body="loading" :data="table.items" border stripe :max-height="height - 200" style="width: 100%">
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="sceneName" label="业务名称" width="200">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="sceneCode" label="业务场景编码" width="120">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="ruleSceneCode" label="业务规则场景" width="120">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="sceneProcess" :formatter="sceneProcessFmt" label="业务流程" min-width="120">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="createDate" label="创建时间" width="200">
            </el-table-column>
            <el-table-column fixed="right" width="200" label="操作">
                <template slot-scope="scope">
                    <el-button title="删除" v-show="optAuth.scene_delete" size="mini" @click.native.prevent="deleteSceneItem(scope.row.sceneId)">
                        <i class="icon-trash-empty"></i>
                    </el-button>
                    <el-button title="编辑" v-show="optAuth.scene_edit" size="mini" @click.native.prevent="showEditDialog(scope.$index, 1)">
                        <i class="icon-edit-square"></i>
                    </el-button>
                    <el-button title="查看详情" @click="showEditDialog(scope.$index, 2)" size="mini"><i class="icon-eye"></i></el-button>
                    <!-- <el-button title="审核" v-show="optAuth.approve && scope.row.ruleStatus === 0 " size="mini" @click.native.prevent="showApproveDialog(scope.row)"><i class="icon-ok-circled"></i></el-button> -->
                    </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pull-right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="table.pager.page"
          :page-sizes="[50, 100, 200, 500, 1000]"
          :page-size="table.pager.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="table.pager.total">
        </el-pagination>

        <!-- 新增弹窗框 -->
        <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false" >
            <el-form ref="sceneForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="业务名称：" prop="sceneName">
                            <el-input v-model="dialog.form.sceneName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="业务场景编码：" prop="sceneCode">
                            <el-input v-model="dialog.form.sceneCode" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="业务规则场景：" prop="ruleSceneCode">
                            <el-input v-model="dialog.form.ruleSceneCode" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="业务流程：" prop="sceneProcess">
                            <el-select v-model="dialog.form.sceneProcess" filterable placeholder="业务流程" :style="{'width': '400px'}">
                                <el-option v-for="(val, key) in processMap" :label="val" :value="key" :key="'form-process-'+ key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-show="dialog.form.sceneProcess == 1">
                    <el-col :span="18">
                        <el-form-item label="API回调接口：" prop="apiUrl" >
                            <el-input v-model="dialog.form.apiUrl" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitForm" type="primary">保 存</el-button>
                <el-button @click="dialog.show = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 编辑弹框 -->
        <el-dialog :title="edit.title" v-model="edit.show" :close-on-press-escape="false" :close-on-click-modal="false" >
            <el-form ref="editForm" :model="edit.form" :rules="edit.rules" label-width="120px" class="dialog-form">
                <el-tabs v-model="edit.tab" type="card">
                <el-tab-pane label="业务信息" name="info">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="业务名称：" prop="sceneName">
                                <el-input v-model="edit.form.sceneName" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="业务场景编码：" prop="sceneCode">
                                <el-input v-model="edit.form.sceneCode" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="业务规则场景：" prop="ruleSceneCode">
                                <el-input v-model="edit.form.ruleSceneCode" auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="业务流程：" prop="sceneProcess">
                                <el-select v-model="edit.form.sceneProcess" filterable placeholder="业务流程" :style="{'width': '400px'}">
                                    <el-option v-for="(val, key) in processMap" :label="val" :value="key" :key="'form-process-'+ key"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" v-show="edit.form.sceneProcess==1">
                        <el-col :span="18">
                            <el-form-item label="API回调接口：" prop="apiUrl">
                                <el-input v-model="edit.form.apiUrl"  auto-complete="off"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="参数映射" name="params" >
                    <div :style="{'float':'right','margin-bottom':'10px'}" v-show="edit.type === 1 && optAuth.param_search">
                        <el-button @click="showParamDialog" type="primary" >新增</el-button>
                    </div>   
                   
                    <el-table highlight-current-row  v-loading="paramsLoading" :data="edit.form.params" border stripe :max-height="height - 200" style="width: 100%">
                        <el-table-column type="index" label="序号" width="80"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="paramCode" label="字段编码" width="110">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="paramName" label="字段名称" width="110">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="paramFormat" :formatter="paramTypeFmt" label="格式" width="80">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="isNecessary" :formatter="paramNecessaryFmt" label="是否必传" width="110">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="fileParamId" :formatter="fileParamCsFmt" label="对应参数" width="110">
                        </el-table-column>
                        <el-table-column fixed="right" width="140" label="操作">
                        <template slot-scope="scope">
                            <el-button title="删除"  size="mini" @click.native.prevent="deleteParamItem(scope.row.paramId)">
                                <i class="icon-trash-empty"></i>
                            </el-button>
                            <el-button title="编辑" size="mini" @click.native.prevent="showEditParamDialog(scope.$index, 1)">
                                <i class="icon-edit-square"></i>
                            </el-button>
                            <el-button title="查看详情" @click="showEditParamDialog(scope.$index, 2)" size="mini"><i class="icon-eye"></i></el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                </el-tabs>
            </el-form>
            <div slot="footer" class="dialog-footer" v-show="edit.type === 1">
                <el-button @click="submitEditForm" type="primary">保 存</el-button>
                <el-button @click="edit.show = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 新增参数映射弹框 -->
        <el-dialog :title="paramDialog.title" v-model="paramDialog.show" :close-on-press-escape="false" :close-on-click-modal="false" >
            <el-form ref="paramDialogForm" :model="paramDialog.form" :rules="edit.rules" label-width="120px" class="dialog-form">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="字段编码：" prop="paramCode">
                            <el-input v-model="paramDialog.form.paramCode" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="字段名称：" prop="paramName">
                            <el-input v-model="paramDialog.form.paramName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="格式：" prop="paramFormat">
                            <!-- <el-input v-model="paramDialog.form.paramFormat" auto-complete="off"></el-input> -->
                            <el-select v-model="paramDialog.form.paramFormat" filterable>
                                    <el-option v-for="(val, key) in paramTypeMap" :label="val" :value="key" :key="'form-paramType-'+ key"></el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否必传：" prop="isNecessary">
                            <!-- <el-input v-model="paramDialog.form.isNecessary" auto-complete="off"></el-input> -->
                            <el-select v-model="paramDialog.form.isNecessary" filterable>
                                    <el-option v-for="(val, key) in necessaryMap" :label="val" :value="key" :key="'form-necessary-'+ key"></el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>                  
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="对应参数：" >
                            <el-select v-model="paramDialog.fileId" placeholder="请选择" @change="getFileParamList(paramDialog.fileId)">
                                <!-- 将文件对应参数进行映射 --> 
                                <el-option  v-for="item in accountFile.files" :key="'fileId-'+ item.fileId" :label="item.fileName" :value="item.fileId">
                                </el-option>
                            </el-select>

                            <el-select v-model="paramDialog.paramId" placeholder="请选择" v-show="paramDialog.fileId" >
                                <!-- 将文件对应参数进行映射 --> 
                                <el-option  v-for="item in accountFile.params" :key="'paramId-'+ item.paramId" :label="item.paramNameCs" :value="item.paramId"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row> 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitParamForm" type="primary">保 存</el-button>
                <el-button @click="paramDialog.show = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 编辑参数映射弹框 -->
        <el-dialog :title="editParam.title" v-model="editParam.show" :close-on-press-escape="false" :close-on-click-modal="false" >
            <el-form ref="editParamForm" :model="editParam.form" :rules="edit.rules" label-width="120px" class="dialog-form">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="字段编码：" prop="paramCode">
                            <el-input v-model="editParam.form.paramCode" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="字段名称：" prop="paramName">
                            <el-input v-model="editParam.form.paramName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="格式：" prop="paramFormat">
                           <el-select v-model="editParam.form.paramFormat" filterable>
                                    <el-option v-for="(val, key) in paramTypeMap" :label="val" :value="key" :key="'form-paramType-'+ key"></el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否必传：" prop="isNecessary">
                            <!-- <el-input v-model="editParam.form.isNecessary" auto-complete="off"></el-input> -->
                            <el-select v-model="editParam.form.isNecessary" filterable>
                                    <el-option v-for="(val, key) in necessaryMap" :label="val" :value="key" :key="'form-necessary-'+ key"></el-option>
                                </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>                  
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="对应参数：" >
                            <el-select v-model="editParam.fileId" placeholder="请选择"  @change="getFileParamList(editParam.fileId)">
                                <el-option  v-for="item in accountFile.files" :key="'fileId-'+ item.fileId" :label="item.fileName" :value="item.fileId">
                                </el-option>
                            </el-select>
                            <el-select v-model="editParam.paramId" placeholder="请选择" >
                                <el-option  v-for="item in accountFile.params" :key="'paramId-'+ item.paramId" :label="item.paramNameCs" :value="item.paramId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row> 
            </el-form>
            <div slot="footer" class="dialog-footer" v-show="editParam.type === 1">
                <el-button @click="submitEditParamForm" type="primary">保 存</el-button>
                <el-button @click="editParam.show = false">取 消</el-button>
            </div>
        </el-dialog>
        
    </div>
</template>
<script>
import api from "../../api";
import bsmp  from "bsmp_main";

export default {
  name: "risk_system_policy_rule_group",
  props: {
    height: {
      type: Number
    }
  },
  data() {
    return {
            userInfo: null,
            loading: false,
            paramsLoading: false,
            search: {
                sceneName: "",
                createDate: null
            },
            queryTimer: null,
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
                index: -1, // 数据下标
                title: "新增",
                form: {
                    sceneName: null,
                    sceneCode: "",
                    ruleSceneCode: "",
                    sceneProcess: "0",
                    apiUrl: "",
                    
                },
                rules: rules
            },
            edit: {
                show: false,
                type: 1, // 1: 编辑，2：详情
                index: -1, // 数据下标
                title: "编辑",
                tab: 'info',
                form: {
                    sceneName: null,
                    sceneCode: "",
                    ruleSceneCode: "",
                    sceneProcess: "0",
                    apiUrl: "",
                    params: []
                },
                rules: rules
            },
            paramDialog: {
                show: false,
                index: -1, // 数据下标
                title: "新增",
                tab: 'info',
                fileId: "",
                paramId: "",
                form: {
                    paramId: '',
                    paramCode: null,
                    paramName: "",
                    paramFormat: "",
                    isNecessary: "",
                    fileParamId: ""
                },
                rules: "",
            },
            editParam: {
                show: false,
                type: 1, // 1: 编辑，2：详情
                index: -1, // 数据下标
                title: "编辑",
                tab: 'info',
                fileId: "",
                paramId: "",
                form: {
                    paramId: -1,
                    paramCode: null,
                    paramName: "",
                    paramFormat: "",
                    isNecessary: "",
                    fileParamId: ""
                },
                rules: "",
            },
            accountFile: {
                files: [],
                params:[],
                allParams:[]
            },
            processMap: {
                0:"先到达业务进件（业务发起，入待审核界面）",
                1:"直接调用规则（业务发起，规则校验，自动接口回写）",
                2:"RPA静默触发（业务发起，规则校验，规则引擎自动触发RPA进回写）"
            },
            necessaryMap: {
                0:"非必传",
                1:"必传"
            },
            paramTypeMap: {
                0:"整数型",
                1:"浮点型",
                2:"字符串",
                3: "文件"
            },
        };
    
  },
  mounted() {
    this.userInfo = bsmp.util.getUserInfo();
    this.getAccountFileList();
    this.getAllFileParamList();
    this.query();
  },
  computed: {
    optAuth() {
      return bsmp.util.mapAuth({
        scene_search: "business_scene_list",
        scene_add: "business_scene_add",
        scene_edit: "business_scene_edit",
        scene_delete: "business_scene_delete",
        param_search: "business_scene_param_list",
        param_add: "business_scene_param_add",
        param_edit: "business_scene_param_edit",
        param_delete: "business_scene_param_delete"
        
      });
    },
  },
  methods: {
        fileParamCsFmt(row) {
            if(typeof row.fileParamId !== 'undefined'){
                let name = "";
                this.accountFile.allParams.forEach(item=>{
                    if(item.paramId == row.fileParamId){
                        name = item.paramNameCs;
                    }
                });
                return name;
            } else{
                return "";
            }
        },
        paramTypeFmt(row) {
            return typeof row.paramFormat !== 'undefined' ? this.paramTypeMap[parseInt(row.paramFormat)] : "";
        },
        paramNecessaryFmt(row) {
            return typeof row.isNecessary !== 'undefined' ? this.necessaryMap[row.isNecessary] : "";
        },
        sceneProcessFmt(row) {
            return typeof row.sceneProcess !== 'undefined' ? this.processMap[row.sceneProcess] : "";
        },
        createDateFmt(row) {
            return typeof row.createTime !== 'undefined' ? this.dateFmt(row.createTime) : "";
        },
        dateFmt(date) {
            if (date) {
                return date.replace('.0', '');
            }
            return '';
        },
        showEditDialog(index, type) {
            if (this.$refs['editForm'] && this.$refs['editForm'].resetFields) {
                this.$refs['editForm'].resetFields();
            }
            this.edit.type = type;
            this.edit.title = type === 1 ? '编辑' : '详情';

            this.edit.index = index;
            let form = Object.assign({}, this.table.items[index]);
            this.edit.form = form;
            this.edit.tab = 'info';

            // 进行对应参数的查询
            this.queryParam(form.sceneId);
            this.edit.show = true;
        },
        submitEditForm() {
            this.$refs["editForm"].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.edit.form);

                    // 编辑
                    api.editBusinessScene(params).then(res => {
                        let data = res.data;
                        if (data && data.code === "0") {
                            this.$message({
                                type: "success",
                                message: "编辑成功!"
                            });

                            this.edit.show = false;
                            this.query();

                            // 记录日志
                            bsmp.log({
                                component: "business_scene",
                                type: "modify",
                                content: `[scene] params: ${JSON.stringify(params)}`
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        showDialog(type, row) {
            if (this.$refs['sceneForm'] && this.$refs['sceneForm'].resetFields) {
                this.$refs['sceneForm'].resetFields();
            }

            this.dialog.form = {
                sceneName: "",
                sceneCode: "",
                ruleSceneCode: "",
                sceneProcess: "",
                apiUrl: "",
                params: []
            };

            this.dialog.show = true;
        },
        showParamDialog(type, row) {
            if (this.$refs['paramDialogForm'] && this.$refs['paramDialogForm'].resetFields) {
                this.$refs['paramDialogForm'].resetFields();
            }

            this.accountFile.fileId = "";
            this.accountFile.paramId = "";

            this.paramDialog.form = {
                paramId: '',
                paramCode: null,
                paramName: "",
                paramFormat: "",
                isNecessary: "",
                fileParamId: ""
            };

            this.paramDialog.show = true;
        },
        submitForm() {
            this.$refs["sceneForm"].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.dialog.form);
                    // 新增
                    api.addBusinessScene(params).then(res => {
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
                                component: "business_scene",
                                type: "add",
                                content: `[scene] params: ${JSON.stringify(params)}`
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        getCompanyId() {
            let companyId = "";
            if (this.userInfo.companyId) {
                if (this.userInfo.companyId === "ALL") {
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

        query(){
            let params = bsmp.util.deleteBlank(this.search);
            params = Object.assign({}, params, this.table.pager);
            // if (this.selectedScene && this.selectedScene.type === 'func') {
            //     params.sceneId = this.selectedScene.id;
            // } else {
            //     return;
            // }

            if (params.createDate && params.createDate.length && params.createDate[0] && params.createDate[1]) {
                params.createDateStart = bsmp.util.formatDate.format(params.createDate[0], "yyyy-MM-dd hh:mm:ss");
                params.createDateEnd = bsmp.util.formatDate.format(params.createDate[1], "yyyy-MM-dd") + " 23:59:59";
            }
            delete params.createDate;

            this.loading = true;
            api.getBusinessSceneList(params).then(res => {
                this.loading = false;
                let data = res.data;
                if (data && data.code === "0") {
                    this.table.items = data.data.data;
                    this.table.pager = Object.assign({}, this.table.pager, {
                    pageNo: data.data.pageNo,
                    total: data.data.total
                });
                }
            }).catch(e => {
                this.loading = false;
            });

        },
        deleteSceneItem(id) {
            this.$confirm("确定要删除该条规则记录?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                // 删除
                api.deleteBusinessScene({ sceneId: id }).then(res => {
                    let data = res.data;
                    if (data && data.code === "0") {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.query();

                        // 记录日志
                        bsmp.log({
                            component: "business_scene",
                            type: "delete",
                            content: `[scene] params: ${JSON.stringify({
                sceneid: id,
                action: "delete"
              })}`
                        });
                    }
                });
            }).catch(e => {});
        },
        clear() {
            this.search = {
                sceneName: "",
                createDate: null
            };
        },

        // ************************** 参数部分 *********************
        queryParam(sceneId){
            let params = {'sceneId': sceneId}
            params = Object.assign({}, params, this.table.pager);
            // if (this.selectedScene && this.selectedScene.type === 'func') {
            //     params.sceneId = this.selectedScene.id;
            // } else {
            //     return;
            // }
            this.paramsLoading = true;
            api.getSceneParamList(params).then(res => {
                let data = res.data;
                if (data && data.code === "0") {
                    this.edit.form.params = data.data.data;
                }
                this.paramsLoading = false;
            }).catch(e => {
                this.paramsLoading = false;
            });
            

        },
        submitParamForm(){
            this.$refs["paramDialogForm"].validate(valid => {
                if (valid) {
                    let sceneId = this.table.items[this.edit.index].sceneId;
                    let params = Object.assign({}, this.paramDialog.form);
                    params["sceneId"] = sceneId;
                    params["fileParamId"] = this.paramDialog.paramId;

                    // 新增
                    api.addSceneParam(params).then(res => {
                        let data = res.data;
                        if (data && data.code === "0") {
                            this.$message({
                                type: "success",
                                message: "新增成功!"
                            });

                            this.paramDialog.show = false;
                            this.queryParam(sceneId);

                            // 记录日志
                            bsmp.log({
                                component: "business_scene_param",
                                type: "add",
                                content: `[scene_param] params: ${JSON.stringify(params)}`
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        deleteParamItem(id) {
            this.$confirm("确定要删除该条参数记录?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                // 删除
                api.deleteSceneParam({ paramId: id }).then(res => {
                    let data = res.data;
                    if (data && data.code === "0") {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        let sceneId = this.table.items[this.edit.index].sceneId;
                        this.queryParam(sceneId);

                        // 记录日志
                        bsmp.log({
                            component: "business_scene_param",
                            type: "delete",
                            content: `[scene_param] params: ${JSON.stringify({
                sceneid: id,
                action: "delete"
                })}`
                        });
                    }
                });
            }).catch(e => {});
        },
        submitEditParamForm() {
            this.$refs["editParamForm"].validate(valid => {
                if (valid) {
                    let paramId = this.edit.form.params[this.editParam.index].paramId;
                    let params = Object.assign({}, this.editParam.form);
                    params["paramId"] = paramId;
                    params["fileParamId"] = this.editParam.paramId

                    // 编辑
                    api.editSceneParam(params).then(res => {
                        let data = res.data;
                        if (data && data.code === "0") {
                            this.$message({
                                type: "success",
                                message: "编辑成功!"
                            });

                            this.editParam.show = false;
                            let sceneId = this.table.items[this.edit.index].sceneId;
                            this.queryParam(sceneId);

                            // 记录日志
                            bsmp.log({
                                component: "business_scene",
                                type: "modify",
                                content: `[scene_param] params: ${JSON.stringify(params)}`
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        showEditParamDialog(index, type) {
            if (this.$refs['editParamForm'] && this.$refs['editParamForm'].resetFields) {
                this.$refs['editParamForm'].resetFields();
            }
            this.editParam.type = type;
            this.editParam.title = type === 1 ? '编辑' : '详情';

            this.editParam.index = index;
            let form = Object.assign({}, this.edit.form.params[index]);
            this.editParam.form = form;
            this.editParam.tab = 'info';

            this.editParam.paramId = parseInt(form.fileParamId);
            this.accountFile.allParams.forEach(item => {
                    if(item.paramId == form.fileParamId){
                        this.editParam.fileId = item.fileId;
                    }
            });
            
            let paramsList = [];
            this.accountFile.allParams.forEach(item => {
                if(item.fileId == this.editParam.fileId){
                    paramsList.push(item);
                }
            });
            this.accountFile.params = paramsList;

            // this.editParam.paramId = "2"; 
            alert(JSON.stringify(this.accountFile.params));
            alert(this.editParam.paramId);

            this.editParam.show = true;
        },

        /***************************** 文件部分 **********************/
        getAccountFileList() {
            return api.getAccountFileList({'isNode':'1'}).then(res => {
                let data = res.data;
                if (data && data.code === "0") {
                    this.accountFile.files = data.data;
                }                  
            }).catch(e => {
                console.error(e);
            });
        },
        getAllFileParamList() {
            return api.getFileParamList().then(res => {
                let data = res.data;
                if (data && data.code === "0") {
                    this.accountFile.allParams = data.data;
                }                  
            }).catch(e => {
                console.error(e);
            });
        },
        getFileParamList(fileId) {
            this.editParam.paramId = "";
            return api.getFileParamList({"fileId":fileId}).then(res => {
                let data = res.data;
                if (data && data.code === "0") {
                    this.accountFile.params = data.data;
                }                  
            }).catch(e => {
                console.error(e);
            });
        },
        
    }
};

// 表单规则
let rules = {
    sceneName: [
        { required: true, message: "请输入业务名称", trigger: "blur" }
    ],
    sceneCode: [
        { required: true, message: "请输入场景编号", trigger: "blur" }
    ],
    ruleSceneCode: [
        { required: true, message: "请输入规则场景编号", trigger: "blur" }
    ],
    sceneProcess: [
        { required: true, message: "请选择场景流程", trigger: "blur" }
    ],
    apiUrl: [
        { required: true, message: "请填写相关的接口地址", trigger: "blur" }
    ]
};

</script>
<style lang="stylus" scoped>
.el-table-expand {
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

.demo-form-inline {
    border: 1px solid #dfe6ec;
    border-radius: 4px;
    padding: 10px 5px;
    .item {
        margin-bottom: 0!important;
    }
}

.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: "";
    clear: both;
    height: 0;
}





</style>
