import ArrstudentList from './index.vue';
import ArrstudentForm from './Form';

export default [
  // 约课学生列表
  {
    path: 'user-list',
    name: 'ArrstudentList',
    component: ArrstudentList,
  },
  // 查看详情
  {
    path: 'user-edit/:id',
    name: 'ArrstudentForm',
    component: ArrstudentForm,
  },
];
