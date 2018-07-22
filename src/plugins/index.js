import assets from '@/assets';
import { http, rules, token } from '@/utils';

function checkPermission(key) {
  const permissions = this.$store.state.user.permissions;
  // eslint-disable-next-line
  return permissions.some(({ route_name }) => route_name === key);
}

/* eslint-disable no-param-reassign */
export default {
  install(Vue) {
    Vue.prototype.$http = http;
    Vue.prototype.$assets = assets;
    Vue.prototype.$rules = rules;
    Vue.prototype.$token = token;
    Vue.prototype.$permissions = checkPermission;
  },
};
