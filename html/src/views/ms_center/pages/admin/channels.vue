<template>
  <div>
    <el-row class="toolbar">
      <el-button title="刷新" v-show="optAuth.search" @click="query()" type="primary" size="small">
        <i class="icon-arrows-cw"></i>&nbsp;&nbsp;刷新
      </el-button>
      <el-button v-show="optAuth.shutdownAll" @click="shutdown()" type="danger">全部关闭</el-button>
    </el-row>
    <el-table
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 45"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        prop="id"
        label="服务运行ID"
        width="150">
      </el-table-column>
      <el-table-column
        prop="name"
        label="服务名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="ip"
        label="服务IP"
        width="200">
      </el-table-column>
      <el-table-column
        prop="time"
        :formatter="dateFmt"
        label="服务启动时间"
        width="200">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="onlineCount"
        label="在线总数">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button v-show="optAuth.shutdown" @click="shutdown(scope.row.id)" type="danger">关闭</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import api from '../../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'admin-channels',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        search: {
          company: ''
        },
        table: {
          items: []
        }
      };
    },
    mounted () {
      this.query();
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          search: 'ms_center_admin_channels_view',
          shutdownAll: 'ms_center_admin_channels_shutdownAll',
          shutdown: 'ms_center_admin_channels_shutdown'
        });
      }
    },
    methods: {
      /**
       * 日期格式化
       * */
      dateFmt (row) {
        return row.time ? bsmp.util.formatDate.format(new Date(row.time), 'yyyy-MM-dd hh:mm:ss') : '';
      },

      shutdown (serverId) {
        this.$confirm('确定要关闭' + (serverId ? serverId : '全部') + '?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 新增
          api.adminShutdownChannel(serverId).then((res) => {
            let data = res.data;
            if (data && data.code === '0') {
              this.$message({
                type: 'success',
                message: '关闭成功!'
              });
              this.query();

              // 记录日志
              bsmp.log({
                component: 'ms_center',
                type: 'shutdown',
                content: `[AdminChannels] params: ${JSON.stringify({serverId})}`
              });
            }
          });
        }).catch(e => {
        });
      },

      /**
       * 查询
       */
      query () {
        this.loading = true;
        api.adminGetChannels().then((res) => {
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
