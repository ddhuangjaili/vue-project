<template>
  <div :class="className" :id="id" :style="{height:heightChart,width:widthChart}"></div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    widthChart: {
      type: String,
      default: '900px'
    },
    heightChart: {
      type: String,
      default: '600px'
    },
    initOptions:Object
  },
  data() {
    return {
      chart: null,
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    initOptions () {
      this.initChart();
    }
  },
  methods: {
    initChart() {
      this.initOptions.toolbox = {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        };
      this.initOptions.calculable = true;
      this.chart = echarts.init(document.getElementById(this.id));
      this.chart.setOption(this.initOptions);
    }  
  }
}
</script>
