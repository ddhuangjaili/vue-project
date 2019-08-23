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
        search: {
            datetime: null,
            clientGroups:[],
        },
        clientGroups:[],
        clientGroupMap:{},
        typeMap: {
            '0': '买',
            '1': '卖',
            '2': '充币',
            '3': '提币',
            '4': '后台转入',
            '5': '后台转出'
            },
      }
  },
  created(){
      this.getclientGroupMap();
      this.getclientGroups();
  },
  mounted(){
  },
  computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'vcc_clientgroup_nums_list_select',
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
    getclientGroupMap() {
        this.clientGroupMap = {'-1': '未知组',};
        api.getClientGroupList({pageNo:1,pageSize:30,status:0}).then((res) => {
          let data = res.data;
          if (data && data.code === '0' && data.data && data.data.data.length) {
            data.data.data.forEach((item) => {
              this.clientGroupMap[item.id] = item.name;
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

        api.getAmountClientGroupNums(params).then((res) => {
                let data = res.data.data;
                let series = [
                              {
                                  name: '买',
                                  type: 'bar',
                                  barGap: 0,
                                  label: {normal:{show:true}},
                                  data: new Array(Object.keys(this.clientGroupMap).length).fill(0)  
                              },
                              {
                                  name: '卖',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data:  new Array(Object.keys(this.clientGroupMap).length).fill(0)  
                              },
                              {
                                  name: '充币',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data:  new Array(Object.keys(this.clientGroupMap).length).fill(0)  
                              },
                              {
                                  name: '提币',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data: new Array(Object.keys(this.clientGroupMap).length).fill(0)  
                              },
                              {
                                  name: '后台转入',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data: new Array(Object.keys(this.clientGroupMap).length).fill(0)  
                              },
                               {
                                  name: '后台转出',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data: new Array(Object.keys(this.clientGroupMap).length).fill(0)  
                              }
                          ]
              
                for(let item of data){
                    let serie = series[item.type];
                    let index= Object.keys(this.clientGroupMap).findIndex((x)=>{
                        return x == item.clientGroup;
                    })
                    serie.data[index] = item.nums;
                }

                this.initOptions1 =  {
                            title: {text: '客户组资金流水数量统计' },
                            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }},
                            legend: { data: ['买', '卖', '充币', '提币', '后台转入', '后台转出']},
                            xAxis: [{ type: 'category', axisTick: {show: false},data: Object.values(this.clientGroupMap)}],
                            yAxis: [{ type: 'value'}],
                            series: series
                        };
 
        });    
        

        api.getAmountClientGroupAmounts(params).then((res) => {
                let data = res.data.data;
                let series = [
                              {
                                  name: '买',
                                  type: 'bar',
                                  barGap: 0,
                                  label: {normal:{show:true}},
                                  data: new Array(Object.keys(this.clientGroupMap).length).fill(0)  
                              },
                              {
                                  name: '卖',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data:  new Array(Object.keys(this.clientGroupMap).length).fill(0)  
                              },
                              {
                                  name: '充币',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data:  new Array(Object.keys(this.clientGroupMap).length).fill(0)  
                              },
                              {
                                  name: '提币',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data: new Array(Object.keys(this.clientGroupMap).length).fill(0)  
                              },
                              {
                                  name: '后台转入',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data: new Array(Object.keys(this.clientGroupMap).length).fill(0)  
                              },
                               {
                                  name: '后台转出',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data: new Array(Object.keys(this.clientGroupMap).length).fill(0)  
                              }
                          ]
              
                for(let item of data){
                    let serie = series[item.type];
                    let index= Object.keys(this.clientGroupMap).findIndex((x)=>{
                        return x == item.clientGroup;
                    })
                    serie.data[index] = item.amounts;
                }

                this.initOptions2 =  {
                        title: {text: '客户组资金流水交易数量统计' },
                        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }},
                        legend: { data: ['买', '卖', '充币', '提币', '后台转入', '后台转出']},
                        xAxis: [{ type: 'category', axisTick: {show: false},data: Object.values(this.clientGroupMap)}],
                        yAxis: [{ type: 'value'}],
                        series: series
                    };
        });    
        
        api.getAmountType(params).then((res) => {
                let data = res.data.data;
                let series = [
                              {
                                  name: '数量',
                                  type: 'bar',
                                  barGap: 0,
                                  label: {normal:{show:true}},
                                  data: new Array(Object.keys(this.typeMap).length).fill(0)  
                              },
                              {
                                  name: '交易数量',
                                  type: 'bar',
                                  label: {normal:{show:true}},
                                  data:  new Array(Object.keys(this.typeMap).length).fill(0)  
                              },
                          ]
              
                for(let item of data){
                    let index= Object.keys(this.typeMap).findIndex((x)=>{
                        return x == item.type;
                    })
                    series[0].data[index] = item.nums;
                    series[1].data[index] = item.amounts;
                }

                this.initOptions3 =  {
                        title: {text: '资金流水类型统计' },
                        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }},
                        legend: { data: ['数量','交易数量']},
                        xAxis: [{ type: 'category', axisTick: {show: false},data: Object.values(this.typeMap)}],
                        yAxis: [{ type: 'value'}],
                        series: series
                    };
        });    
   
    }
  }
}
</script>


