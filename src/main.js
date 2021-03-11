import Vue from 'vue';
import KnobControl from 'vue-knob-control';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import './registerServiceWorker';
import router from './router';
import store from './store';


Vue.config.productionTip = false;

Vue.use(KnobControl);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');

