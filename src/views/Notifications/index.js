import NotificationList from './index.vue';
import NotificationForm from './Form';
import NotificationInfo from './Info';

export default [
  // 系统消息列表
  {
    path: 'notifications-list',
    name: 'NotificationList',
    component: NotificationList,
  },

  // 系统消息 - 创建
  {
    path: 'notifications-creat',
    name: 'NotificationCreate',
    component: NotificationForm,
  },

  // 系统消息 - 编辑
  {
    path: 'notifications-edit/:id',
    name: 'NotificationEdit',
    component: NotificationForm,
  },

  // 系统消息 - 详情
  {
    path: 'notifications-info/:id',
    name: 'NotificationInfo',
    component: NotificationInfo,
  },
];
