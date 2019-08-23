<template>
    <div>
        <query-panel class="query-panel">
            <el-form :inline="true" :model="params" class="query-panel">
                <el-form-item label="业务代码/支付渠道标记">
                    <el-input v-model="params.code" clearable></el-input>
                </el-form-item>
                <el-form-item label="扩展代码/验证标记">
                    <el-input v-model="params.extCode" clearable></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker v-model="createDate" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" clearable>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="params.status" placeholder="请选择" clearable>
                        <el-option key="all" label="所有" value=""></el-option>
                        <el-option :key="0" label="待审批" :value="0"></el-option>
                        <el-option :key="1" label="审批通过" :value="1"></el-option>
                        <el-option :key="2" label="审批失败" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="query" v-if="optAuth.list">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="showAddDialog" v-if="optAuth.add">新增</el-button>
                </el-form-item>
            </el-form>
        </query-panel>
        <el-table highlight-current-row :data="list" border stripe class="list-table">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-width="160px" label-position="left">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="业务结果/名称描述：">{{ props.row.result }}</el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="业务代码/支付渠道标记：">{{ props.row.code }}</el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="扩展代码/验证标记：">{{ props.row.extCode }}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="支付渠道有效期(小时）：">{{ props.row.codeExpire }}</el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="验证标记有效期(小时）：">{{ props.row.extCodeExpire }}</el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="状态：">{{ formatStatus(props.row.status) }}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="审批人：">{{ props.row.approveUser }}</el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="审批时间：">{{ props.row.approveDate }}</el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="审批备注：">{{ props.row.remark }}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="创建人：">{{ props.row.createUser }}</el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="创建时间：">{{ props.row.createDate }}</el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="修改人：">{{ props.row.updateUser }}</el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="修改时间：">{{ props.row.updateDate }}</el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="index" width="60" class-name="text-center"></el-table-column>
            <el-table-column label="业务结果/名称描述" prop="result"></el-table-column>
            <el-table-column label="业务代码/支付渠道标记" prop="code"></el-table-column>
            <el-table-column label="扩展代码/验证标记" prop="extCode"></el-table-column>
            <el-table-column label="支付渠道有效期(小时）" prop="codeExpire"></el-table-column>
            <el-table-column label="验证标记有效期(小时）" prop="extCodeExpire"></el-table-column>
            <el-table-column label="状态" prop="status" :formatter="formatStatusRender"></el-table-column>
            <el-table-column label="创建时间" prop="createDate"></el-table-column>
            <el-table-column label="操作" width="130">
                <template slot-scope="scope">
                    <el-button title="编辑" v-if="optAuth.edit" size="mini" @click="showEditDialog(scope.row)">
                        <i class="icon-edit-square"></i>
                    </el-button>
                    <el-button title="审批" v-if="optAuth.approve && scope.row.status != 1" size="mini" @click="showApproveDialog(scope.row.id)">
                        <i class="icon-ok-circled"></i>
                    </el-button>
                    <el-button title="删除" v-if="optAuth.delete && scope.row.status != 1" size="mini" @click="deleteRuleResult(scope.row.id)">
                        <i class="icon-trash-empty"></i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pull-right"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="params.pageNo"
                   :page-sizes="pageSizes"
                   :page-size="params.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="listTotal">
        </el-pagination>
        <el-dialog title="新增" v-model="addDialogShow" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form :model="addParams" label-width="170px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="业务结果/名称描述：" required>
                            <el-input v-model="addParams.result"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="业务代码/支付渠道标记：" required>
                            <el-input v-model="addParams.code"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="有效期：">
                            <el-input v-model="addParams.codeExpire"><template slot="append">小时</template></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="扩展代码/验证标记：">
                            <el-input v-model="addParams.extCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="有效期：">
                            <el-input v-model="addParams.extCodeExpire"><template slot="append">小时</template></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item style="text-align: right;">
                    <el-button type="primary" @click="createRuleResult" :disabled="saving">保 存</el-button>
                    <el-button :disable="saving" @click="addDialogShow = false" :disabled="saving">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改" v-model="editDialogShow" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form :model="editParams" label-width="170px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="业务结果/名称描述：" required>
                            <el-input v-model="editParams.result"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="业务代码/支付渠道标记：" required>
                            <el-input v-model="editParams.code"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="有效期：">
                            <el-input v-model="editParams.codeExpire"><template slot="append">小时</template></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="扩展代码/验证标记：">
                            <el-input v-model="editParams.extCode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="有效期：">
                            <el-input v-model="editParams.extCodeExpire"><template slot="append">小时</template></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item style="text-align: right;">
                    <el-button type="primary" @click="saveRuleResult" :disabled="saving">保 存</el-button>
                    <el-button :disable="saving" @click="editDialogShow = false" :disabled="saving">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="审批" v-model="approveDialogShow" size="tiny" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form :model="approveParams" label-width="120px" class="dialog-form">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="审批状态" required>
                            <el-select v-model="approveParams.status" placeholder="审批状态">
                                <el-option key="1" label="审批通过" value="1"></el-option>
                                <el-option key="2" label="审批失败" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="审批备注" :required="approveParams.status === '2'">
                            <el-input v-model="approveParams.remark" type="textarea"></el-input>
                            <div :style="'color:red;visibility:' + (approveParams.status === '2' && approveParams.remark.trim() == '' ? 'visible' : 'hidden')">请输入审批备注</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="saveApprove" type="primary" :disabled="saving || !canSaveApprove">保 存</el-button>
                <el-button @click="approveDialogShow = false" :disabled="saving">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import api from "../../api";
import bsmp  from "bsmp_main";

export default {
    data() {
        return {
            saving: false,
            addDialogShow: false,
            editDialogShow: false,
            approveDialogShow: false,
            createDate: [],
            pageSizes: [10, 20, 50, 100, 200],
            list: [],
            listTotal: 0,
            params: {
                code: "",
                extCode: "",
                status: "",
                pageNo: 1,
                pageSize: 10
            },
            addParams: {
                code: "",
                result: "",
                extCode: "",
                codeExpire: "",
                extCodeExpire: ""
            },
            editParams: {
                id: "",
                code: "",
                result: "",
                extCode: "",
                codeExpire: "",
                extCodeExpire: ""
            },
            approveParams: {
                ids: "",
                status: "",
                remark: ""
            }
        }
    },
    created() {
        this.query();
    },
    computed: {
        optAuth() {
            return bsmp.util.mapAuth({
                "list": "risk_system_policy_rule_result_list",
                "add": "risk_system_policy_rule_result_add",
                "edit": "risk_system_policy_rule_result_edit",
                "delete": "risk_system_policy_rule_result_delete",
                "approve": "risk_system_policy_rule_result_approve",
            })
        },
        canSaveApprove() {
            return this.approveParams.status != '2' || this.approveParams.remark.trim() != "";
        }
    },
    methods: {
        query() {

            if (this.createDate[0] != null && this.createDate[1] != null) {
                this.params.createDateStart = this.formatDateTime(this.createDate[0]);
                this.params.createDateEnd = this.formatDateTime(this.createDate[1]);
            } else {
                this.params.createDateStart = "";
                this.params.createDateEnd = "";
            }

            this.params.code = this.params.code.trim();
            this.params.extCode = this.params.extCode.trim();

            return api.getRuleResultList(this.params)
                .then(res => res.data)
                .then(res => {
                    if (res.code != 0) {
                        return;
                    }

                    this.list = res.data.data;
                    this.listTotal = res.data.total;
                })
        },
        formatDateTime(date) {
            return `${ date.getFullYear() }-${ (date.getMonth() + 1).toString().padStart(2, '0') }-${ date.getDate().toString().padStart(2, '0') } ${ date.getHours().toString().padStart(2, '0') }:${ date.getMinutes().toString().padStart(2, '0') }:${ date.getSeconds().toString().padStart(2, '0') }`;
        },
        showAddDialog() {
            this.addParams = {
                code: "",
                result: "",
                extCode: "",
                codeExpire: "",
                extCodeExpire: ""
            }

            this.addDialogShow = true;
        },
        createRuleResult() {
            Object.keys(this.addParams).forEach(key => {
                this.addParams[key] = (this.addParams[key] || "").toString().trim();
            });

            if (this.addParams.code.length == 0) {
                this.$message.error("请输入业务代码/支付渠道标记");
                return;
            }

            if (this.addParams.result.length == 0) {
                this.$message.error("请输入业务结果/名称描述");
                return;
            }

            this.saving = true;

            return api.addRuleResul(this.addParams)
                .then(res => res.data)
                .then(res => {
                    this.saving = false;

                    if (res.code != 0) {
                        return;
                    }

                    this.$message.success("保存成功");
                    this.query();
                    this.addDialogShow = false;
                });

        },
        showEditDialog(ruleResult) {
            this.editParams = {
                id: ruleResult.id,
                code: ruleResult.code,
                result: ruleResult.result,
                extCode: ruleResult.extCode,
                codeExpire: ruleResult.codeExpire,
                extCodeExpire: ruleResult.extCodeExpire
            }

            this.editDialogShow = true;
        },
        saveRuleResult() {
            Object.keys(this.editParams).forEach(key => {
                this.editParams[key] = (this.editParams[key] || "").toString().trim();
            });

            if (this.editParams.code.length == 0) {
                this.$message.error("请输入业务代码/支付渠道标记");
                return;
            }

            if (this.editParams.result.length == 0) {
                this.$message.error("请输入业务结果/名称描述");
                return;
            }

            this.saving = true;

            return api.editRuleResul(this.editParams)
                .then(res => res.data)
                .then(res => {
                    this.saving = false;

                    if (res.code != 0) {
                        return;
                    }

                    this.$message.success("保存成功");
                    this.query();
                    this.editDialogShow = false;
                });
        },
        deleteRuleResult(id) {
            this.$confirm("请确认此配置未被规则使用，确定要删除吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                return api.deleteRuleResul({ id: id })
                    .then(res => res.data)
                    .then(res => {
                        if (res.code != 0) {
                            return;
                        }

                        this.$message.success("删除成功");
                        this.query();
                    });
            });
        },
        showApproveDialog(id) {
            this.approveParams = {
                ids: id,
                status: "",
                remark: ""
            }

            this.approveDialogShow = true;
        },
        saveApprove() {
            return api.approveRuleResul(this.approveParams)
                .then(res => res.data)
                .then(res => {
                    if (res.code != 0) {
                        return;
                    }

                    this.$message.success("审批成功");
                    this.query();
                    this.approveDialogShow = false;
                });
        },
        formatStatusRender(row, column) {
            return this.formatStatus(row.status);
        },
        formatStatus(status) {
            let arr = ['待审批', '审批通过', "审批失败"]
            return arr[status];
        },
        handleSizeChange(size) {
            this.params.pageSize = size;
            this.query();
        },
        handleCurrentChange(pageNo) {
            this.params.pageNo = pageNo;
            this.query();
        }
    }
}

</script>
<style scoped>
.query-panel {
    padding: 8px 0 0 10px !important;
}

.list-table {
    width: 100%;
    margin-top: 10px;
}

</style>
<style>
.text-center {
    text-align: center;
}

</style>
