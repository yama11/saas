<script>
/**
 * @overview 主页面 - 菜单
 */

export default {
  name: 'MainMenu',

  data: () => ({
    menus: [
      {
        name: '课程中心',
        permission: 'curriculum_center',
        children: [
          {
            name: '学科管理',
            permission: 'curriculum_center.subject',
            index: '/subject-list',
          },
          {
            name: '课时内容',
            permission: 'curriculum_center.course',
            index: '/courseware-list',
          },
          {
            name: '课程管理',
            permission: 'curriculum_center.curriculum',
            index: '/curriculum-list',
          },
        ],
      },
      {
        name: '商品中心',
        permission: 'shop',
        children: [
          {
            name: '品类管理',
            permission: 'shop.category',
            index: '/category-list',
          },
          {
            name: '商品管理',
            permission: 'shop.merchandise',
            index: '/product-list',
          },
          {
            name: '订单管理',
            permission: 'shop.order',
            index: '/order-list',
          },
          {
            name: '优惠券管理',
            permission: 'shop.coupon',
            index: '/discount-list',
          },
        ],
      },
      {
        name: '用户中心',
        permission: 'user',
        children: [
          {
            name: '学生管理',
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
            name: '直播室管理',
            permission: 'system.liveroom',
            index: '/liveroom-list',
          },
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
            name: '版本管理',
            permission: 'system.package',
            index: '/package-list',
          },
          {
            name: '培训机构',
            permission: 'system.department',
            index: '/organization',
          },
        ],
      },
      {
        name: '排班上课',
        permission: 'schedule_center',
        children: [
          {
            name: '约课班级',
            permission: 'schedule_center.class',
            index: '/class-list',
          },
          {
            name: '约课学生',
            permission: 'schedule_center.intention',
            index: '/intention-list',
          },
          {
            name: '上课安排',
            permission: 'schedule_center.class',
            index: '/arrange-list',
          },
        ],
      },
      {
        name: '变更调度',
        permission: 'dispatch_center',
        children: [
          {
            name: '转班管理',
            permission: 'dispatch_center.change',
            index: '/change-list',
          },
          {
            name: '退班管理',
            permission: 'dispatch_center.quit',
            index: '/quit-list',
          },
          {
            name: '冻结管理',
            permission: 'dispatch_center.freeze',
            index: '/freeze-list',
          },
        ],
      },
      {
        name: '注册用户',
        permission: 'member_center',
        children: [
          {
            name: '学生管理',
            permission: 'member_center.student',
            index: '/student-list',
          },
          {
            name: '家长管理',
            permission: 'member_center.client',
            index: '/client-list',
          },
        ],
      },
    ],
  }),

  computed: {
    defaultActive() {
      return this.$route.path;
    },
  },

  methods: {
    /**
     * @param {String} index 菜单项的唯一标识，同时也是点击该菜单项所进入的页面路由
     */
    onSelectMenu(index) {
      const specialList = [
        '/subject-list',
      ];

      const path = specialList.includes(index)
        ? index
        : `${index}?page=1&per_page=10`;

      this.$router.push(path);
    },
  },
};
</script>

<template>
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
</template>

<style lang="postcss">
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

.main-menu .el-submenu__title {
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
}
</style>
