import Vue from 'vue';
import Router from 'vue-router';
import * as views from '../views';
import MainChildrenRoutes from './main';

Vue.use(Router);

export default new Router({
  mode: 'history',

  routes: [
    {
      path: '/login',
      name: 'Login',
      component: views.Login,
    },
    {
      path: '/',
      name: 'Main',
      component: views.Main,
      children: MainChildrenRoutes,
    },
  ],
});
