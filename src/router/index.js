import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import BPMNE from "../views/process/ProcessList.vue";
import Login from "../views/Login.vue";
import { routeMiddleware } from './middleware.js';
import PageNotFound from './../views/PageNotFound.vue';
import MultiGuard from 'vue-router-multiguard';
import CreateProcess from "../views/process/CreateProcess.vue";
import ShowListUser from "../views/users/ShowList.vue";
import ShowListDocument from "../views/document/ShowList.vue";
import ShowListService from "../views/service/ShowList.vue";
import ActionPanel from "../views/users/ActionPanel.vue";
import Snippet from "../views/snippets/index.vue";
import Permissions from "../views/permissions/index.vue";
import apps from "../views/apps/index.vue";
import actions from "../views/actions/index.vue";
import virtualdocs from "../views/virtualdocs/index.vue";
import tasks from "../views/tasks/index.vue";
import application from "../views/apps/yourApp.vue";
import Editor from "../views/document/Editor.vue";
import SubmitDocument from "../views/document/submit/Submit.vue";
import DetailDocument from "../views/document/detail/Detail.vue";
import ListObject from "../views/document/listobject/ListObject.vue";
import DeployHistory from "../views/process/DeployHistory.vue";
import RunInstance from "../views/process/RunInstance.vue";
import ProcessInstances from "../views/process/ProcessInstances.vue";
import TrackingProcessInstance from "../views/process/TrackingProcessInstance.vue";
import WorkList from "../views/works/WorkList.vue";
import DoTask from "../views/tasks/DoTask.vue";

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
        path: "/bpmne/:id/edit",
        name: "editProcess",
        component: CreateProcess,
    },
    {
        path: "/bpmne/:id/clone",
        name: "cloneProcess",
        component: CreateProcess,
    },
    {
        path: "/bpmne/:name/deploy-history",
        name: "deployHistory",
        component: DeployHistory,
    },
    {
        path: "/bpmne/process-definition/:idProcessDef/instances",
        name: "listProcessInstances",
        component: ProcessInstances,
    },
    {
        path: "/bpmne/process-instances/:idInstance/tracking",
        name: "trackingProcessInstance",
        component: TrackingProcessInstance,
    },
    {
        path: "/bpmne/create",
        name: "createProcess",
        component: CreateProcess,
    },
    {
        path: "/bpmne/process-definition/:id/run",
        name: "RunInstance",
        component: RunInstance,
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
        path: "/documents",
        name: "processListDocument",
        component: ShowListDocument,
    },
    {
        path: "/document/editor",
        name: "createDocument",
        component: Editor,
    },
    {
        path: "/document/editor/:id?",
        name: "editDocument",
        component: Editor,

    },
    {
        path: "/document/submit/:id?",
        name: "submitDocument",
        component: SubmitDocument,

    },
    {
        path: "/document/:name?/object/:id?",
        name: "detailDocument",
        component: DetailDocument,

    },
    {
        path: "/document/:name?/objects",
        name: "listDocumentObject",
        component: ListObject,

    },
    //service

    {
        path: "/service",
        name: "processListService",
        component: ShowListService,
    },

    // {
    //     path: "/users/permission-package/:id",
    //     name: "permissionPackage",
    //     component: PermissionPackage,
    // },

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
    {
        path: "/tasks/:id",
        name: "tasks",
        component: DoTask,
    },
    {
        path: "/works",
        name: "workList",
        component: WorkList,
    },
];

routes.concat([{
        path: "/page-not-found",
        name: "pageNotFound",
        component: PageNotFound, //Vue component,
        meta: { layout: "content-only" },
    },
    {
        path: "*",
        name: "page",
        redirect: "/page-not-found",
    }
]);

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