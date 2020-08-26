export default [{
        path: "/users",
        name: "processListUser",
        component: () =>
            import ('../../views/users/ShowList.vue'),
    },

    {
        path: "/users/add",
        name: "addUser",
        component: () =>
            import ('../../views/users/ActionPanel.vue'),
    },
    {
        path: "/users/edit/:id",
        name: "editUser",
        component: () =>
            import ('../../views/users/ActionPanel.vue'),
    },
];