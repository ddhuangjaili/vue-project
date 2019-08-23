<template>
  <el-dialog 
    :title="dialog.title" 
    v-model="dialog.isShow" 
    :size="dialog.size" 
    :close-on-press-escape="false" 
    :close-on-click-modal="false"
    @close="onClose"
    @open="onOpen">
      <el-row class="manager">
        <el-col :span="6">
          <h3>推送渠道<el-button type="primary" icon="plus" size="small" @click="doAddItemTo('channel')"></el-button></h3>
          <el-menu @select="doSelectChannel">
            <el-menu-item v-for="(item, index) in config.channel" :key="'channel_'+item.code" :index="index+''">
              {{item.name}}
              <i class="el-icon-delete2" @click="deleteItem('channel', index, $event)"></i>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="6">
          <h3>推送位置<el-button type="primary" icon="plus" size="small" @click="doAddItemTo('spot')" :disabled="!selected.channel"></el-button></h3>
          <el-menu @select="doSelectSpot">
            <el-menu-item 
              v-for="(item, index) in config.spot"
              v-if="selected.channel && item.parentCode==selected.channel.code" 
              :key="'channel_'+item.code" :index="index+''">
              {{item.name}}
              <i class="el-icon-delete2" @click="deleteItem('spot', index, $event)"></i>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="6">
          <h3>客户类型<el-button type="primary" icon="plus" size="small" @click="doAddItemTo('clientType')" :disabled="!selected.spot"></el-button></h3>
          <el-menu @select="doSelectClientType">
            <el-menu-item 
              v-for="(item, index) in config.clientType"
              v-if="selected.spot && item.parentCode==selected.spot.code"  
              :key="'channel_'+item.code" :index="index+''">
              {{item.name}}
              <i class="el-icon-delete2" @click="deleteItem('clientType', index, $event)"></i>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="6">
          <h3>推送类型<el-button type="primary" icon="plus" size="small" @click="doAddItemTo('type')"></el-button></h3>
          <el-menu>
            <el-menu-item v-for="(item, index) in config.type" :key="'channel_'+item.code" :index="index+''">
              {{item.name}}
              <i class="el-icon-delete2" @click="deleteItem('type', index, $event)"></i>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveConfig">确 定</el-button>
        <el-button @click="dialog.isShow = false">取 消</el-button>
      </div>
  </el-dialog>
</template>
<script>
import api from "../api";
import bsmp  from "bsmp_main";
import transferItem from './transferItem.vue';
export default {
  name: "push-config-manager",
  components: {
      transferItem
    },
  props: {
    isActive: {
      type: Boolean
    },
    dictList: {
      type: Array
    }
  },
  data(){
    return {
      dialog: {
        title: "推送配置管理",
        isShow: false,
        size: "large"
      },
      config:{
        channel:[],
        clientType:[],
        type:[],
        spot:[]
      },
      selected:{
        channel: null,
        clientType: null,
        type:null,
        spot: null
      }
    }
  },
  watch: {
    isActive(value) {
      return (this.dialog.isShow = value || false);
    }
  },
  methods:{
    onClose(){
      this.$emit("dialogClose");
    },
    onOpen(){
      this.dictList.forEach((dict) => {
        let map = null;
        switch (dict.fieldCode) {
          case 'p_channel':
            this.config.channel = dict.items;
            break;
          case 'p_clientType':
            this.config.clientType = dict.items;
            break;
          case 'p_type':
            this.config.type = dict.items;
            break;
          case 'p_spot':
            this.config.spot = dict.items;
            break;
        }
      });
    },
    renderContent(h, {key, label, isActive}) {
      return this.$createElement('transferItem', {
        props: {
          val: key + '',
          label,
          isActive
        },
        on: {
          'trash': (data) => {
            this.operateDict('delete', data);
          }
        }
      });
    },
    cleanAfterDeleted(){
      let channel = this.config["channel"],
          spot = this.config["spot"],
          clientType = this.config["clientType"];
      let indexes = [];
      spot.forEach((item, i) => {
        if(!item.parentCode){
          return;
        }
        if(channel.every(c => c.code !== item.parentCode)){
          indexes.push(i);
        };
      });
      indexes.forEach(i => spot.splice(i, 1));
      indexes = [];
      clientType.forEach((item, i) => {
        if(!item.parentCode){
          return;
        }
        if(spot.every(c => c.code !== item.parentCode)){
          indexes.push(i);
        };
      });
      indexes.forEach(i => clientType.splice(i, 1));
    },
    deleteItem(name, index, e){
      let group = this.config[name];
      if(name == "channel" || name == "spot"){  
        this.$confirm('此操作将影响到其他项, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            group.splice(index, 1);
            this.cleanAfterDeleted();//关联删除
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        }
        else {
          group.splice(index, 1);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }
    },
    doSelectChannel(index){
      this.selected.channel = this.config.channel[index] || null;
      this.selected.spot = null;
    },
    doSelectSpot(index){
      this.selected.spot = this.config.spot[index] || null;
      this.selected.clientType = null;
    },
    doSelectClientType(index){
      this.selected.clientType = this.config.clientType[index] || null;
    },
    checkItemByName(value, type){
      let items = this.config[type];
      if(value.length === 0){
        return false;
      }
      if(items.some(item => item.parentCode && item.name === value)){
        return "名字已经存在在此类别里，请重新输入。"
      }
      return true;
    },
    doAddItemTo(name){
      if(!this.config[name]){
        return;
      }
      this.$prompt("请输入名字", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: val => this.checkItemByName(val, name)
      })
      .then(({value}) => {
        let newItem = {
          code: Date.now(),
          name: value,
          isActive: 1
        };
        if(name == "spot" || name == "clientType"){
          let selectedItem = name == "spot" ? this.selected.channel : this.selected.spot;
          newItem.parentCode = selectedItem.code;
        }
        this.config[name].push(newItem);
      })
      .catch(_ => {
        this.$message('什么也没做哦！');
      });
    },
    saveConfig(){
      let promiseArray = [], _this = this;
      Object.keys(this.config).forEach(key => {
        promiseArray.push(_this.saveConfigFor(key, this.config[key]));
      });
      Promise.all(promiseArray).then(reses => {
        this.$message.success('保存推送配置成功!');
        this.$emit("onSaveConfig");
        this.dialog.isShow = false;
      }).catch(e => {
        this.$message.warning("保存推送项配置失败：", e.message);
      })
    },
    saveConfigFor(name, items){
        let params = {
          fieldCode: `p_${name}`,
          items
        };
        // 记录日志
        bsmp.log({
              component: 'push_center',
              type: 'modify',
              content: `[ContentInfo] params: p_${name} - ${JSON.stringify(items)}`
            });
        return api.updateDict(params);
    }
  }
}
</script>
<style scoped>
  .manager h3{
    width: 280px;
    line-height: 30px;
    position: relative;
  }
  .manager h3 .el-button{
    position: absolute;
    right: 3px;
  }
  .manager .el-menu{
    width: 280px;
    min-height: 400px;
  }
  .manager .el-menu-item i[class^='el-icon-']{
    display:none;
    position: absolute;
    right: 3px;
    top: 10px;
  }
  .manager .el-menu-item:hover i[class^='el-icon-']{
    display:inline-block;
  }
</style>
