import VueRouter from 'vue-router';
import Login from './pages/login';
import Admin from './pages/admin';
import surveyView from './components/surveyView';
import surveyReport from './components/surveyReport';
import submitList from './components/submitList';

export default new VueRouter({
  routes: [
    {
      name: 'root',
      path: '/',
      component: Login,
      props: true
    },
    {
      name: 'surveyList',
      path: '/surveylist',
      component: Admin,
      props: true,
    },
    {
      name: 'surveyView',
      path: '/surveyview',
      component: surveyView,
      props: true,
    },
    {
      name: 'surveyReport',
      path: '/surveyReport',
      component: surveyReport,
      props: true,
    },
    {
      name: 'submitList',
      path: '/submitlist',
      component: submitList,
      props: true,
    },
  ],
  mode: 'history',
})
