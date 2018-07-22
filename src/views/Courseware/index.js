import CoursewareList from './index.vue';

import CoursewareEdition from './Edition';

export default [
  // 课件列表
  {
    path: 'courseware-list',
    name: 'CoursewareList',
    component: CoursewareList,
  },
  // 课件编辑
  {
    path: 'courseware-edition',
    name: 'CoursewareEdtion',
    component: CoursewareEdition,
  },
];
