export default {
    home:{
        workspace1:{
            isWorkSpace:true,
            title:"CÔNG VIỆC",
            items:[
                {
                    title:"Board",
                    name:"selectBoard",
                    subTitle:'Board',
                    type:'select',
                    component:'SelectBoard',
                    icon: 'mdi-view-dashboard-variant-outline',
                },
                {
                    title:"Kanban board",
                    name:"board",
                    icon: 'mdi-view-week-outline',
                    url:"/task-management/projects/:id/kanban-board"
                },
                {
                    title:"Backlog",
                    name:"backlog",
                    icon: 'mdi-view-carousel-outline',
                    url:"/task-management/projects/:id/backlog"
                },
                {
                    title:"Component",
                    name:"component",
                    icon: 'mdi-hexagon-multiple-outline',
                    url:"/task-management/projects/:id/components"
                },
                {
                    title:"Version",
                    name:"version",
                    icon: 'mdi-shield-check-outline',
                    url:"/task-management/projects/:id/versions"
                },
                {
                    title:"TimeSheet",
                    name:"timesheet",
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
                    name:'report',
                    title:"Report",
                    icon: 'mdi-chart-bell-curve-cumulative',
                    url:"/task-management/projects/:id/report"
                }
            ]
        },
        workspace3:{
            isWorkSpace:true,
            title:"CÀI ĐẶT",
            items:[
                {
                    title:"Project Setting",
                    name:"projectSetting",
                    url:"/task-management/projects/:id/settings/details",
                    icon: 'mdi-cog-outline'
                }
            ]
        },
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
                    name:'workflow',
                    title:"workflow",
                    icon: 'mdi-lan',
                    url:"/task-management/projects/:id/workflow"
                },
                {
                    name:'issueType',
                    title:"Issue type",
                    icon: 'mdi-file-document-outline',
                    url:"/task-management/projects/:id/settings/issuetypes"
                },
                
                // {
                //     name:'issueLink',
                //     title:"Issue Link",
                //     icon: 'mdi-link',
                //     url:"/task-management/projects/:id/issue-link"
                // },
                {
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
                {
                    name:'backToKanban',
                    title:"Quay lại Kanban",
                    icon: 'mdi-keyboard-backspace',
                    url:"/task-management/projects/:id/kanban-board"
                },
            ]
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