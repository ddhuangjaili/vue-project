<template>
  <div>
    <el-form ref="uploadForm" label-width="120px" class="dialog-form">
      <el-row :gutter="10">
        <el-col :span="2">
          <el-upload
            v-show="optAuth.upload"
            :action="uploadFile.uploadFileUrl"
            :show-file-list="false"
            :on-success="avatarSuccess"
            :before-upload="beforeUpload"
            :on-error="avatarError"
            :data="uploadFile.uploadFileImg"
          >
            <el-button size="small">选择图片</el-button>
          </el-upload>
        </el-col>
        <el-col :span="22">
          <img v-if="imageUrl" :src="imageUrl" class="show-img">
          <img v-else src="static/images/ewm.png">
          <br><br>
          <div v-if="imageUrl">图片地址：<a href="imageUrl" target="_blank">{{imageUrl}}</a></div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import api from '../api';
  import bsmp from 'bsmp_main';
  export default {
    name: 'app_args_upload',
    props: {
      height: {
        type: Number
      }
    },
    data () {
      return {
        imageUrl: '',
        uploadFile: {
          uploadFileUrl: api.uploadUrl,
          uploadFileImg: {
            type: "AD",
            token: bsmp.util.getToken()
          }
        },
      }
    },
    computed: {
      optAuth() {
        return bsmp.util.mapAuth({
          upload: 'app_args_upload_up'
        });
      },
    },
    methods: {
      beforeUpload(file){
//        let isImg = (file.type === 'image/jpeg' || file.type === 'image/png');
//        if (!isImg) {
//          this.$message.error('上传图片格式只能是png或者jpg!');
//        }
        if (this.optAuth.upload) {
          return true;
        } else {
          this.$message.warning('无上传图片权限！');
          return false;
        }
      },
      avatarSuccess(res, file, files){
        if (res.code !== 0) {
          this.$message.error('上传图片失败' + res.msg);
          return;
        }
        this.$message.success('上传成功' + res.msg);
        this.imageUrl = res.data.url;
      },
      avatarError(err, file, fileList) {
        this.$message.error('上传图片失败' + err);
      },
    }
  };
</script>
<style lang="stylus" scoped>
  .show-img
    max-width 400px
    max-height 300px
</style>
