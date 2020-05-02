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
        { title: "workflows", icon: "mdi-sitemap", link: "/bpmne/create" },
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
        { title: "users", icon: "mdi-account-settings", link: "/users" },
        { title: "snippets", icon: "mdi-contain", link: "/snippets" },
        { title: "permissions", icon: "mdi-folder-account", link: "/permissions" },
    ],
    urlToTabTitleMap: {}, // map giữa url với title của tab,
    currentTabIndex: 0, // index cuả tab hiện tại đang mở,
    supportedLanguages: [{
        key: 'vn',
        title: "Tiếng Việt"
    }, {
        key: 'en',
        title: "English"
    }],

    /**
     * Danh sách các node của các orgchart
     * dạng: {
     *      idOrgchart : {} // tất cả các node của từng orgchart ở dạng phẳng , có id của node cha ở từng node, 
     *      dạng {id của node: thuộc tính của node đó}
     * }
     */
    orgchartNodes: {

    },
    // Danh sách tất cả các user trong hệ thống
    allUsers: [{ "id": "850", "firstName": "Hoang1", "lastName": null, "userName": "hoangn", "displayName": "hoangn", "email": "hoangn@gmail.com", "password": null, "passwordProps": "{\"needChange\":1,\"dueDate\":{\"active\":1,\"type\":\"month\",\"value\":1}}", "phone": "1234764542", "status": "Đang mở", "avatar": null, "createAt": "2020-04-12 23:14:20", "updateAt": "2020-04-12 23:14:20", "listForeignKey": [] }, { "id": "849", "firstName": "Hoàng", "lastName": null, "userName": "hoangnd", "displayName": "Hoàng symper", "email": "hoang11a111@gmail.com", "password": null, "passwordProps": "{\"needChange\":1,\"dueDate\":{\"active\":1,\"type\":\"month\",\"value\":1}}", "phone": "0373848398", "status": "Đang mở", "avatar": null, "createAt": "2020-04-12 23:04:09", "updateAt": "2020-04-12 23:04:09", "listForeignKey": [] }, { "id": "848", "firstName": "Dinh", "lastName": null, "userName": "nvdinh", "displayName": "Nguyễn Việt Dinh", "email": "nvdinh@symper.vn", "password": null, "passwordProps": "{\"needChange\":1,\"dueDate\":{\"active\":1,\"type\":\"month\",\"value\":1}}", "phone": "1234567890", "status": "Đang mở", "avatar": null, "createAt": "2020-04-12 18:41:38", "updateAt": "2020-04-12 18:41:38", "listForeignKey": [] }, { "id": "847", "firstName": "Khá", "lastName": null, "userName": "khadm", "displayName": "Mạnh Khá", "email": "khadm@symper.vn", "password": null, "passwordProps": "{\"needChange\":1,\"dueDate\":{\"active\":1,\"type\":\"month\",\"value\":1}}", "phone": "1234567890", "status": "Đang mở", "avatar": null, "createAt": "2020-04-12 18:30:42", "updateAt": "2020-04-12 18:30:42", "listForeignKey": [] }, { "id": "846", "firstName": "Hoàng", "lastName": null, "userName": "hoangnd", "displayName": "Hoàng symper", "email": "hoang11111@gmail.com", "password": null, "passwordProps": "{\"needChange\":1,\"dueDate\":{\"active\":1,\"type\":\"month\",\"value\":1}}", "phone": "0373848398", "status": "Đang mở", "avatar": null, "createAt": "2020-04-12 18:25:57", "updateAt": "2020-04-12 18:25:57", "listForeignKey": [] }, { "id": "845", "firstName": "Hoàng", "lastName": null, "userName": "hoangnd", "displayName": "Hoàng symper", "email": "hoang1111@gmail.com", "password": null, "passwordProps": "{\"needChange\":1,\"dueDate\":{\"active\":1,\"type\":\"month\",\"value\":1}}", "phone": "0373848398", "status": "Đang mở", "avatar": null, "createAt": "2020-04-12 18:25:41", "updateAt": "2020-04-12 18:25:41", "listForeignKey": [] }, { "id": "844", "firstName": "Hoàng", "lastName": null, "userName": "hoangnd", "displayName": "Hoàng symper", "email": "hoang111@gmail.com", "password": null, "passwordProps": "{\"needChange\":1,\"dueDate\":{\"active\":1,\"type\":\"month\",\"value\":1}}", "phone": "0373848398", "status": "Đang mở", "avatar": null, "createAt": "2020-04-12 18:25:27", "updateAt": "2020-04-12 18:25:27", "listForeignKey": [] }, { "id": "843", "firstName": "Hoàng", "lastName": null, "userName": "hoangnd", "displayName": "Hoàng symper", "email": "hoang11@gmail.com", "password": null, "passwordProps": "{\"needChange\":1,\"dueDate\":{\"active\":1,\"type\":\"month\",\"value\":1}}", "phone": "0373848398", "status": "Đang mở", "avatar": null, "createAt": "2020-04-12 18:25:10", "updateAt": "2020-04-12 18:25:10", "listForeignKey": [] }, { "id": "842", "firstName": "Hoàng", "lastName": null, "userName": "hoangnd", "displayName": "Hoàng symper", "email": "hoang1@gmail.com", "password": null, "passwordProps": "{\"needChange\":1,\"dueDate\":{\"active\":1,\"type\":\"month\",\"value\":1}}", "phone": "0373848398", "status": "Đang mở", "avatar": null, "createAt": "2020-04-12 18:24:54", "updateAt": "2020-04-12 18:24:54", "listForeignKey": [] }, { "id": "841", "firstName": "Hoàng", "lastName": null, "userName": "hoangnd", "displayName": "Hoàng symper", "email": "hoang@gmail.com", "password": null, "passwordProps": "{\"needChange\":1,\"dueDate\":{\"active\":1,\"type\":\"month\",\"value\":1}}", "phone": "0373848398", "status": "Đang mở", "avatar": null, "createAt": "2020-04-12 18:24:33", "updateAt": "2020-04-12 18:24:33", "listForeignKey": [] }]
};

export default defaultState;