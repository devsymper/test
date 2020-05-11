import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import BPMNE from "../views/BPMNEngine.vue";
import Login from "../views/Login.vue";
import { routeMiddleware } from './middleware.js';
import PageNotFound from './../views/PageNotFound.vue';
import MultiGuard from 'vue-router-multiguard';

import CreateProcess from "../views/process/CreateProcess.vue";

import ShowListUser from "../views/users/ShowList.vue";
import ActionPanel from "../views/users/ActionPanel.vue";
import Snippet from "../views/snippets/index.vue";
import Permissions from "../views/permissions/index.vue";
import apps from "../views/apps/index.vue";
import actions from "../views/actions/index.vue";
import virtualdocs from "../views/virtualdocs/index.vue";
import tasks from "../views/tasks/index.vue";
import application from "../views/apps/yourApp.vue";
import Editor from "../views/document/Editor.vue";

Vue.use(VueRouter);
/**
 * Mặc định nếu không xét meta trong các item của route thì layout có đủ sidebar và header,
 * Nếu muốn để layout không có side và header thì dùng: meta: { layout: 'content-only' } như route trỏ đển login
 * 
 * Nếu muốn thêm các middleware thì thêm key beforeEnter vào trong mỗi route, 
 * value là mảng của các function có đầu vào là (to, from, next) (Tham khảo các sự kiện của vue-router)
 * 
 */
const routes = [{
        path: "/",
        name: "home",
        component: Home,
    },
    {
        path: "/bpmne",
        name: "processList",
        component: BPMNE,
    },
    {
        path: "/bpmne/create",
        name: "createProcess",
        component: CreateProcess,
    },
    {
        path: "/login",
        name: "login",
        meta: { layout: "content-only" },
        component: Login,
    },

    //users

    {
        path: "/users",
        name: "processListUser",
        component: ShowListUser,
    },

    {
        path: "/users/add",
        name: "addUser",
        component: ActionPanel,
    },
    {
        path: "/users/edit/:id",
        name: "editUser",
        component: ActionPanel,
    },

    //document

    {
        path: "/document/editor",
        name: "documentEditor",
        component: Editor,
    },
    //Snippet
    {
        path: "/snippets",
        name: "snippets",
        component: Snippet,
    },
    //Permissions
    {
        path: "/permissions",
        name: "permissions",
        component: Permissions,
    },
    {
        path: "/apps",
        name: "apps",
        component: apps,
    },
    {
        path: "/application",
        name: "application",
        component: application,
    },
    {
        path: "/actions",
        name: "actions",
        component: actions,
    },
    {
        path: "/virtualdocs",
        name: "virtualdocs",
        component: virtualdocs,
    },
    {
        path: "/tasks",
        name: "tasks",
        component: tasks,
    },

    // Luôn để 2 item này ở cuối cùng của array này để nó có thể redirect đến được trang 404 khi ko tìm thấy route
    {
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
];

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