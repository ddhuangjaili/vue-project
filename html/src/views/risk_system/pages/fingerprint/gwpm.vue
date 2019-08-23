<template>
  <div v-loading="loading">
    <iframe :src="frameUrl" frameborder="0"
            :style="{height: (height - 10) + 'px', width: '100%'}">
    </iframe>
  </div>
</template>
<script>

export default {
  name: "gwpm",
  props: {
    height: {
      type: Number
    }
  },
  data() {
    return {
      loading: true,
      domain: 'local',
      frameUrl: '',
      config: {
        bsmp: 'https://sjmdoffice.gwghk.com/caesar-admin/account_login?userName=gw@pm.com&password=42f749ade7f9e195bf475f37a44cafcb',
        local: 'http://192.168.75.240:9000/caesar-admin/account_login?userName=gw@pm.com&password=42f749ade7f9e195bf475f37a44cafcb'
      }
    }
  },
  mounted() {
    if (/^http:\/\/localhost*|^https?:\/\/(\d{1,3}\.){3}\d{1,3}.+/.test(window.location.href)) {
      this.domain = 'local';
    } else {
      this.domain = 'bsmp';
    }

    this.frameUrl = this.config[this.domain];

    setTimeout(() => {
      this.loading = false;
    }, 5000);
  }
}
</script>
