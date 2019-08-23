
<template>
  <div class="home">
    <h1>{{ msg }}</h1>
    <div class="chart" id="homeChart"></div>
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp from 'bsmp_main';
  var echarts = require('echarts');
  export default {
    name: 'monitor_alarm_index',
    data () {
      return {
        msg: ''
      }
    },
    mounted() {
      //echarts 实例化
      var myChart = echarts.init(document.getElementById('homeChart'));
      var option = {
        title: {
          text: '监控告警总览',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data:['网络异常','接口返回非200 OK','程序异常']
        },
        toolbox: {
          show: true,
          feature: {
            magicType: {show: true, type: ['stack', 'tiled']},
            saveAsImage: {show: true}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一','周二','周三','周四','周五','周六','周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '网络异常',
          type: 'line',
          smooth: true,
          data: [10, 12, 21, 54, 260, 830, 710]
        },
          {
            name: '接口返回非200 OK',
            type: 'line',
            smooth: true,
            data: [30, 182, 434, 791, 390, 30, 10]
          },
          {
            name: '程序异常',
            type: 'line',
            smooth: true,
            data: [1320, 1132, 601, 234, 120, 90, 20]
          }]
      };

      myChart.setOption(option);
    }
  }
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .chart {
    width: 98%;
    height: 500px;
    background-color: black;
  }

</style>


