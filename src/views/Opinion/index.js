import OpinionList from './index.vue';
import OpinionInfo from './Info';

export default [
  // 意见反馈列表
  {
    path: 'opinion-list',
    name: 'OpinionList',
    component: OpinionList,
  },

  // 意见反馈详情
  {
    path: 'opinion-info/:id',
    name: 'OpinionInfo',
    component: OpinionInfo,
  },
];
