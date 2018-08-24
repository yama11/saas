import DealerAccountList from './index.vue';
import DealerAccountDetails from './Details';
import DealerAccountForm from './Form';
import DealerAccountDispose from './Dispose';
import DealerAccountStudent from './Student';

export default [
  // 经销商结算  - 经销商列表
  {
    path: 'account-list',
    name: 'DealerAccountList',
    component: DealerAccountList,
  },
  // 经销商结算  - 明细
  {
    path: 'account-detail/:id',
    name: 'DealerAccountForm',
    component: DealerAccountForm,
  },
  // 经销商结算  - 结算详情
  {
    path: 'account-info/:id',
    name: 'DealerAccountDetails',
    component: DealerAccountDetails,
  },
  // 经销商结算  - 结算处理
  {
    path: 'account-deal/:id',
    name: 'DealerAccountDispose',
    component: DealerAccountDispose,
  },
  // 经销商结算  - 明细 - 机构明细
  {
    path: 'account-student/:id',
    name: 'DealerAccountStudent',
    component: DealerAccountStudent,
  },
];
