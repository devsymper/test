export default [
    {
        path: '/dataflows',
        name: "listDataflows",
        component: () =>
            import ('../../views/dataflows/Index.vue'),
    },
    
]