export default [
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
                name: "TaskManagement-KanbanBoard",
                meta:{group:'home'},
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/board/KanbanBoard.vue'),
                }
            },
            {
                path: "projects/:id/workflow",
                meta:{group:'projectSetting'},
                name: "issueTypeWorkflow",
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/projectSetting/Workflow.vue')
                }
            },
            {
                path: "projects/:id/kanban-board/settings/:idBoard",
                name: "kanbanBoardSetting",
                meta:{group:'home'},
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
                    TaskManagement: () => import ('../../views/taskManagement/project/setting/Access.vue')
                }
            },
            {
                path: "workflow",
                meta:{group:'projectSetting'},
                name: "issueTypeWorkflow",
                components:{
                    TaskManagement: () => import ('../../views/taskManagement/projectSetting/Workflow.vue')
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
                path: "report",
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
                path: "projects/:id/components/:idVersion",
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
        ]   
    },
]