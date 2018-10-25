import Vue from 'vue';
import Vuex from 'vuex';
import { http } from '@/utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      permissions: [],
      user: {},
    },

    roleType: null,
  },

  mutations: {
    initUserInfo(state, user) {
      state.user = user;

      state.roleType = user.user.role.role_type;
    },
  },

  actions: {
    initUserInfo({ commit }) {
      http.get('/user/init')
        .then(res => commit('initUserInfo', res));
    },
  },
});
