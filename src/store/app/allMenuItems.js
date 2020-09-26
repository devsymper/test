export default {
    my_application: {
        title: 'My application',
        icon: 'mdi mdi-format-list-checkbox',
        link: "/my-applications",
        group: "My work"
    },
    workflow_definition: {
        title: "workflows",
        icon: "mdi-lan",
        group: "My work",
        children: {
            listWorkflow: {
                title: "List workflows",
                action: {
                    "module": "workflow",
                    "resource": "workflow_definition",
                    "scope": "workflow",
                    "action": "list"
                },
            },
            listTrash: {
                title: "Lists trash",
                icon: "mdi-trash",
                link: "/documents/trash"
            }
        }
    },
    document_definition: {
        title: "documents",
        icon: "mdi-file-document-edit-outline",
        group: "My work",
        children: {
            listDocument: {
                title: "List documents",
                action: {
                    "module": "document",
                    "resource": "document_definition",
                    "scope": "document",
                    "action": "list"
                },
            },
            listTrash: {
                title: "Lists trash",
                icon: "mdi-trash",
                link: "/documents/trash"
            }
        }
    },
    BI: {
        title: "Report",
        icon: "mdi-view-dashboard-outline",
        group: "My work",
    },
    orgchart: {
        title: "orgchart",
        icon: "mdi-office-building-outline",
        group: "My work",
        action: {
            "module": "orgchart",
            "resource": "orgchart",
            "scope": "orgchart",
            "action": "list"
        }
    },
    lisTaskToDo: {
        title: "Lists to do",
        icon: "mdi-sticker-check-outline",
        group: "My work",
        children: {
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
        }
    },
    timeTable: {
        icon: "mdi-calendar-month-outline",
        title: "myWork",
        group: "Applications",
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
    },
    knowledge: {
        title: 'KH',
        icon: 'mdi-file-certificate-outline',
        link: '/knowledge',
        group: "Applications"
    },
    fileManagement: {
        title: 'File',
        icon: 'mdi-upload-outline',
        link: '/knowledge',
        group: "Applications"
    },
    userManager: {
        title: "Account management",
        icon: "mdi-account-cog-outline",
        group: "Administrator",
        children: {
            account: {
                title: "users",
                icon: "mdi-account-settings",
                link: "/users",
            },
            ba_account: {
                title: "baAccount",
                icon: "mdi-account-tie",
                link: "/ba-account"
            },
        }
    },
    accessManager: {
        title: "Access Management",
        icon: "mdi-shield-key-outline",
        group: "Administrator",
        children: {
            permissions: {
                title: "permissions",
                icon: "mdi-folder-account",
                link: "/permissions",
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
        }
    },
    application_definition: {
        title: "apps",
        icon: "mdi mdi-widgets-outline",
        link: "/apps",
        group: "My work"
    },
    // comment: {
    // 	title: 'tesstsdádasdad',
    // 	icon: 'mdi-file-edit-outline',
    // 	link: '/comment',
    // },
    // { title: "reports", icon: "mdi-view-dashboard", link: "/reports" },
    // { title: "virtualdocs", icon: "mdi-table", link: "/virtualdocs" },
    // { title: "methods", icon: "mdi-function", link: "/methods" },
    // { title: "virtual_doc", icon: "mdi-table-sync", link: "/virtual-doc" },
    // { title: "service", icon: "mdi-cogs", link: "/service" },
    // { title: "snippets", icon: "mdi-contain", link: "/snippets" },
};