export default [
    {
        path: "/task-management/home",
        name: "taskManagerHome",
        component: () =>
            import ('../../views/taskManagement/home/Index.vue')
    },
    {
        path: "/task-management",
        name: "taskManagerHome",
        component: () =>
            import ('../../views/taskManagement/home/Index.vue')
    },
    {
        path: "/task-management/test-workers",
        name: "worker",
        component: () =>
            import ('../../views/taskManagement/testWorker/RickText.vue')
    },
    {
        path: "/task-management/categories",
        name: "categories",
        component: () =>
            import ('../../views/taskManagement/category/List.vue')
    },
    {
        path: "/task-management/projects",
        name: "project",
        component: () =>
            import ('../../views/taskManagement/project/index.vue')
    },
    {
        path: "/task-management",
        name: "TaskManagement",
        meta:{group:'home'},
        component:() => import ('../../views/taskManagement/Index.vue'),
        children: [
            {
                path: "projects/:id/kanban-board",
                name: "KanbanBoard",
                meta:{group:'home'},
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/board/KanbanBoard.vue'),
                }
            },
            {
                path: "projects/:id/backlog",
                name: "Backlog",
                meta:{group:'home'},
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/board/Backlog.vue'),
                }
            },
            {
                path: "projects/:id/kanban-board/settings/:idBoard",
                name: "kanbanBoardSetting",
                meta:{group:'boardSetting'},
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/board/SettingBoard.vue')
                }
            },
            {
                path: "projects/:id/settings/details",
                meta:{group:'projectSetting'},
                name: "projectDetail",
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/project/setting/Detail.vue')
                }
            },
            {
                path: "projects/:id/settings/access",
                meta:{group:'projectSetting'},
                name: "projectAccess",
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/project/setting/AccessControl.vue')
                }
            },
            {
                path: "projects/:id/workflow",
                meta:{group:'projectSetting'},
                name: "listWorkflow",
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/workflow/List.vue')
                }
            },
            {
                path: "projects/:id/timesheets",
                meta:{group:'home'},
                name: "timesheet",
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/timesheet/Index.vue')
                }
            },
            {
                path: "projects/:id/issue-link",
                meta:{group:'projectSetting'},
                name: "projectIssueLink",
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/issueLink/List.vue')
                }
            },
            {
                path: "projects/:id/create-filter",
                meta:{group:'projectSetting'},
                name: "createFilter",
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/issueLink/List.vue')
                }
            },
            {
                path: "projects/:id/workflow/create",
                // meta:{group:'projectSetting'},
                name: "issueTypeWorkflow",
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/workflow/CreateWorkflow.vue')
                }
            },
            {
                path: "projects/:id/workflow/:workflowId",
                // meta:{group:'projectSetting'},
                name: "detailworkflow",
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/workflow/DetailWorkflow.vue')
                }
            },
            {
                path: "projects/:id/settings/issuetypes",
                meta:{group:'projectSetting'},
                name: "projectIssueType",
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/project/setting/IssueType.vue')
                }
                    
            },
            //report
            {
                path: "projects/:id/report",
                name: "Report",
                meta:{group:'home'},
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/report/Report.vue')
                }
            },

            //component
            {
                path: "projects/:id/components",
                name: "Component",
                meta:{group:'home'},
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/component/List.vue')
                }
            },
            {
                path: "projects/:id/components/:idComponent",
                name: "ComponentDetail",
                meta:{group:'home'},
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/component/DetailComponent.vue')
                }
            },
            ///////version
            {
                path: "projects/:id/versions",
                name: "Version",
                meta:{group:'home'},
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/version/List.vue')
                }
            },
            {
                path: "projects/:id/versions/:idVersion",
                name: "VersionDetail",
                meta:{group:'home'},
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/version/DetailVersion.vue')
                }
            },
            // priority
            {
                path: "projects/:id/priorities",
                name: "projectPriority",
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/priority/List.vue')
                }
            },
        ]   
    },
]