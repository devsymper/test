import Api from "./api";
import appConfigs from "./../configs.js";

var bpmneApi = new Api(appConfigs.bpmne);
export default {
    /** 
     * Lấy danh sách các process đã được tạo ra
     */
    getListProcess() {
        return bpmneApi.get("process");
    }
};
