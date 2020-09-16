import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/main.css";
import vuetify from "./plugins/vuetify";
import i18n from './lang/i18n'
import {
    util
} from "./plugins/util.js";
import BaView from "./views/layout/BAView";
import EndUserView from "./views/layout/EndUserView";
import ContentOnlyView from "./views/layout/ContentOnlyView";
import Notifications from 'vue-notification'
import VueMoment from "vue-moment";
import moment from "moment-timezone";
import {
    appConfigs
} from "./configs";
import actionMap from './action/index'
import VueRx from 'vue-rx'
//thu vien slider thumbnails

//Anhtger import html2canvas
import VueHtml2Canvas from 'vue-html2canvas';
Vue.use(VueHtml2Canvas);
Vue.component('ba-view', BaView);
Vue.component('end-user-view', EndUserView);
Vue.component('content-only-view', ContentOnlyView);
Vue.use(VueRx)

Vue.mixin({
    methods: {
        $bindAction(actionDef, param = {}) {
            let isValidAction = true;
            if (actionDef && typeof actionDef == 'object') {
                let sampleAction = {
                    "module": "orgchart",
                    "resource": "orgchart",
                    "scope": "orgchart",
                    "action": "list"
                };
                for (let key in sampleAction) {
                    if (!actionDef.hasOwnProperty(key)) {
                        isValidAction = false;
                        console.warn("[SYMPER-BIND-ACTION-FAILED]  action definition is not valid, action definition must be a object with 4 keys: module, resource, scope, action, but receive", actionDef);
                        break;
                    }
                }
            } else {
                isValidAction = false;
                console.warn("[SYMPER-BIND-ACTION-FAILED]  action definition is not valid, first param expected Object, but receive: ", actionDef);
            }

            if (isValidAction) {
                return JSON.stringify({
                    action: actionDef,
                    params: param ? param : {}
                });
            } else {
                return JSON.stringify({
                    action: {},
                    params: {}
                });

            }
        }
    }
})

Vue.use(Notifications);
Vue.use(VueMoment, {
    moment,
});

/**
 * $evtBus : component chuyên chở các sự kiện giữa tất cả các component
 */
Vue.prototype.$evtBus = new Vue({});
Vue.prototype.$evtBus.$on('symper-app-call-action-handler', (action, context, extraParams) => {
    if (typeof action == 'string') {
        try {
            action = JSON.parse(action);
            if (!action) {
                action = {};
            }
        } catch (error) {
            action = {};
        }
    }
    if (!action.parameter) {
        action.parameter = {};
    }
    action.parameter = Object.assign(action.parameter, extraParams);
    let key = action.module + '_' + action.resource + '_' + action.scope + '_' + action.action;
    if (actionMap[key]) {
        actionMap[key].handler.apply(context, [action.parameter]);
    } else {
        console.error('[Symper action find failed]: can not find action with key :' + key, action);
    }
})


function checkCanAddTab(context) {
    let rsl = true;
    let urlMap = context.$store.state.app.urlToTabTitleMap;
    if (Object.keys(urlMap).length == appConfigs.maxOpenTab) {
        rsl = false;
        context.$snotifyWarning({}, context.$t('appTabs.overMaxOpen.title'), context.$t('appTabs.overMaxOpen.detail'));
    }
    return rsl;
}


function checkUrlNotExisted(url, context) {
    let urlMap = context.$store.state.app.urlToTabTitleMap;
    urlMap = Object.values(urlMap);
    for (let idx in urlMap) {
        if (urlMap[idx].url == url) {
            context.$evtBus.$emit('auto-active-tab', Number(idx));
            return false;
        }
    }
    return true;
}

/**
 * Di chuyển đến một trang và tạo ra tab tương ứng
 */
Vue.prototype.$goToPage = function(url, title, pageInstanceKey = false, allwaysOpenNewTab = true, extraData = {}) {
    let canAddTab = checkCanAddTab(this);
    if (!allwaysOpenNewTab) {
        canAddTab = canAddTab && checkUrlNotExisted(url, this);
    }
    if (!canAddTab) {
        return;
    }
    let activeTabIndex = 0;
    if (!pageInstanceKey) {
        pageInstanceKey = Date.now();
    }
    let routeObj = this.$router.match(url);
    let params = Object.assign(routeObj.params, {
        pageInstanceKey: pageInstanceKey,
        extraData: extraData
    });

    let urlMap = this.$store.state.app.urlToTabTitleMap;
    let urlInfo = {
        url: url,
        routeName: routeObj.name,
        title: title,
        pageInstanceKey: pageInstanceKey,
        routeParams: util.cloneDeep(params)
    };
    this.$store.commit('app/changeUrlsToTabs', urlInfo);
    activeTabIndex = Object.keys(urlMap).length - 1;

    this.$store.commit('app/updateCurrentTabIndex', activeTabIndex);
    if (routeObj.name) {
        if (routeObj.name == this.$route.name) {
            this.$router.push({
                name: 'symperHiddenRedirectComponent',
                params: {
                    urlInfo: urlInfo,
                    pageInstanceKey: Date.now(),
                }
            });
        } else {
            this.$router.push({
                name: routeObj.name,
                params: util.cloneDeep(params),
            });
        }
    } else {
        this.$snotifyError('Url not found');
    }
};

/**
 * Custom notification
 */
Vue.prototype.$snotify = function(option, group = false) {
    group = group ? group : 'symper-general-notification';
    let position = option.position ? option.position : 'top right';
    let defaultOptions = {
        group: group,
        width: 400,
        classes: 'symper-general-notification',
        duration: option.duration ? option.duration : appConfigs.notificationTimeout[option.type],
        speed: 500,
        data: {
            type: option.type,
            title: option.title,
            text: option.text,
            actionBtns: option.actionBtns
        }
    };
    option = Object.assign(defaultOptions, option);
    this.$store.state.app.generalNotificationPosition = position;
    this.$notify(option);
}

Vue.prototype.$snotifyError = function(err = {}, title = 'ERROR', detail = '', duration = false) {
    console.warn(err);
    if (!detail && err.responseJSON && err.responseJSON.message) {
        detail = err.responseJSON.message;
    }

    if (!detail && err.message) {
        detail = err.message;
    }
    let setting = {
        type: 'error',
        title: title,
        text: detail
    }

    if (duration) {
        setting.duration = duration;
    }
    this.$snotify(setting);
}
Vue.prototype.$snotifyInfo = function(title = 'INFORMATION', detail = '') {
    this.$snotify({
        type: 'info',
        title: title,
        text: detail
    });
}
Vue.prototype.$snotifyWarning = function(err, title = 'WARNING', detail = '') {
    console.warn(err);
    this.$snotify({
        type: 'warn',
        title: title,
        text: detail
    });
}
Vue.prototype.$snotifySuccess = function(title = 'SUCCESS', detail = '', duration = false) {
    let setting = {
        type: 'success',
        title: title,
        text: detail
    };

    if (duration) {
        setting.duration = duration;
    }
    this.$snotify(setting);
}


Vue.config.productionTip = false;
global.jQuery = require('jquery');
var $ = global.jQuery;
window.$ = $;
window.Vue = Vue;
util.serviceWorker.register();
require('@/assets/resource/toc/jquery.toc/jquery.toc.js')
export const SYMPER_APP = new Vue({
    router,
    store,
    i18n,
    vuetify,
    render: h => h(App)
}).$mount("#app");