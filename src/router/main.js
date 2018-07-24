/**
 * @overview 主应用路由
 */

import Courseware from '@/views/Courseware';
import Subject from '@/views/Subject';
import Student from '@/views/Student';

const routes = [
  ...Courseware,
  ...Subject,
  ...Student,
];

export default routes;
