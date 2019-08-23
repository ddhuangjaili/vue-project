<template>
  <div id="app">
    <router-view></router-view>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import bsmp from 'bsmp_main';
  export default {
    name: 'App',
    mounted () {
      // 消息对象
      bsmp.util.vue = this;

      if (this.$route.path === '/') {
        this.getFuncs({path: this.$route.path, next: null});
      }
    },
    methods: {
      ...mapActions(['getFuncs']),
    },
    created () {

      //  hook the progress bar to start before we move router-view
      this.$router.beforeEach((to, from, next) => {
//        console.log('to:', to, ', from:', from);

        // does the page we want to go to have a meta.progress object
        if (to.meta.progress !== undefined) {
          let meta = to.meta.progress;
          // parse meta tags
          this.$Progress.parseMeta(meta)
        }
        // start the progress bar
        this.$Progress.start();

        if (!to.matched.length) {
          next({path: '/index'});
        } else {
          if (to.path !== '/login') {
            this.getFuncs({path: to.path, next: next});
          } else {
            next();
          }
        }
      });

      // hook the progress bar to finish after we've finished moving router-view
      this.$router.afterEach((to, from) => {
        // finish the progress bar
        this.$Progress.finish()
      });
    }
  };
</script>
