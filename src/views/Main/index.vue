<script>
/**
 * @overview 主页面容器
 */

import { mapState } from 'vuex';

export default {
  name: 'Main',

  computed: {
    ...mapState({
      userName: state => state.user.user.name,
    }),
  },

  created() {
    this.$store.dispatch('initUserInfo');
  },

  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
    } else {
      next();
    }
  },
};
</script>

<template>
  <div class="main">
    <MainMenu />

    <div class="main-content">
      <MainHeader />

      <router-view class="main-body"/>
    </div>
  </div>
</template>

<style lang="postcss">
.main {
  background-color: #f2f6fc;
}

.main-content {
  flex: auto;
  display: flex;
  flex-direction: column;
  padding: 0 2.5em 2em calc(200px + 2em);
  min-height: 100vh;
  overflow-x: hidden;
}

.main-main {
  flex: auto;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  background-color: #fff;
}
</style>
