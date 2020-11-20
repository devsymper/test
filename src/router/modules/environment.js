export default [{
    path: "/environment-management",
    name: "environmentManagement",
    component: () =>
        import ('../../views/environment/Index.vue'),
	}, 
	{
		path: "/environment-sync-history",
		name: "environmentSyncHistory",
		component: () =>
			import ('../../views/environment/SyncHistory.vue'),
	},
	{
		path: "/service/:serviceId/versions",
		name: "versionOfService",
		component: () =>
			import ('../../views/environment/ListVersionOfService.vue'),
	},
]