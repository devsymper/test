import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/main.css";
import vuetify from "./plugins/vuetify";
import i18n from './lang/i18n'
import { util } from "./plugins/util.js";
import BaView from "./views/layout/BAView";
import EndUserView from "./views/layout/EndUserView";
import ContentOnlyView from "./views/layout/ContentOnlyView";
import Notifications from 'vue-notification'

Vue.component('ba-view', BaView);
Vue.component('end-user-view', EndUserView);
Vue.component('content-only-view', ContentOnlyView);
Vue.use(Notifications);
/**
 * $evtBus : component chuyên chở các sự kiện giữa tất cả các component
 */
Vue.prototype.$evtBus = new Vue({});

/**
 * Di chuyển đến một trang và tạo ra tab tương ứng
 */
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

/**
 * Custom notification
 */
Vue.prototype.$snotify = function(option, group = false) {
    group = group ? group : 'symper-general-notification';
    let defaultOptions = {
        group: group,
        width: 400,
        classes: 'symper-general-notification',
        duration: 10000,
        speed: 500,
        data: {
            type: option.type,
            title: option.title,
            text: option.text,
            actionBtns: option.actionBtns
        }
    };
    option = Object.assign(defaultOptions, option);
    this.$notify(option);
}

Vue.config.productionTip = false;
global.jQuery = require('jquery');
var $ = global.jQuery;
window.$ = $;
window.Vue = Vue;
util.serviceWorker.register();

new Vue({
    router,
    store,
    i18n,
    vuetify,
    render: h => h(App)
}).$mount("#app");