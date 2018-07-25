import ParentList from './index.vue';
import ParentForm from './Form';

export default [
  // 学生管理列表
  {
    path: 'parent-list',
    name: 'ParentList',
    component: ParentList,
  },
  // 学生管理列表
  {
    path: 'parent-info/:id',
    name: 'ParentInfo',
    component: ParentForm,
  },
];
