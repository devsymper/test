const defaultState = {
    accountType: "ba", // loại tài khoản đang đăng nhập: ba hoặc enduser
    baInfo: {
        email: "", // email của BA
        name: "", // tên của BA,
        id: 0,
    },
    endUserInfo: {
        name: "Nguyễn Quốc Tân",
        id: 0,
        currentRole: {
            // Vai trò hiện tại của enduser đang đóng
            id: 0,
            name: "",
        },
        roles: { // các vai trò mà user có thể có trong orgchart hoặc system role
            orgchart: [],
            systemRole: []
        },
    },
    collapseSideBar: true, // trạng thái của sidebar: true là đang nhỏ, false là đang mở rộng
    unreadNotification: 2, // số lượng các thông báo chưa đọc
    needReloadNotification: false,
    items: [
        // các menu mà ba hoặc enduser được phân quyền
        { title: "application", icon: "mdi-application", link: "/application" },
        { title: "reports", icon: "mdi-view-dashboard", link: "/reports" },
        { title: "workflows", icon: "mdi-sitemap", link: "/workflow" },
        {
            title: "documents",
            icon: "mdi-file-document-outline",
            link: "/documents",
        },
        {
            title: "orgchart",
            icon: "mdi-account-group-outline",
            link: "/orgchart",
        },
        { title: "methods", icon: "mdi-function", link: "/methods" },
        { title: "virtual_doc", icon: "mdi-table-sync", link: "/virtual-doc" },
        { title: "service", icon: "mdi-cogs", link: "/service" },
        {
            title: "menu",
            icon: "mdi-microsoft-xbox-controller-menu",
            link: "/menu",
        },
        { title: "users", icon: "mdi-account-settings", link: "/users" },
        { title: "snippets", icon: "mdi-contain", link: "/snippets" },
        {
            title: "permissions",
            icon: "mdi-folder-account",
            link: "/permissions",
        },
        { title: "actions", icon: "mdi-package", link: "/actions" },
        { title: "apps", icon: "mdi-apps", link: "/apps" },
        { title: "virtualdocs", icon: "mdi-table", link: "/virtualdocs" },
        { title: "tasks", icon: "mdi-check-all", link: "/tasks" },
        { title: "works", icon: "mdi-briefcase-check-outline", link: "/works" },
        { title: "userRoleSetting", icon: "mdi-access-point-network", link: "/user-role-settings" },
    ],
    urlToTabTitleMap: {}, // map giữa url với title và pageInstanceKey của tab,
    currentTabIndex: 0, // index cuả tab hiện tại đang mở,
    supportedLanguages: [{
            key: "vn",
            title: "Tiếng Việt",
        },
        {
            key: "en",
            title: "English",
        },
    ],

    /**
     * Danh sách các node của các orgchart
     * dạng: {
     *      idOrgchart : {} // tất cả các node của từng orgchart ở dạng phẳng , có id của node cha ở từng node,
     *      dạng {id của node: thuộc tính của node đó}
     * }
     */
    orgchartNodes: {},
    // Danh sách tất cả các user trong hệ thống
    allUsers: [],
    generalNotificationPosition: 'top right'
};

export default defaultState;