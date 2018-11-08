import StudentList from './index.vue';
import StudentForm from './Form';
import StudentInfo from './Info';
import StudentCourse from './Course';
import StudentHistory from './History';
import StudentPerformance from './Performance';

export default [
  // 学生管理列表
  {
    path: 'student-list',
    name: 'StudentList',
    component: StudentList,
  },
  // 创建学生
  {
    path: 'student-create',
    name: 'StudentCreate',
    component: StudentForm,
  },
  // 编辑学生
  {
    path: 'student-edit/:id',
    name: 'StudentEdit',
    component: StudentForm,
  },
  // 查看学生
  {
    path: 'student-info/:id',
    name: 'StudentLook',
    component: StudentInfo,
  },
  // 查看课程
  {
    path: 'student-course/:id',
    name: 'StudentCourse',
    component: StudentCourse,
  },
  // 上课历史
  {
    path: 'student-history/:id',
    name: 'StudentHistory',
    component: StudentHistory,
  },
  // 学习报告
  {
    path: 'student-performance/:id',
    name: 'StudentPerformance',
    component: StudentPerformance,
  },
];
