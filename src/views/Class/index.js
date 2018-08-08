import ClassList from './index.vue';
import ClassInfo from './Form';

export default [
// 约课班级管理列表
  {
    path: 'class-list',
    name: 'ClassList',
    component: ClassList,
  },
  // 约课班级详情
  {
    path: 'class-info/:id',
    name: 'ClassInfo',
    component: ClassInfo,
  },
];
