export default [{
        path: "/setting-notification",
        name: "Setting Notification",
        component: () =>
            import ('../../views/settingNotification/index.vue'),
    },
    {
        path: "/setting-notificationBA",
        name: "Setting Notification BA",
        component: () =>
            import ('../../views/settingNotification/BAconfig.vue'),
    },

]