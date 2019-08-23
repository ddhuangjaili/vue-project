<template>
  <div>
    <el-row class="toolbar">
      <el-button @click="query()" type="primary" icon="el-icon-refresh">刷新</el-button>
    </el-row>

    <el-tabs v-model="activeName" @tab-click="switchTab">
      <el-tab-pane label="group" name="group"></el-tab-pane>
      <el-tab-pane label="服务器" name="server"></el-tab-pane>
    </el-tabs>
    <el-table v-show="activeName === 'group'"
      highlight-current-row
      v-loading.body="loading"
      :data="table.items"
      border
      :max-height="height - 165"
      style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        prop="groupName"
        label="组名称"
        width="100" sortable>
      </el-table-column>
      <el-table-column
        prop="serverIps"
        label="所在服务器"
        width="500" sortable>
      </el-table-column>
      <el-table-column
        prop="storageCount"
        label="节点数量"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        prop="activeCount"
        label="活跃节点数量"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        prop="useCount"
        label="已存文件总数"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        prop="useSize"
        label="已存储空间大小MB"
        width="200" sortable>
      </el-table-column>
      <el-table-column
        prop="freeMB"
        label="可用空间MB"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        prop="totalMB"
        label="总空间MB"
        width="150" sortable>
      </el-table-column>
    </el-table>

    <el-table v-show="activeName === 'server'"
              highlight-current-row
              v-loading.body="loading"
              :data="table.serverItems"
              border
              :max-height="height - 165"
              style="width: 100%">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column
        prop="ipAddr"
        label="服务器地址"
        width="200" sortable>
      </el-table-column>
      <el-table-column
        prop="freeMB"
        label="可用空间MB"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        prop="totalMB"
        label="总空间MB"
        width="150" sortable>
      </el-table-column>
      <el-table-column
        prop="groupList"
        label="组列表"
        width="350" sortable>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import api from '../../api';
  export default {
    name: 'monitorFastDFS',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        loading: true,
        activeName:'group',
        table: {
          items: [],
          serverItems:[]
        }
      };
    },
    mounted () {
      this.query();
    },
    methods: {
      /**
       * 查询
       */
      query () {
        this.loading = true;
        api.monitor.fastDFS().then((res) => {
          this.loading = false;
          let data = res.data;
          if (data && data.code === '0') {
            //组
            for(let i = 0;i<data.data.length;i++) {
              let group = data.data[i];
              group.serverIps = "";
              if(group.serverList) {
                group.serverList.forEach(groupServer => {
                  group.serverIps += "  " + groupServer.ipAddr+":"+groupServer.storagePort;
                });
              }
            }
            this.table.items = data.data;






            //服务器
            let serverMap = {};
            for(let i = 0;i<data.data.length;i++){
              let group = data.data[i];
              if(group.serverList){
                group.serverList.forEach(groupServer=>{
                  let server = serverMap[groupServer.ipAddr];
                  if(!server){
                    server = groupServer;
                    serverMap[groupServer.ipAddr] = server;
                  }
                  let serverGroups = server.groups;
                  if(!serverGroups){
                    serverGroups = new Set();
                    server.groups = serverGroups;
                  }
                  serverGroups.add(group.groupName);
                  server.groupList = [...serverGroups].join(",");
                });
              }
              let serverList = [];

              for(var key in serverMap){
                serverList.push(serverMap[key]);
              }

              this.table.serverItems = serverList;
            }
          }
        }).catch(e => {
          this.loading = false;
        });
      },
      switchTab(){
      }
    }
  };
</script>
