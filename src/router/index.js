import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import BPMNE from "../views/BPMNEngine.vue";
import Login from "../views/Login.vue";
import { routeMiddleware } from './middleware.js';
import PageNotFound from './../views/PageNotFound.vue';
import MultiGuard from  'vue-router-multiguard';

Vue.use(VueRouter);
/**
 * Mặc định nếu không xét meta trong các item của route thì layout có đủ sidebar và header,
 * Nếu muốn để layout không có side và header thì dùng: meta: { layout: 'content-only' } như route trỏ đển login
 */
const routes = [
    {
        path: "/",
        name: "home",
        component: Home
    },
    {
        path: "/bpmne",
        name: "processList",
        component: BPMNE,
    },
    {
        path: "/login",
        name: "login",
        meta: { layout: 'content-only' },
        component: Login,
    },

    // Luôn để 2 item này ở cuối cùng của array này để nó có thể redirect đến được trang 404 khi ko tìm thấy route
    {
        path: '/page-not-found',
        name: 'pageNotFound',
        component: PageNotFound, //Vue component,
        meta: { layout: 'content-only' }
    },
    { path: '*',
        name: 'page',
        redirect: '/page-not-found' 
    }
];

let commonGuards = Object.values(routeMiddleware.common);
for(let r of routes){
    let guards = r.beforeEnter ? r.beforeEnter : [];
    guards = commonGuards.concat(guards);
    r.beforeEnter = MultiGuard(guards);
}
const router = new VueRouter({
    routes
});

export default router;
