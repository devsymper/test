export default [
	{
    path: "/admin",
    name: "admin",
    component: () =>
        import ('../../views/admin/Index.vue'),
	},
	{
    path: "/work/:processInstanceId",
    name: "process",
    component: () =>
        import ('../../views/admin/ListWorkInProcessInstance.vue'),
	},
 ]