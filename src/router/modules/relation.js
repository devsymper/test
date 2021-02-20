export default [
	{
		path: "/relation/:id/edit",
		name: "editRelation",
		component: () =>
			import ('@/views/relation/EditRelation.vue'),
	},
	{
		path: "/relation/add",
		name: "addRelation",
		component: () =>
			import ('@/views/relation/AddRelation.vue'),
	},
	{
		path: "/relation/:id/view",
		name: "viewRelation",
		component: () =>
			import ('@/views/relation/ViewRelation.vue'),
	},
	{
		path: "/relation/:id/clone",
		name: "cloneRelation",
		component: () =>
			import ('@/views/relation/CloneRelation.vue'),
	},
]