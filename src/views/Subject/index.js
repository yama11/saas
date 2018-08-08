import SubjectList from './index.vue';
import SubjectEdition from './Edition';

export default [
  // 课时列表
  {
    path: 'subject-list',
    name: 'SubjectList',
    component: SubjectList,
  },
  // 课时编辑
  {
    path: 'subject-edition/:id',
    name: 'SubjectEdition',
    component: SubjectEdition,
  },
];
