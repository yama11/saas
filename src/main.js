import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import '@/style/index.css';
import pluginsRegister from '@/plugins';
import componentsRegister from '@/components';
import store from './store';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.use(ElementUI)
  .user(componentsRegister)
  .user(pluginsRegister);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
