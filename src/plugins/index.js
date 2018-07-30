import assets from '@/assets';
import { http, rules, token } from '@/utils';

function checkPermission(key, data) {
  const permissions = this.$store.state.user.permissions;

  const bool = permissions
    .some(({ route_name }) => route_name === key);

  return data === undefined ? bool : (bool && data);
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
