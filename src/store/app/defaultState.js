const defaultState = {
    accountType: 'ba', // loại tài khoản đang đăng nhập: ba hoặc enduser
    baEmail: '', // email của BA
    baName: '', // tên của BA
    collapseSideBar: true, // trạng thái của sidebar: true là đang nhỏ, false là đang mở rộng
    userName: "Nguyễn Quốc Tân", // tên của enduser đang đăng nhập
    currentRole: { // Vai trò hiện tại của enduser đang đóng
        id: 0,
        title: "Trưởng phòng nhân sự"
    },
    unreadNotification: 1, // số lượng các thông báo chưa đọc
    roles: [ // các vai trò của enduser có thể có
        {
            id: 0,
            title: "Trưởng phòng nhân sự"
        }
    ],
    items: [ // các menu mà ba hoặc enduser được phân quyền 
        { title: "Reports", icon: "mdi-view-dashboard", link: "/reports" },
        { title: "Workflows", icon: "mdi-sitemap", link: "/bpmne" },
        {
            title: "Documents",
            icon: "mdi-file-document-outline",
            link: "/documents"
        },
        {
            title: "Org Chart",
            icon: "mdi-account-group-outline",
            link: "/orgchart"
        },
        { title: "Methods", icon: "mdi-function", link: "/methods" },
        { title: "Virtual Doc", icon: "mdi-table-sync", link: "/virtual-doc" },
        { title: "Service", icon: "mdi-cogs", link: "/service" },
        {
            title: "Menu",
            icon: "mdi-microsoft-xbox-controller-menu",
            link: "/menu"
        },
        { title: "Users", icon: "mdi-account-settings", link: "/users" }
    ]
};

export default defaultState;
