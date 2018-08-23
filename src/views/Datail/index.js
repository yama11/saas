import DatailList from './index.vue';
import DatailForm from './Form';

export default [
  // 用户账户管理  - 用户账户列表
  {
    path: 'detail-list',
    name: 'DatailList',
    component: DatailList,
  },
  // 用户账户列表 - 查看明细
  {
    path: 'detail-info/:id',
    name: 'DatailForm',
    component: DatailForm,
  },
];
