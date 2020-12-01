export default [
    {
        path: "/categories",
        name: "categories",
        component: () =>
            import ('../../views/taskManagement/category/List.vue')
    },
    {
        path: "/task-management",
        name: "TaskManagement",
        component: () =>
            import ('../../views/taskManagement/Index.vue'),
    },
    {
        path: "/projects",
        name: "project",
        component: () =>
            import ('../../views/taskManagement/project/index.vue')
    },
    {
        path: "/projects/:id/settings/details",
        meta:{group:'projectSetting'},
        name: "projectDetail",
        component: () =>
            import ('../../views/taskManagement/project/setting/Detail.vue')
    },
    {
        path: "/projects/:id/settings/access",
        meta:{group:'projectSetting'},
        name: "projectAccess",
        component: () =>
            import ('../../views/taskManagement/project/setting/Access.vue')
    },
    {
        path: "/workflow",
        meta:{group:'projectSetting'},
        name: "issueTypeWorkflow",
        component: () =>
            import ('../../views/taskManagement/projectSetting/Workflow.vue')
    },
    {
        path: "/projects/:id/settings/issuetypes",
        meta:{group:'projectSetting'},
        name: "projectIssueType",
        component: () =>
            import ('../../views/taskManagement/project/setting/IssueType.vue')
    },


    //report
    {
        path: "/report",
        name: "Report",
        meta:{group:'home'},
        component: () =>
            import ('../../views/taskManagement/report/Report.vue')
    },

    //board
    {
        path: "/projects/:id/kanban-board",
        name: "kanbanBoard",
        meta:{group:'home'},
        component: () =>
            import ('../../views/taskManagement/board/KanbanBoard.vue')
    },

]