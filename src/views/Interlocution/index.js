import InterlocutionList from './index.vue';
import InterlocutionForm from './Form';

export default [
  // 帮助中心列表
  {
    path: 'interlocution-list',
    name: 'InterlocutionList',
    component: InterlocutionList,
  },

  // 帮助中心新增
  {
    path: 'interlocution-create',
    name: 'InterlocutionCreate',
    component: InterlocutionForm,
  },

  // 帮助中心编辑
  {
    path: 'interlocution-edit/:id',
    name: 'InterlocutionEdit',
    component: InterlocutionForm,
  },
];
