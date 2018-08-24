import DrawList from './index.vue';
import DrawDispose from './Dispose';
import DrawDetails from './Details';

export default [
  // 用户提现  - 提现管理列表
  {
    path: 'draw-list',
    name: 'DrawList',
    component: DrawList,
  },
  // 用户提现  - 提现详情
  {
    path: 'draw-info/:id',
    name: 'DrawDetails',
    component: DrawDetails,
  },
  // 用户提现  - 提现处理
  {
    path: 'draw-deal/:id',
    name: 'DrawDispose',
    component: DrawDispose,
  },
];
