export default [{
        path: "/apps",
        name: "apps",
        component: () =>
            import ('../../views/apps/index.vue'),
    },
    {
        path: "/application",
        name: "application",
        component: () =>
            import ('../../views/apps/yourApp.vue'),
    },
]