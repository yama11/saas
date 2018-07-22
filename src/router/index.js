import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/views/Main';
import Login from '@/views/Login';
import MainChildrenRoutes from './main';

Vue.use(Router);

export default new Router({
  mode: 'history',

  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: MainChildrenRoutes,
    },
  ],
});
