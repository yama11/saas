import FreezeList from './index.vue';
import FreezeForm from './Form';
import FreezeDispose from './Dispose';
import FreezeDetails from './Details';

export default [
  // 冻结管理列表
  {
    path: 'freeze-list',
    name: 'FreezeList',
    component: FreezeList,
  },
  // 冻结
  {
    path: 'freeze-create',
    name: 'FreezeForm',
    component: FreezeForm,
  },
  // 冻结处理
  {
    path: 'freeze-deal/:id',
    name: 'FreezeDispose',
    component: FreezeDispose,
  },
  // 冻结详情
  {
    path: 'freeze-info/:id',
    name: 'FreezeDetails',
    component: FreezeDetails,
  },
];
