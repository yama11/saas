import StudentList from './index.vue';
import StudentForm from './Form';
import StudentInfo from './Info';
import StudentCourse from './Course';

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
    path: 'student-look/:id',
    name: 'StudentLook',
    component: StudentInfo,
  },
  // 查看课程
  {
    path: 'course-look/:id',
    name: 'CourseLook',
    component: StudentCourse,
  },
];
