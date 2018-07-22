import SubjectList from './index.vue';
import SubjectEdition from './Edition';

export default [
// 学科列表
  {
    path: 'subject-list',
    name: 'SubjectList',
    component: SubjectList,
  },
  // 学科结构编辑
  {
    path: 'subject-edition',
    name: 'SubjectEdtion',
    component: SubjectEdition,
  },
];
