export default [{
    path: "/myitem",
    name: "myItem",
    component: () =>
        import ('../../views/myItem/index.vue'),
},
// {
//     path: "/tasks/:id",
//     name: "doTask",
//     component: () =>
//         import ('../../views/tasks/DoTask.vue')
// },
// {
//     path: "/works",
//     name: "workList",
//     component: () =>
//         import ('../../views/works/WorkList.vue'),
// },
]