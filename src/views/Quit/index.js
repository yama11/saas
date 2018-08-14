import QuitList from './index.vue';
import QuitForm from './Form';
import QuitDispose from './Dispose';
import QuitDetails from './Details';

export default [
  // 退班管理列表
  {
    path: 'quit-list',
    name: 'QuitList',
    component: QuitList,
  },
  // 退班
  {
    path: 'quit-create',
    name: 'QuitForm',
    component: QuitForm,
  },
  // 退班处理
  {
    path: 'quit-deal/:id',
    name: 'QuitDispose',
    component: QuitDispose,
  },
  // 退班详情
  {
    path: 'quit-info/:id',
    name: 'QuitDetails',
    component: QuitDetails,
  },
];
