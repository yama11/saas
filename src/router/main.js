/**
 * @overview 主应用路由
 */

import Courseware from '@/views/Courseware';
import Subject from '@/views/Subject';
import Curriculum from '@/views/Curriculum';
import Category from '@/views/Category';
import Product from '@/views/Product';
import Order from '@/views/Order';
import Discount from '@/views/Discount';
import Student from '@/views/Student';
import Parent from '@/views/Parent';
import Class from '@/views/Class';
import Arrstudent from '@/views/Arrstudent';
import User from '@/views/User';
import Role from '@/views/Role';
import Arrange from '@/views/Arrange';
import Change from '@/views/Change';
// import Quit from '@/views/Quit';
import Freeze from '@/views/Freeze';
import Liveroom from '@/views/Liveroom';

const routes = [
  ...Courseware,
  ...Subject,
  ...Curriculum,
  ...Category,
  ...Product,
  ...Order,
  ...Discount,
  ...Student,
  ...Parent,
  ...Class,
  ...Arrstudent,
  ...User,
  ...Role,
  ...Arrange,
  ...Change,
  // ...Quit,
  ...Freeze,
  ...Liveroom,
];

export default routes;
