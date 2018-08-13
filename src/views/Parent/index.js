import ParentList from './index.vue';
import ParentForm from './Form';

export default [
  // 家长管理列表
  {
    path: 'client-list',
    name: 'ParentList',
    component: ParentList,
  },
  // 家长详情
  {
    path: 'client-info/:id',
    name: 'ParentInfo',
    component: ParentForm,
  },
];
