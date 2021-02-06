/**
 * File phục vụ cho việc lấy các cấu hình mặc định của dashboards
 */
export const getDefaultDashboardConfig = function(){
    return {
        cellConfigsHeight:"200px",
        cellContextMenu: {}, // chứa các context menu có thể có của cell đang được foucus
        colapsedPane: { // lưu lại trạng thái đóng mở của các tab cấu hình bên phải 
            comment: true, // tab comment
            fields: false, // tab thông tin của các trường trong dataset
            globalFilter: true, // tab chứa thông tin của global filter
            viz: false // tab chứa cấu hình lựa chọn report type và cấu hình của từng report
        }, 
        currentCellConfigs: {}, // cấu hình của report hiện tại đang được chọn
        dashboardConfigs: {
            allCellConfigs: { // cấu hình của tất cả các report có trong một dashboard
                // 'cell-1606808582716': {cấu hình của một report, theo cấu trúc kết quả của hàm getDefaultReportConfig trong file ./defaultReportConfig.js  }
            },
            info: {
                activePageIndex: 0, // index của page đang được mở lên
                activeTabIndex: 0, // index của page đang được mở lên
                currentTabPageKey:"tab 1", // key của tab và page đang được mở lên
                dashboardName:"", // tên dashboard
                datasets: {}, // map các dataset được lựa chọn cho dashboard này, dạng: {id dataset : true}
                drillThrough: {
                    drillThrough: {
                        'tab 1': []
                    },
                }, // cấu hình về drill through
                focusingDataPoint: {}, // điểm đang được foucus của các report khi click chuột phải hoặc click bằng chuột trái
                hasCopiedCell:false, // dashboard này đang có cell được copy ko
                layout: {
                    'tab 1': [],
                    '': []
                }, // chứa config về layout của các tab trong dashboard: có những cell với vị trí, kích thước ntn
                lockWorkspace: false, // có đang khóa việc kéo thả các cell ko
                relations: [], // mảng chứa các id của relation được áp dụng trong dashboard  
                tabsAndPages: {
                    tabs: [{
                            name: 'tab 1',
                            active: true
                        },
                        {
                            name: '',
                            active: true
                        }
                    ],
                    // pages: ['page 1']
                }, // object chứa config của các tab trong dashboard
                theme: "symper_default_dashboard_theme", // id theme được áp dụng cho dashboard
                variables:{}
            }
        }, // cấu hình của toàn bộ dashboard này
        datasetsInRelationsMap: {}, // 
        filter:{},
        isInitDashboard: true,
        loadedCellDataCount: 0,
        loadingData: false,
        needRemoteDataCellCount: 0,
        recentColors: [],
        allDatasetColumns: {} // danh sách tất cả các dataset được sử dụng trong dashboard
    }
}
export const getDefaultDisplayOption = function() {
    return {
        symperTitle: {},
        general: {},
        data: [],
        contentSize: {
            h: 0,
            w: 0
        }
    };
}

export const calcTitleCellHeight = function(textHeight){
    return Number(textHeight) + 5;
}