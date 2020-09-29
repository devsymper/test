export default [{
    path: '/dashboard/:id/view',
    name: "viewDashboard",
    component: () =>
        import ('../../views/dashboard/DashboardView.vue'),
}]