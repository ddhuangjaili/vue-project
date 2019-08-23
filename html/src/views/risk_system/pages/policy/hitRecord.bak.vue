<template>
    <div style="max-height: 100%; overflow-y: auto; overflow-x: hidden;">
        <el-row :gutter="8" class="info-card-list">
            <el-col :span="16">
                <el-row :gutter="8">
                    <el-col :span="6">
                        <el-card class="info-card">
                            <h3>今日注册场景</h3>
                            <p>500 20%命中</p>
                        </el-card>
                        <el-card class="info-card">
                            <h3>今日注册场景</h3>
                            <p>500 20%命中</p>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card class="info-card">
                            <h3>今日开户场景</h3>
                            <p>500 20%命中</p>
                        </el-card>
                        <el-card class="info-card">
                            <h3>今日注册场景</h3>
                            <p>500 20%命中</p>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card class="info-card">
                            <h3>今日入金场景</h3>
                            <p>500 20%命中</p>
                        </el-card>
                        <el-card class="info-card">
                            <h3>今日注册场景</h3>
                            <p>500 20%命中</p>
                        </el-card>
                    </el-col>
                    <el-col :span="6">
                        <el-card class="info-card">
                            <h3>今日开户场景</h3>
                            <p>500 20%命中</p>
                        </el-card>
                        <el-card class="info-card">
                            <h3>今日注册场景</h3>
                            <p>500 20%命中</p>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="8" class="layout-r">
                <el-row :gutter="8">
                    <el-col :span="12">
                        <el-card class="info-card">
                            <h3>今日事件总量</h3>
                            <p>5000 20%命中</p>
                        </el-card>
                    </el-col>
                    <el-col :span="12">
                        <el-card class="info-card">
                            <h3>周事件总量</h3>
                            <p>5000 20%命中</p>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <query-panel style="margin-top:10px;">
            <!--场景统计 -->
            <el-form :inline="true" :model="search" class="demo-form-inline" style="padding: 8px 0 0 10px;">
                <el-form-item>
                    统计时间：
                    <el-date-picker v-model="search.time" type="daterange" align="right" placeholder="点击选择统计时间范围"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="query">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="default" @click="exportData">导出报表</el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col :span="18">
                    <div style="height:400px;" ref="sceneCharts"></div>
                </el-col>
                <el-col :span="4" class="sceneCharts">
                    <el-row :gutter="10">
                        <el-col :span="6" style="text-align: right;">
                            <el-progress type="circle" :percentage="0" :width="50"></el-progress>
                        </el-col>
                        <el-col :span="18" class="text">拒绝次数
                            <br/>120</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6" style="text-align: right;">
                            <el-progress type="circle" :percentage="20" :width="50"></el-progress>
                        </el-col>
                        <el-col :span="18" class="text">拒绝次数
                            <br/>120</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6" style="text-align: right;">
                            <el-progress type="circle" :percentage="40" :width="50"></el-progress>
                        </el-col>
                        <el-col :span="18" class="text">拒绝次数
                            <br/>120</el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="6" style="text-align: right;">
                            <el-progress type="circle" :percentage="60" :width="50"></el-progress>
                        </el-col>
                        <el-col :span="18" class="text">拒绝次数
                            <br/>120</el-col>
                    </el-row>
                </el-col>
            </el-row>
        </query-panel>
        <query-panel style="margin-top:10px;">
            <!--区域统计 -->
            <el-form :inline="true" :model="search" class="demo-form-inline" style="padding: 8px 0 0 10px;">
                <el-form-item>
                    统计时间：
                    <el-date-picker v-model="search.time" type="daterange" align="right" placeholder="点击选择统计时间范围"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    监控指标：
                    <el-select v-model="search.monitor" placeholder="请选择">
                        <el-option v-for="item in monitorOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    统计排名：
                    <el-select v-model="search.rank" placeholder="请选择">
                        <el-option v-for="item in rankOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="query">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="default" @click="exportData">导出报表</el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-col :span="16">
                    <div style="height:400px;" ref="areaCharts"></div>
                </el-col>
                <el-col :span="8" class="areaCharts">

                </el-col>
            </el-row>
        </query-panel>
    </div>
</template>
<script>
export default {
    data() {
        return {
            search: {
                time: ""
            },
            monitorOptions: [{
                label: "指标1",
                value: "0"
            },{
                label: "指标2",
                value: "1"
            }],
            rankOptions: [{
                label: "前5名",
                value: "0"
            },{
                label: "前10名",
                value: "1"
            }],
            sceneChartsOption: {
                legend: {
                    data: ['蒸发量', '降水量']
                },
                xAxis: [{
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                        name: '蒸发量',
                        type: 'bar',
                        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                        markPoint: {
                            data: [
                                { type: 'max', name: '最大值' },
                                { type: 'min', name: '最小值' }
                            ]
                        },
                    },
                    {
                        name: '降水量',
                        type: 'bar',
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                        markPoint: {
                            data: [
                                { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183, symbolSize: 18 },
                                { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
                            ]
                        },
                    }
                ]
            },
            areaChartsOption: {
                legend: {
                    data: ['蒸发量', '降水量']
                },
                xAxis: [{
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                }],
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                        name: '蒸发量',
                        type: 'bar',
                        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                        markPoint: {
                            data: [
                                { type: 'max', name: '最大值' },
                                { type: 'min', name: '最小值' }
                            ]
                        },
                    },
                    {
                        name: '降水量',
                        type: 'bar',
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                        markPoint: {
                            data: [
                                { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183, symbolSize: 18 },
                                { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
                            ]
                        },
                    }
                ]
            }
        }
    },
    created() {
        this.loadECharts()
            .then(echarts => {
                let sceneCharts = echarts.init(this.$refs.sceneCharts);
                sceneCharts.setOption(this.sceneChartsOption);
                let areaCharts = echarts.init(this.$refs.areaCharts);
                areaCharts.setOption(this.areaChartsOption);
            })
    },
    methods: {
        query() {

        },
        exportData() {

        },
        jsLoader(url) {
            return new Promise((resolve, reject) => {
                let dom = document.createElement("SCRIPT");
                dom.src = url;
                dom.type = "text/javascript";
                dom.charset = "utf-8";
                dom.async = true;
                dom.defer = true;
                dom.onload = resolve;
                dom.onerror = reject;

                document.body.appendChild(dom);
            })
        },
        loadECharts() {
            return this.jsLoader("/static/echarts-all.js")
                .then(v => {
                    return window.echarts;
                })
        }
    }
}

</script>
<style scoped>
.info-card-list {
    text-align: center;
}

.info-card+.info-card {
    margin-top: 8px;
}

.layout-r .info-card {
    height: 166px;
    padding-top: 18%;
}

.sceneCharts {
    padding-top: 80px;
}

.sceneCharts .el-row {
    margin-bottom: 12px;
}

.sceneCharts .text {
    padding-top: 10px;
}

</style>
