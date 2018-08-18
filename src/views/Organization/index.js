import OrganizationList from './index.vue';
import OrganizationForm from './Form';
import LearningTeacher from './Learning';

export default [
  // 机构管理 - 机构列表
  {
    path: 'organization-list',
    name: 'OrganizationList',
    component: OrganizationList,
  },
  // 机构管理 - 添加机构
  {
    path: '/organization-create',
    name: 'OrganizationCreate',
    component: OrganizationForm,
  },
  // 机构管理 - 编辑机构
  {
    path: '/organization-edit/:id',
    name: 'OrganizationEdit',
    component: OrganizationForm,
  },
  // 机构管理 - 学管师列表
  {
    path: '/organization-teacher/:id',
    name: 'LearningTeacher',
    component: LearningTeacher,
  },
];
