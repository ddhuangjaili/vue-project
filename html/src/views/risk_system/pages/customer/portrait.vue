<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item prop="id">
          <el-input v-model="search.id" placeholder="身份证"></el-input>
        </el-form-item>
        <el-form-item prop="account">
          <el-input v-model="search.account" placeholder="交易账号"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="search.phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="search.name" placeholder="客户姓名"></el-input>
        </el-form-item>
        <el-form-item label="评分卡：">
          <el-select v-model="search.scoreModel" filterable placeholder="评分卡">
            <el-option v-for="card in scoreCard" :label="card" :value="card"
                       :key="'search-card-'+ card"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query" v-loading="loading">查询</el-button>
          <el-button @click="showDialog" type="primary">评分模型说明</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <div :style="{height: (height - 90) + 'px'}" class="content" v-if="total">
      
      <div v-show="total > 0" class="result-info">查询结果：共{{total}}个客户</div>

      <div v-for="(item, index) in items" :key="'item' + index" class="item clearfix">
        <div @click="showItem(index, item)" class="avater">
          <img v-if="item.sex == '1'" src="./male.jpg" width="26"/>
          <img v-if="item.sex == '0'" src="./female.jpg" width="26"/>
          <span>身份证号{{item.idCard}}</span>
        </div>

        <div class="score">
          <p class="tags">
            <el-tag v-for="(label, i) in item.labels" :key="'label-' + label" type="info" :class="'label-' + item.colors[i]">{{label}}</el-tag>
            <i @click="showItem(index, item)" class="info-down-up" :class="{'el-icon-arrow-down': !item.isShow, 'el-icon-arrow-up': item.isShow}"></i>
          </p>

          <table v-show="item.isShow" class="view-table">
            <thead>
              <tr>
                <th style="width: 12%">一级指标</th>
                <th style="width: 13%">二级指标</th>
                <th style="width: 20%">三级指标</th>
                <th style="width: 30%">指标值</th>
                <th style="width: 10%">指标风险值</th>
                <th style="width: 15%">标签名</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in item.level3" :key="'row-' + index">
                <td v-if="item.level1[index]" :rowspan="item.level1[index].rowspan" class="text-c">
                  <h3>{{item.level1[index].text}}</h3>
                </td>
                <td v-if="item.level2[index]" :rowspan="item.level2[index].rowspan" class="text-c">
                  <h4>{{item.level2[index].text}}</h4>
                </td>
                <td>{{row.name}}</td>
                <td>{{row.result}}</td>
                <td>{{row.score}}</td>
                <td>{{row.label}}</td>
              </tr>
            </tbody>
          </table>

        </div>

      </div>

    </div>
    <div v-else class="no-data">暂无数据</div>

  <el-dialog title="详情" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="msgForm" :model="dialog.form" label-width="80px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="评分卡：" prop="scoreModel">
              <el-select @change="getStandards" v-model="dialog.form.scoreModel" filterable placeholder="评分卡">
            <el-option v-for="card in scoreCard" :label="card" :value="card"
                       :key="'dialog-card-'+ card"></el-option>
          </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-tabs v-model="dialog.card" type="card" @tab-click="getStandards">
          <el-tab-pane label="评分标准" name="score">
            <table class="view-table" v-loading="dialog.scoreCard.loading">
              <thead>
                <tr>
                  <th>变量</th>
                  <th>分箱</th>
                  <th>风险分值</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in dialog.scoreCard.data.level2" :key="'score-row-' + index">
                  <td v-if="dialog.scoreCard.data.level1[index]" 
                    :rowspan="dialog.scoreCard.data.level1[index].rowspan" class="text-c">
                    {{dialog.scoreCard.data.level1[index].text}}
                  </td>
                  <td class="text-c">{{row.cutOff}}</td>
                  <td class="text-c">{{row.score}}</td>
                </tr>
              </tbody>
            </table>

          </el-tab-pane>
          <el-tab-pane label="样本数" name="sample">
            <table class="view-table" v-loading="dialog.sample.loading">
              <thead>
                <tr>
                  <th>样本</th>
                  <th>风险客户数</th>
                  <th>正常客户数</th>
                  <th>总计</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in dialog.sample.data" :key="'sample-row-' + index">
                  <td class="text-c">{{row.sample}}</td>
                  <td class="text-c">{{row.riskCustomerNum}}</td>
                  <td class="text-c">{{row.normalCustomerNum}}</td>
                  <td class="text-c">{{row.total}}</td>
                </tr>
              </tbody>
            </table>

          </el-tab-pane>
          <el-tab-pane label="散点图" name="scatterPlot">
            <div class="img-port" v-loading="dialog.picture.loading">
              <img :src="dialog.picture.url"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="柱状图" name="histogram">
            <div class="img-port" v-loading="dialog.picture.loading">
              <img :src="dialog.picture.url"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="用户标签" name="label">
            <table class="view-table" v-loading="dialog.label.loading">
              <thead>
                <tr>
                  <th>标签分类</th>
                  <th>标签词语</th>
                  <th>标签说明</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in dialog.label.data.level2" :key="'label-row-' + index">
                  <td v-if="dialog.label.data.level1[index]" 
                    :rowspan="dialog.label.data.level1[index].rowspan" class="text-c">
                    {{dialog.label.data.level1[index].text}}
                  </td>
                  <td class="text-c">{{row.label}}</td>
                  <td class="text-c">{{row.labelDesc}}</td>
                </tr>
              </tbody>
            </table>

          </el-tab-pane>
        </el-tabs>
      </el-form>
  </el-dialog>
  </div>
</template>

<script>
import api from "../../api";
import bsmp  from "bsmp_main";

export default {
  name: "customer_portait",
  props: {
    height: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      search: {
        id: '',
        account: '',
        phone: '',
        name: '',
        scoreModel: ''
      },
      scoreCard: [],
      items: [],
      total: 0,
      dialog: {
        show: false,
        card: 'score',
        form: {
          scoreModel: ''
        },
        scoreCard: { // 评分标准表
          loading: false,
          data: {
            level1: [],
            level2: []
          }
        },
        sample: { // 样本数
          loading: false,
          data: []
        },
        label: { // 用户标签
          loading: false,
          data: {
            level1: [],
            level2: []
          }
        },
        picture: { // 图片
          loading: false,
          url: ''
        }

      }
    }
  },
  computed: {
    optAuth() {
      return bsmp.util.mapAuth({
        search: "risk_customer_portrait_search"
      });
    },
  },
  mounted() {
    this.getScoreCard();
  },
  methods: {

    showDialog() {
      this.dialog.show = true;
      this.getStandards();
    },

    showItem(index, item) {
      item.isShow = !item.isShow;
      this.items.splice(index, item);
    },

    /**
     * 获取标准说明
     */
    getStandards() {

      switch(this.dialog.card) {
        case 'score': // 评分标准
          this.getScoreCardDetail();
          break;
        case 'sample': // 样本数
          this.getScoreCardSample();
          break;
        case 'label': // 用户标签
          this.getScoreCardLabel();
          break;
        case 'scatterPlot': // 图片
        case 'histogram': // 图片
          this.getScoreCardPictrue(this.dialog.card);
          break;
      }
    },

    query() {
      if (!this.search.id && !this.search.name && !this.search.account && !this.search.phone) {
        this.$message.warning('至少填写一项查询条件！');
        return;
      }

      let idCardRegx = /(^\d{6,20}$)|(^\d{17}(\d|X|x)$)/; // 6到20位的数字或者17位数字加1位数字或者字母
      if(this.search.id && !idCardRegx.test(this.search.id)){
        this.$message.warning(`请填写正确的身份证号码！`);
        return;
      }

      let mobilePhoneRegx = /^[0-9]{8,20}$/; // 手机号码为8到20位的纯数字
      if(this.search.phone && !mobilePhoneRegx.test(this.search.phone)){
        this.$message.warning(`请填写正确的手机号码！`);
        return;
      }

      let params = bsmp.util.deleteBlank(this.search);

      this.loading = true;
      api.getCustomerPortraitScore(params).then(res => {
        this.loading = false;
        let data = res.data;
        if (data && data.code === "0") {
          this.items = data.data;
          this.handleItems();
        }
      }).catch(e => {
        this.loading = false;
      });
    },

    handleItems() {
      if (!this.items || !this.items.length) {
        return;
      }

      this.total = 0;
      this.items = this.items.map((item) => {
        if (item.code === '0') {
          this.total++;
          item.isShow = true;

          if (item.labelAll) {
            item.labels = item.labelAll.split(',');
            item.colors = item.riskColor.split(',');
          }

          let count = 0;
          for (let key in item.resultMap) {

            for (let o in item.resultMap[key]) {
              count = 0;
              for (let t in item.resultMap[key][o]) {
                count++;
              }
              item.resultMap[key][o]['rowspan'] = count;
              item.resultMap[key]['rowspan'] = (item.resultMap[key]['rowspan'] || 0 ) + count;
            }
          }

          let level1 = [], level2 = [], level3 = [], row = null;
          for (let key in item.resultMap) {
            level1.push({text: key, rowspan: item.resultMap[key]['rowspan']});

            for (let o in item.resultMap[key]) {

              if (o != 'rowspan') {
                level2.push({text: o, rowspan: item.resultMap[key][o]['rowspan']});
              }

              for (let t in item.resultMap[key][o]) {
                if (t != 'rowspan') {
                  row = item.resultMap[key][o][t];
                  row.name = t;
                  row.score = row.score || '\\';

                  level3.push(row);

                  // 补位
                  if (!level1[level3.length - 1]) {
                    level1.push('');
                  }
                  if (!level2[level3.length - 1]) {
                    level2.push('');
                  }
                }
              }
            }
          }

          item.level1 = level1;
          item.level2 = level2;
          item.level3 = level3;

          return item;
        } else {
          return null;
        }
      });
    },

    /**
     * 获取评分模型标准
     * */
    getScoreCardDetail() {
      this.dialog.scoreCard.loading = true;
      return api.getCustomerScoreCardDetail({scoreModel: this.dialog.form.scoreModel}).then(res => {
        this.dialog.scoreCard.loading = false;

        let data = res.data;
        this.dialog.scoreCard.data = {
          level1: [],
          level2: []
        };

        if (data && data.code === "0") {
          if (data.data && data.data.length) {

            let level1 = [], level2 = [];
            data.data.forEach(item => {
              level1.push({text: item.variableName, rowspan: item.details.length});

              item.details.forEach(item => {
                level2.push(item);

                // 补位
                if (!level1[level2.length - 1]) {
                  level1.push('');
                }
              });
            });

            this.dialog.scoreCard.data = {
              level1: level1,
              level2: level2
            };
          }
        }

      }).catch(e => {
        console.error(e);
      });
    },

    /**
     * 获取样本数
     * */
    getScoreCardSample() {
      this.dialog.sample.loading = true;
      return api.getCustomerScoreCardSample({scoreModel: this.dialog.form.scoreModel}).then(res => {
        this.dialog.sample.loading = false;

        let data = res.data;
        this.dialog.scoreCard.data = [];

        if (data && data.code === "0") {
          this.dialog.sample.data = data.data;
        }
        
      }).catch(e => {
        console.error(e);
      });
    },

    /**
     * 获取评分用户标签
     * */
    getScoreCardLabel() {
      this.dialog.label.loading = true;
      return api.getCustomerScoreCardLabel({scoreModel: this.dialog.form.scoreModel}).then(res => {
        this.dialog.label.loading = false;

        let data = res.data;
        this.dialog.label.data = {
          level1: [],
          level2: []
        };

        if (data && data.code === "0") {
          if (data.data && data.data.length) {

            let level1 = [], level2 = [];
            data.data.forEach(item => {
              level1.push({text: item.category, rowspan: item.labelDetails.length});

              item.labelDetails.forEach(item => {
                level2.push(item);

                // 补位
                if (!level1[level2.length - 1]) {
                  level1.push('');
                }
              });
            });

            this.dialog.label.data = {
              level1: level1,
              level2: level2
            };
          }
        }

      }).catch(e => {
        console.error(e);
      });
    },

    /**
     * 获取图片
     * */
    getScoreCardPictrue(pictureType) {
      this.dialog.picture.loading = true;
      this.dialog.picture.url = '';
      return api.getCustomerScoreCardPicture({scoreModel: this.dialog.form.scoreModel, pictureType}).then(res => {
        this.dialog.picture.loading = false;

        let data = res.data;

        if (data && data.code === "0") {
          if (data.data && data.data.pictureList && data.data.pictureList.length) {
            this.dialog.picture.url = data.data.pictureList[0].url;
          }
        }
        
      }).catch(e => {
        console.error(e);
      });
    },

    /**
     * 获取评分模型列表
     * */
    getScoreCard() {
      return api.getCustomerScoreCard().then(res => {
        let data = res.data;
        if (data && data.code === "0") {
          this.scoreCard = data.data && data.data.scoreCardList ? data.data.scoreCardList : [];
          this.search.scoreModel = this.scoreCard.length ? this.scoreCard[0] : '';
          this.dialog.form.scoreModel = this.scoreCard.length ? this.scoreCard[0] : '';
        }
      }).catch(e => {
        console.error(e);
      });
    }
  }
}

</script>
<style lang="stylus" scoped>
  .clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: "";
    clear: both;
    height: 0;
  }

  .content {
    padding: 20px;
    overflow-y: scroll;
    width: 100%;
    .item {
      border-top: #e0e0e0 1px solid;
      padding-top: 20px;
    }
    .avater {
      cursor: pointer;
    }
    .score {
      width: 100%;
      .tags {
        margin: 10px 0;
        .el-tag {
          margin-right: 10px;
        }

        .label-1 {
          background:#20a0ff;
        }
        .label-2 {
          background:#FFFF00;
          color: #0000FF;
        }
        .label-3 {
          background:#FFA500;
        }
        .label-4 {
          background:#FF0000;
        }
      }
    }
    .info-down-up {
      display: inline-block;
      width: 80px;
      height: 20px;
      text-align: center;
      cursor: pointer;
    }
  }
  .view-table {
    border-collapse: collapse;
    width: 70%;
    margin: 0 auto 20px auto;
    th {
      background-color: #f5f5f5;
      text-align: center;
      font-family: "Source Sans Pro", sans-serif;
      font-weight: 700;
      padding: 4px 8px;
      border: #e0e0e0 1px solid;
    }

    td {
      vertical-align: top;
      padding: 10px 8px 0 8px;
      border: #e0e0e0 1px solid;
      line-height: 25px;
      word-break: break-all;
    }

    .text-c {
      text-align: center;
      vertical-align: middle;
    }
  }

  .no-data {
    margin: 10px;
    font-size: 16px;
    color: #ccc;
    text-align: center;
  }

  .img-port {
    width: 100%;
    min-height: 200px;
    text-align: center;
    img {
      width: 80%;
      margin: 0 auto;
    }
  }

  .result-info {
    height: 20px;
  }
</style>
