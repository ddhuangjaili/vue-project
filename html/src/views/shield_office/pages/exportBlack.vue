<template>
<div>
    <query-panel>
        <el-form :inline="true" :rules="rules" :model="search" ref="searchForm" class="demo-form-inline" v-show="optAuth.query">
            <el-form-item prop="status">
                <el-select clearable v-model="search.status" placeholder="生成状态">
                    <el-option label="正在生成" value="0"></el-option>
                    <el-option label="生成失败" value="-1"></el-option>
                    <el-option label="成功生成可以下载" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="createUser">
                <el-input v-model="search.createUser" placeholder="创建人"></el-input>
            </el-form-item>
            <el-form-item prop="time">
                <el-date-picker
                    clearable
                    v-model="search.time"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm:ss"
                    placeholder="上传时间范围">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit" @click="submitForm('searchForm')">查询</el-button>
            </el-form-item>
        </el-form>
    </query-panel>
    <el-row class="toolbar" v-if="optAuth.export">
      <el-button :disabled="dialog.isOpen" @click="dialog.isOpen = !dialog.isOpen" title="生成黑名单"
                 type="success" class="handle-btn">
        <i class="icon-plus"></i>&nbsp;&nbsp;生成黑名单
      </el-button>
    </el-row>
    <el-dialog v-model="dialog.isOpen" size="tiny"
        :title="dialog.title">
        <span class="demonstration">请选择每个分片的条数</span>
        <el-row>
            <el-slider
                v-model="dialog.number"
                :min="dialog.min" 
                :max="dialog.min * 10"
                :step="dialog.min"
                :disabled="dialog.isProcessing"
                show-stops>
            </el-slider>
            <el-input-number v-model="dialog.number" 
                label="每页条数"
                :disabled="dialog.isProcessing"
                :min="dialog.min" 
                :max="dialog.min * 10"
                :step="dialog.min"></el-input-number>
            <el-button title="生成" 
                type="success" 
                class="handle-btn"
                :disabled="dialog.isProcessing" 
                @click="toExport()">生成</el-button>
        </el-row>
    </el-dialog>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      style="width: 100%">
        <el-table-column
            :show-overflow-tooltip="true"
            prop="createIp"
            label="创建IP"
            width="150">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            prop="strCreateDate"
            label="创建日期"
            width="200">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            prop="createUser"
            label="创建用户"
            width="150">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            prop="remark"
            label="备注">
        </el-table-column>
        <el-table-column
            :show-overflow-tooltip="true"
            prop="status"
            label="状态"
            width="120">
            <template slot-scope="scope">
                <el-tag v-show="scope.row.status != 1" :type="scope.row.status == -1 ? 'danger' : 'primary'">{{getButtonLabel(scope.row.status)}}</el-tag>
                <el-tag v-show="scope.row.status == 1 && !optAuth.download" type="success">成功生成</el-tag>
                <a class="download" v-show="scope.row.status == 1 && optAuth.download" :href="getDownloadLink(scope.row.id)" download="file">下载</a>
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
</div>
</template>
<script>
import api from '../api';
import LoadingWheel from "../components/LoadingWheel.vue";
import bsmp  from 'bsmp_main';
export default {
    name: "exportBlack",
    components: {LoadingWheel},
    data(){
        return {
            loading: false,
            dialog: {
                title: "生成黑名单文件",
                isOpen: false,
                number: 1000,
                min: 1000,
                isProcessing: false
            },
            search: {
                status: "",
                createUser: "",
                time: null
            },
            rules: {
                createUser:{
                    pattern: /(^[\u4e00-\u9fa5]{1,6}$)|(^[a-zA-Z]+$)|(\_\-)|([0-9])/,
                    message: "不像是姓名哦，请重新输入！"
                }
            },
            table: {
                items: [],
                pager: {
                    pageSize: 20,
                    pageNo: 1,
                    total: 0
                }
            }
        }
    },
    computed:{
        optAuth() {
            return bsmp.util.mapAuth({
                export: 'shield_office_exportBlack_export',
                query: 'shield_office_exportBlack_query',
                download: 'shield_office_exportBlack_download'
            });
        }
    },
    mounted() {
      this.queryData();
    },
    methods: {
        getButtonLabel(status){
            return {
                "-1": "生成失败",
                "0": "正在生成",
                "1": "下载"
            }[status];
        },
        parseSearchOptions(){
            let searchOptions = {};
            if(this.search.status != ""){
                searchOptions.status = this.search.status;
            }
            if(this.search.createUser != ""){
                searchOptions.createUser = this.search.createUser;
            }
            if(this.search.time){
                searchOptions.startTime = this.search.time[0] || null;
                searchOptions.endTime = this.search.time[1] || null;
                searchOptions.startTime = searchOptions.startTime ? bsmp.util.formatDate.format(searchOptions.startTime, 'yyyy-MM-dd hh:mm:ss') : null;
                searchOptions.endTime = searchOptions.endTime ? bsmp.util.formatDate.format(searchOptions.endTime, 'yyyy-MM-dd hh:mm:ss') : null;
            }
            return searchOptions;
        },
        submitForm(formName) {
            let _this = this;
            this.$refs[formName].validate((valid) => {
            if (valid) {
                _this.queryData();
            } else {
                _this.showWarnMessage('查询字段非法，不能往下执行！');
                return false;
            }
            });
        },
        queryData(){
            let _this = this, queryOptions = {
                pageNo: this.table.pager.pageNo,
                pageSize: this.table.pager.pageSize
            };
            Object.assign(queryOptions, this.parseSearchOptions());
            this.loading = true;
            api.qaueryExportBlackListTask(queryOptions)
            .then(res => {
                if(res.data.code != "0"){
                    _this.$message({
                        type: 'warning',
                        message: '查询数据异常：' + res.data.msg
                    });
                    console.error(res.data);
                    return;
                }
                _this.table.items = res.data.data.data;
                _this.table.pager.total = res.data.data.total;
            })
            .catch(e => {
                _this.$message({
                    type: 'error',
                    message: '查询数据异常：'+ e.message
                });
            })
            .finally(() => {
                this.loading = false;
            })
        },
        toExport(){
            let _this = this;
            this.dialog.isProcessing = true;
            api.exportBlackList({
                size: this.dialog.number
            }).then(res => {
                if(res.data.code != "0"){
                    _this.$message({
                        type: 'warning',
                        message: '导出数据异常：' + res.data.msg
                    });
                    console.error(res.data);
                    return;
                }
                _this.$message({
                    type: 'success',
                    message: '任务请求成功，正在导出！'
                });
                _this.queryData();
            })
            .catch(e => {
                _this.$message({
                    type: 'error',
                    message: '导出数据失败：'+ e.message
                });
            }).finally(()=> {
                _this.dialog.isProcessing = false;
                _this.dialog.isOpen = false;
            });
        },
        getDownloadLink(id){
            let _this = this;
            let token = bsmp.util.getToken();
            return `/api/shield_office/shield/office/black/download_action?token=${token}&id=${id}`;
        },
        handleSizeChange(val) {
            this.table.pager.pageSize = val;
            this.queryData();
        },
        handleCurrentChange(val){
            if (typeof this.table.pager.pageNo != "undefined") {
                this.table.pager.pageNo = val;
                this.queryData();
            }
        }
    }
}
</script>

<style scoped>
a.download{
    color: rgb(72, 87, 106);
}
a.download:active,
a.download:hover{
    color: #20a0ff;
}
.query-block .el-form-item{
    margin-bottom: 20px;
}
</style>


