/**
 * File phục vụ cho việc lấy các cấu hình mặc định của dashboards
 */
export const getDefaultDataflowConfig = function(){
    return {
        homeConfig: {}, // chứa cấu hình chung của dataflow
        selectedWidget: {}, // chứa cấu hình của Widget đang được lựa, cấu trúc giống như cấu trúc class NodeBase
        allWidget: {} // chứa danh sách tất cả các cấu hình của các Widget trong dataflow
    }
} 

var loadedClasses = {}; // map các class đã được map với key là 
/**
 * Hàm load tự động các class của các loại report
 * @returns {Object} object chứa các hàm khởi tạo của 
 */
export const autoLoadNodeClasses = function () {
    if(Object.keys(loadedClasses) == 0){
        let context = require.context('@/components/dataflow/nodes', true, /\.(node\.js)$/);
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
