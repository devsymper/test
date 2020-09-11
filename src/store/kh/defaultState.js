const defaultState = {
    currentDocument: "",
    collapseSideBar: false,
    userName: "Nguyễn Quốc Tân",
    unreadNotification: 1,
    roles: ["Trưởng phòng nhân sự"],
    items: [
        { title: "Reports", icon: "mdi-view-dashboard" },
        { title: "Workflows", icon: "mdi-sitemap" },
        { title: "Documents", icon: "mdi-file-document-outline" },
        { title: "Org Chart", icon: "mdi-account-group-outline" },
        { title: "Methods", icon: "mdi-function" },
        { title: "Virtual Doc", icon: "mdi-table-sync" },
        { title: "Service", icon: "mdi-cogs" },
        { title: "Menu", icon: "mdi-microsoft-xbox-controller-menu" },
        { title: "Users", icon: "mdi-account-settings" }
    ],

    header_slug: 1, //KH thanh tranh thái hiển thị slug,
    statusEdit: true, //trạng thái của document
    statusRightBar: -1, //trạng thái của thanh sidebar right
    subCollapseSideBar: false, // trạng thái của sidebar KH: true là đang nhỏ, false là đang mở rộng
    widthSideBar: 250,
    search: "",

    // Danh sách tất cả các Directory
    allDirectory: [],
    allDocument: [],
    listDocumentFavorite: [],
    listDataTableRoot: [],
    listDataTableChildren: [],
    listLogDocument: [],
    listLogAll: [],
    listBackupDocument: [],
    statusRestore: false,
    statusBackup: false,
    statusFormAddSizeTable: false,
    statusHansonTable: false,
    statusShowImage: false,
    arrSizeTable: {},
    hotData: [],
    dataTable: [],
    idTable: "",
    arrIdFileAttach: [],
    arrFileAttach: [],
    flagFirst: 0,
    flagErrEditor: 0,
    //statusAddTable: 0,


};

export default defaultState;