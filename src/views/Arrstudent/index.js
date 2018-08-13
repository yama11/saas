import IntentionList from './index.vue';
import IntentionForm from './Form';

export default [
  // 约课学生列表
  {
    path: 'intention-list',
    name: 'IntentionList',
    component: IntentionList,
  },
  // 查看详情
  {
    path: 'intention-edit/:id',
    name: 'IntentionForm',
    component: IntentionForm,
  },
];
