<script>
/**
 * @overview 主页面 - 头部
 */

import { mapState } from 'vuex';
import { passwordModify } from '../components';

export default {
  name: 'MainHeader',

  computed: {
    ...mapState({
      userName: state => state.user.user.realname,
    }),
  },

  methods: {
    preLogout() {
      this.$alert('确定退出登录？', {
        showCancelButton: true,
        type: 'warning',
      })
        .then(this.logout);
    },

    logout() {
      this.$http.post('/user/logout', {})
        .then(() => {
          localStorage.removeItem('token');

          location.href = '/login';
        });
    },

    preModifyPassword() {
      passwordModify.open();
    },
  },
};
</script>

<template>
  <div class="main-header">
    <el-dropdown>
      <span class="el-draopdown-link">
        {{ userName }}
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          @click.native="preModifyPassword"
        >
          修改密码
        </el-dropdown-item>
        <el-dropdown-item
          @click.native="preLogout"
        >
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<style lang="postcss">
.main-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 50px;
}

/* 重置element-ui */
.main-header {

  & .el-dropdown .el-draopdown-link {
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>
