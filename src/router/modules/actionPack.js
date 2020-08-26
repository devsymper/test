export default [{
        path: "/action-pack",
        name: "actionPackList",
        component: () =>
            import ('../../views/permissions/AcitionPackList.vue'),
    },
    {
        path: "/actions",
        name: "actions",
        // component: actions,
        component: () =>
            import ('../../views/actions/index.vue'),
    },
]