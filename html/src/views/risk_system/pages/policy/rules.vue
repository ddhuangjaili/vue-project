<template>
    <div>
        <el-row :gutter="5">
            <el-col :span="5">
                <div class="rules-left">
                    <div class="btn-row">
                        <h3 class="tree-title">审核规则树</h3>
                        <el-button v-show="optAuth.scene_add" @click="getSceneList" title="刷新" type="primary" size="small" class="pull-right">
                            <i class="icon-arrows-cw"></i>
                        </el-button>
                        <el-button v-show="optAuth.scene_list" @click="showSceneDialog(null, 1)" title="新建" type="primary" size="small" class="pull-right">
                            <i class="icon-plus"></i>
                        </el-button>
                    </div>
                    <div class="tree-block" :style="{'height': (height - 60) + 'px'}">
                        <el-tree v-loading="scene.loading" :data="scene.items" node-key="id" ref="tree" highlight-current @node-click="handleNodeClick" :render-content="renderContent" :default-expand-all="true" :props="defaultProps">
                        </el-tree>
                    </div>
                </div>
            </el-col>
            <el-col :span="19">
                <div class="rules-right">
                    <query-panel>
                        <el-form :inline="true" :model="search" class="demo-form-inline">
                            <el-form-item>
                                <el-select v-model="search.ruleResult" clearable filterable placeholder="审核结果">
                                    <el-option v-for="(val, key) in ruleResultMap" :label="val" :value="key" :key="'search-ruleResult-'+ key"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="search.ruleName" placeholder="请输入规则名称"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-select v-model="search.ruleStatus" clearable filterable placeholder="审核状态">
                                    <el-option v-for="(val, key) in ruleStatusMap" :label="val" :value="key" :key="'search-ruleStatus-'+ key"></el-option>
                                </el-select>
                            </el-form-item>
                            <br/>
                            <el-form-item>
                                <el-date-picker clearable v-model="search.createDate" type="daterange" placeholder="创建时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button v-show="optAuth.search && selectedScene && selectedScene.type === 'func'" type="primary" @click="query">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button v-show="selectedScene && selectedScene.type === 'func'" type="primary" @click="clear">清空</el-button>
                            </el-form-item>
                        </el-form>
                    </query-panel>
                    <el-row class="toolbar">
                        <el-button v-show="optAuth.add && selectedScene && selectedScene.type === 'func'" @click="showDialog(1)" type="primary" style="margin: 5px 10px">新增</el-button>
                        <el-button v-show="optAuth.import && selectedScene && selectedScene.type === 'func'" @click="showImport(1)" type="primary" style="margin: 5px 10px">导入</el-button>
                    </el-row>
                    <el-table highlight-current-row v-loading.body="loading" :data="table.items" border stripe :max-height="height - 200" style="width: 100%">
                        <el-table-column type="index" label="序号" width="80"></el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="ruleName" label="规则名称" width="200">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="ruleResult" :formatter="ruleResultFmt" label="规则结果" width="120">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="hitCount" label="命中数量" width="120">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="excuteCount" label="触发数量" width="120">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="ruleStatus" :formatter="ruleStatusFmt" label="操作状态" min-width="120">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="ruleEnable" :formatter="ruleEnableFmt" label="是否启用" min-width="120">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="ruleSalience" :formatter="ruleSalienceFmt" label="优先级" width="120">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" prop="createDate" :formatter="createDateFmt" label="创建时间" width="200">
                        </el-table-column>
                        <el-table-column fixed="right" width="200" label="操作">
                            <template slot-scope="scope">
                                <el-button title="删除" v-show="optAuth.delete && scope.row.ruleEnable !== 1
                  && scope.row.ruleEnable === 0" size="mini" @click.native.prevent="deleteItem(scope.row.ruleId)">
                                    <i class="icon-trash-empty"></i>
                                </el-button>
                                <el-button title="编辑" v-show="optAuth.edit && scope.row.ruleEnable === 0" size="mini" @click.native.prevent="showEditDialog(scope.$index, 1)">
                                    <i class="icon-edit-square"></i>
                                </el-button>
                                <el-button title="审核" v-show="optAuth.approve && scope.row.ruleStatus === 0 " size="mini" @click.native.prevent="showApproveDialog(scope.row)"><i class="icon-ok-circled"></i></el-button>
                                <el-button @click.native.prevent="enableRule(scope.row.ruleId, 1)" title="启用" v-show="scope.row.ruleStatus === 1 && optAuth.enable && scope.row.ruleEnable === 0" size="mini">
                                    <i class="icon-play"></i>
                                </el-button>
                                <el-button @click.native.prevent="enableRule(scope.row.ruleId, 0)" title="停用" v-show="scope.row.ruleStatus === 1 && optAuth.enable && scope.row.ruleEnable === 1" size="mini">
                                    <i class="icon-stop"></i>
                                </el-button>
                                <el-button title="查看详情" @click="showEditDialog(scope.$index, 2)" size="mini"><i class="icon-eye"></i></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
        <!-- 弹窗框 -->
        <el-dialog :title="scene.dialog.title" v-model="scene.dialog.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form ref="sceneForm" :model="scene.dialog.form" label-width="120px" class="dialog-form">
                <el-row v-if="scene.dialog.form.sceneIdentify" :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="场景标识：" prop="sceneIdentify" :rules="[
              { required: true, message: '请输入场景标识', trigger: 'blur' }]">
                            <el-input v-model="scene.dialog.form.sceneIdentify" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="场景名称：" prop="sceneName" :rules="[
              { required: true, message: '请输入场景名称', trigger: 'blur' }]">
                            <el-input v-model="scene.dialog.form.sceneName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="场景描写：" prop="sceneDesc" :rules="[
              { required: true, message: '请输入场景描写', trigger: 'blur' }]">
                            <el-input v-model="scene.dialog.form.sceneDesc" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20"  v-show="scene.dialog.element === 0">
                    <el-col :span="24">
                        <el-form-item label="场景结果：" prop="customizedResult">
                            <el-select v-model="scene.dialog.form.customizedResult" filterable placeholder="场景结果">
                                <el-option v-for="(val, key) in ruleResultMap" :label="val" :value="key" :key="'form-customizedResult-'+ key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="submitSceneForm" type="primary">保 存</el-button>
                <el-button @click="scene.dialog.show = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- /弹窗框 -->
        <!-- 弹窗框 -->
        <el-dialog title="生成API" v-model="api.show" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form ref="apiForm" label-width="120px" class="dialog-form api-block" v-loading="api.loading">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="api地址：">
                            <div class="item url">{{api.form.apiUrl}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="请求方式：">
                            <div class="item method">{{api.form.method}}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-if="api.form.header">
                    <el-col :span="24">
                        <el-form-item label="header：">
                            <table>
                                <thead>
                                    <tr>
                                        <th style="width: 50%">字段</th>
                                        <th style="width: 50%">描述</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(val, key) in api.form.header" :key="'header-' + key">
                                        <td>{{key}}</td>
                                        <td>{{val}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-if="api.form.params">
                    <el-col :span="24">
                        <el-form-item label="params：">
                            <table>
                                <thead>
                                    <tr>
                                        <th style="width: 50%">字段</th>
                                        <th style="width: 50%">描述</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(val, key) in api.form.params" :key="'params-' + key">
                                        <td>{{key}}</td>
                                        <td>{{val}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <!-- /弹窗框 -->
        <!-- 弹窗框 -->
        <el-dialog :title="dialog.title" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form ref="ruleForm" :model="dialog.form" :rules="dialog.rules" label-width="120px" class="dialog-form">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="规则名称：" prop="ruleName">
                            <el-input v-model="dialog.form.ruleName" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="审核结果：" prop="ruleResult">
                            <el-select v-model="dialog.form.ruleResult" filterable placeholder="审核结果">
                                <el-option v-for="(val, key) in ruleResultMap" :label="val" :value="key" :key="'form-ruleResult-'+ key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="审核后置动作：" prop="funId">
                            <el-cascader clearable v-loading="variableCalParams.loading" @change="changeAddFunId" v-model="dialog.form.funId" placeholder="审核后置动作" :options="variableCalTree">
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24" class="select-block">
                        <div class="item" v-for="(params, key) in variableCalParams.items" :key="'form-params' + key">
                            <span class="label">{{params.paramName}}：</span>
                            <el-cascader clearable :options="variableDimTree" v-model="dialog.form.rel[key]">
                            </el-cascader>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="优先级：" prop="ruleSalience">
                            <el-select v-model="dialog.form.ruleSalience" filterable placeholder="优先级">
                                <el-option v-for="(val, key) in ruleSalienceMap" :label="val" :value="key" :key="'form-ruleSalience-'+ key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="规则描述：" prop="ruleDesc">
                            <el-input v-model="dialog.form.ruleDesc" type="textarea"></el-input>
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
        <!-- 弹窗框 -->
        <el-dialog title="审核" v-model="approve.show" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form ref="approveForm" :model="approve.form" :rules="approve.rules" label-width="120px" class="dialog-form">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="审批状态：" prop="ruleStatus">
                            <el-select @change="changeApproveStatus" v-model="approve.form.ruleStatus" placeholder="审核状态">
                                <el-option v-for="(val, key) in ruleStatusSelectMap" :label="val" :value="key" :key="'approve-ruleStatus-'+ key"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="审批备注：" prop="approveRemark" ref="approveRemark">
                            <el-input v-model="approve.form.approveRemark" type="textarea"></el-input>
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
        <!-- 导入规则弹窗框 -->
        <el-dialog title="导入" v-model="importRule.show"  :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form ref="importRuleForm" :model="importRule.form" :rules="importRule.rules" label-width="120px" class="dialog-form">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="选择分组：" prop="ruleGroup" label-width="150px">
                            <el-select v-model="importRule.form.ruleGroup" @change="selectRuleGroup" placeholder="分组" filterable style="width: 200px">
                                <el-option v-for=" group in groupList" :label="group" :value="group" :key="group" ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="需要导入的规则：" prop="ruleId" label-width="150px" v-show="importRule.form.ruleGroup">
                            <el-select v-model="importRule.form.ruleId" placeholder="规则库规则" filterable style="width: 350px">
                                <el-option v-for=" importRule in ruleBaseList.items" :label="importRule.ruleName" :value="importRule.ruleId" :key="'import-rule-'+ importRule.ruleId"></el-option>
                            </el-select>
                            <el-button v-show="optAuth.condition_edit" @click="showRuleDialog(2)" :disabled="edit.conditionOpt.type === '1' && edit.conditionOpt.index !== index" type="text" size="small">查看详情</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="importRuleForm" type="primary">导 入</el-button>
                <el-button @click="importRule.show = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 导入规则弹窗框 -->

        <!-- 编辑弹窗框 -->
        <el-dialog :title="edit.title" v-model="edit.show" size="large" class="dialog-more-small" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form ref="editForm" :model="edit.form" :rules="edit.rules" label-width="120px" class="dialog-form edit-dialog-form">
                <el-tabs v-model="edit.tab" type="card">
                    <el-tab-pane label="规则信息" name="info">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="规则名称：" prop="ruleName">
                                    <el-input v-model="edit.form.ruleName" auto-complete="off" :disabled="edit.type === 2"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="规则编码：" prop="ruleCode">
                                    <el-input v-model="edit.form.ruleCode" auto-complete="off" :disabled="edit.type === 2"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="审核结果：" prop="ruleResult">
                                    <el-select v-model="edit.form.ruleResult" filterable placeholder="审核结果" :disabled="edit.type === 2">
                                        <el-option v-for="(val, key) in ruleResultMap" :label="val" :value="key" :key="'form-ruleResult-'+ key"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <!-- <el-col :span="12">
                                <el-form-item label="审核后置动作：" prop="funId">
                                    <el-cascader clearable v-loading="variableCalParams.loading" @change="changeEditFunId" v-model="edit.form.funId" placeholder="审核后置动作" :disabled="edit.type === 2" :options="variableCalTree">
                                    </el-cascader>
                                </el-form-item>
                            </el-col> -->
                            
                            <el-col :span="8">
                                <el-form-item label="规则分组：" prop="ruleGroup" >
                                    <el-select v-model="edit.form.ruleGroup" filterable allow-create clearable disabled>
                                        <el-option v-for="item in groupList" :value = item :key = item :label="item" > </el-option>
                                    </el-select>
                                    <!-- <el-select v-model="edit.form.ruleGroup" filterable allow-create clearable default-first-option "></el-select> -->
                                    <!-- <el-input v-model="dialog.form.group" auto-complete="off"></el-input> -->
                                </el-form-item>
                            </el-col>
                             <el-col :span="8" class="select-block">
                                <div class="item" v-for="(params, key) in variableCalParams.items" :key="'form-params' + key">
                                    <span class="label">{{params.paramName}}：</span>
                                    <el-cascader :disabled="edit.type === 2" clearable :options="variableDimTree" v-model="edit.form.rel[key]">
                                    </el-cascader>
                                </div>
                            </el-col>
                        </el-row>
                        <!-- <el-row :gutter="20">
                           
                        </el-row> -->
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="优先级：" prop="ruleSalience">
                                    <el-select v-model="edit.form.ruleSalience" filterable placeholder="优先级" :disabled="edit.type === 2">
                                        <el-option v-for="(val, key) in ruleSalienceMap" :label="val" :value="key" :key="'form-ruleSalience-'+ key"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="规则命中原因：" prop="ruleHitReason">
                                    <el-input v-model="edit.form.ruleHitReason" auto-complete="off" :disabled="edit.type === 2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="22">
                                <el-form-item label="规则描述：" prop="ruleDesc">
                                    <el-input v-model="edit.form.ruleDesc" type="textarea" :disabled="edit.type === 2"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" v-show="edit.type === 2">
                            <el-col :span="12">
                                <el-form-item label="审核状态：" prop="ruleStatus">
                                    {{ruleStatusFmt(edit.form)}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="审核备注：" prop="approveRemark">
                                    {{edit.form.approveRemark}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" v-show="edit.type === 2">
                            <el-col :span="12">
                                <el-form-item label="编辑人员：" prop="updateUser">
                                    {{edit.form.updateUser}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="编辑时间：" prop="updateDate">
                                    {{dateFmt(edit.form.updateDate)}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" v-show="edit.type === 2">
                            <el-col :span="12">
                                <el-form-item label="审核人员：" prop="approveUser">
                                    {{edit.form.approveUser}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="审核时间：" prop="approveDate">
                                    {{dateFmt(edit.form.approveDate)}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" v-show="edit.type === 2">
                            <el-col :span="12">
                                <el-form-item label="创建人员：" prop="createUser">
                                    {{edit.form.createUser}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="创建时间：" prop="createDate">
                                    {{dateFmt(edit.form.createDate)}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" v-show="edit.type === 1">
                            <el-col :span="24">
                                <el-form-item>
                                    <el-button @click="submitEditForm" type="primary">保 存</el-button>
                                    <el-button @click="edit.show = false">取 消</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="规则条件" name="condition">
                        <div class="toolbar clearfix">
                            <el-button v-show="edit.type === 1 && optAuth.condition_add" :disabled="edit.conditionOpt.type !== '0'" @click="changeCondition(1)" type="primary" class="pull-right"><i class="el-icon-plus"></i>&nbsp;&nbsp;新增条件</el-button>
                        </div>
                        <div class="condition list" style="width:100%; height:220px; overflow-x:hidden; overflow-y:auto;">
                        <el-form style="margin-bottom:10px; padding: 10px;" v-for="(item, index) in edit.conditions" :key="'condition-' + index" :inline="true" class="demo-form-inline">
                            <el-form-item label="条件名：" class="item">
                                <el-input v-model="edit.conditions[index].conditionName" auto-complete="off" style="width: 40px" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="源：" class="item">
                                <el-cascader v-model="edit.conditions[index].conditionLeft" style="width: 300px" :disabled="edit.type === 2" clearable :options="variableDimTree">
                                </el-cascader>
                            </el-form-item>
                            <el-form-item label="逻辑：" class="item">
                                <el-select v-model="edit.conditions[index].conditionOper" placeholder="逻辑" style="width: 150px" :disabled="edit.type === 2">
                                    <el-option v-for="(val, key) in conditionOperMap" :label="val" :value="key" :key="'form-conditionOper-'+ key"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="目标：" class="item">
                                <el-select v-model="edit.conditions[index].rightType" style="width: 150px" :disabled="edit.type === 2">
                                    <el-option v-for="(val, key) in rightTypeMap" :label="val" :value="key" :key="'form-rightType-'+ key"></el-option>
                                </el-select>
                                <el-cascader v-if="edit.conditions[index].rightType === '2'" :disabled="edit.type === 2" v-model="edit.conditions[index].conditionRights" style="width: 200px" clearable :options="variableDimTreeRight">
                                </el-cascader>
                                <el-input v-if="edit.conditions[index].rightType === '1'" :disabled="edit.type === 2" v-model="edit.conditions[index].conditionRight" auto-complete="off" style="width: 200px"></el-input>
                                <el-select v-if="edit.conditions[index].rightType === '4'" :disabled="edit.type === 2" v-model="edit.conditions[index].dictRight" style="width: 200px">
                                    <el-option v-for="(val, key) in dictRightMap" :label="val" :value="key" :key="'form-dictRight-'+ key"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item class="item" v-show="edit.type === 1">
                                <el-button v-show="optAuth.condition_edit" @click="saveCondition(index)" :disabled="edit.conditionOpt.type === '1' && edit.conditionOpt.index !== index" type="text" size="small">保存</el-button>
                                <el-button v-show="optAuth.condition_delete" @click="changeCondition(2, index)" :disabled="edit.conditionOpt.type === '1' && edit.conditionOpt.index !== index" type="text" size="small">删除</el-button>
                                <el-button v-show="optAuth.condition_changeseq && index != 0 && edit.conditionOpt.type == '0'" @click="changeConditionSeq(index, 0)" type="text" size="small">上调</el-button>
                                <el-button v-show="optAuth.condition_changeseq && index != (edit.conditions.length - 1) && edit.conditionOpt.type == '0'" @click="changeConditionSeq(index, 1)" type="text" size="small">下调</el-button>
                            </el-form-item>
                        </el-form>
                        </div>
                        <hr />
                         <el-form  label-position="left" style="margin-bottom:10px; padding: 10px;" class="demo-form-inline">
                            <el-form-item label="规则逻辑：" prop="logical">
                                <el-input v-model="edit.form.logical" style="width: 500px" auto-complete="off" placeholder="用(),||,&&进行组合的逻辑关系，如：(#A||#B)&&#C" :disabled="edit.type === 2"></el-input>
                                 <el-button class="pull-right" v-show="edit.type === 1" @click="ruleLogicSetting(edit.form.ruleId,edit.form.logical)" type="primary">保存条件逻辑</el-button>
                            </el-form-item>
                        </el-form>


                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-dialog>
        <!-- /编辑弹窗框 -->
    </div>
</template>
<script>
import api from "../../api";
import bsmp  from "bsmp_main";
import sceneTreeItem from "../sceneTreeItem.vue";

export default {
    name: "risk_system_policy_rules",
    components: {
        sceneTreeItem
    },
    props: {
        height: {
            type: Number
        }
    },
    data() {
        return {
            userInfo: null,
            defaultProps: {
                children: "children",
                label: "label"
            },
            scene: {
                loading: false,
                items: [],
                dialog: {
                    type: 1, // 1：新增，2：编辑
                    element: 1, // 类别：0 节点，1目录
                    show: false,
                    node: null,
                    title: "新增场景",
                    form: {
                        sceneIdentify: "",
                        sceneName: "",
                        sceneDesc: "",
                        customizedResult: ""
                    }
                }
            },
            api: {
                show: false,
                loading: false,
                form: {
                    apiUrl: '',
                    method: '',
                    header: null,
                    params: null
                }
            },
            loading: false,
            search: {
                ruleResult: "",
                ruleName: "",
                ruleStatus: "",
                createDate: null
            },
            queryTimer: null,
            selectedScene: null,
            table: {
                items: []
            },
            ruleBaseList: {
                items: []
            },
            groupList: [],
            dialog: {
                show: false,
                index: -1, // 数据下标
                title: "新增",
                form: {
                    sceneId: null,
                    ruleName: "",
                    ruleDesc: "",
                    ruleResult: "0",
                    ruleSalience: "1",
                    funId: [],
                    rel: {}
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
                    sceneId: null,
                    ruleCode: "",
                    ruleName: "",
                    ruleHitReason: "",
                    ruleDesc: "",
                    ruleResult: "0",
                    ruleSalience: "1",
                    funId: null,
                    rel: {},
                    logical: "",
                    updateUser: '',
                    updateDate: '',
                    approveUser: '',
                    approveDate: '',
                    createUser: '',
                    createDate: ''
                },
                conditions: [],
                conditionOpt: {
                    type: '0',
                    index: -1
                },
                rules: rules
            },
            approve: {
                show: false,
                form: {
                    ruleId: null,
                    ruleStatus: '',
                    approveRemark: ''
                },
                rules: {
                    ruleStatus: [
                        { required: true, message: '请选择审批状态', trigger: 'change' }
                    ]
                }
            },
            importRule: {
                show: false,
                form: {
                    ruleGroup: '',
                    index: null,
                    ruleId: '',
                    ruleName: null,
                },
                rules: {
                    ruleId: [
                        { type: 'number', required: true, message: '请选择导入的规则', trigger: 'change' }
                    ],
                    ruleGroup: [
                        { type: 'string', required: true, message: '请选择分组', trigger: 'blur' }
                    ]
                }
            },
            variableCalTree: null,
            variableCalMap: {},
            variableCalParams: {
                loading: false,
                items: null
            },
            variableDimTree: null,
            variableDimTreeRight: null,
            variableDimMap: {},
            ruleResultMap: {},
            ruleStatusMap: {
                "0": "待审核",
                "1": "审核通过",
                "2": "审核失败"
            },
            ruleStatusSelectMap: {
                "1": "审核通过",
                "2": "审核失败"
            },
            ruleEnableMap: {
                '1': '启用',
                '0': '停用'
            },
            ruleSalienceMap: {
                1: '1(低)',
                2: '2',
                3: '3',
                4: '4',
                5: '5',
                6: '6',
                7: '7',
                8: '8',
                9: '9',
                10: '10(高)'
            },
            conditionOperMap: {
                '==': '等于',
                '!=': '不等于',
                '>': '大于',
                '>=': '大于或等于',
                '<': '小于',
                '<=': '小于或等于',
                'contains': '包含',
                'not contains': '不包含',
                'matches': '匹配',
                'not matches': '不匹配'
            },
            rightTypeMap: {
                '1': '常量',
                '2': '基础变量',
                '4': '字典'
            },
            dictRightMap: {
                'true': '是',
                'false': '否',
                '': '空'
            }
        };
    },
    mounted() {
        this.userInfo = bsmp.util.getUserInfo();
        this.getSceneList();
        this.getRuleResult();
        this.getVariableCalList();
        this.getVariableDimTree();
        this.getGroupList();
    },
    computed: {
        optAuth() {
            return bsmp.util.mapAuth({
                search: "business_config_rules_list",
                add: "business_config_rules_add",
                edit: "business_config_rules_edit",
                delete: "business_config_rules_delete",
                approve: "business_config_rules_approve",
                enable: "business_config_rules_enable",
                import: "business_config_rules_import",
                scene_list: "business_config_rules_scene_list",
                scene_add: "business_config_rules_scene_add",
                scene_edit: "business_config_rules_scene_edit",
                scene_del: "business_config_rules_scene_delete",
                scene_api: "business_config_rules_variable_params",
                variable_cal_list: "business_config_rules_variable_cal_list",
                variable_cal_params: "business_config_rules_variable_cal_params",
                variable_dim_tree: "business_config_rules_variable_dim_tree",
                condition_add: "business_config_rules_condition_add",
                condition_edit: "business_config_rules_condition_edit",
                condition_delete: "business_config_rules_condition_delete",
                condition_list: "business_config_rules_condition_list",
                condition_changeseq: "business_config_rules_condition_changeseq",
                condition_logical: "business_config_rules_condition_logical"
            });
        },
        company() {
            return bsmp.util.getCompany();
        },
        loginUser() {
            return bsmp.util.getUserInfo();
        }
    },
    watch: {
        company: function(company) {
            if (this.userInfo.companyId === "ALL" && company) {

            }
        },
        loginUser: function(loginUser) {
            if (loginUser && loginUser.loginName) {
                this.userInfo = bsmp.util.getUserInfo();
            }
        }
    },
    methods: {
        ruleSalienceFmt(row) {
            return typeof row.ruleSalience !== 'undefined' ? this.ruleSalienceMap[row.ruleSalience] : "";
        },
        ruleResultFmt(row) {
            return typeof row.ruleResult !== 'undefined' ? this.ruleResultMap[row.ruleResult] : "";
        },
        ruleStatusFmt(row) {
            return typeof row.ruleStatus !== 'undefined' ? this.ruleStatusMap[row.ruleStatus] : "";
        },
        ruleEnableFmt(row) {
            return typeof row.ruleEnable !== 'undefined' ? this.ruleEnableMap[row.ruleEnable] : "";
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
        changeCondition(type, index) {
            if (type === 1) {
                // 新增
                this.edit.conditions.push({
                    conditionLeft: [],
                    conditionOper: '==',
                    rightType: '1',
                    conditionRight: '',
                    conditionRights: [],
                    dictRight: ''
                });
                this.edit.conditionOpt.index = this.edit.conditions.length - 1;
                this.edit.conditionOpt.type = '1';
            } else {
                if (this.edit.conditionOpt.type === '1' && this.edit.conditionOpt.index !== index) {
                    this.$message.warning("请先完成新增条件操作！");
                    return;
                }

                this.edit.conditionOpt.index = index;
                if (this.edit.conditions[index].conditionId) {
                    this.deleteCondition(this.edit.form.ruleId, this.edit.conditions[index].conditionId);
                } else {
                    this.edit.conditions.splice(index, 1);
                    this.edit.conditionOpt.type = '0';
                }
            }
        },
        saveCondition(index) {
            if (this.edit.conditionOpt.type === '1' && this.edit.conditionOpt.index !== index) {
                this.$message.warning("请先完成新增条件操作！");
                return;
            }

            let condition = this.edit.conditions[index];

            if (!condition.conditionLeft.length) {
                this.$message.warning("请选择源！");
                return;
            }

            let params = {
                ruleId: this.edit.form.ruleId,
                conditionLeft: condition.conditionLeft[1],
                conditionOper: condition.conditionOper,
                rightType: condition.rightType
            };

            if (params.rightType === '2') {
                if (!condition.conditionRights.length) {
                    this.$message.warning("请选择基础变量！");
                    return;
                } else {
                    params.conditionRight = condition.conditionRights[1];
                }
            } else if (params.rightType === '1') {
                if (!condition.conditionRight) {
                    this.$message.warning("请输入变量！");
                    return;
                } else {
                    params.conditionRight = condition.conditionRight;
                }
            }
            if (params.rightType === '4') {
                // if (!condition.dictRight) {
                //     this.$message.warning("请选择字典！");
                //     return;
                // } else {
                     params.conditionRight = condition.dictRight;
                // }
            }

            if (condition.conditionId) {
                // 编辑
                params.conditionId = condition.conditionId;
                api.editCondition(params).then(res => {
                    let data = res.data;
                    if (data && data.code === "0") {
                        this.$message({
                            type: "success",
                            message: "编辑成功!"
                        });
                        this.edit.conditionOpt.type = '0';
                        this.query();

                        // 记录日志
                        bsmp.log({
                            component: "risk_system",
                            type: "edit",
                            content: `[Condition] params: ${JSON.stringify(params)}`
                        });
                    }
                });
            } else {
                // 新增
                api.saveCondition(params).then(res => {
                    let data = res.data;
                    if (data && data.code === "0") {
                        this.$message({
                            type: "success",
                            message: "新增成功!"
                        });

                        if (data.data) {
                            this.edit.conditions[index].conditionId = data.data.conditionId;
                            this.edit.conditions[index].conditionName = data.data.conditionName;
                        }
                        this.edit.conditionOpt.type = '0';
                        this.query();

                        // 记录日志
                        bsmp.log({
                            component: "risk_system",
                            type: "add",
                            content: `[Condition] params: ${JSON.stringify(params)}`
                        });
                    }
                });
            }


        },
        deleteCondition(ruleId, conditionId) {
            this.$confirm("确定要删除条件?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                // 删除
                api.removeCondition({ ruleId, conditionId }).then(res => {
                    let data = res.data;
                    if (data && data.code === "0") {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });

                        this.edit.conditions.splice(this.edit.conditionOpt.index, 1);
                        this.edit.conditionOpt.type = '0';
                        this.query();

                        // 记录日志
                        bsmp.log({
                            component: "risk_system",
                            type: "delete",
                            content: `[Condition] params: ${JSON.stringify({
                ruleId,
                conditionId
              })}`
                        });
                    }
                });
            }).catch(e => {});
        },
        handleCondition(items) {
            return items.map(item => {
                item.rightType = item.rightType + '';
                if (this.variableDimMap[item.conditionLeft] && this.variableDimMap[item.conditionLeft].super) {
                    item.conditionLeft = [this.variableDimMap[item.conditionLeft].super, parseInt(item.conditionLeft, 10)];
                } else {
                    item.conditionLeft = [];
                }

                if (item.rightType === '2' && this.variableDimMap[item.conditionRight] &&
                    this.variableDimMap[item.conditionRight].super) {
                    item.conditionRights = [this.variableDimMap[item.conditionRight].super, parseInt(item.conditionRight, 10)];
                } else {
                    item.conditionRights = [];
                }

                if (item.rightType === '4') {
                    item.dictRight = item.conditionRight;
                } else {
                    item.dictRight = '';
                }

                return item;
            });
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

            if (this.edit.form.funId) {
                this.edit.form.funId = [this.variableCalMap[this.edit.form.funId].super, this.edit.form.funId];
            } else {
                this.edit.form.funId = [];
            }

            this.edit.tab = 'info';
            this.changeEditFunId();

            // 条件列表
            this.edit.conditions = [];
            api.getConditionList({ ruleId: this.edit.form.ruleId }).then(res => {
                let data = res.data;
                if (data && data.code === "0" && data.data && data.data.length) {
                    this.edit.conditions = this.handleCondition(data.data);
                }
            }).catch(e => {

            });

            this.edit.conditionOpt = {
                type: '0',
                index: -1
            };

            this.edit.show = true;
        },
        changeEditFunId() {

            if (!this.edit.form.funId || !this.edit.form.funId.length) {
                this.variableCalParams.items = null;
                return;
            }

            let promise = this.getVariableCalParams(this.edit.form.funId[1]);
            if (promise) {

                // 初始化数组
                let relMap = {};
                promise.then((res) => {
                    for (let key in this.variableCalParams.items) {
                        relMap[key] = [];
                    }
                });

                if (typeof this.edit.form.rel === 'string') {
                    let rels = this.edit.form.rel.split('|');
                    rels.forEach(rel => {
                        let ids = rel.split(',');
                        if (ids.length > 1) {
                            relMap[ids[0]] = [this.variableDimMap[ids[1]].super, parseInt(ids[1], 10)];
                        }
                    });
                }

                this.edit.form.rel = Object.assign({}, relMap);
            }
        },
        submitEditForm() {
            this.$refs["editForm"].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.edit.form);

                    let rels = [];
                    for (let key in params.rel) {
                        if (params.rel[key].length) {
                            rels.push(key + ',' + params.rel[key][1]);
                        }
                    }
                    if (rels.length) {
                        params.rel = rels.join('|');
                    }

                    if (params.funId && params.funId.length) {
                        params.funId = params.funId[1];
                    }

                    // 编辑
                    api.editRule(params).then(res => {
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
                                component: "risk_system",
                                type: "modify",
                                content: `[Rules] params: ${JSON.stringify(params)}`
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        showDialog(type, row) {
            if (this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields) {
                this.$refs['ruleForm'].resetFields();
            }

            this.dialog.form = {
                sceneId: null,
                ruleName: "",
                ruleDesc: "",
                ruleResult: "0",
                ruleSalience: "1",
                funId: [],
                rel: {}
            };
            this.changeAddFunId();

            this.dialog.show = true;
        },
        showImport(type, row) {
            // if (this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields) {
            //     this.$refs['ruleForm'].resetFields();
            // }

            // this.dialog.form = {
            //     sceneId: null,
            //     ruleName: "",
            //     ruleDesc: "",
            //     ruleResult: "0",
            //     ruleSalience: "1",
            //     funId: [],
            //     rel: {}
            // };
            // this.changeAddFunId();

            this.importRule.show = true;
        },
        changeAddFunId() {
            this.dialog.form.rel = {};
            if (!this.dialog.form.funId || !this.dialog.form.funId.length) {
                this.variableCalParams.items = null;
                return;
            }
            let promise = this.getVariableCalParams(this.dialog.form.funId[1]);
            if (promise) {
                promise.then((res) => {
                    for (let key in this.variableCalParams.items) {
                        this.dialog.form.rel[key] = [];
                    }
                });
            }
        },
        submitForm() {
            this.$refs["ruleForm"].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.dialog.form);

                    let rels = [];
                    for (let key in params.rel) {
                        if (params.rel[key].length) {
                            rels.push(key + ',' + params.rel[key][1]);
                        }
                    }
                    if (rels.length) {
                        params.rel = rels.join('|');
                    }
                    params.sceneId = this.selectedScene.id;

                    if (params.funId && params.funId.length) {
                        params.funId = params.funId[1];
                    }

                    // 新增
                    api.saveRule(params).then(res => {
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
                                content: `[Rules] params: ${JSON.stringify(params)}`
                            });
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        deleteItem(id) {
            this.$confirm("确定要删除该条规则记录?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                // 删除
                api.removeRule({ ruleId: id }).then(res => {
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
                            content: `[Rule] params: ${JSON.stringify({
                id: id,
                action: "delete"
              })}`
                        });
                    }
                });
            }).catch(e => {});
        },
        showApproveDialog(row) {
            if (this.$refs['approveForm'] && this.$refs['approveForm'].resetFields) {
                this.$refs['approveForm'].resetFields();
            }

            this.approve.form = {
                ruleId: row.ruleId,
                ruleStatus: '',
                approveRemark: ''
            };
            this.approve.show = true;
        },
        changeApproveStatus() {
            if (this.approve.form.ruleStatus === '2') {
                this.approve.rules = {
                    ruleStatus: [
                        { required: true, message: '请选择审批状态', trigger: 'change' }
                    ],
                    approveRemark: [
                        { required: true, message: '请输入审批备注', trigger: 'blur' }
                    ]

                }
            } else {
                this.approve.rules = {
                    ruleStatus: [
                        { required: true, message: '请选择审批状态', trigger: 'change' }
                    ]

                }
            }
            this.$refs["approveRemark"].resetField();
        },
        submitApproveForm() {
            this.$refs["approveForm"].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.approve.form);
                    api.approveRule(params).then(res => {
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
                                content: `[Rule] params: ${JSON.stringify(params)}`
                            });
                        }
                    });
                }
            });
        },
        enableRule(id, enable) {
            let type = enable === 1 ? '启用' : '停用';
            this.$confirm(`确定要${type}该条规则记录?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                // 删除
                api.enableRule({ ruleId: id, ruleEnable: enable }).then(res => {
                    let data = res.data;
                    if (data && data.code === "0") {
                        this.$message({
                            type: "success",
                            message: `${type}成功!`
                        });
                        this.query();

                        // 记录日志
                        bsmp.log({
                            component: "risk_system",
                            type: "enable",
                            content: `[Rule] params: ${JSON.stringify({
                id,
                enable
              })}`
                        });
                    }
                });
            }).catch(e => {});
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
        showSceneDialog(node, type) {
            if (this.$refs["sceneForm"] && this.$refs["sceneForm"].resetFields) {
                this.$refs["sceneForm"].resetFields();
            }
            if(node != null){
                this.scene.dialog.element = 0;
            } else{
                this.scene.dialog.element = 1;
            }

            this.scene.dialog.type = type;
            if (type === 2) {
                this.scene.dialog.title = '编辑场景';
                this.scene.dialog.node = null;

                this.scene.dialog.form = {
                    sceneIdentify: node.identify,
                    sceneId: node.id,
                    sceneName: node.label,
                    sceneDesc: node.desc,
                    customizedResult: node.result
                };
            } else {
                this.scene.dialog.title = '新增场景';
                this.scene.dialog.node = node;

                this.scene.dialog.form = {
                    sceneName: "",
                    sceneDesc: "",
                    customizedResult: "0"
                };
            }

            this.scene.dialog.show = true;
        },
        submitSceneForm() {
            if (!this.getCompanyId()) {
                this.$message.warning("未获取到公司ID");
                return;
            }
            this.$refs["sceneForm"].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.scene.dialog.form);

                    if (this.scene.dialog.type === 1) {

                        // 新增
                        if (this.scene.dialog.node) {
                            params.sceneEl = 0;
                            params.sceneParent = this.scene.dialog.node.id;
                        } else {
                            params.sceneEl = 1;
                        }

                        params.bu = this.getCompanyId();
                        api.saveScene(params).then(res => {
                            let data = res.data;
                            if (data && data.code === "0") {
                                this.$message({
                                    type: "success",
                                    message: "新增成功!"
                                });

                                this.scene.dialog.show = false;
                                this.getSceneList();

                                // 记录日志
                                bsmp.log({
                                    component: "risk_system",
                                    type: "add",
                                    content: `[Scene] params: ${JSON.stringify(params)}`
                                });
                            }
                        });
                    } else {
                        // 编辑
                        api.editScene(params).then(res => {
                            let data = res.data;
                            if (data && data.code === "0") {
                                this.$message({
                                    type: "success",
                                    message: "编辑成功!"
                                });

                                this.scene.dialog.show = false;
                                this.getSceneList();

                                // 记录日志
                                bsmp.log({
                                    component: "risk_system",
                                    type: "edit",
                                    content: `[Scene] params: ${JSON.stringify(params)}`
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
        deleteSceneItem(id) {
            this.$confirm("确定要删除该条场景记录?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                // 删除
                api.removeScene({ sceneId: id }).then(res => {
                    let data = res.data;
                    if (data && data.code === "0") {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.getSceneList();

                        // 记录日志
                        bsmp.log({
                            component: "risk_system",
                            type: "delete",
                            content: `[Scene] params: ${JSON.stringify({
                id: id,
                action: "delete"
              })}`
                        });
                    }
                });
            }).catch(e => {});
        },

        query() {
            let params = bsmp.util.deleteBlank(this.search);
            params = Object.assign({}, params, this.table.pager);
            if (this.selectedScene && this.selectedScene.type === 'func') {
                params.sceneId = this.selectedScene.id;
            } else {
                return;
            }

            if (params.createDate && params.createDate.length && params.createDate[0] && params.createDate[1]) {
                params.createDateStart = bsmp.util.formatDate.format(params.createDate[0], "yyyy-MM-dd hh:mm:ss");
                params.createDateEnd = bsmp.util.formatDate.format(params.createDate[1], "yyyy-MM-dd") + " 23:59:59";
            }
            delete params.createDate;

            this.loading = true;
            api.getRuleList(params).then(res => {
                this.loading = false;
                let data = res.data;
                if (data && data.code === "0") {
                    this.table.items = data.data;
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
                ruleResult: "",
                ruleName: "",
                ruleStatus: "",
                createDate: null
            };
        },
        handleNodeClick(data) {
            this.selectedScene = data;

            if (this.queryTimer) {
                clearTimeout(this.queryTimer);
                this.queryTimer = null;
            }
            this.queryTimer = setTimeout(() => {
                this.query();
            }, 500);
        },
        renderContent(h, { node, data, store }) {
            return this.$createElement("sceneTreeItem", {
                props: {
                    node,
                    type: 1
                },
                on: {
                    edit: data => {
                        this.showSceneDialog(data.data, 2);
                    },
                    plus: data => {
                        this.showSceneDialog(data.data, 1);
                    },
                    trash: data => {
                        this.deleteSceneItem(data.data.id);
                    },
                    getApi: data => {
                        this.api.show = true;
                        this.api.form = {
                            apiUrl: '',
                            method: '',
                            header: null,
                            params: null
                        };
                        this.getVariableParams(data.data.identify);
                    }
                }
            });
        },
        getVariableParams(scene) {
            this.api.loading = true;
            return api.getVariableParams({ scene }).then(res => {
                this.api.loading = false;
                let data = res.data;
                if (data && data.code === "0") {
                    this.api.form = Object.assign({}, data.data);
                }
            });
        },
        getVariableCalList() {
            return api.getVariableCalList({ funType: 1 }).then(res => {
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
                return api.getVariableCalParams({ funId: funId }).then(res => {
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
        getVariableDimTree() {
            return api.getVariableDimTree({ needDerivative: 1 }).then(res => {
                let data = res.data;
                if (data && data.code === "0") {
                    if (data.data) {
                        this.variableDimTree = [];
                        this.variableDimTreeRight = [];
                        let node = null,
                            rightNode = null;
                        data.data.forEach(item => {
                            node = {
                                value: item.value,
                                label: item.desc,
                                children: []
                            };

                            if (item.prefix !== 'V_DERIVATIVE') {
                                rightNode = {
                                    value: item.value,
                                    label: item.desc,
                                    children: []
                                };
                            } else {
                                rightNode = null;
                            }

                            if (item.varList && item.varList.length) {
                                item.varList.forEach(i => {
                                    node.children.push({
                                        value: i.variableId,
                                        label: i.variableName,
                                    });

                                    if (rightNode) {
                                        rightNode.children.push({
                                            value: i.variableId,
                                            label: i.variableName,
                                        });
                                    }

                                    // map 方便查找编辑显示
                                    this.variableDimMap[i.variableId] = {
                                        value: i.variableId,
                                        label: i.variableName,
                                        super: item.value
                                    };
                                });
                            }

                            this.variableDimTree.push(node);
                            if (rightNode) {
                                this.variableDimTreeRight.push(rightNode);
                            }
                        });
                        console.log(JSON.stringify(this.variableDimTree));
                            console.log(JSON.stringify(this.variableDimTreeRight));
                    }
                }
            });
        },
        getRuleBaseList(ruleGroup){
            let params = bsmp.util.deleteBlank(this.search);
            params = Object.assign({}, params, this.table.pager);
            params.ruleBaseType = 1;
            params.ruleStatus = 1;
            params.ruleGroup = ruleGroup;

            this.loading = true;
            api.getRuleList(params).then(res => {
                this.loading = false;
                let data = res.data;
                if (data && data.code === "0") {
                    this.ruleBaseList.items = data.data;
                }
            }).catch(e => {
                this.loading = false;
            });
        },
        importRuleForm() {
            this.$refs["importRuleForm"].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.importRule.form);
                    params.sceneId = this.selectedScene.id;
                    api.importRule(params).then(res => {
                        let data = res.data;
                        if (data && data.code === "0") {
                            this.$message({
                                type: "success",
                                message: "导入成功!"
                            });
                            this.importRule.show = false;
                            this.query();

                            // 记录日志
                            bsmp.log({
                                component: "risk_system",
                                type: "importRule",
                                content: `[Rule] params: ${JSON.stringify(params)}`
                            });
                        }
                    });
                }
            });
        },
        getRuleResult() {
            return api.getRuleInfoResult().then(res => {
                let data = res.data;
                if (data && data.code === "0") {
                    let items = data.data;
                    items.forEach(item => {
                        this.ruleResultMap[item.code] = item.result;
                    });
                }
            });
        },
        getSceneList() {
            this.scene.loading = true;
            return api.getSceneList().then(res => {
                this.scene.loading = false;
                let data = res.data;
                if (data && data.code === "0") {
                    let items = data.data;
                    let nodes = [],
                        node = null;

                    items.forEach(item => {
                        node = {
                            id: item.sceneId,
                            value: item.sceneId,
                            label: item.sceneName,
                            identify: item.sceneIdentify,
                            desc: item.sceneDesc,
                            type: "menu",
                            children: []
                        };

                        if (item.children && item.children.length) {
                            node.children = item.children.map(i => {
                                return {
                                    id: i.sceneId,
                                    value: i.sceneId,
                                    label: i.sceneName,
                                    identify: i.sceneIdentify,
                                    desc: i.sceneDesc,
                                    result: i.customizedResult,
                                    type: "func"
                                };
                            });
                        }

                        nodes.push(node);
                    });
                    this.scene.items = nodes;

                    this.selectedScene = null;
                }
            }).catch(e => {
                console.error(e);
            });
        },
        /**
         * 调整顺序
         * @param  {[type]} index 当前索引
         * @param  {[type]} type  0：上调 1：下调
         */
        changeConditionSeq(index, type) {
            let params = null

            if (type) {
                params = {
                    conditionId1: this.edit.conditions[index + 1].conditionId,
                    conditionId2: this.edit.conditions[index].conditionId
                }
            } else {
                params = {
                    conditionId1: this.edit.conditions[index - 1].conditionId,
                    conditionId2: this.edit.conditions[index].conditionId
                }
            }
            return api.changeConditionSeq(params)
                .then(res => res.data)
                .then(res => {
                    this.edit.conditions = [];
                    return api.getConditionList({ ruleId: this.edit.form.ruleId }).then(res => {
                        let data = res.data;
                        this.edit.conditions = this.handleCondition(data.data);
                    })
                })
                .then(res => {
                    this.edit.conditionOpt = {
                        type: '0',
                        index: -1
                    };
                })
        },
        /**
         * 逻辑表达式的调整  ---baker
         * @param  {[type]} ruleId 规则ID
         * @param  {[type]} logical  逻辑语句
         */
        ruleLogicSetting(ruleId, logical) {
            let params = null
            params = {
                ruleId: ruleId,
                logicalString: logical
            }
            return api.logicalSetting(params)
                    .then(res => {
                        let data = res.data;
                        if (data && data.code === "0") {
                            this.$message({
                                type: "success",
                                message: "条件逻辑保存成功!"
                            });
                            this.edit.conditionOpt.type = '0';
                            this.query();

                            // 记录日志
                            bsmp.log({
                                component: "risk_system",
                                type: "modify",
                                content: `[Rules] params: ${JSON.stringify(params)}`
                            });
                        }
                    })
                    // .then(res => {
                    //     this.edit.conditionOpt = {
                    //         type: '0',
                    //         index: -1
                    //     };
                    // })
        },
        showRuleDialog(type) {
            this.$refs["importRuleForm"].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.importRule.form);
                
                    for(var i in this.ruleBaseList.items){
                    // console.log(this.options[i].text)
                        if(this.ruleBaseList.items[i].ruleId == this.importRule.form.ruleId){
                            params.ruleBaseIndex = i;
                        }
                    }

                    if (this.$refs['editForm'] && this.$refs['editForm'].resetFields) {
                        this.$refs['editForm'].resetFields();
                    }

                    this.edit.type = type;
                    this.edit.title = type === 1 ? '编辑' : '详情';

                    let form = Object.assign({}, this.ruleBaseList.items[params.ruleBaseIndex]);
                    this.edit.form = form;

                    if (this.edit.form.funId) {
                        this.edit.form.funId = [this.variableCalMap[this.edit.form.funId].super, this.edit.form.funId];
                    } else {
                        this.edit.form.funId = [];
                    }

                    this.edit.tab = 'info';
                    this.changeEditFunId();

                    // 条件列表
                    this.edit.conditions = [];
                    api.getConditionList({ ruleId: this.edit.form.ruleId }).then(res => {
                        let data = res.data;
                        if (data && data.code === "0" && data.data && data.data.length) {
                            this.edit.conditions = this.handleCondition(data.data);
                        }
                    }).catch(e => {

                    });

                    this.edit.conditionOpt = {
                        type: '0',
                        index: -1
                    };

                    this.edit.show = true;
                }
            });
        },
        getGroupList(){
            return api.getGroupList().then(res => {
                let data = res.data;
                if (data && data.code === "0") {
                    if (data.data) {
                        this.groupList = data.data;
                    }
                }
            });
        },
        selectRuleGroup(){
            let group = this.importRule.form.ruleGroup;
            this.getRuleBaseList(group);
        }
    }
};

// 表单规则
let rules = {
    ruleName: [
        { required: true, message: "请输入规则名称", trigger: "blur" }
    ],
    ruleHitReason: [
        { required: true, message: "请输入命中原因", trigger: "blur" }
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

</style>
