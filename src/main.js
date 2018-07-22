import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import pluginsRegister from '@/plugins';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.use(ElementUI)
  .user(pluginsRegister);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
