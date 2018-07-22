import assets from '@/assets';

function checkPermission(key) {
  const permissions = this.$store.state.user.permissions;
  // eslint-disable-next-line
  return permissions.some(({ route_name }) => route_name === key);
}

/* eslint-disable no-param-reassign */
export default {
  install(Vue) {
    Vue.prototype.$assets = assets;
    Vue.prototype.$permissions = checkPermission;
  },
};
