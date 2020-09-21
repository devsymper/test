export default [{
        path: "/knowledge/",
        name: "kh",
        component: () =>
            import ('../../views/kh/Home.vue')
    },
    {
        path: "/knowledge/document/:hash",
        name: "document",
        // component: Document,
        component: () =>
            import ('../../views/kh/KHDocument.vue'),

    },
    //detail workspace
    {
        path: "/knowledge/folder/:hash",
        name: "folder",
        component: () =>
            import ('../../views/kh/KHDetailFolder.vue'),
    },
]