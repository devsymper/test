export default [
	{
    path: "/admin",
    name: "admin",
    component: () =>
        import ('../../views/admin/Index.vue'),
	},
	{
    path: "/admin/jobs",
    name: "jobs",
    component: () =>
        import ('../../views/admin/jobs/Index.vue'),
	},
	{
    path: "/work/:processInstanceId",
    name: "process",
    component: () =>
        import ('../../views/admin/ListWorkInProcessInstance.vue'),
	},
 ]