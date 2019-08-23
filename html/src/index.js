// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import bsmp from 'bsmp_main';
import ElementUI from 'element-ui';

Vue.config.devtools = true;
Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.component('queryPanel', bsmp.components.queryPanel);
Vue.component('menuTreeItem', bsmp.components.menuTreeItem);

Vue.use(bsmp.components.progress.progressBar, bsmp.components.progress.options);

// 请求拦截器
bsmp.util.interceptors.init();
bsmp.util.outside(Vue);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: bsmp.router,
  store: bsmp.store,
  template: '<App/>',
  components: {App}
});

