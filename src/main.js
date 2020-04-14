import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/main.css";
import vuetify from "./plugins/vuetify";

import BaView from "./views/layout/BAView";
import EndUserView from "./views/layout/EndUserView";
import ContentOnlyView from "./views/layout/ContentOnlyView";

Vue.component('ba-view', BaView);
Vue.component('end-user-view', EndUserView);
Vue.component('content-only-view', ContentOnlyView);

/**
 * $evtBus : component chuyên chở các sự kiện giữa tất cả các component
 */
Vue.prototype.$evtBus = new Vue({});
Vue.prototype.$goToPage = function(url, title) {
    let activeTabIndex = 0;
    let urlMap = this.$store.state.app.urlToTabTitleMap;
    if (urlMap.hasOwnProperty(url)) {
        activeTabIndex = Object.keys(urlMap).indexOf(url);
    } else {
        this.$store.commit('app/changeUrlsToTabs', { url: url, title: title });
        activeTabIndex = Object.keys(urlMap).length - 1;
    }
    this.$store.commit('app/updateCurrentTabIndex', activeTabIndex);
    this.$router.push({
        path: url
    });
};

Vue.config.productionTip = false;
global.jQuery = require('jquery');
var $ = global.jQuery;
window.$ = $;
window.Vue = Vue;

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount("#app");