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
        action: {
            "module": "dashboard",
            "resource": "dashboard",
            "scope": "dashboard",
            "action": "list"
        },
    },
    orgchart: {
        title: "orgchart",
        icon: "mdi-office-building-outline",
        group: "My work",
        children: {
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
    taskManagement: {
        title: 'Task Management',
        icon: 'mdi-lock-outline',
        link: '/task-management',
        group: "Applications"
    },
    fileManagement: {
        title: 'File',
        icon: 'mdi-upload-outline',
        link: '/file-management',
        group: "Applications",
        action: {
            "module": "file",
            "resource": "file",
            "scope": "file",
            "action": "list"
        },
    },
    admin: {
        title: "admin",
        icon: "mdi-cog-transfer-outline",
		group: "Administrator",
		link: "/admin",
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
        title: "accessControl",
        icon: "mdi-shield-key",
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
	access_control: {
		title: "accessControlBeta",
        icon: "mdi mdi-shield-key-outline",
		group: "Administrator",
		link: "/access-control"
	},
	syql_function: {
		title: "syqlFunction",
        icon: "mdi mdi-function-variant",
		group: "Administrator",
		link: "/syql-manager"
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
        group: "Setting",
        children: {
            settingNotificationUser: {
                title: "Notification User",
                icon: "mdi-folder-account",
                link: "/setting-notification",
            },
            settingNoticationBa: {
                icon: 'mdi-bell-plus-outline',
                title: "Notification Config BA",
                icon: "mdi-access-point-network",
                link: '/setting-notification-Ba',
            },

        }
	},
	environmentManagement:{
		title: 'environment',
        icon: 'mdi-earth',
		group: "Setting",
		link: '/environment-management',
	}

};