export default {
    home:{
        workspace1:{
            isWorkSpace:true,
            title:"CÔNG VIỆC",
            items:[
                {
                    title:"Board",
                    subTitle:'Board',
                    type:'select',
                    component:'SelectBoard',
                    icon: 'mdi-view-dashboard-variant-outline',
                },
                {
                    title:"Kanban board",
                    icon: 'mdi-view-week-outline',
                    url:"/task-management/projects/:id/kanban-board"
                },
                {
                    title:"Backlog",
                    icon: 'mdi-view-carousel-outline',
                    url:"/task-management/projects/:id/kanban-board"
                },
                {
                    title:"Component",
                    icon: 'mdi-hexagon-multiple-outline',
                    url:"/task-management/projects/:id/components"
                },
                {
                    title:"Version",
                    icon: 'mdi-shield-check-outline',
                    url:"/task-management/projects/:id/versions"
                },
                {
                    title:"TimeSheet",
                    icon: 'mdi-calendar-month',
                    url:"/task-management/projects/:id/timesheets"
                },
            ]
        },
        workspace2:{
            isWorkSpace:true,
            title:"BÁO CÁO",
            items:[
                {
                    name:'hoang_child',
                    title:"Report",
                    icon: 'mdi-chart-bell-curve-cumulative',
                    url:"/report"
                }
            ]
        },
        item3:{
            isWorkSpace:false,
            title:"Project Setting",
            url:"/task-management/projects/:id/settings/details",
            icon: 'mdi-cog-outline'
        }
    },
    projectSetting:{
        workspaceProject:{
            isWorkSpace:true,
            title:"Project setting",
            items:[
                {
                    name:'detail',
                    title:"Detail",
                    icon: 'mdi-file-table-box-outline',
                    url:"/task-management/projects/:id/settings/details"
                },
                {
                    name:'access',
                    title:"Access",
                    icon: 'mdi-shield-account',
                    url:"/task-management/projects/:id/settings/access"
                },
                {
                    name:'issueType',
                    title:"Issue type",
                    icon: 'mdi-file-document-outline',
                    url:"/task-management/projects/:id/settings/issuetypes"
                },
                {
                    name:'workflow',
                    title:"workflow",
                    icon: 'mdi-graph',
                    url:"/task-management/projects/:id/workflow"
                },
                {
                    name:'IssueLink',
                    title:"Issue Link",
                    icon: 'mdi-link',
                    url:"/task-management/projects/:id/issue-link"
                },
                {
                    name:'Priority',
                    title:"Priority",
                    icon: 'mdi-priority-low',
                    url:"/task-management/projects/:id/priorities"
                },
                {
                    name:'backToKanban',
                    title:"Back to Kanban",
                    icon: 'mdi-keyboard-backspace',
                    url:"/task-management/projects/:id/kanban-board"
                },
            ]
        }
    },
    boardSetting:{
        item4:{
            name:'backToKanban',
            title:"Back to Kanban",
            icon: 'mdi-keyboard-backspace',
            url:"/task-management/projects/:id/kanban-board"
        },
    }
}