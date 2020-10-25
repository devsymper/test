export default {
    my_application: {
        title: 'myApplication',
        icon: 'mdi-briefcase-edit-outline',
        link: "/my-applications",
        group: "My work",
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
                link: "/workflow/trash"
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
            },
            history: {
                title: "deleteHistory",
                icon: "mdi-file-document-edit-outline",
                link: "/documents/delete-history"
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
        children:{
            list: {
                title: "listOrgchart",
                link: "/orgchart"
            },
            trash: {
                title: "listTrashOrgchart",
                link: "/orgchart/trash"
            },
            viewOrgchart: {
                title: "viewOrgchart",
                // link: "/orgchart/:id/view"
            },
        }
    },
    myItem: {
        title: "myItem",
        icon: "mdi-format-list-checkbox",
        link: "/myitem",
        group: "My work",
    },
    // lisTaskToDo: {
    //     title: "Lists to do",
    //     icon: "mdi-sticker-check-outline",
    //     group: "My work",
    //     children: {
    //         tasks: {
    //             title: "tasks",
    //             icon: "mdi-check-all",
    //             link: "/tasks"
    //         },
    //         works: {
    //             title: "works",
    //             icon: "mdi-briefcase-check-outline",
    //             link: "/works"
    //         },
    //         myItem: {
    //             title: "myItem",
    //             icon: "mdi-format-list-checkbox",
    //             link: "/myitem"
    //         },
    //     }
    // },
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
        link: '/file-management',
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
            account_trash: {
                title: "account_trash",
                icon: "mdi-account-settings",
                link: "/users/trash",
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
        group: "My work",
        children: {
            listApp: {
                title: "listApps",
                icon: "mdi-folder-account",
                link: "/apps",
            },
            listTrashApp: {
                title: "listTrashApps",
                icon: "mdi-access-point-network",
                link: "/apps/trash"
            },
           
        }
    },
    settingNotication: {
        title: 'Notification',
        icon: 'mdi-bell-check-outline',
        link: '/setting-notification',
        group: "Setting"
    },
    settingNoticationBA: {
        title: 'Notification Config BA',
        icon: 'mdi-bell-plus-outline',
        link: '/setting-notificationBA',
        group: "Setting"
    },
};