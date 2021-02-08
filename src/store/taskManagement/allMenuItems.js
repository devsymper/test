export default {
    home:{
        workspaceHome:{
            isWorkSpace:true,
            title:"CÔNG VIỆC",
            items:{
                selectBoard:{
                    title:"Board",
                    name:"selectBoard",
                    subTitle:'Board',
                    type:'select',
                    component:'SelectBoard',
                    icon: 'mdi-view-dashboard-variant-outline',
                },
                KanbanBoard:{
                    title:"Kanban board",
                    name:"board",
                    icon: 'mdi-view-week-outline',
                    url:"/task-management/projects/:id/kanban-board"
                },
                Backlog:{
                    title:"Backlog",
                    name:"backlog",
                    icon: 'mdi-view-carousel-outline',
                    url:"/task-management/projects/:id/backlog"
                },
                Component:{
                    title:"Component",
                    name:"component",
                    icon: 'mdi-hexagon-multiple-outline',
                    url:"/task-management/projects/:id/components"
                },
                Version:{
                    title:"Version",
                    name:"version",
                    icon: 'mdi-shield-check-outline',
                    url:"/task-management/projects/:id/versions"
                },
                Timesheets:{
                    title:"TimeSheet",
                    name:"timesheet",
                    icon: 'mdi-calendar-month',
                    url:"/task-management/projects/:id/timesheets"
                },
            }
        },
        workspaceReport:{
            isWorkSpace:true,
            title:"BÁO CÁO",
            items:{
                Report:{
                    name:'report',
                    title:"Report",
                    icon: 'mdi-chart-bell-curve-cumulative',
                    url:"/task-management/projects/:id/report"
                }
            }
        },
        workspaceSetting:{
            isWorkSpace:true,
            title:"CÀI ĐẶT",
            items:{
                projectSetting:{
                    title:"Project Setting",
                    name:"projectSetting",
                    url:"/task-management/projects/:id/settings/details",
                    icon: 'mdi-cog-outline'
                }
            }
        },
    },
    projectSetting:{
        workspaceProject:{
            isWorkSpace:true,
            title:"Project setting",
            items:{
                projectDetail:{
                    name:'detail',
                    title:"Detail",
                    icon: 'mdi-file-table-box-outline',
                    url:"/task-management/projects/:id/settings/details"
                },
                projectAccess:{
                    name:'access',
                    title:"Access",
                    icon: 'mdi-shield-account',
                    url:"/task-management/projects/:id/settings/access"
                },
                listWorkflow:{
                    name:'workflow',
                    title:"workflow",
                    icon: 'mdi-lan',
                    url:"/task-management/projects/:id/workflow"
                },
                projectIssueType:{
                    name:'issueType',
                    title:"Issue type",
                    icon: 'mdi-file-document-outline',
                    url:"/task-management/projects/:id/settings/issuetypes"
                },
                
                projectIssueLink:{
                    name:'issueLink',
                    title:"Issue Link",
                    icon: 'mdi-link',
                    url:"/task-management/projects/:id/issue-link"
                },
                projectPriority:{
                    name:'priority',
                    title:"Priority",
                    icon: 'mdi-priority-low',
                    url:"/task-management/projects/:id/priorities"
                },
                // {
                //     name:'createFilter',
                //     title:"Create Filter",
                //     icon: 'mdi-filter-plus-outline',
                //     url:"/task-management/projects/:id/create-filter"
                // },
                backToKanban:{
                    name:'backToKanban',
                    title:"Quay lại Kanban",
                    icon: 'mdi-keyboard-backspace',
                    url:"/task-management/projects/:id/kanban-board"
                },
            }
        }
    },
    boardSetting:{
        item4:{
            name:'backToKanban',
            title:"Quay lại Kanban",
            icon: 'mdi-keyboard-backspace',
            url:"/task-management/projects/:id/kanban-board"
        },
    }
}