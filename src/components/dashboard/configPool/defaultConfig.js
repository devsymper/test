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

/**
 * Cấu trúc dữ liệu cho một cell bất kỳ
 */
const defaultCellConfigs = {
    /**
     * Các config dùng chung cho cả việc hiển thị và xử lý dữ liệu bên dưới
     */
    sharedConfigs: {
        type: '',
        yAxisCount: 1, // mặc định cho số lượng yaxis
        cellId: 0,
        data: [] // data dùng cho việc hiển thị của cell này
    },
    /**
     * Các config chỉ dùng cho xử lý dữ liệu bên dưới
     */
    rawConfigs: {
        setting: {}, // cấu hình các cột
        style: [], // cấu hình hiển thị của cell
        condition: [] // điều kiện để lấy data của cell
    },

    /**
     * Các config chỉ dùng cho việc hiển thị 
     */
    viewConfigs: {
        isSelecting: false,
        selectedDataset: {}, // các dataset nào được dùng cho cell hiện tại,
        showIcon: true,
        commentCount: 0,
        displayOptions: getDefaultDisplayOption(),
        needSaveExtraOptions: {}, // các option cho việc hiển thị do việc tương tác trực tiếp trên cell, ví dụ việc lưu lại chiều rộng các cột do BA kéo
        filter: {},
        loadingData: false,
    },
};

const globalStyleConfigs = {
    size: {
        w: '1280px', // width
        h: '720px', // height
        s: 1, // scale của cả dashboard
    },
    rowHeight: 15,
    wrapperSize: {
        w: '', // width
        h: '', // height
    },
    style: {
        background: {
            color: '#ffffff',
        },
        cellMargin: [10, 10]
    }
};
let globalCell = JSON.parse(JSON.stringify(defaultCellConfigs));
globalCell.viewConfigs.displayOptions.dashboardStyle = globalStyleConfigs;
globalCell.sharedConfigs.type = 'global';
const defaultDashboardConfigs = {
    /**
     * Cấu hình của tất cả các cell trong dashboard
     * có dạng {
     *      cellId1 : cấu trúc giống như defaultCellConfigs
     *      cellId2: cấu trúc giống như defaultCellConfigs
     * } 
     */
    allCellConfigs: {
        global: globalCell,
    },
    info: { // các thông tin chung của dashboard
        dashboardName: '',
        activeTabIndex: '0',
        activePageIndex: 0,
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
        },
        currentTabPageKey: 'tab 1',

        /**
         * vị trí, kích thước của các cell trong dashboard, 
         * cấu trúc là object, key là id của tab và page, 
         * value là layout của dashboard tại tab và page đó
         */
        layout: {
            'tab 1': [],
            '': []
        },
        relations: [], // các quan hệ được sử dụng trong dashboard
        datasets: {}, // các dataset được lựa chọn dùng cho dashboard
        theme: 'symper_default_dashboard_theme',
        lockWorkspace: false,
        /**
         * drill through qua các tab trong dashboard
         * có cấu trúc: {
         *      'tên của tab' : [{cấu trúc của cột được kéo vào}]
         * }
         */
        drillThrough: {
            'tab 1': []
        },

        /**
         * điểm dữ liệu đang được focus
         */
        focusingDataPoint: {
            cellId: '', // của cell nào
            data: {}, // dữ liệu là gì
            dataRowIndex: -1, //index của dòng trong bảng dữ liệu thô được trả về
        },
        hasCopiedCell: false
    }
}


const defaultConditionFormat = {
    listColumns: [], // danh sách tất cả các cột trong table
    applyColumnUid: '', // đối tượng chứa thông tin cột để áp dụng format theo điều kiện
    mode: 'singleColor', // chế độ format: singleColor (màu đơn sắc) hoặc colorScale (theo dải màu)
    applyColumnObj: {},
    singleColorConfig: [ // cấu hình cho chế độ màu đơn sắc: danh sách các item cấu hình
        // {
        //     condition : {}, // điều kiện hiển thị, cấu hình giống như cây điều kiện
        //     style: {} // cách hiển thị khi thỏa mãn điều kiện, các cấu hình giống prop value của component TextStyleSetting.vue
        // }
    ],
    colorScaleConfig: {
        minPoint: {
            type: 'minValue', // nhận một trong ba giá trị: minValue, percent, fixedValue
            value: '' // giá trị được điền trong trường hợp type là fixedValue
        },
        midlePoint:  {
            type: '', // giống như trên
            value: '' // giống như trên
        },
        maxPoint:  {
            type: '', // giống như trên
            value: '' // giống như trên
        }
    }
};
export default {
    getCellConfigs() {
        return JSON.parse(JSON.stringify(defaultCellConfigs));
    },
    getDashboardConfigs() {
        return JSON.parse(JSON.stringify(defaultDashboardConfigs));
    },
    getGlobalConfigs() {
        return JSON.parse(JSON.stringify(globalCell));
    },
    defaultConditionFormat: defaultConditionFormat
}