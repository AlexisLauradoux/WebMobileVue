import Vue from 'vue';
import VueRouter from 'vue-router';
import Artist from '../views/Artist.vue';
import Home from '../views/Home.vue';
import Add from '../views/Add.vue';
import Login from '../components/Login'
import Register from '../components/Register'

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
},
{
    path: '/register',
    name: 'Register',
    component: Register
},
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/artist/:id',
    name: 'artist',
    component: Artist,
  },
    {
    path: '/add-music',
    name: 'add',
    component: Add,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
