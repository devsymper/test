export default [{
    path: "/myitem",
    name: "myItem",
    component: () =>
        import ('../../views/myItem/index.vue'),
},
{
    path: "/myitem/tasks/:id",
    name: "doTask",
    component: () =>
        import ('@/components/myItem/DoTask.vue')
},
// {
//     path: "/works",
//     name: "workList",
//     component: () =>
//         import ('../../views/works/WorkList.vue'),
// },
]