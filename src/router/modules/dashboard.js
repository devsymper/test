export default [
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