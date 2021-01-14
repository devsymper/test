const defaultState = {
    allDashboard: { // lưu lại tất cả các config của các dashboard theo instanceKey
        123423: { // instanceKey của dashboard
            // các key cấu hình trong kết quả trả về của hàm getDefaultDashboardConfig trong src\components\dashboard\configPool\defaultDashboardConfigs.js
        }
    },
    datasetAndColumn:{} // cấu trúc theo key - value, key là instanceKey , value dạng object
};

export default defaultState;