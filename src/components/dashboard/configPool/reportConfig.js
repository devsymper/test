/**
 * File phục vụ cho việc lấy các cấu hình mặc định của report
 */
export const getDefaultReportConfig = function(){
    return {
        rawConfigs: { // config thô do BA setting
            condition: [], // cấu hình điều kiện cho report này
            setting: {}, // cấu hình cho các cột
            style: {} // cấu hình cho việc hiển thị của report
        },
        sharedConfigs: { // các cấu hình chung của report
            cellId: "", // id đánh tự động của report
            data: [], // dữ liệu thô được lấy từ server
            type: "", // loại report
            yAxisCount: 1, // số lượng yAxis được sử dụng
        },
        viewConfigs: { // cấu hình phục vụ cho việc hiển thị
            commentCount: 0, // số lượng comment
            displayOptions: {}, // cấu hình được translate từ các rawConfig thành cấu hình tương ứng của thư viện
            filter: {}, // filter áp dụng cho report này
            isSelecting: false, // có đang click để lựa chọn hay không
            loadingData: false, // có đang tải dữ liệu không 
            needSaveExtraOptions: {}, // các cấu hình phụ cần lưu trong quá trình tương tác với report, vd: chiều rộng của các column trong table sau resize
            selectedDataset: {}, // chứa các cột trong các dataset  được lựa chọn cho report này 
            showIcon: true // có hiển thị icon ko
        }
    }
}

var loadedClasses = {}; // map các class đã được map với key là 
var mapReportTypeAndClasses
/**
 * Hàm load tự động các class của các loại report
 * @returns {Object} object chứa các hàm khởi tạo của 
 */
export const autoLoadChartClasses = function () {
    if(Object.keys(loadedClasses) == 0){
        let context = require.context('@/components/dashboard/reports', true, /\.(chart\.js)$/);
        let rsl = {};
        let obj;
        let reportClass = null;
        context.keys().forEach((filePath) => {
            reportClass = context(filePath).default;
            obj = new reportClass();
            rsl[obj.getType()] = reportClass;
        });
        loadedClasses = rsl;
        return rsl;
    }else{
        return loadedClasses;
    }
}


export const getUsedDatasetsFromSetting = function(setting){
    let rsl = {};
    for(let key in setting){
        for(let col of setting[key].selectedColums){
            rsl[col.dataset] = true;
        }
    }
    return rsl;
}