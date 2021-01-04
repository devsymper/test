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
	{
    path: "/test/testAg",
    name: "procesdsdsds",
    component: () =>
        import ('@/components/common/agDataTable/TestAg'),
	},
	{
    path: "/test-ag/application",
    name: "procesdsdsdsdadsadsdasdss",
    component: () =>
        import ('@/components/common/agDataTable/TestAgApplication'),
	},
	{
    path: "/test-ag/document",
    name: "procesdssdsdsdsdsds",
    component: () =>
        import ('@/components/common/agDataTable/TestAgDocument'),
	},
 ]