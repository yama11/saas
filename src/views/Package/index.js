import PackageList from './index.vue';
import PackageForm from './Form';
import PackageInfo from './Info';

export default [
  // 版本管理 - 版本列表
  {
    path: 'package-list',
    name: 'PackageList',
    component: PackageList,
  },
  // 版本管理 - 发布版本
  {
    path: 'package-create',
    name: 'PackageForm',
    component: PackageForm,
  },
  // 版本管理 - 版本详情
  {
    path: 'package-info/:id',
    name: 'PackageInfo',
    component: PackageInfo,
  },
];
