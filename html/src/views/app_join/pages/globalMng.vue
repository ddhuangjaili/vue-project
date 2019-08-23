<template>
  <div>
    <el-form ref="messageForm" label-width="60px" class="dialog-form">
      <el-row :gutter="10">
        <el-col :span="10" :offset="5">
          <el-form-item label="消息：">
            <el-input :rows="3" type="textarea" v-model="msg" auto-complete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="10" :offset="5">
          <el-button type="primary" @click="sendMsg" class="pull-right">发 送</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import api from '../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'globalMng',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        appCode: 'fxChat',
        msg: ''
      };
    },
    methods: {
      sendMsg () {
        if (!this.msg) {
          this.$message({
            type: 'warning',
            message: '请输入要发送消息!'
          });
          return;
        }

        api.sendAppMsg(this.appCode, {msg: this.msg}).then((res) => {
          let data = res.data;
          if (data && data.code === '0') {
            this.$message({
              type: 'success',
              message: '消息推送成功!'
            });

            // 记录日志
            bsmp.log({
              component: 'app_join',
              type: 'send',
              content: `[Global] params: ${JSON.stringify({appCode: this.appCode, msg: this.msg})}`
            });
          }
        });
      }
    }
  };
</script>
