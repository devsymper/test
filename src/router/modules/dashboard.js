export default [
    {
        path: '/dashboards',
        name: "listDashboards",
        component: () =>
            import ('../../views/dashboard/Index.vue'),
    },
    {
        path: '/dashboard/:id/view',
        name: "viewDashboard",
        component: () =>
            import ('../../views/dashboard/DashboardView.vue'),
    },
    {
        path: '/dashboards/:id/edit',
        name: "editDashboard",
        component: () =>
            import ('../../views/dashboard/EditDashboard.vue'),
    },
    {
        path: '/dashboards/:id/clone',
        name: "cloneDashboard",
        component: () =>
            import ('../../views/dashboard/CloneDashboard.vue'),
    },
]