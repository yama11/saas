import ChangeList from './index.vue';
import ChangeForm from './Form';
import ChangeDetails from './Details';
import ChangeDispose from './Dispose';

export default [
  // 转班管理列表
  {
    path: 'change-list',
    name: 'ChangeList',
    component: ChangeList,
  },
  // 转班
  {
    path: 'change-create',
    name: 'ChangeForm',
    component: ChangeForm,
  },
  // 转班详情
  {
    path: 'change-info/:id',
    name: 'ChangeDetails',
    component: ChangeDetails,
  },
  // 转班处理
  {
    path: 'change-deal/:id',
    name: 'ChangeDispose',
    component: ChangeDispose,
  },
];
