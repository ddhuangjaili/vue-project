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
  import api from '../api';
  import bsmp  from 'bsmp_main';
  import Chart from './charts/vccChart'
  export default {
    components: {Chart}, 
    data () {
      return {
        loading: true,
        initOptions1:null,
        initOptions2:null,
        initOptions3:null,
        initOptions4:null,
        search: {
          datetime: null,
          clientGroups:[],
        },
         clientGroups:[],
      };
    },
    created(){
      this.getclientGroups();
    },
    mounted () {
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'vcc_order_status_list_select',
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
      query () {
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
        
        api.getOrderStatus(params).then((res) => {
              let data = res.data.data;
              let series= [
                              {value:0, name:'待付款'},
                              {value:0, name:'已付款待放行'},
                              {value:0, name:'已完成'},
                              {value:0, name:'申诉中'},
                              {value:0, name:'已取消'}
                          ];
              for(let item of data){
                  if(item.status == 0){
                    series[0].value = item.nums;
                  }
                  if(item.status == 1){
                    series[1].value = item.nums;
                  }
                  if(item.status == 2){
                    series[2].value = item.nums;
                  }
                  if(item.status == 3){
                    series[3].value = item.nums;
                  }
                  if(item.status == 4){
                    series[4].value = item.nums;
                  }
             }

            this.initOptions1={
                  title : { text: '订单状态统计',},
                  tooltip : { trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)" },
                  legend: { data: ['待付款','已付款待放行','已完成','申诉中','已取消'] },
                  series : [
                      {
                          name: '订单状态',
                          type: 'pie',
                          radius : '55%',
                          center: ['50%', '60%'],
                          data: series,
                          itemStyle: {
                              emphasis: {
                                  shadowBlur: 10,
                                  shadowOffsetX: 0,
                                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                              }
                          }
                      }
                  ]
              };
        });

        api.getOrderPrice(params).then((res) => {
              let data = res.data.data;
              let series=[
                              {
                                  name: '订单总数',
                                  type: 'bar',
                                  barGap: 0,
                                  label: {normal:{show:true}},
                                  data: []
                              },
                              {
                                  name: '订单总额',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data: []
                              },
                              {
                                  name: '买入（卖出）总额',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data: []
                              },
                          ]

              for(let item of data){
                series[0].data.push(item.oderNums);
                series[1].data.push(item.orderPrice);
                series[2].data.push(item.price);
              }

              this.initOptions2 =  {
                            title: {text: '订单买入（卖出）金额统计' },
                            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }},
                            legend: { data: ['订单总数', '订单总额', '买入（卖出）总额']},
                            xAxis: [{ type: 'category', axisTick: {show: false},data: ['买入', '卖出']}],
                            yAxis: [{ type: 'value'}],
                            series: series
                        };
        });

        api.getOrderDod(params).then((res) => {
            let data = res.data.data;
            let xAxis = [];
            let series = [
                            {
                                name:'订单量',
                                type:'bar',
                                barGap: 0,
                                label: {normal:{show:true}},
                                data:[]
                            },
                            {
                                name:'每日订单环比',
                                type:'line',
                                label: {normal:{show:true}},
                                data:[]
                            }
                      ];
            for(let item of data){
                xAxis.push(item.ymd);
                series[0].data.push(item.nums1);
                series[1].data.push(item.nums2);
            }

            this.initOptions3 = {
                    title: {text: '每日订单及环比情况' },
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }},
                    legend: { data:['订单量','每日订单环比']},
                    xAxis: [{ type: 'category', axisTick: {show: false},data: xAxis}],
                    yAxis: [{ type: 'value'}],
                    series: series
                };

        });

        api.getOrderWeek(params).then((res) => {
            let data = res.data.data;
            let xAxis = [];
            let series = [
                            {
                                name:'订单总数',
                                type:'bar',
                                barGap: 0,
                                label: {normal:{show:true}},
                                data:[]
                            },
                            {
                                name:'日均订单数',
                                type:'line',
                                label: {normal:{show:true}},
                                data:[]
                            }
                      ];
            for(let item of data){
                xAxis.push(item.weeks);
                series[0].data.push(item.nums);
                series[1].data.push(item.dayNums);
            }

            this.initOptions4 = {
                    title: { text: '每周订单数据分析' },
                    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }},
                    legend: { data:['订单总数','日均订单数']},
                    xAxis: [{ type: 'category', axisTick: {show: false},data: xAxis}],
                    yAxis: [{ type: 'value'}],
                    series: series
                };
        });
        
        
      },
    }
  };
</script>
