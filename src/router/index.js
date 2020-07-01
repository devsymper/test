import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
// import workflow from "../views/process/ProcessList.vue";
// import Login from "../views/Login.vue";
import { routeMiddleware } from './middleware.js';
import PageNotFound from './../views/PageNotFound.vue';
import MultiGuard from 'vue-router-multiguard';
// import CreateProcess from "../views/process/CreateProcess.vue";
// import ShowListUser from "../views/users/ShowList.vue";
// import ShowListDocument from "../views/document/ShowList.vue";
// import ShowListService from "../views/service/ShowList.vue";
// import ActionPanel from "../views/users/ActionPanel.vue";
// import Snippet from "../views/snippets/index.vue";
// import Permissions from "../views/permissions/index.vue";
// import apps from "../views/apps/index.vue";
// import actions from "../views/actions/index.vue";
// import virtualdocs from "../views/virtualdocs/index.vue";
// import tasks from "../views/tasks/index.vue";
// import application from "../views/apps/yourApp.vue";
// import Editor from "../views/document/Editor.vue";
// import SubmitDocument from "../views/document/submit/Submit.vue";
// import DetailDocument from "../views/document/detail/Detail.vue";
// import ListObject from "../views/document/listobject/ListObject.vue";
// import DeployHistory from "../views/process/DeployHistory.vue";
// import RunInstance from "../views/process/RunInstance.vue";
// import ProcessInstances from "../views/process/ProcessInstances.vue";
// import TrackingProcessInstance from "../views/process/TrackingProcessInstance.vue";
// import WorkList from "../views/works/WorkList.vue";
// import DoTask from "../views/tasks/DoTask.vue";

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
        // component: Home
        component: () =>
            import ('../views/Home.vue')
    },
    {
        path: "/workflow",
        name: "processList",
        // component: workflow,
        component: () =>
            import ('../views/process/ProcessList.vue'),
    },
    {
        path: "/workflow/:id/edit",
        name: "editProcess",
        component: () =>
            import ('../views/process/CreateProcess.vue'),
    },
    {
        path: "/workflow/:id/clone",
        name: "cloneProcess",
        component: () =>
            import ('../views/process/CreateProcess.vue'),

    },
    {
        path: "/workflow/:id/view",
        name: "viewProcess",
        component: () =>
            import ('../views/process/CreateProcess.vue'),

    },
    {
        path: "/workflow/:name/deploy-history",
        name: "deployHistory",
        // component: DeployHistory,
        component: () =>
            import ('../views/process/DeployHistory.vue')
    },
    {
        path: "/workflow/process-definition/:idProcessDef/instances",
        name: "listProcessInstances",
        // component: ProcessInstances,
        component: () =>
            import ('../views/process/ProcessInstances.vue')

    },
    {
        path: "/workflow/process-instances/:idInstance/tracking",
        name: "trackingProcessInstance",
        // component: TrackingProcessInstance,
        component: () =>
            import ('../views/process/TrackingProcessInstance.vue')
    },
    {
        path: "/workflow/create",
        name: "createProcess",
        component: () =>
            import ('../views/process/CreateProcess.vue'),
    },
    {
        path: "/workflow/process-definition/:id/run",
        name: "RunInstance",
        // component: RunInstance,
        component: () =>
            import ('../views/process/RunInstance.vue'),
    },
    {
        path: "/login",
        name: "login",
        meta: { layout: "content-only" },
        // component: Login,
        component: () =>
            import ('../views/Login.vue'),
    },

    //users

    {
        path: "/users",
        name: "processListUser",
        // component: ShowListUser,
        component: () =>
            import ('../views/users/ShowList.vue'),
    },

    {
        path: "/users/add",
        name: "addUser",
        // component: ActionPanel,
        component: () =>
            import ('../views/users/ActionPanel.vue'),
    },
    {
        path: "/users/edit/:id",
        name: "editUser",
        // component: ActionPanel,
        component: () =>
            import ('../views/users/ActionPanel.vue'),

    },

    //document

    {
        path: "/documents",
        name: "processListDocument",
        // component: ShowListDocument,
        component: () =>
            import ('../views/document/ShowList.vue'),
    },
    {
        path: "/document/editor",
        name: "createDocument",
        // component: Editor,
        component: () =>
            import ('../views/document/Editor.vue'),
    },
    {
        path: "/document/editor/:id?",
        name: "editDocument",
        // component: Editor,
        component: () =>
            import ('../views/document/Editor.vue'),

    },
    {
        path: "/document/submit/:id?",
        name: "submitDocument",
        // component: SubmitDocument,
        component: () =>
            import ('../views/document/submit/Submit.vue'),

    },
    {
        path: "/documents/objects/:id?",
        name: "detailDocument",
        // component: DetailDocument,
        component: () =>
            import ('../views/document/detail/Detail.vue'),
    },
    {
        path: "/document/objects/update/:id?",
        name: "updateDocumentObject",
        // component: SubmitDocument,
        component: () =>
            import ('../views/document/submit/Submit.vue'),
    },
    {
        path: "/documents/:id?/objects",
        name: "listDocumentObject",
        // component: ListObject,
        component: () =>
            import ('../views/document/listobject/ListObject.vue'),

    },
    //service

    {
        path: "/service",
        name: "processListService",
        // component: ShowListService,
        component: () =>
            import ('../views/service/ShowList.vue'),
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
        // component: Snippet,
        component: () =>
            import ('../views/snippets/index.vue'),
    },
    //Permissions
    {
        path: "/permissions",
        name: "permissions",
        // component: Permissions,
        component: () =>
            import ('../views/permissions/index.vue'),
    },
    {
        path: "/apps",
        name: "apps",
        // component: apps,
        component: () =>
            import ('../views/apps/index.vue'),
    },
    {
        path: "/application",
        name: "application",
        // component: application,
        component: () =>
            import ('../views/apps/yourApp.vue'),
    },
    {
        path: "/actions",
        name: "actions",
        // component: actions,
        component: () =>
            import ('../views/actions/index.vue'),
    },
    {
        path: "/virtualdocs",
        name: "virtualdocs",
        // component: virtualdocs,
        component: () =>
            import ('../views/virtualdocs/index.vue'),
    },
    {
        path: "/tasks",
        name: "tasks",
        // component: tasks,
        component: () =>
            import ('../views/tasks/index.vue'),
    },
    {
        path: "/tasks/:id",
        name: "tasks",
        // component: DoTask
        component: () =>
            import ('../views/tasks/DoTask.vue')
    },
    {
        path: "/works",
        name: "workList",
        // component: WorkList,
        component: () =>
            import ('../views/works/WorkList.vue'),
    },

    // Orgchart
    {
        path: "/orgchart",
        name: "listOrgchart",
        component: () =>
            import ('../views/orgchart/OrgchartList.vue'),
    },
    {
        path: "/orgchart/create",
        name: "createOrgchart",
        component: () =>
            import ('../views/orgchart/CreateOrgchart.vue'),
    },
    {
        path: "/orgchart/:id/edit",
        name: "editOrgchart",
        component: () =>
            import ('../views/orgchart/EditOrgchart.vue'),
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