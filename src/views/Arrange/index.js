import ArrangeList from './index.vue';
import ArrangeForm from './Form';

export default [
  // 上课安排列表
  {
    path: 'arrange-list',
    name: 'ArrangeList',
    component: ArrangeList,
  },
  // 上课班级详情
  {
    path: 'arrange-info/:id',
    name: 'ArrangeForm',
    component: ArrangeForm,
  },
];
