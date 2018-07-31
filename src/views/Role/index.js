import List from './index.vue';
import Edition from './Edition';

export default [
  /* 角色管理模块 */
  {
    path: 'role-list',
    name: 'RoleList',
    component: List,
  },
  {
    path: 'role-create',
    name: 'RoleCreate',
    component: Edition,
  },
  {
    path: 'role-edit/:id',
    name: 'RoleEdit',
    component: Edition,
  },
];
