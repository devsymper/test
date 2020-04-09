import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/main.css";
import vuetify from "./plugins/vuetify";

import BaView  from "./views/layout/BAView";
import EndUserView  from "./views/layout/EndUserView";
import ContentOnlyView  from "./views/layout/ContentOnlyView";

Vue.component('ba-view', BaView);
Vue.component('end-user-view', EndUserView);
Vue.component('content-only-view', ContentOnlyView);

Vue.config.productionTip = false;
global.jQuery = require('jquery');
var $ = global.jQuery;
window.$ = $;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
