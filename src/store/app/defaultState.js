const defaultState = {
    accountType: 'ba', // loại tài khoản đang đăng nhập: ba hoặc enduser
    baInfo: {
        email: '', // email của BA
        name: '', // tên của BA,
        id: 0
    },
    endUserInfo: {
        name: 'Nguyễn Quốc Tân',
        id: 0,
        currentRole: { // Vai trò hiện tại của enduser đang đóng
            id: 0,
            title: "Trưởng phòng nhân sự"
        },
        roles: [ // các vai trò của enduser có thể có
            {
                id: 0,
                title: "Trưởng phòng nhân sự"
            }
        ],
    },
    collapseSideBar: true, // trạng thái của sidebar: true là đang nhỏ, false là đang mở rộng
    unreadNotification: 1, // số lượng các thông báo chưa đọc
    items: [ // các menu mà ba hoặc enduser được phân quyền 
        { title: "reports", icon: "mdi-view-dashboard", link: "/reports" },
        { title: "workflows", icon: "mdi-sitemap", link: "/bpmne" },
        {
            title: "documents",
            icon: "mdi-file-document-outline",
            link: "/documents"
        },
        {
            title: "orgchart",
            icon: "mdi-account-group-outline",
            link: "/orgchart"
        },
        { title: "methods", icon: "mdi-function", link: "/methods" },
        { title: "virtual_doc", icon: "mdi-table-sync", link: "/virtual-doc" },
        { title: "service", icon: "mdi-cogs", link: "/service" },
        {
            title: "menu",
            icon: "mdi-microsoft-xbox-controller-menu",
            link: "/menu"
        },
        { title: "users", icon: "mdi-account-settings", link: "/users" }
    ],
    urlToTabTitleMap: {}, // map giữa url với title của tab,
    currentTabIndex: 0, // index cuả tab hiện tại đang mở,
    supportedLanguages: [{
        key: 'vn',
        title: "Tiếng Việt"
    }, {
        key: 'en',
        title: "English"
    }]
};

export default defaultState;