<template>
  <div>
    <query-panel>
      <el-form :inline="true" :model="search" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search.orderId" placeholder="订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.sendId" placeholder="发送人id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.sendName" placeholder="发送人昵称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.receiveId" placeholder="接收人id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="search.receiveName" placeholder="接收人昵称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="search.sendStatus" placeholder="状态">
            <el-option v-for="(val, key) in sendStatusMap" :label="val" :value="key"
                       :key="'sendStatus-'+ key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            clearable
            v-model="search.datetime"
            type="daterange"
            placeholder="时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-show="optAuth.search" type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </query-panel>

    <el-row class="toolbar">
      <el-button type="primary" v-show="optAuth.export" @click="handleDownload" title="导出"
                 :loading="downloading"><i class="icon-download"></i>&nbsp;&nbsp;导出
      </el-button>
    </el-row>

    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 165"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="dateTime"
        :formatter="createDateFmt"
        width="200"
        label="时间">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="orderId"
        label="订单号"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="userId"
        label="发送人ID"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="nickname"
        label="发送人昵称"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="toUser.userId"
        :formatter="receiveUserIdFmt"
        label="接收人ID"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="toUser.nickname"
        :formatter="receiveNicknameFmt"
        label="接收人昵称"
        width="150">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="sendStatus"
        label="状态"
        :formatter="sendStatusFmt"
        width="150">
      </el-table-column>
      <el-table-column
        label="内容">
        <template slot-scope="scope">
          <img v-if="scope.row.content.type === 'image'"
               v-show="scope.row.content.value"
               :src="scope.row.content.value"
               class="min-img"
               @click="showImage(scope.row.content.value)"
          />
          <span v-else>{{scope.row.content.value}}</span>
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
  import bsmp  from 'bsmp_main';
  export default {
    name: 'chatMsg',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        downloading: false,
        search: {
          orderId: '',
          sendId: '',
          sendName: '',
          receiveId: '',
          receiveName: '',
          datetime: null,
          sendStatus: ''
        },
        table: {
          items: [],
          pager: {
            pageSize: 20,
            pageNo: 1,
            total: 0
          }
        },
        sendStatusMap: {
          '1': '已发送',
          '2': '已送达'
        }
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'vc_gz_chatMsg_view',
          export: 'vc_gz_chatMsg_export'
        });
      }
    },
    methods: {
      receiveUserIdFmt(row) {
        if (row.toUser && row.toUser.userId) {
          return row.toUser.userId
        }
        return '';
      },
      receiveNicknameFmt(row) {
        if (row.toUser && row.toUser.nickname) {
          return row.toUser.nickname
        }
        return '';
      },
      contentFmt(row) {
        if (row.content && row.content.value) {
          return row.content.value
        }
        return '';
      },
      /**
       * 日期格式化
       * */
      createDateFmt (row) {
        return row.dateTime ? bsmp.util.formatDate.format(new Date(row.dateTime), 'yyyy-MM-dd hh:mm:ss') : '';
      },
      sendStatusFmt(row) {
        return typeof row.sendStatus !== 'undefined' ? this.sendStatusMap[row.sendStatus] : '';
      },
      dateToStr(date) {
        return bsmp.util.formatDate.format(date, 'yyyy-MM-dd hh:mm:ss');
      },

      showImage(url) {
        this.$msgbox({
          title: '图片预览',
          customClass: 'm-message-box-img',
          message: this.$createElement('img', {style: 'color: teal', attrs: {src: url}}),
        }).catch(() => {

        });
      },

      handleDownload() {

        if (!this.table.items.length) {
          this.$message.warning('查询结果为空，没有可导出的数据！');
          return;
        }

        let params = bsmp.util.deleteBlank(this.search);
        params = Object.assign({}, params, this.table.pager);

        params.pageNumber = 1;
        params.pageSize = 1000000;

        this.downloading = true;
        api.getChatMsgList(params).then((res) => {
          let data = res.data, items = [];

          if (data && data.code === '0') {
            if (data.data.data instanceof Array) {
              items = data.data.data;

              let filedHeader = ['时间', '订单号', '发送人ID', '发送人昵称',
                  '接收人ID', '接收人昵称', '内容'],
                fieldNames = ['dateTime', 'orderId', 'userId', 'nickname',
                  'receiveUserId', 'receiveNickname', 'content'];

              let filedData = bsmp.util.excellentExport.formatJson(fieldNames, items, {
                dateTime: {map: this.createDateFmt, tab: true},
                orderId: {tab: true},
                userId: {tab: true},
                receiveUserId: {map: this.receiveUserIdFmt, tab: true},
                receiveNickname: {map: this.receiveNicknameFmt},
                content: {map: this.contentFmt}
              });
              bsmp.util.excellentExport.csvByData('聊天内容管理.csv', filedHeader, filedData);
            }
            this.downloading = false;
          }
        });
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        let params = bsmp.util.deleteBlank(this.search);
        params = Object.assign({}, params, this.table.pager);
        if (this.search.datetime && this.search.datetime.length) {
          if (this.search.datetime[0]) {
            params.startDate = new Date(this.dateToStr(this.search.datetime[0])).getTime();
          }
          if (this.search.datetime[1]) {
            params.endDate = new Date(this.dateToStr(new Date(this.search.datetime[1].setHours(23, 59, 59, 0)))).getTime();
          }
        }
        delete params.datetime;
        api.getChatMsgList(params).then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            this.table.items = data.data.data;
            this.table.pager = Object.assign({}, this.table.pager,
              {
                pageNo: parseInt(data.data.pageNo, 10),
                total: data.data.total
              });
          }
        });
      },

      /**
       * 每页显示条数变化
       * @param val
       */
      handleSizeChange (val) {
        this.table.pager.pageSize = val;
        this.query();
      },

      /**
       * 页码变化
       * @param val
       */
      handleCurrentChange (val) {
        if (this.table.pager.pageNo) {
          this.table.pager.pageNo = val;
          this.query();
        }
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .min-img
    width: auto;
    height: 50px;
    cursor: pointer;
</style>

