/**
 * @overview 主应用路由
 */

import Courseware from '@/views/Courseware';
import Subject from '@/views/Subject';
import Student from '@/views/Student';
import Parent from '@/views/Parent';
import Arrange from '@/views/Arrange';
import Arrstudent from '@/views/Arrstudent';

const routes = [
  ...Courseware,
  ...Subject,
  ...Student,
  ...Parent,
  ...Arrange,
  ...Arrstudent,
];

export default routes;
