import Vue from 'vue'
import App from './App.vue'
import {router} from './router/index';
import store from '../store/index.js'
import api from './api/index'
import iView from 'view-design';
//import 'iview/dist/styles/iview.css';
import util from './lib/util.js';
import myComponents from './components/index.js'
import './my-theme/index.less'
import "../src/style/main.less";
import './directive/index'
import i18n from './locale'

Vue.prototype.$api = api;
Vue.prototype.$util = util;
Vue.use(myComponents)
Vue.config.productionTip = false
Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
