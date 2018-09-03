import FreezeList from './index.vue';
import FreezeForm from './Form';
import FreezeDispose from './Dispose';
import FreezeDetails from './Details';

export default [
  // 挂起管理列表
  {
    path: 'freeze-list',
    name: 'FreezeList',
    component: FreezeList,
  },
  // 挂起
  {
    path: 'freeze-create',
    name: 'FreezeForm',
    component: FreezeForm,
  },
  // 挂起处理
  {
    path: 'freeze-deal/:id',
    name: 'FreezeDispose',
    component: FreezeDispose,
  },
  // 挂起详情
  {
    path: 'freeze-info/:id',
    name: 'FreezeDetails',
    component: FreezeDetails,
  },
];
