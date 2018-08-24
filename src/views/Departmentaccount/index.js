import DepartmentList from './index.vue';
import DepartmentDetails from './Details';
import DepartmentDispose from './Dispose';
import DepartmentForm from './Form';


export default [
  // 机构结算 - 机构列表
  {
    path: 'department-list',
    name: 'DepartmentList',
    component: DepartmentList,
  },
  // 机构结算  - 明细
  {
    path: 'department-detail/:id',
    name: 'DepartmentForm',
    component: DepartmentForm,
  },
  // 机构结算  - 结算详情
  {
    path: 'department-info/:id',
    name: 'DepartmentDetails',
    component: DepartmentDetails,
  },
  // 机构结算  - 结算处理
  {
    path: 'department-deal/:id',
    name: 'DepartmentDispose',
    component: DepartmentDispose,
  },

];
