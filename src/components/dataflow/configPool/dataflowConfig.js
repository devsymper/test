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