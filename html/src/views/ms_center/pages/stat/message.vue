<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-select clearable v-model="search.code" filterable placeholder="应用">
            <el-option v-for="(c, key) in apps" :label="c.name" :value="c.code"
                       :key="'search-app-'+ c.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.date"
            type="daterange"
            placeholder="选择日期范围">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 85"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="date"
        :formatter="dateFmt"
        label="日期"
        width="200" sortable>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="numberStatistics"
        label="当日消息统计"
        width="500">
        <template slot-scope="scope">
          <table class="stat-table" v-if="scope.row.numberStatistics && scope.row.numberStatistics.all">
            <thead>
              <tr>
                <th>发送总数</th>
                <th>发送字节总数</th>
                <th>接受总数</th>
                <th>接受字节总数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{scope.row.numberStatistics.all.count}}</td>
                <td>{{scope.row.numberStatistics.all.byteCount}}</td>
                <td>{{scope.row.numberStatistics.all.frequencyCount}}</td>
                <td>{{scope.row.numberStatistics.all.byteFrequencyCount}}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </el-table-column>
      <el-table-column
        prop="numberStatistics"
        label="最大分钟消息统计">
        <template slot-scope="scope">
          <table class="stat-table" v-if="scope.row.numberStatistics && scope.row.numberStatistics.max">
            <thead>
            <tr>
              <th>发送总数</th>
              <th>发送字节总数</th>
              <th>接受总数</th>
              <th>接受字节总数</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{scope.row.numberStatistics.max.count}}</td>
              <td>{{scope.row.numberStatistics.max.byteCount}}</td>
              <td>{{scope.row.numberStatistics.max.frequencyCount}}</td>
              <td>{{scope.row.numberStatistics.max.byteFrequencyCount}}</td>
            </tr>
            </tbody>
          </table>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button title="查看详情" @click="showDialog(scope.$index)" size="mini"><i class="icon-eye"></i></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗框 -->
    <el-dialog title="消息详情" v-model="dialog.show" :close-on-press-escape="false" :close-on-click-modal="false">
      <el-form ref="msgForm" label-width="150px"
               class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="时间：">
              <el-date-picker
                readonly
                v-model="dialog.form.date"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="dialog.form.numberStatistics && dialog.form.numberStatistics.all">
          <el-col :span="24">
            <el-form-item label="当日消息统计：">
              <table class="stat-table">
                <thead>
                <tr>
                  <th>发送总数</th>
                  <th>发送字节总数</th>
                  <th>接受总数</th>
                  <th>接受字节总数</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>{{dialog.form.numberStatistics.all.count}}</td>
                  <td>{{dialog.form.numberStatistics.all.byteCount}}</td>
                  <td>{{dialog.form.numberStatistics.all.frequencyCount}}</td>
                  <td>{{dialog.form.numberStatistics.all.byteFrequencyCount}}</td>
                </tr>
                </tbody>
              </table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="dialog.form.numberStatistics && dialog.form.numberStatistics.max">
          <el-col :span="24">
            <el-form-item label="最大分钟消息统计：">
              <table class="stat-table">
                <thead>
                <tr>
                  <th>发送总数</th>
                  <th>发送字节总数</th>
                  <th>接受总数</th>
                  <th>接受字节总数</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>{{dialog.form.numberStatistics.max.count}}</td>
                  <td>{{dialog.form.numberStatistics.max.byteCount}}</td>
                  <td>{{dialog.form.numberStatistics.max.frequencyCount}}</td>
                  <td>{{dialog.form.numberStatistics.max.byteFrequencyCount}}</td>
                </tr>
                </tbody>
              </table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="dialog.form.numberStatistics && dialog.form.numberStatistics.personal">
          <el-col :span="24">
            <el-form-item label="个人消息统计：">
              <table class="stat-table">
                <thead>
                <tr>
                  <th>发送总数</th>
                  <th>发送字节总数</th>
                  <th>接受总数</th>
                  <th>接受字节总数</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>{{dialog.form.numberStatistics.personal.count}}</td>
                  <td>{{dialog.form.numberStatistics.personal.byteCount}}</td>
                  <td>{{dialog.form.numberStatistics.personal.frequencyCount}}</td>
                  <td>{{dialog.form.numberStatistics.personal.byteFrequencyCount}}</td>
                </tr>
                </tbody>
              </table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="dialog.form.numberStatistics && dialog.form.numberStatistics.global">
          <el-col :span="24">
            <el-form-item label="全局消息统计：">
              <table class="stat-table">
                <thead>
                <tr>
                  <th>发送总数</th>
                  <th>发送字节总数</th>
                  <th>接受总数</th>
                  <th>接受字节总数</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>{{dialog.form.numberStatistics.global.count}}</td>
                  <td>{{dialog.form.numberStatistics.global.byteCount}}</td>
                  <td>{{dialog.form.numberStatistics.global.frequencyCount}}</td>
                  <td>{{dialog.form.numberStatistics.global.byteFrequencyCount}}</td>
                </tr>
                </tbody>
              </table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="dialog.form.numberStatistics && dialog.form.numberStatistics.topic">
          <el-col :span="24">
            <el-form-item label="渠道消息统计：">
              <table class="stat-table">
                <thead>
                <tr>
                  <th>渠道ID</th>
                  <th>发送总数</th>
                  <th>发送字节总数</th>
                  <th>接受总数</th>
                  <th>接受字节总数</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(topic, key) in dialog.form.numberStatistics.topic">
                  <td>{{key}}</td>
                  <td>{{topic.count}}</td>
                  <td>{{topic.byteCount}}</td>
                  <td>{{topic.frequencyCount}}</td>
                  <td>{{topic.byteFrequencyCount}}</td>
                </tr>
                </tbody>
              </table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="dialog.form.numberStatistics && dialog.form.numberStatistics.tag">
          <el-col :span="24">
            <el-form-item label="标签消息统计：">
              <table class="stat-table">
                <thead>
                <tr>
                  <th>标签ID</th>
                  <th>发送总数</th>
                  <th>发送字节总数</th>
                  <th>接受总数</th>
                  <th>接受字节总数</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(tag, key) in dialog.form.numberStatistics.tag">
                  <td>{{key}}</td>
                  <td>{{tag.count}}</td>
                  <td>{{tag.byteCount}}</td>
                  <td>{{tag.frequencyCount}}</td>
                  <td>{{tag.byteFrequencyCount}}</td>
                </tr>
                </tbody>
              </table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="dialog.form.numberStatistics && dialog.form.numberStatistics.platform">
          <el-col :span="24">
            <el-form-item label="平台消息统计：">
              <table class="stat-table">
                <thead>
                <tr>
                  <th>平台ID</th>
                  <th>发送总数</th>
                  <th>发送字节总数</th>
                  <th>接受总数</th>
                  <th>接受字节总数</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(platform, key) in dialog.form.numberStatistics.platform">
                  <td>{{key}}</td>
                  <td>{{platform.count}}</td>
                  <td>{{platform.byteCount}}</td>
                  <td>{{platform.frequencyCount}}</td>
                  <td>{{platform.byteFrequencyCount}}</td>
                </tr>
                </tbody>
              </table>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
      </div>
    </el-dialog>
    <!-- /弹窗框 -->
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp  from 'bsmp_main';
  export default {
    name: 'messageStat',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: false,
        apps: null,
        search: {
          code: '',
          date: null
        },
        table: {
          items: []
        },
        dialog: {
          show: false,
          index: -1, // 数据下标
          form: {
            date: null,
            numberStatistics: {
              all: {
                count: 0,
                byteCount: 0,
                frequencyCount: 0,
                byteFrequencyCount: 0
              },
              max: {
                count: 0,
                byteCount: 0,
                frequencyCount: 0,
                byteFrequencyCount: 0
              },
              server: null,
              global: null,
              topic: null,
              tag: null,
              platform: null,
              personal: {
                count: 0,
                byteCount: 0,
                frequencyCount: 0,
                byteFrequencyCount: 0
              }
            }
          }
        }
      }
    },
    mounted() {
      this.getApps();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'ms_center_stat_message_view'
        });
      }
    },
    methods: {
      getApps () {
        api.getAppList({}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.apps = data.data.data;
          }
        });
      },
      /**
       * 日期格式化
       * */
      dateFmt (row) {
        return row.date ? bsmp.util.formatDate.format(new Date(row.date), 'yyyy-MM-dd') : '';
      },

      /**
       * 显示弹窗
       * */
      showDialog (index) {
        this.dialog.index = index;
        let form = Object.assign({}, this.table.items[index]);

        this.dialog.form = form;
        this.dialog.show = true;
      },
      /**
       * 取消弹窗
       * */
      cancelForm () {
        this.dialog.show = false;
      },

      /**
       * 查询
       */
      query () {
        if (!this.search.code) {
          return;
        }
        this.loading = true;
        let params = {
          code: this.search.code
        };
        if (this.search.date) {
          if (this.search.date[0]) {
            params.startTime = bsmp.util.formatDate.format(this.search.date[0], 'yyyy-MM-dd');
          }
          if (this.search.date[1]) {
            params.endTime = bsmp.util.formatDate.format(this.search.date[1], 'yyyy-MM-dd');
          }
        }
        api.statMessage(this.search.code, params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data;
          }
        }).catch(e => {
          this.loading = false;
        });
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .stat-table
    width 100%
    thead
      color #5e6d82
      background-color #eff2f7
      th
        width 20%
        text-align center
        border 1px solid rgb(223, 230, 236)
    tbody
      td
        text-align center
        border 1px solid rgb(223, 230, 236)
</style>
