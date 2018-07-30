import RoleList from './index.vue';
import RoleEdit from './Form';

export default [
  // 约课班级管理列表
  {
    path: 'role-list',
    name: 'RoleList',
    component: RoleList,
  },
  // 约课班级详情
  {
    path: 'role-edit/:id',
    name: 'RoleEdit',
    component: RoleEdit,
  },
];
