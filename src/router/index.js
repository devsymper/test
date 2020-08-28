import Vue from "vue";
import VueRouter from "vue-router";
import { routeMiddleware } from './middleware.js';
import PageNotFound from './../views/PageNotFound.vue';
import MultiGuard from 'vue-router-multiguard';
import SymperHiddenRedirectComponent from "../views/SymperHiddenRedirectComponent.vue";
Vue.use(VueRouter);
/**
 * Mặc định nếu không xét meta trong các item của route thì layout có đủ sidebar và header,
 * Nếu muốn để layout không có side và header thì dùng: meta: { layout: 'content-only' } như route trỏ đển login
 * 
 * Nếu muốn thêm các middleware thì thêm key beforeEnter vào trong mỗi route, 
 * value là mảng của các function có đầu vào là (to, from, next) (Tham khảo các sự kiện của vue-router)
 */

const systemRoutes = [{
        path: "/",
        name: "home",
        component: () =>
            import ('../views/Home.vue')
    },
    {
        path: "/login",
        name: "login",
        meta: { layout: "content-only" },
        component: () =>
            import ('../views/Login.vue'),
    },
    // một link để redirect khi chọn một tab mà trùng name với tab hiện tại
    {
        path: "/symper-hidden-redirect-component",
        name: "symperHiddenRedirectComponent",
        component: SymperHiddenRedirectComponent
    }, {
        path: "/page-not-found",
        name: "pageNotFound",
        component: PageNotFound, //Vue component,
        meta: { layout: "content-only" },
    },
    {
        path: "*",
        name: "page",
        redirect: "/page-not-found",
    },
    // phần search
    {
        path: "/search/general",
        name: "generalSearchInfo",
        component: () =>
            import ('../views/search/general.vue'),
    },
];

function autoImportRouteModules() {
    var context = require.context('./modules', true, /\.(js)$/);
    var files = {};
    let filename = '';
    context.keys().forEach((filePath) => {
        filename = filePath.match(/[^\\/:*?"<>|\r\n]+$/)[0].replace('.js', '');
        files[filename] = context(filePath)['default'];
    });
    let routes = [];
    for (let moduleName in files) {
        routes = routes.concat(files[moduleName]);
    }
    return routes;
}

let routes = autoImportRouteModules();
routes = routes.concat(systemRoutes);


/**
 * Thêm các middleware vào cho các route
 */
let commonGuards = Object.values(routeMiddleware.common);
for (let r of routes) {
    let guards = r.beforeEnter ? r.beforeEnter : [];
    guards = commonGuards.concat(guards);
    r.beforeEnter = MultiGuard(guards);
}

const router = new VueRouter({
    routes
});

export default router;