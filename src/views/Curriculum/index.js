import CurriculumList from './index.vue';
import CurriculumTimeTable from './TimeTable';
import CurriculumPeriod from './Period';
import CurriculumSchedule from './Schedule';

export default [
  // 课程列表
  {
    path: 'curriculum-list',
    name: 'CurriculumList',
    component: CurriculumList,
  },
  // 时间模板
  {
    path: 'curriculum-timeTable',
    name: 'CurriculumTimeTable',
    component: CurriculumTimeTable,
  },
  // 课时管理
  {
    path: 'curriculum-period/:id',
    name: 'CurriculumPeriod',
    component: CurriculumPeriod,
  },
  // 排课
  {
    path: 'curriculum-schedule/:id',
    name: 'CurriculumSchedule',
    component: CurriculumSchedule,
  },
];
