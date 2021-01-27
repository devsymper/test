export default [
    {
        path: '/dataflows',
        name: "listDataflows",
        component: () =>
            import ('../../views/dataflow/Index.vue'),
    },
    {
        path: '/dataflows/:id/edit',
        name: "editDataflow",
        component: () =>
            import ('@/views/dataflow/EditDataflow.vue'),
    },
    {
        path: '/dataflows/:id/clone',
        name: "cloneDataflow",
        component: () =>
            import ('../../views/dataflow/CloneDataflow.vue'),
    },
    {
        path: '/dataflows/create',
        name: "createDataflow",
        component: () =>
            import ('../../views/dataflow/CreateDataflow.vue'),
    },
    
]