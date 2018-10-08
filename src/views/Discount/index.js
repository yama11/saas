import DiscountList from './index.vue';
import DiscountForm from './Form';
import DiscountSituation from './Situation';

export default [
  // 优惠券列表
  {
    path: 'discount-list',
    name: 'DiscountList',
    component: DiscountList,
  },
  // 优惠劵添加
  {
    path: 'discount-create',
    name: 'DiscountCreate',
    component: DiscountForm,
  },
  // 优惠券查看
  {
    path: 'discount-look/:id',
    name: 'DiscountLook',
    component: DiscountForm,
  },
  // 优惠券编辑
  {
    path: 'discount-edit/:id',
    name: 'DiscountEdit',
    component: DiscountForm,
  },
  // 优惠券领取情况
  {
    path: 'discount-get/:id',
    name: 'DiscountGet',
    component: DiscountSituation,
  },
];
