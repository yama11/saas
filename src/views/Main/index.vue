<script>
/**
 * @overview 主页面容器
 */

import { token } from '@/utils';
import MainHeader from './Header';
import MainMenu from './Menu';

export default {
  name: 'Main',

  components: {
    MainHeader,
    MainMenu,
  },

  created() {
    this.$store.dispatch('initUserInfo');
  },

  beforeRouteEnter(to, from, next) {
    if (!token.get()) {
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
  display: flex;
  flex: auto;
  flex-direction: column;
  padding: 0 2.5em 2em calc(200px + 2em);
  min-height: 100vh;
  overflow-x: hidden;
}

.main-body {
  flex: auto;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  background-color: #fff;
  padding: 1em 1.5em;
}
</style>
