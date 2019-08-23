<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.datetime"
            type="daterange"
            placeholder="时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.clientGroups" multiple  placeholder="客户组别">
            <el-option
              v-for="item of clientGroups"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <div style="margin:30px;">
      <Chart id="chart1"  :initOptions='initOptions1'></Chart>
      <Chart id="chart2"  :initOptions='initOptions2'></Chart>
      <Chart id="chart3"  :initOptions='initOptions3'></Chart>
      <Chart id="chart4"  :initOptions='initOptions4'></Chart>
    </div>
  </div>
</template>

<script>
import Chart from './charts/vccChart'
import bsmp  from 'bsmp_main';
import api from '../api'
export default {
  components: {Chart},
  data(){
    return {
      initOptions1:null,
      initOptions2:null,
      initOptions3:null,
      initOptions4:null,
      search: {
          datetime: null,
          clientGroups:[],
        },
      clientGroups:[],
      }
  },
  created(){
      this.getclientGroups();
  },
  mounted(){
  },
  computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'vc_gz_acc_list_select',
        });
      }
    },
  methods: {
    dateToStr(date) {
        return bsmp.util.formatDate.format(date, 'yyyy-MM-dd hh:mm:ss');
      },
    getclientGroups() {
        api.getClientGroupList({pageNo:1,pageSize:30,status:0}).then((res) => {
          let data = res.data;
          if (data && data.code === '0' && data.data && data.data.data.length) {
            data.data.data.forEach((item) => {
              this.clientGroups.push({id:item.id,name:item.name});
            });
          }
        });
      },
    query(){
        this.loading = true;
        let params = {clientGroups:this.search.clientGroups.join(',')};
        if (this.search.datetime && this.search.datetime.length && this.search.datetime[0] && this.search.datetime[1]) {
            params.startDate = this.dateToStr(this.search.datetime[0]);
            params.endDate = this.dateToStr(new Date(this.search.datetime[1].setHours(23, 59, 59, 0)));
          }
        else{
          this.$message.warning('请选择查询时间！');
          return;
        }

        api.getAccLsit(params).then((res) => {
              let data = res.data.data;
              let series=[
                              {
                                  name: '客户总数',
                                  type: 'bar',
                                  barGap: 0,
                                  label: {normal:{show:true}},
                                  data: []
                              },
                              {
                                  name: '有订单客户数',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data: []
                              },
                              {
                                  name: '客户订单总数',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data: []
                              },
                              {
                                  name: '客户买入（卖出）率',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data:[]
                              }
                          ]

              for(let item of data){
                series[0].data.push(item.accNums);
                series[1].data.push(item.haveOrderAccNums);
                series[2].data.push(item.orderNums);
                series[3].data.push(item.buyOrSellRate);
              }

            this.initOptions1 =  {
                                    title: {text: '客户买入（卖出）统计' },
                                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }},
                                    legend: { data: ['客户总数', '有订单客户数', '客户订单总数', '客户买入（卖出）率']},
                                    xAxis: [{ type: 'category', axisTick: {show: false},data: ['买入', '卖出']}],
                                    yAxis: [{ type: 'value'}],
                                    series: series
                                };

        });

        api.getAvglist(params).then((res) => {
              let data = res.data.data;
              let series=[
                              {
                                  name: '客户购买（卖出）总额',
                                  type: 'bar',
                                  barGap: 0,
                                  label: {normal:{show:true}},
                                  data: []
                              },
                              {
                                  name: '每客户订单数',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data: []
                              },
                              {
                                  name: '每客户购买（卖出）额',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data: []
                              },
                          ]

              for(let item of data){
                series[0].data.push(item.accOrderTurnover);
                series[1].data.push(item.avgAccOrderNum);
                series[2].data.push(item.avgAccTurnover);
              }


              this.initOptions2= {
                                    title: {text: '客户平均买入（卖出）额' },
                                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }},
                                    legend: { data: ['客户购买（卖出）总额', '每客户订单数', '每客户购买（卖出）额'],},
                                    xAxis: [{ type: 'category', axisTick: {show: false},data: ['买入', '卖出']}],
                                    yAxis: [{ type: 'value'}],
                                    series: series
                                };
        });

        api.getAccOrderRank(params).then((res) => {
              let data = res.data.data;
              let series3 = [
                        {
                            name: '订单数',
                            type: 'bar',
                            barGap: 0,
                            label: {normal:{show:true}},
                            data: []
                        },
                        {
                            name: '买入额',
                            type: 'bar',
                            label: {normal:{show:true}},
                            data: []
                        }
                    ]

              let series4 = [
                        {
                            name: '订单数',
                            type: 'bar',
                            barGap: 0,
                            label: {normal:{show:true}},
                            data: []
                        },
                        {
                            name: '卖出额',
                            type: 'bar',
                            label: {normal:{show:true}},
                            data: []
                        }
                    ]

              let yAxis3 = {
                        type: 'category',
                        data: []
                    };

              let yAxis4 =  {
                        type: 'category',
                        data: []
                    };


              for(let item of data){
                if(item.orderType==0){
                   series3[0].data.push(item.orderNums);
                   series3[1].data.push(item.orderPrices);
                   yAxis3.data.push(item.nameCN);
                }

                 if(item.orderType==1){
                   series4[0].data.push(item.orderNums);
                   series4[1].data.push(item.orderPrices);
                   yAxis4.data.push(item.nameCN);
                }
              }


              this.initOptions3 = {
                        title: {text: '客户买入排行' },
                        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }},
                        legend: { data: ['订单数', '买入额']},
                        xAxis: {type: 'value', boundaryGap: [0, 0.01]},
                        yAxis: yAxis3,
                        series: series3
                    };

              this.initOptions4 = {
                        title: {text: '客户卖出排行' },
                        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }},
                        legend: { data: ['订单数', '卖出额']},
                        xAxis: {type: 'value', boundaryGap: [0, 0.01]},
                        yAxis: yAxis4,
                        series: series4
                    };
        });
    }
  }
}
</script>


