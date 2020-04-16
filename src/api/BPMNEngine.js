import Api from "./api"; // import class api vào để sử dụng
import appConfigs from "./../configs.js"; // trong trường hợp này ta cần sử dụng domain của từng module nghiệp vụ được định nghĩa trong file config

var bpmneApi = new Api(appConfigs.bpmne); // Khởi tạo một đối tượng api với domain của service BPMNE
export default {
    /** 
     * Lấy danh sách các process đã được tạo ra
     */
    getListProcess() {
        return bpmneApi.get("process"); //sử dụng đối tượng api để gọi API có method GET, với resource là process
    }
};