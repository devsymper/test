export default [{
        path: "/timesheet",
        name: "timesheet",
        component: () =>
            import ('../../views/timesheet/ShowLogTime.vue'),
    },

    {
        path: "/timesheet/report",
        name: "Report timesheet",
        component: () =>
            import ('../../views/timesheet/ReportTimesheet.vue'),
    },
    {
        path: "/category",
        name: "Timesheet Category",
        component: () =>
            import ('../../views/timesheet/ListCategory.vue'),
    },

    {
        path: "/timesheet/submit",
        name: "Submit Timesheet",
        component: () =>
            import ('../../views/timesheet/SubmitTimesheet.vue'),
    },
    {
        path: "/timesheet/report",
        name: "Timesheet Report",
        component: () =>
            import ('../../views/timesheet/ReportTimesheet.vue'),
    },

    {
        path: "/timesheet/manage",
        name: "Manage Timesheet",
        component: () =>
            import ('../../views/timesheet/ManageTimeSheet.vue'),
    }
];