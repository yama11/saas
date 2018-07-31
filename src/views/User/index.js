import List from './index.vue';
import Edition from './Edition';

/* 用户管理模块 */
export default [
  // 用户列表
  {
    path: 'user-list',
    name: 'UserList',
    component: List,
  },
  // 用户创建
  {
    path: 'user-create',
    name: 'UserCreate',
    component: Edition,
  },
  // 用户编辑
  {
    path: 'user-edit/:id',
    name: 'UserEdit',
    component: Edition,
  },
];
