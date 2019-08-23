<template>
    <div>
        <el-row :gutter="5">
            <el-col :span="8">
                <div class="rules-left">
                    <div class="btn-row">
                        <h3 class="tree-title">业务办理点</h3>
                        <el-button v-show="optAuth.agency_list" @click="getAgencyList" title="刷新" type="primary" size="small" class="pull-right">
                            <i class="icon-arrows-cw"></i>
                        </el-button>
                        <el-button v-show="optAuth.agency_add" @click="showAgencyDialog(null, 1)" title="新建" type="primary" size="small" class="pull-right">
                            <i class="icon-plus"></i>
                        </el-button>
                    </div>
                    <div class="tree-block" :style="{'height': (height - 60) + 'px'}">
                        <el-tree v-loading="agency.loading" :data="agency.items" node-key="agencyId" ref="agencyTree" highlight-current @node-click="handleAgencyNodeClick" :render-content="renderAgencyContent" :default-expand-all="true" :props="agencyDefaultProps">
                        </el-tree>
                    </div>
                </div>
            </el-col>
        
            <el-col :span="8">
                <div class="rules-left" v-show="this.selectedAgency != null">
                    <div class="btn-row">
                        <h3 class="tree-title">开户类型配置</h3>
                        <el-button v-show="optAuth.application_type_list && this.selectedAgency != null && this.selectedAgency.isNode === '1'" 
                        @click="getApplicationTypeList()" title="刷新" type="primary" size="small" class="pull-right">
                            <i class="icon-arrows-cw"></i>
                        </el-button>
                        <el-button v-show="optAuth.application_type_add  && this.selectedAgency != null && this.selectedAgency.isNode === '1'" 
                        @click="showApplicationTypeDialog(null, 1)" title="新建" type="primary" size="small" class="pull-right">
                            <i class="icon-plus"></i>
                        </el-button>
                    </div>
                    <div class="tree-block" :style="{'height': (height - 60) + 'px'}">
                        <el-tree v-loading="applicationType.loading" :data="applicationType.items" node-key="applicationTypeId" ref="applicationTypeTree" highlight-current @node-click="handleApplicationTypeNodeClick" :render-content="renderApplicationTypeContent" :default-expand-all="true" :props="applicationTypeDefaultProps">
                        </el-tree>
                    </div>
                </div>
            </el-col>

            <!-- *************文件配置************  -->
            <el-col :span="8">
                <div class="rules-left"  v-show="this.selectedApplicationType != null" >
                    <div class="btn-row">
                        <h3 class="tree-title">所需文件配置</h3>
                        <el-button v-show="optAuth.account_file_add &&  this.selectedApplicationType != null && this.selectedApplicationType.isNode === '1'" 
                        @click="saveFileConfig()" title="保存配置" type="primary" size="small" class="pull-right">
                            保存配置
                        </el-button>
                        <el-button v-show="optAuth.account_file_list && this.selectedApplicationType != null && this.selectedApplicationType.isNode === '1'" 
                        @click="getAccountFileList()" title="刷新" type="primary" size="small" class="pull-right">
                            <i class="icon-arrows-cw"></i>
                        </el-button>
                        <!-- <el-button v-show="optAuth.account_file_add &&  this.selectedApplicationType != null && this.selectedApplicationType.isNode === '1'" 
                        @click="showAccountFileDialog(null, 1)" title="新建" type="primary" size="small" class="pull-right">
                            <i class="icon-plus"></i>
                        </el-button> -->
                    </div>
                    <div class="tree-block" :style="{'height': (height - 60) + 'px'}">
                        <el-tree show-checkbox v-loading="accountFile.loading" :data="accountFile.items" node-key="fileId" ref="accountFileTree" highlight-current @node-click="handleAccountFileNodeClick" :render-content="renderAccountFileContent" :default-expand-all="true" :props="accountFileDefaultProps">
                        </el-tree>
                
                    </div>
                </div>
            </el-col>
        </el-row>
        <!-- 办理点弹框 -->
        <el-dialog :title="agency.dialog.title" v-model="agency.dialog.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form ref="agencyForm" :model="agency.dialog.form" label-width="120px" class="dialog-form">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="办理点名称：" prop="agencyName" :rules="[
              { required: true, message: '请输入办理点名称', trigger: 'blur' }]">
                            <el-input v-model="agency.dialog.form.agencyName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="办理点描述：" prop="agencyDesc" >
                            <el-input v-model="agency.dialog.form.agencyDesc" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20"  v-show="agency.dialog.type === 1">
                    <el-col :span="24">
                        <el-form-item label="是否为办理点：" prop="isNode">
                            <el-select v-model="agency.dialog.form.isNode" filterable placeholder="是 or 否">
                                <el-option v-for="(val, key) in agencyTypeMap" :label="val" :value="key" :key="'form-agencyType-'+ key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitAgencyForm" type="primary">保 存</el-button>
                <el-button @click="agency.dialog.show = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 业务类型弹框 -->
        <el-dialog :title="applicationType.dialog.title" v-model="applicationType.dialog.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form ref="applicationTypeForm" :model="applicationType.dialog.form" label-width="120px" class="dialog-form">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="业务类型：" prop="applicationTypeName" :rules="[
              { required: true, message: '请输入业务类型', trigger: 'blur' }]">
                            <el-input v-model="applicationType.dialog.form.applicationTypeName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="业务类型描述：" prop="applicationTypeDesc" >
                            <el-input v-model="applicationType.dialog.form.applicationTypeDesc" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitApplicationTypeForm" type="primary">保 存</el-button>
                <el-button @click="applicationType.dialog.show = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 文件类型弹框 -->
        <el-dialog :title="accountFile.dialog.title" v-model="accountFile.dialog.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form ref="accountFileForm" :model="accountFile.dialog.form" label-width="120px" class="dialog-form">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="文件名称：" prop="fileName" :rules="[
              { required: true, message: '请输入文件名称', trigger: 'blur' }]">
                            <el-input v-model="accountFile.dialog.form.fileName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="文件描述：" prop="fileDesc" >
                            <el-input v-model="accountFile.dialog.form.fileDesc" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row :gutter="20"  v-show="accountFile.dialog.type === 1">
                    <el-col :span="24">
                        <el-form-item label="文件或目录：" prop="isNode">
                            <el-select v-model="accountFile.dialog.form.isNode" filterable placeholder="文件 or 目录">
                                <el-option v-for="(val, key) in fileTypeMap" :label="val" :value="key" :key="'form-accountFileNodeType-'+ key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitAccountFileForm" type="primary">保 存</el-button>
                <el-button @click="accountFile.dialog.show = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import api from "../../api";
import bsmp  from "bsmp_main";
import navigationConfigTreeItem from "../navigationConfigTreeItem.vue";

export default {
    name: "business_navigation_config",
    components: {
        navigationConfigTreeItem
    },
    props: {
        height: {
            type: Number
        }
    },
    data() {
        return {
            /**************** 办理点 ***************/
            agencyDefaultProps: {
                children: "children",
                label: "agencyName"
            },
            agency: {
                loading: false,
                items: [],
                dialog: {
                    type: 1, // 1：新增，2：编辑
                    show: false,
                    node: null,
                    title: "新增办理点",
                    form: {
                        agencyName: "",
                        isNode: "",
                        agencyDesc: "",
                        remark: ""
                    }
                }
            },
            queryTimer: null,
            selectedAgency: null,
            
            /**************** 业务类型 ***************/
            applicationTypeDefaultProps: {
                children: "children",
                label: "applicationTypeName"
            },
            applicationType: {
                loading: false,
                items: [],
                dialog: {
                    type: 1, // 1：新增，2：编辑
                    show: false,
                    node: null,
                    title: "新增业务类型",
                    form: {
                        applicationTypeName: "",
                        applicationTypeDesc: "",
                        isNode: "",
                        remark: ""
                    }
                }
            },
            selectedApplicationType: null,

            /******** 文件 *************/
            accountFileDefaultProps: {
                children: "children",
                label: "fileName"
            },
            accountFile: {
                loading: false,
                filesLoading: false,
                items: [],
                dialog: {
                    type: 1, // 1：新增，2：编辑
                    show: false,
                    node: null,
                    title: "新增文件",
                    form: {
                        fileName: "",
                        fileDesc: "",
                        isNode: "",
                        remark: ""
                    }
                }
            },
            selectedFileIds: [],

            agencyTypeMap: {
                "1": "是",
                "0": "否"
            },
            fileTypeMap: {
                "1": "文件",
                "0": "目录"
            }
        };
    },
    mounted() {
        this.getAgencyList();
        this.getAccountFileList();
    },
    computed: {
        optAuth() {
            return bsmp.util.mapAuth({
                // 办理点
                agency_add: "business_navigation_config_agency_add",
                agency_list: "business_navigation_config_agency_list",
                agency_delete: "business_navigation_config_agency_delete",
                agency_edit: "business_navigation_config_agency_edit",

                // 开户类型
                application_type_add: "business_navigation_config_application_add",
                application_type_list: "business_navigation_config_application_list",
                application_type_delete: "business_navigation_config_application_delete",
                application_type_edit: "business_navigation_config_application_edit",

                // 文件
                account_file_add: "business_navigation_config_account_file_add",
                account_file_list: "business_navigation_config_account_file_list",
                account_file_delete: "business_navigation_config_account_file_delete",
                account_file_edit: "business_navigation_config_account_file_edit",
                account_type_file_set: "business_navigation_config_type_file_setting",
                account_type_file_list: "business_navigation_config_type_file_list"
            });
        }
    },
    
    methods: {
        createDateFmt(row) {
            return typeof row.createDate !== 'undefined' ? this.dateFmt(row.createDate) : "";
        },
        dateFmt(date) {
            if (date) {
                return date.replace('.0', '');
            }
            return '';
        },

        /*********** 办理点方法部分  *************************/
        showAgencyDialog(node, type) {
            if (this.$refs["agencyForm"] && this.$refs["agencyForm"].resetFields) {
                this.$refs["agencyForm"].resetFields();
            }
            if(node != null){
                this.agency.dialog.element = 0;
            } else{
                this.agency.dialog.element = 1;
            }

            this.agency.dialog.type = type;
            if (type === 2) {
                this.agency.dialog.title = '编辑办理点';
                this.agency.dialog.node = null;

                this.agency.dialog.form = {
                    agencyId: node.agencyId,
                    agencyName: node.agencyName,
                    isNode: node.isNode,
                    agencyDesc: node.agencyDesc,
                    remark: node.remark
                };
            } else {
                this.agency.dialog.title = '新增办理点';
                this.agency.dialog.node = node;

                this.agency.dialog.form = {
                    agencyName: "",
                    isNode: "0",
                    agencyDesc: "",
                    remark:""
                };
            }

            this.agency.dialog.show = true;
        },
        submitAgencyForm() {
            this.$refs["agencyForm"].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.agency.dialog.form);
                    
                    if (this.agency.dialog.type === 1) {

                        // 新增
                        if (this.agency.dialog.node) {
                            params.parentId = this.agency.dialog.node.agencyId;
                        } else{
                            // 未传入 为父节点
                            params.parentId = 0;
                        }
                        api.saveAgency(params).then(res => {
                            let data = res.data;
                            if (data && data.code === "0") {
                                this.$message({
                                    type: "success",
                                    message: "新增成功!"
                                });

                                this.agency.dialog.show = false;
                                this.getAgencyList();

                                // 记录日志
                                bsmp.log({
                                    component: "risk_system",
                                    type: "add",
                                    content: `[NavigationConfig-Agency] params: ${JSON.stringify(params)}`
                                });
                            }
                        });
                    } else {
                        // 编辑
                        api.editAgency(params).then(res => {
                            let data = res.data;
                            if (data && data.code === "0") {
                                this.$message({
                                    type: "success",
                                    message: "编辑成功!"
                                });

                                this.agency.dialog.show = false;
                                this.getAgencyList();

                                // 记录日志
                                bsmp.log({
                                    component: "risk_system",
                                    type: "edit",
                                    content: `[NavigationConfig-Agency] params: ${JSON.stringify(params)}`
                                });
                            }
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        deleteAgencyItem(id) {
            this.$confirm("确定要删除该条节点?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                // 删除
                api.deleteAgency({ agencyId: id }).then(res => {
                    let data = res.data;
                    if (data && data.code === "0") {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.getAgencyList();

                        // 记录日志
                        bsmp.log({
                            component: "risk_system",
                            type: "delete",
                            content: `[NavigationConfig-Agency] params: ${JSON.stringify({
                agencyId: id,
                action: "delete"
              })}`
                        });
                    }
                });
            }).catch(e => {});
        },
        handleAgencyNodeClick(data) {
            // 待参考
            
            if(data.isNode === '1'){
                this.selectedAgency = data;
                this.getApplicationTypeList();
            } else{
                this.selectedAgency = null;
                this.selectedApplicationType = null;
            }
            // if (this.queryTimer) {
            //     clearTimeout(this.queryTimer);
            //     this.queryTimer = null;
            // }
            // this.queryTimer = setTimeout(() => {
            //     this.getAgencyList();
            // }, 500);
        },
        renderAgencyContent(h, { node, data, store }) {
            return this.$createElement("navigationConfigTreeItem", {
                props: {
                    node,
                    type: 1
                },
                on: {
                    edit: data => {
                        this.showAgencyDialog(data.data, 2);
                    },
                    plus: data => {
                        this.showAgencyDialog(data.data, 1);
                    },
                    trash: data => {
                        this.deleteAgencyItem(data.data.agencyId);
                    }
                }
            });
        },
        getAgencyList() {
            this.agency.loading = true;
            return api.getAgencyList().then(res => {
                this.agency.loading = false;
                let data = res.data;
                if (data && data.code === "0") {
                    let items = data.data;
                    let nodes = [],
                        node = null;

                    items.forEach(item => {
                        node = {
                            agencyId: item.agencyId,
                            parentId: item.parentId,
                            agencyName: item.agencyName,
                            remark: item.remark,
                            isNode: item.isNode.toString(),
                            children: []
                        };
                        node.children = this.setChildNode(item.children);
                        nodes.push(node);
                    });

                    this.agency.items = nodes;
                    this.selectedAgency = null;
                    this.applicationType.items = [];
                }
            }).catch(e => {
                console.error(e);
            });
        },
        setChildNode(children){
            
            let nodes = [], node = null;
            if (children && children.length) {
                children = children.forEach(item => {
                    node = {
                            agencyId: item.agencyId,
                            parentId: item.parentId,
                            agencyName: item.agencyName,
                            remark: item.remark,
                            isNode: item.isNode.toString(),
                            children: []
                    };
                    node.children = this.setChildNode(item.children);
                    nodes.push(node);
                });
            }
            return nodes;
        },

        /*********** 开户类型方法部分 ***********************/
        showApplicationTypeDialog(node, type) {
            if (this.$refs["applicationTypeForm"] && this.$refs["applicationTypeForm"].resetFields) {
                this.$refs["applicationTypeForm"].resetFields();
            }
            if(node != null){
                this.applicationType.dialog.element = 0;
            } else{
                this.applicationType.dialog.element = 1;
            }

            this.applicationType.dialog.type = type;
            if (type === 2) {
                this.applicationType.dialog.title = '编辑业务类型';
                this.applicationType.dialog.node = null;

                this.applicationType.dialog.form = {
                    applicationTypeId: node.applicationTypeId,
                    applicationTypeName: node.applicationTypeName,
                    isNode: node.isNode,
                    applicationTypeDesc: node.applicationTypeDesc,
                    remark: node.remark
                };
            } else {
                this.applicationType.dialog.title = '新增业务类型';
                this.applicationType.dialog.node = node;

                this.applicationType.dialog.form = {
                    applicationTypeName: "",
                    isNode: "0",
                    applicationTypeDesc: "",
                    remark:""
                };
            }

            this.applicationType.dialog.show = true;
        },
        submitApplicationTypeForm() {
            this.$refs["applicationTypeForm"].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.applicationType.dialog.form);
                    
                    if (this.applicationType.dialog.type === 1) {

                        // 新增
                        if (this.applicationType.dialog.node) {
                            params.parentId = this.applicationType.dialog.node.applicationTypeId;
                            params.isNode = 1;
                        } else{
                            // 未传入 为父节点
                            params.parentId = 0;
                            params.isNode = 0;
                        }

                        params.agencyId = this.selectedAgency.agencyId;

                        api.saveApplicationType(params).then(res => {
                            let data = res.data;
                            if (data && data.code === "0") {
                                this.$message({
                                    type: "success",
                                    message: "新增成功!"
                                });

                                this.applicationType.dialog.show = false;
                                this.getApplicationTypeList();

                                // 记录日志
                                bsmp.log({
                                    component: "risk_system",
                                    type: "add",
                                    content: `[NavigationConfig-ApplicationType] params: ${JSON.stringify(params)}`
                                });
                            }
                        });
                    } else {
                        // 编辑
                        api.editApplicationType(params).then(res => {
                            let data = res.data;
                            if (data && data.code === "0") {
                                this.$message({
                                    type: "success",
                                    message: "编辑成功!"
                                });

                                this.applicationType.dialog.show = false;
                                this.getApplicationTypeList();

                                // 记录日志
                                bsmp.log({
                                    component: "risk_system",
                                    type: "edit",
                                    content: `[NavigationConfig-ApplicationType] params: ${JSON.stringify(params)}`
                                });
                            }
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        deleteApplicationTypeItem(id) {
            this.$confirm("确定要删除该条节点或类型?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                // 删除
                api.deleteApplicationType({ applicationTypeId: id }).then(res => {
                    let data = res.data;
                    if (data && data.code === "0") {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.getApplicationTypeList();

                        // 记录日志
                        bsmp.log({
                            component: "risk_system",
                            type: "delete",
                            content: `[NavigationConfig-ApplicationType] params: ${JSON.stringify({
                applicationTypeId: id,
                action: "delete"
              })}`
                        });
                    }
                });
            }).catch(e => {});
        },
        handleApplicationTypeNodeClick(data) {
            if(data.isNode === '1'){
                this.selectedApplicationType = data;
                this.getFileConfigList();
            } else{
                this.selectedApplicationType = null;
            }
            // if (this.queryTimer) {
            //     clearTimeout(this.queryTimer);
            //     this.queryTimer = null;
            // }
            // this.queryTimer = setTimeout(() => {
            //     this.query();
            // }, 500);
        },
        renderApplicationTypeContent(h, { node, data, store }) {
            return this.$createElement("navigationConfigTreeItem", {
                props: {
                    node,
                    type: 1
                },
                on: {
                    edit: data => {
                        this.showApplicationTypeDialog(data.data, 2);
                    },
                    plus: data => {
                        this.showApplicationTypeDialog(data.data, 1);
                    },
                    trash: data => {
                        this.deleteApplicationTypeItem(data.data.applicationTypeId);
                    }
                }
            });
        },
        getApplicationTypeList() {
            this.applicationType.loading = true;
            return api.getApplicationTypeList({ agencyId: this.selectedAgency.agencyId }).then(res => {
                this.applicationType.loading = false;
                let data = res.data;
                if (data && data.code === "0") {
                    let items = data.data;
                    let nodes = [],
                        node = null;

                    items.forEach(item => {
                        node = {
                            applicationTypeId: item.applicationTypeId,
                            agencyId: item.agencyId,
                            parentId: item.parentId,
                            applicationTypeName: item.applicationTypeName,
                            applicationTypeDesc: item.applicationTypeDesc,
                            remark: item.remark,
                            isNode: item.isNode.toString(),
                            children: []
                        };
                        node.children = this.setApplicationTypeChildNode(item.children);
                        nodes.push(node);
                    });

                    this.applicationType.items = nodes;

                    this.selectedApplicationType = null;
                }
            }).catch(e => {
                console.error(e);
            });
        },
        setApplicationTypeChildNode(children){
            
            let nodes = [], node = null;
            if (children && children.length) {
                children = children.forEach(item => {
                    node = {
                        applicationTypeId: item.applicationTypeId,
                        agencyId: item.agencyId,
                        parentId: item.parentId,
                        applicationTypeName: item.applicationTypeName,
                        applicationTypeDesc: item.applicationTypeDesc,
                        remark: item.remark,
                        isNode: item.isNode.toString(),
                        children: []
                    };
                    node.children = this.setApplicationTypeChildNode(item.children);
                    nodes.push(node);
                });
            }
            return nodes;
        },

        /*********** 文件方法部分 ***********************/
        showAccountFileDialog(node, type) {
            if (this.$refs["accountFileForm"] && this.$refs["accountFileForm"].resetFields) {
                this.$refs["accountFileForm"].resetFields();
            }

            this.accountFile.dialog.type = type;
            if (type === 2) {
                this.accountFile.dialog.title = '编辑文件配置';
                this.accountFile.dialog.node = null;

                this.accountFile.dialog.form = {
                    fileId: node.fileId,
                    fileName: node.fileName,
                    isNode: node.isNode,
                    fileDesc: node.fileDesc,
                    remark: node.remark
                };
            } else {
                this.accountFile.dialog.title = '新增文件配置';
                this.accountFile.dialog.node = node;

                this.accountFile.dialog.form = {
                    fileName: "",
                    isNode: "0",
                    fileDesc: "",
                    remark:""
                };
            }

            this.accountFile.dialog.show = true;
        },
        submitAccountFileForm() {
            this.$refs["accountFileForm"].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.accountFile.dialog.form);
                    
                    if (this.accountFile.dialog.type === 1) {
                        // 新增
                        if (this.accountFile.dialog.node) {
                            params.parentId = this.accountFile.dialog.node.fileId;
                            params.isForm = this.accountFile.dialog.node.isForm;
                            params.isNode = 1;
                        } else{
                            // 未传入 为父节点
                            params.parentId = 0;
                            params.isNode = 0;
                        }
                        api.saveAccountFile(params).then(res => {
                            let data = res.data;
                            if (data && data.code === "0") {
                                this.$message({
                                    type: "success",
                                    message: "新增成功!"
                                });

                                this.accountFile.dialog.show = false;
                                this.getAccountFileList();

                                // 记录日志
                                bsmp.log({
                                    component: "risk_system",
                                    type: "add",
                                    content: `[NavigationConfig-File] params: ${JSON.stringify(params)}`
                                });
                            }
                        });
                    } else {
                        // 编辑
                        api.editAccountFile(params).then(res => {
                            let data = res.data;
                            if (data && data.code === "0") {
                                this.$message({
                                    type: "success",
                                    message: "编辑成功!"
                                });

                                this.accountFile.dialog.show = false;
                                this.getAccountFileList();

                                // 记录日志
                                bsmp.log({
                                    component: "risk_system",
                                    type: "edit",
                                    content: `[NavigationConfig-File] params: ${JSON.stringify(params)}`
                                });
                            }
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        deleteAccountFileItem(id) {
            this.$confirm("确定要删除该条节点或类型?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                // 删除
                api.deleteAccountFile({ fileId: id }).then(res => {
                    let data = res.data;
                    if (data && data.code === "0") {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.getAccountFileList();

                        // 记录日志
                        bsmp.log({
                            component: "risk_system",
                            type: "delete",
                            content: `[NavigationConfig-File] params: ${JSON.stringify({
                fileId: id,
                action: "delete"
              })}`
                        });
                    }
                });
            }).catch(e => {});
        },
        handleAccountFileNodeClick(data) {
            // 待保存处理
            // if(data.isNode === '1'){
            //     this.selectedApplicationType = data;
            // } else{
            //     this.selectedApplicationType = null;
            // }
            // if (this.queryTimer) {
            //     clearTimeout(this.queryTimer);
            //     this.queryTimer = null;
            // }
            // this.queryTimer = setTimeout(() => {
            //     this.query();
            // }, 500);
        },
        renderAccountFileContent(h, { node, data, store }) {
            return this.$createElement("navigationConfigTreeItem", {
                props: {
                    node,
                    type: 1
                },
                on: {
                    edit: data => {
                        this.showAccountFileDialog(data.data, 2);
                    },
                    plus: data => {
                        this.showAccountFileDialog(data.data, 1);
                    },
                    trash: data => {
                        this.deleteAccountFileItem(data.data.fileId);
                    }
                }
            });
        },
        getAccountFileList() {
            this.accountFile.loading = true;
            return api.getAccountFileList().then(res => {
                this.accountFile.loading = false;
                let data = res.data;
                if (data && data.code === "0") {
                    let items = data.data;
                    let nodes = [],
                        node = null;

                    items.forEach(item => {
                        node = {
                            fileId: item.fileId,
                            parentId: item.parentId,
                            fileName: item.fileName,
                            fileDesc: item.fileDesc,
                            remark: item.remark,
                            isNode: item.isNode.toString(),
                            isForm: item.isForm.toString(),
                            children: []
                        };
                        node.children = this.setAccountFileChildNode(item.children);
                        nodes.push(node);
                    });

                    this.accountFile.items = nodes;
                }
            }).catch(e => {
                console.error(e);
            });
        },
        setAccountFileChildNode(children){
            
            let nodes = [], node = null;
            if (children && children.length) {
                children = children.forEach(item => {
                    node = {
                        fileId: item.fileId,
                        parentId: item.parentId,
                        fileName: item.fileName,
                        fileDesc: item.fileDesc,
                        remark: item.remark,
                        isNode: item.isNode.toString(),
                        isForm: item.isForm.toString(),
                        children: []
                    };
                    node.children = this.setAccountFileChildNode(item.children);
                    nodes.push(node);
                });
            }
            return nodes;
        },
        saveFileConfig(){
            let params = {};
            params.applicationTypeId = this.selectedApplicationType.applicationTypeId;
            let fileIds = (this.$refs.accountFileTree.getCheckedKeys()).toString();
            params.fileIds = fileIds.replace('[|]', '');

            api.saveFileConfig(params).then(res => {
                let data = res.data;
                if (data && data.code === "0") {
                    this.$message({
                        type: "success",
                        message: "保存成功!"
                    });

                    this.getAccountFileList();
                    this.getFileConfigList();

                    // 记录日志
                    bsmp.log({
                        component: "risk_system",
                        type: "save",
                        content: `[NavigationConfig-TypeFileRel] params: ${JSON.stringify(params)}`
                    });
                }
            });

        },
        getFileConfigList() {
            this.accountFile.filesLoading = true;
            this.selectedFileIds =  [];
            this.$refs.accountFileTree.setCheckedKeys(this.selectedFileIds);
            api.getFileConfigList({applicationTypeId : this.selectedApplicationType.applicationTypeId}).then(res => {
                this.accountFile.filesLoading = false;
                let data = res.data;
                if (data && data.code === "0" && data.data) {
                    let items = data.data;
                    let selectFiles = [];
                    items.forEach(item => {
                        selectFiles.push(item.fileId);
                    });
                    this.selectedFileIds =  selectFiles;
                    this.$refs.accountFileTree.setCheckedKeys(this.selectedFileIds);
                }
            }).catch(e => {
                console.error(e);
            })
        }
    }
};

// 表单规则
let rules = {
    ruleName: [
        { required: true, message: "请输入规则名称", trigger: "blur" }
    ]
};

</script>
<style lang="stylus" scoped>
.tree-title {
    float: left;
    font-size: 16px;
    font-weight: bold;
    padding: 5px;
}

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

.demo-form-inline {
    border: 1px solid #dfe6ec;
    border-radius: 4px;
    padding: 10px 5px;
    .item {
        margin-bottom: 0!important;
    }
}

.edit-dialog-form {
    min-height: 400px;
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

.api-block {
    .item {
        border-radius: 5px;
        padding: 3px 10px;
        height: 35px;
        border: 1px solid #ccc;
        background-color: #000;
    }
    .url {
        color: #fff;
    }
    .method {
        color: #0f0;
        font-weight: bold;
    }

    table {
        border-collapse: collapse;
        width: 100%;
        th {
            background-color: #f5f5f5;
            padding: 4px 8px;
            border: #e0e0e0 1px solid;
            font-weight: bold;
        }
        td {
            vertical-align: top;
            padding: 10px 8px 0 8px;
            border: #e0e0e0 1px solid;
        }
    }
}

.rules-left {
    border: 1px solid #ccc;

    .btn-row {
        height: 50px;
        padding: 5px;

        button {
            margin: 5px;
        }
    }

    .tree-block {
        height: 750px;
        overflow: scroll;
    }
}

.rules-right {
    border: 1px solid #ccc;
}

.clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: "";
    clear: both;
    height: 0;
}

.icon-arrows-cw{
    font-size: 85%;
}

.icon-plus{
    font-size: 85%;
}

</style>
