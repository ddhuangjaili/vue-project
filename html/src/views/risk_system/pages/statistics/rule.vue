<template>
  <div class="form-co" :style="{height: (height - 20) + 'px'}">
    <div class="today-open total">
      <div class="item">
        <p>今日开户总量</p>
        <p>
          <span class="num">{{today.todayTotal}}</span>
        </p>
      </div>
      <div class="item">
        <p>本周开户总量</p>
        <p>
          <span class="num">{{today.weekTotal}}</span>
        </p>
      </div>
    </div>

    <div class="today-open">
      <div class="item" v-for="(item, index) in today.sceneFireList" :key="'fire' + index">
        <p>今日{{item.sceneName}}开户</p>
        <p>
          <span class="num">{{item.total}}</span>
          {{item.percent}}命中
        </p>
      </div>
    </div>

    <div class="today-open refuse">
      <div class="item" v-for="(item, index) in today.sceneRefuseList" :key="'refuse' + index">
        <p>今日{{item.sceneName}}</p>
        <p>
          拒绝次数：
          <span class="num">{{item.refuseTotal}}</span>
        </p>
      </div>
    </div>

    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item label="统计时间：">
          <el-date-picker clearable v-model="search.createDate" type="daterange" placeholder="统计时间"></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button v-show="optAuth.scene" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <div class="pies">
      <div class="item" v-for="(pie, index) in pipes" :key="'pie-' + index">
        <div class="title">{{pie.name}}</div>
        <div class="pie" :id="'chart' + index"></div>
      </div>
    </div>

    <query-panel>
      <el-form :inline="true" :model="map" class="demo-form-inline">
        <el-form-item label="统计时间：">
          <el-date-picker
            clearable
            v-model="map.createDate"
            type="daterange"
            placeholder="统计时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="监控指标：">
          <el-select v-model="map.area" clearable filterable placeholder="监控指标">
            <el-option label="全国" value=""></el-option>
            <el-option label="华南" value="1"></el-option>
            <el-option label="华中" value="2"></el-option>
            <el-option label="华北" value="3"></el-option>
            <el-option label="其他" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计排名：">
          <el-select v-model="map.order" clearable filterable placeholder="统计排名">
            <el-option label="前5名" value=""></el-option>
            <el-option label="前10名" value="1"></el-option>
            <el-option label="前20名" value="2"></el-option>
            <el-option label="前50名" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" title="导出报表"><i class="icon-download"></i>&nbsp;&nbsp;导出报表</el-button>
        </el-form-item>
      </el-form>
    </query-panel>
    <iframe src="http://47.107.126.89:83/apidoc/temp/map-polygon.html" frameborder="0"
            :style="{height: '500px', width: '100%'}">
    </iframe>
  </div>
</template>

<script>
import api from "../../api";
import bsmp  from "bsmp_main";

let echarts = require("echarts/lib/echarts");
// 引入饼图组件
require("echarts/lib/chart/pie");
// 引入提示框和图例组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/legend");

export default {
  name: "statistics_rule",
  props: {
    height: {
      type: Number
    }
  },
  data() {
    return {
      loading: true,
      search: {
        createDate: [new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                      new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())]
      },
      today: {
        todayTotal: 0,
        weekTotal: 0,
        sceneRefuseList: [],
        sceneFireList: []
      },
      pipes: [],
      map: {
        createDate: null,
        area: '',
        order: ''
      }
    };
  },
  mounted() {
    this.getRuleStatToday();

    this.query();

    // this.showMap();
  },
  computed: {
    optAuth() {
      return bsmp.util.mapAuth({
        today: "statistics_rule_today",
        scene: "statistics_rule_scene"
      });
    }
  },
  methods: {
    /**
     * 动态加载js文件
     * @param {String} url
     * @param {String} id
     */
    loadScript(url, id) {
      return new Promise((resolve, reject) => {
        let dom = document.createElement("SCRIPT");
        dom.src = url;
        dom.type = "text/javascript";
        dom.charset = "utf-8";
        dom.id = id;
        dom.async = true;
        dom.defer = true;
        dom.onload = resolve;
        dom.onerror = reject;

        let head = document.getElementsByTagName("head")[0];
        head.appendChild(dom);
      });
    },

    showMap() {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ]
          }
        ]
      };

      // 基于准备好的dom，初始化echarts实例
      let mapChart = echarts.init(document.getElementById("mainMap"));

      // 使用刚指定的配置项和数据显示图表。
      mapChart.setOption(option);
    },

    showPies() {
      if (this.pipes && this.pipes.length) {
        this.pipes.forEach((pie, index) => {
          let options = {...option};
          options.series[0].name = pie.name;
          options.legend.data = pie.legend;
          options.series[0].data = pie.series;

          let $chart = document.getElementById(`chart${index}`);
          
          if ($chart) {
            // 基于准备好的dom，初始化echarts实例
            let chart = echarts.init($chart);

            // 使用刚指定的配置项和数据显示图表。
            chart.setOption(options);
          }
        })
      }
    },

    /**
     * 查询
     */
    query() {
      this.loading = true;
      let params = bsmp.util.deleteBlank(this.search);

      if (
        params.createDate &&
        params.createDate.length &&
        params.createDate[0] &&
        params.createDate[1]
      ) {
        params.createTimeStart =
          bsmp.util.formatDate.format(params.createDate[0], "yyyy-MM-dd") +
          " 0:0:0";
        params.createTimeEnd =
          bsmp.util.formatDate.format(params.createDate[1], "yyyy-MM-dd") +
          " 23:59:59";
        delete params.createDate;
      }

      api
        .getRuleStatScene(params)
        .then(res => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === "0") {
            this.pipes = [];

            if (data.data && data.data.length) {
              data.data.forEach(item => {
                let pie = {};
                pie.name = item.sceneName;
                pie.legend = [];
                pie.series = [];
                console.log(pie);

                if (item.ruleFireList && item.ruleFireList.length) {
                  item.ruleFireList.forEach(bean => {
                    pie.legend.push(bean.ruleName);
                    pie.series.push({
                      value: bean.total,
                      name: bean.ruleName
                    });
                  });
                }

                this.pipes.push(pie);
              });

              console.log(this.pipes);
              setTimeout(() => {
                this.showPies();
              }, 500);
            }
          }
        })
        .catch(e => {
          this.loading = false;
        });
    },

    /**
     * 今日场景和规则数据统计
     */
    getRuleStatToday() {
      this.loading = true;

      api
        .getRuleStatToday()
        .then(res => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === "0") {
            this.today = data.data;
          }
        })
        .catch(e => {
          this.loading = false;
        });
    }
  }
};

let option = {
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c} ({d}%)"
  },
  legend: {
    orient: "vertical",
    x: "left",
    data: []
  },
  series: [
    {
      name: "",
      type: "pie",
      radius: ["50%", "70%"],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: "center"
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: "30",
            fontWeight: "bold"
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: []
    }
  ]
};
</script>
<style lang="stylus" scoped>
.form-co {
  overflow-y: scroll;
}

.today-open {
  border-bottom: 1px solid #dfe6ec;

  .item {
    width: 180px;
    padding: 10px;
    font-size: 14px;
    margin: 10px;
    display: inline-block;
    background: #00a0e9;
    color: #fff;
    border-radius: 10px;
    text-align: center;
    box-shadow:2px 2px 5px #333;

    .num {
      font-size: 20px;
    }
  }
}

.refuse {
  .item {
    background: palevioletred;
  }
}

.total {
  .item {
    background: #E00202;
  }
}

.pies {
  width: 100%;

  .item {
    display inline-block;
    width: 48%;

    .title {
      font-size: 18px;
      color: #4096ff;
      padding: 10px 0;
      text-align: center;
    }

    .pie {
      width: 100%;
      height: 300px;
    }
  }
}
</style>
