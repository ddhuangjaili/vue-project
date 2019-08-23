<template>
    <div>
        <query-panel>
            <el-form :inline="true" :model="params" class="query-panel">
                <el-form-item>
                    厂家通道：
                    <el-select v-model="params.channel" placeholder="请选择">
                        <el-option key="all" label="全部" value=""></el-option>
                        <el-option v-for="item in channelList" :key="item.channel" :label="item.channelName" :value="item.channel">
                        </el-option>
                    </el-select>
                    应用场景：
                    <el-select v-model="params.serviceType" placeholder="请选择">
                        <el-option key="all" label="全部" value=""></el-option>
                        <el-option v-for="item in serviceList" :key="item.serviceType" :label="item.serviceName" :value="item.serviceType">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="query" v-show="optAuth.search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="showAddConfigDialog" v-show="optAuth.add">新增</el-button>
                </el-form-item>
            </el-form>
        </query-panel>
        <el-table highlight-current-row 
            v-loading.body="loading"
            :data="config" 
            border 
            stripe 
            :max-height="height - 100"
            class="list-table">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <div>
                        <!--  style="padding-right:140px;" -->
                        <el-table :data="props.row.configList">
                            <el-table-column label="优先级顺序" prop="sort"></el-table-column>
                            <el-table-column label="通道配置编码" prop="id"></el-table-column>
                            <el-table-column label="验证类型" prop="serviceType"></el-table-column>
                            <el-table-column label="验证类型中文名称" prop="serviceName"></el-table-column>
                            <el-table-column label="验证类型描述" prop="serviceDesc"></el-table-column>
                            <el-table-column label="第三方接口地址" prop="apiUrl"></el-table-column>
                            <el-table-column label="费用" prop="fee"></el-table-column>
                            <el-table-column label="备注信息" prop="remark"></el-table-column>
                            <el-table-column label="操作" width="140">
                                <template slot-scope="scope">
                                    <el-button @click="changeConfigStatus(props.row.configList[scope.$index])" v-if="optAuth.edit && props.row.configList[scope.$index].serviceStatus == 0" title="启用" size="mini"><i class="icon-play"></i></el-button>
                                    <el-button @click="changeConfigStatus(props.row.configList[scope.$index])" v-if="optAuth.edit && props.row.configList[scope.$index].serviceStatus == 1" title="停用" size="mini"><i class="icon-stop"></i></el-button>
                                    <el-button v-if="optAuth.edit" title="编辑" type="info" icon='edit' size="mini" @click="showEditConfigDialog(props.row, scope.$index)"></el-button>
                                    <el-button v-if="optAuth.delete" title="删除" type="danger" icon='delete' size="mini" @click="deleteConfig(props.row, scope.$index)"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="通道名称" prop="channelName"></el-table-column>
            <el-table-column label="通道代码" prop="channel"></el-table-column>
            <el-table-column label="该通道下已配置所有的服务" prop="serviceTotal"></el-table-column>
            <el-table-column label="操作" width="230" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="showDepositDialog(scope.$index)" type="primary" v-show="optAuth.deposit_list">充值详情</el-button>
                    <el-button @click="changeStatus(scope.$index)" v-if="optAuth.edit && config[scope.$index].status == 0" title="全启用" size="mini"><i class="icon-play"></i></el-button>
                    <el-button @click="changeStatus(scope.$index)" v-if="optAuth.edit && config[scope.$index].status == 1" title="全停用" size="mini"><i class="icon-stop"></i></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="新增" v-model="addConfigShow" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form :model="addParams" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="通道代码" required>
                            <el-input v-model="addParams.channel" placeholder="请输入通道代码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="通道名称" required>
                            <el-input v-model="addParams.channelName" placeholder="请输入通道名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="验证类型" required>
                            <el-input v-model="addParams.serviceType" placeholder="请输入验证类型"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="第三方接口地址" required>
                            <el-input v-model="addParams.apiUrl" placeholder="请输入第三方接口地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="token1">
                            <el-input v-model="addParams.token1" placeholder="请输入token1"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="token2">
                            <el-input v-model="addParams.token2" placeholder="请输入token2"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="token3">
                            <el-input v-model="addParams.token3" placeholder="请输入token3"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="token4">
                            <el-input v-model="addParams.token4" placeholder="请输入token4"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="费用">
                            <el-input v-model="addParams.fee"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注信息">
                            <el-input v-model="addParams.remark" placeholder="请输入备注信息"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item style="text-align: right;">
                    <el-button type="primary" @click="createConfig" :disable="saving">保 存</el-button>
                    <el-button :disable="saving" @click="addConfigShow = false">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="编辑" v-model="editConfigShow" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form :model="editParams" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="通道名称">
                            <el-input v-model="editParams.channelName" placeholder="请输入通道名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="第三方接口地址">
                            <el-input v-model="editParams.apiUrl" placeholder="请输入第三方接口地址"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="token1">
                            <el-input v-model="editParams.token1" placeholder="请输入token1"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="token2">
                            <el-input v-model="editParams.token2" placeholder="请输入token2"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="token3">
                            <el-input v-model="editParams.token3" placeholder="请输入token3"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="token4">
                            <el-input v-model="editParams.token4" placeholder="请输入token4"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="优先级顺序">
                            <el-input-number v-model="editParams.sort" :min="0" label="优先级顺序"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="费用">
                            <el-input v-model="editParams.fee"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="备注信息">
                            <el-input v-model="editParams.remark" placeholder="请输入备注信息"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item style="text-align: right;">
                    <el-button type="primary" @click="saveEditConfig">保 存</el-button>
                    <el-button @click="editConfigShow = false;">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="充值详情" v-model="depositDialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
            <el-form ref="depositForm" :inline="true" :model="depositDialog.form" :rules="depositDialog.rules" class="demo-form-inline">
                <el-form-item prop="depositMoney">
                    <el-input v-model="depositDialog.form.depositMoney" placeholder="充值金额"></el-input>
                </el-form-item>
                <el-form-item prop="remark">
                    <el-input v-model="depositDialog.form.remark" placeholder="备注"></el-input>
                </el-form-item>
                <el-form-item prop="depositDate">
                    <el-date-picker
                        :editable="false"
                        :clearable="false"
                        v-model="depositDialog.form.depositDate"
                        type="datetime"
                        placeholder="充值时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="deposit" v-show="optAuth.deposit_add">充值</el-button>
                </el-form-item>
            </el-form>

            <el-table
                highlight-current-row
                v-loading.body="depositDialog.loading"
                :data="depositDialog.items"
                border
                stripe
                style="width: 100%">
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="channel"
                    label="充值对象"
                    width="150">
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="depositUser"
                    label="提交人"
                    width="150">
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="depositMoney"
                    label="充值金额"
                    width="150">
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="depositTime"
                    label="充值时间"
                    width="200">
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="remark"
                    label="备注"
                    width="150">
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    prop="createDate"
                    :formatter="createDateFmt"
                    label="录入时间"
                    width="200">
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="danger" @click="deleteDeposit(scope.row)" v-show="optAuth.deposit_delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import api from "../../api";
import bsmp  from "bsmp_main";

export default {
    name: "assist_channel",
    props: {
        height: {
            type: Number
        }
    },
    data() {
        let emptyTexts = {
            empty: "暂无数据",
            quering: "正在查询，请稍候",
            error: "查询数据失败，请重试"
        };
        return {
            loading: false,
            saving: false,
            addConfigShow: false,
            editConfigShow: false,
            editConfigData: {
                config: null,
                index: 0
            },
            emptyText: emptyTexts.empty,
            emptyTexts,
            config: [],
            channelList: [],
            serviceList: [],
            params: {
                channel: "",
                serviceType: ""
            },
            addParams: {
                channel: "",
                channelName: "",
                status: 1,
                serviceType: "",
                serviceStatus: 1,
                token1: "",
                token2: "",
                token3: "",
                token4: "",
                apiUrl: "",
                fee: "0",
                remark: ""
            },
            editParams: {
                id: "",
                token1: "",
                token2: "",
                token3: "",
                token4: "",
                apiUrl: "",
                channelName: "",
                status: 1,
                serviceStatus: 1,
                sort: "0",
                fee: "0",
                remark: ""
            },
            depositDialog: {
                show: false,
                loading: false,
                index: -1,
                form: {
                    depositMoney: '',
                    depositDate: null,
                    remark: ''
                },
                rules: {
                    depositMoney: [
                        {required: true, message: "请输入充值金额", trigger: "blur"},
                        {pattern: /^[1-9]+\d*$/, message: '充值金额必须为数字'}
                    ],
                    depositDate: [
                        {required: true, type: 'date', message: '请选择充值时间', trigger: 'blur,change'}
                    ],
                    remark: [
                        {required: true, message: "请输入备注", trigger: "blur"}
                    ],
                },
                items: []
            }
        }
    },
    created() {
        this.query().then(this.makeLists);
    },
    computed: {
        optAuth() {
            return bsmp.util.mapAuth({
                search: "risk_system_channel_credit_config",
                add: "risk_system_channel_credit_config_add",
                edit: "risk_system_channel_credit_config_delete",
                delete: "risk_system_channel_credit_config_edit",
                deposit_list: "risk_system_channel_credit_config_deposit_list",
                deposit_add: "risk_system_channel_credit_config_deposit_add",
                deposit_delete: "risk_system_channel_credit_config_deposit_delete"
            });
        },
    },
    methods: {
        createDateFmt(row) {
            return typeof row.createDate !== 'undefined' ?bsmp.util.formatDate.format(new Date(row.createDate), 'yyyy-MM-dd hh:mm:ss') : '';
        },
        showDepositDialog(index) {
            this.depositDialog.form = {
                depositMoney: '',
                depositDate: null,
                remark: ''
            };

            this.depositDialog.index = index;
            this.depositDialog.show = true;
            this.getDepositList();
        },
        getDepositList() {
            if (this.depositDialog.index == -1) {
                return;
            }
            let params = {
                channel: this.config[this.depositDialog.index].channel
            };

            this.depositDialog.loading = true;
            api.queryDepositList(params).then(res => {
                this.depositDialog.loading = false;
                let data = res.data;
                
                if (data && data.code === '0') {
                    this.depositDialog.items = data.data.data;
                }
            }).catch(e => {
                this.depositDialog.loading = false;
            });

        },
        deposit() {
            this.$refs["depositForm"].validate(valid => {
                if (valid) {
                    // 新增
                    let params = {
                        channel: this.config[this.depositDialog.index].channel,
                        ...this.depositDialog.form
                    };
                    params.depositDate =  bsmp.util.formatDate.format(params.depositDate, "yyyy-MM-dd hh:mm:ss");

                    api.addDeposit(params).then(res => {
                        let data = res.data;
                        if (data && data.code === "0") {
                            this.$message({
                                type: "success",
                                message: "充值成功!"
                            });

                            this.depositDialog.form = {
                                depositMoney: '',
                                depositDate: null,
                                remark: ''
                            };

                            this.$refs['depositForm'].resetFields();
                            this.getDepositList();

                            // 记录日志
                            bsmp.log({
                                component: "risk_system",
                                type: "add",
                                content: `[Channel] params: ${JSON.stringify(params)}`
                            });
                        }
                    });
                }
            });
        },
        deleteDeposit(item) {
            this.$confirm("确定要删除该条记录?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                // 删除
                api.deleteDeposit({ id: item.id }).then(res => {
                    let data = res.data;
                    if (data && data.code === "0") {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.getDepositList();

                        // 记录日志
                        bsmp.log({
                            component: "risk_system",
                            type: "delete",
                            content: `[Channel] params: ${JSON.stringify({
                                id: item.id
                            })}`
                        });
                    }
                });
            }).catch(e => { });
        },
        showAddConfigDialog() {
            this.addParams = {
                channel: "",
                channelName: "",
                status: 1,
                serviceType: "",
                serviceStatus: 1,
                token1: "",
                token2: "",
                token3: "",
                token4: "",
                apiUrl: "",
                fee: "0",
                remark: ""
            };

            this.addConfigShow = true;
        },
        showEditConfigDialog(config, index) {
            this.editParams = {
                id: config.configList[index].id,
                channel: config.channel,
                token1: config.configList[index].token1,
                token2: config.configList[index].token2,
                token3: config.configList[index].token3,
                token4: config.configList[index].token4,
                apiUrl: config.configList[index].apiUrl,
                channelName: config.channelName,
                status: config.status,
                serviceStatus: config.configList[index].serviceStatus,
                sort: config.configList[index].sort,
                fee: config.configList[index].fee,
                remark: config.configList[index].remark
            }

            this.editConfigShow = true;
            this.editConfigData = {
                config: config,
                index: index
            }
        },
        query() {
            this.loading = true;
            this.emptyText = this.emptyTexts.quering;
            return api.queryCreditConfig(this.params)
                .then(res => res.data)
                .then(res => {
                    if (res.code != 0) {
                        this.emptyText = this.emptyTexts.error;
                        return;
                    }
                    this.config = res.data;
                    this.loading = false;
                }).catch(e => {
                    this.loading = false;
                });
        },
        makeLists() {
            let serviceHash = {};
            this.config.forEach(config => {
                this.channelList.push({
                    channel: config.channel,
                    channelName: config.channelName,
                    config
                });

                config.configList.forEach(service => {
                    if (service.serviceType in serviceHash) {
                        return;
                    }

                    this.serviceList.push({
                        serviceType: service.serviceType,
                        serviceName: service.serviceName,
                        config,
                        service
                    });

                    serviceHash[service.serviceType] = true;
                })
            });
        },
        changeStatus(index) {
            let config = this.config[index];
            let params = {
                channel: config.channel,
                status: config.status == 0 ? 1 : 0
            }
            return api.editCreditConfig(params)
                .then(res => res.data)
                .then(res => {
                    if (res.code != 0) {
                        return;
                    }

                    config.status = params.status;
                    this.$message.success("操作成功!");
                })
        },
        changeConfigStatus(config) {
            let status = config.serviceStatus == 0 ? 1 : 0;
            let params = {
                id: config.id,
                serviceStatus: status
            }

            return api.editCreditConfig(params)
                .then(res => res.data)
                .then(res => {
                    if (res.code != 0) {
                        return;
                    }

                    config.serviceStatus = params.serviceStatus;
                    this.$message.success("操作成功!");
                })
        },
        createConfig() {
            for (let p in this.addParams) {
                this.addParams[p] = this.addParams[p] == null ? "" : this.addParams[p].toString().trim();
            }

            if (this.addParams.channel.length == 0) {
                this.$message.error("请输入通道配置编码");
                return;
            }

            if (this.addParams.channelName.length == 0) {
                this.$message.error("请输入通道配置名称");
                return;
            }

            if (this.addParams.serviceType.length == 0) {
                this.$message.error("请输入验证类型");
                return;
            }

            this.saving = true;

            return api.addCreditConfig(this.addParams)
                .then(res => res.data)
                .then(res => {
                    this.saving = false;

                    if (res.code != "0") {
                        return;
                    }

                    this.$message.success("保存成功");
                    this.addConfigShow = false;
                    this.query();
                })
                .catch(e => {
                    this.saving = false;
                })
        },
        saveEditConfig() {
            for (let p in this.editParams) {
                this.editParams[p] = this.editParams[p] == null ? "" : this.editParams[p].toString().trim();
            }

            if (this.editParams.channelName.length == 0) {
                this.$message.error("请输入通道配置名称");
                return;
            }

            this.saving = true;

            return api.editCreditConfig(this.editParams)
                .then(res => res.data)
                .then(res => {
                    this.saving = false;

                    if (res.code != "0") {
                        return;
                    }

                    this.$message.success("保存成功");
                    this.editConfigShow = false;


                    let config = this.editConfigData.config;
                    let cConfig = config.configList[this.editConfigData.index];


                    config.channelName = this.editParams.channelName;

                    cConfig = Object.assign(cConfig, {
                        "token1": this.editParams.token1,
                        "token2": this.editParams.token2,
                        "token3": this.editParams.token3,
                        "token4": this.editParams.token4,
                        "apiUrl": this.editParams.apiUrl,
                        "sort": this.editParams.sort,
                        "fee": this.editParams.fee,
                        "remark": this.editParams.remark
                    })
                })
                .catch(e => {
                    this.saving = false;
                })
        },
        deleteConfig(config, index) {
            this.$confirm("确定要删除该条记录?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                return api.deleteCreditConfig({
                    channel: config.channel,
                    serviceType: config.configList[index].serviceType
                })
                .then(res => res.data)
                .then(res => {
                    if (res.code != 0) {
                        return;
                    }

                    this.$message.success("删除成功");
                    this.query();
                })
            });
        }
    }
}

</script>
<style scoped>
.query-panel {
    padding: 8px 0 0 10px!important;
}

.list-table {
    width: 100%;
    margin-top: 10px;
}

</style>
