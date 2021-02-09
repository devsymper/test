export default [
    {
        path: '/datasets',
        name: "listDatasets",
        component: () =>
            import ('../../views/dataset/Index.vue'),
    },
    
]