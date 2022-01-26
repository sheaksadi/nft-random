import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { VueMasonryPlugin } from "vue-masonry";

Vue.config.productionTip = false
Vue.use(VueMasonryPlugin)

new Vue({
  router,
  store,
  vuetify,

  render: function (h) { return h(App) }
}).$mount('#app')
