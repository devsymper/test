export default [
    {
        path: '/relations',
        name: "listRelations",
        component: () =>
            import ('../../views/relation/Index.vue'),
    }
]