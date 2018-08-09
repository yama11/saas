import OrderList from './index.vue';
import OrderInfo from './Info';

export default [
  // 订单列表
  {
    path: 'order-list',
    name: 'OrderList',
    component: OrderList,
  },
  // 订单详情
  {
    path: 'order-info/:id',
    name: 'OrderInfo',
    component: OrderInfo,
  },
];
