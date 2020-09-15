export default {
    workflow_definition: {
        title: "workflows",
        icon: "mdi-sitemap",
        action: {
            "module": "workflow",
            "resource": "workflow_definition",
            "scope": "workflow",
            "action": "list"
        }
    },
    document_definition: {
        title: "documents",
        icon: "mdi-file-document-outline",
        action: {
            "module": "document",
            "resource": "document_definition",
            "scope": "document",
            "action": "list"
        },
        children: {
            listTrash: {
                title: "Thùng rác",
                icon: "mdi-trash",
                link: "/documents/trash"
            }
        }
    },
    orgchart: {
        title: "orgchart",
        icon: "mdi-account-group-outline",
        action: {
            "module": "orgchart",
            "resource": "orgchart",
            "scope": "orgchart",
            "action": "list"
        }
    },
    account: {
        title: "users",
        icon: "mdi-account-settings",
        link: "/users"
    },
    permissions: {
        title: "permissions",
        icon: "mdi-folder-account",
        link: "/permissions",
    },
    application_definition: {
        title: "apps",
        icon: "mdi-apps",
        link: "/apps"
    },
    tasks: {
        title: "tasks",
        icon: "mdi-check-all",
        link: "/tasks"
    },
    works: {
        title: "works",
        icon: "mdi-briefcase-check-outline",
        link: "/works"
    },
    role: {
        title: "userRoleSetting",
        icon: "mdi-access-point-network",
        link: "/user-role-settings"
    },
    action_pack: {
        title: "actionPack",
        icon: "mdi-access-point",
        link: "/action-pack"
    },
    ba_account: {
        title: "baAccount",
        icon: "mdi-account-tie",
        link: "/ba-account"
    },
    knowledge: {
        title: 'KH',
        icon: 'mdi-file-edit-outline',
        link: '/knowledge',
    },
    // comment: {
    // 	title: 'tesstsdádasdad',
    // 	icon: 'mdi-file-edit-outline',
    // 	link: '/comment',
    // },
    timeSheetLogWork: {
        title: "My work",
        icon: "mdi-calendar",
        link: "/timesheet",
        children: {
            timeSheetLogWork: {
                title: "My work",
                icon: "mdi-calendar",
                link: "/timesheet"
            },
            timeSheetSubmit: {
                title: "Timesheet",
                icon: "mdi-calendar-check",
                link: "/timesheet/submit",
            },
            timeSheetReport: {
                title: "Timesheet report",
                icon: "mdi-chart-line",
                link: "/timesheet/report",
            },
            timeSheetManage: {
                title: "Manage timesheet",
                icon: " mdi-calendar-text",
                link: "/timesheet/manage",
            }
        }
    }
    // { title: "reports", icon: "mdi-view-dashboard", link: "/reports" },
    // { title: "virtualdocs", icon: "mdi-table", link: "/virtualdocs" },
    // { title: "methods", icon: "mdi-function", link: "/methods" },
    // { title: "virtual_doc", icon: "mdi-table-sync", link: "/virtual-doc" },
    // { title: "service", icon: "mdi-cogs", link: "/service" },
    // { title: "snippets", icon: "mdi-contain", link: "/snippets" },
};