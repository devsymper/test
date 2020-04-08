import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import BPMNE from "../views/BPMNEngine.vue";
import Login from "../views/Login.vue";

Vue.use(VueRouter);
/**
 * Mặc định nếu không xét meta trong các item của route thì layout có đủ sidebar và header,
 * Nếu muốn để layout không có side và header thì dùng: meta: { layout: 'content-only' } như route trỏ đển login
 */
const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/About.vue")
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
    }
];

const router = new VueRouter({
    routes
});

export default router;
