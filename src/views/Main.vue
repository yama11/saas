<script>
import { mapState } from 'vuex';
import { modifyPassword } from './components';

export default {
  name: 'Main',

  data() {
    return {
      menus: [
        {
          name: '课程中心',
          permission: 'curriculum',
          children: [
            {
              name: '教材管理',
              permission: 'curriculum.material',
              index: '/material-list',
            },
            {
              name: '发布管理',
              permission: 'curriculum.curriculum',
              index: '/course-list',
            },
            {
              name: '课程包发布',
              permission: 'curriculum.packet',
              index: '/coursePackage-list',
            },
            {
              name: '订单管理',
              permission: 'curriculum.order',
              index: '/order-list',
            },
          ],
        },
        {
          name: '用户中心',
          permission: 'user',
          children: [
            {
              name: '学生列表',
              permission: 'user.student',
              index: '/student-list',
            },
            {
              name: '签约管理',
              permission: 'user.contract',
              index: '/contract-list',
            },
            {
              name: '班级管理',
              permission: 'user.class',
              index: '/class-list',
            },
            {
              name: '答疑记录',
              permission: 'user.mistake',
              index: '/mistake-list',
            },
          ],
        },
        {
          name: '系统中心',
          permission: 'system',
          children: [
            {
              name: '生源学校',
              permission: 'system.school',
              index: '/school-list',
            },
            {
              name: '流程管理',
              permission: 'system.flow',
              index: '/process-list',
            },
            {
              name: '角色管理',
              permission: 'system.role',
              index: '/role-list',
            },
            {
              name: '用户管理',
              permission: 'system.user',
              index: '/user-list',
            },
            {
              name: '培训机构',
              permission: 'system.department',
              index: '/organization',
            },
            {
              name: '版本管理',
              permission: 'system.package',
              index: '/package-list',
            },
          ],
        },
        {
          name: '营销中心',
          permission: 'marketing',
          children: [
            {
              name: '活动管理',
              permission: 'marketing.activity',
              index: '/market-list',
            },
          ],
        },
        {
          name: '平台维护',
          permission: 'platform',
          children: [
            {
              name: '课堂表现',
              permission: 'platform.dimension',
              index: '/classroom-list',
            },
            {
              name: '家长管理',
              permission: 'platform.wechatuser',
              index: '/parent-list',
            },
            {
              name: '游戏管理',
              permission: 'platform.game',
              index: '/game-list',
            },
          ],
        },
      ],
    };
  },

  computed: {
    ...mapState({
      userName: state => state.user.user.name,
    }),

    defaultActive() {
      return this.$route.path;
    },
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

  methods: {
    /**
     * @param {String} index 菜单项的唯一标识，同时也是点击该菜单项所进入的页面路由
     */
    onSelectMenu(index) {
      this.$router.push(`${index}?page=1&per_page=10`);
    },

    preLogout() {
      this.$alert('确定退出登录？', {
        showCancelButton: true,
        type: 'warning',
      })
        .then(this.logout);
    },

    logout() {
      this.$http.post('/user/logout', {})
        .then(this.$http.removeToken);
    },

    preModifyPassword() {
      modifyPassword.open();
    },
  },
};
</script>

<template>
  <div class="main">
    <div class="main-menu">
      <h1 class="main-menu__title">麦克斯韦管理后台</h1>
      <el-menu
        :default-active="defaultActive"
        mode="vertical"
        unique-opened
        @select="onSelectMenu"
      >
        <el-submenu
          v-for="menu in menus"
          v-if="$permissions(menu.permission)"
          :key="menu.permission"
          :index="menu.permission"
        >
          <span slot="title">{{ menu.name }}</span>
          <el-menu-item
            v-for="submenu in menu.children"
            v-if="$permissions(submenu.permission)"
            :key="submenu.index"
            :index="submenu.index"
            style="padding-left:62px;"
          >
            <span slot="title">{{ submenu.name }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <div class="main-content">
      <div class="main-header">
        <el-dropdown>
          <span class="el-draopdown-link">{{ userName }}</span>
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

      <router-view class="main-main"/>
    </div>
  </div>
</template>

<style lang="postcss">
.main {
  background-color: #f2f6fc;
}

.main-menu {
  position: fixed;
  margin-right: 2em;
  top: 0;
  left: 0;
  height: 100vh;
  width: 200px;
  text-align: center;
  background-color: #fff;
}

.main-menu::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background-color: #e6e6e6;
}

.main-menu__title {
  padding: 1em 0;
  border-bottom: 1px solid #e6e6e6;
  font-size: 1.25rem;
}

.el-submenu__title {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
}

.main-content {
  flex: auto;
  display: flex;
  flex-direction: column;
  padding: 0 2.5em 2em calc(200px + 2em);
  min-height: 100vh;
  overflow-x: hidden;
}

.main-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 50px;
}

.main-main {
  flex: auto;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  background-color: #fff;
}

/* 重置element-ui */

.main {

  & .el-dropdown .el-draopdown-link {
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: var(--color-primary);
    }
  }
}
</style>
