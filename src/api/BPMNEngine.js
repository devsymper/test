import Api from "./api"; // import class api vào để sử dụng
import { appConfigs } from "./../configs.js"; // trong trường hợp này ta cần sử dụng domain của từng module nghiệp vụ được định nghĩa trong file config

var bpmneApi = new Api(appConfigs.apiDomain.bpmne); // Khởi tạo một đối tượng api với domain của service BPMNE

// Phục vụ cho việc test
let fullCookieTest = "__cfduid=d7930d57921d3b5a2ec601b154400395a1571850128;FLOWABLE_REMEMBER_ME=UzY2S1JCNlp3VE1WSnZHb1ZSTndwZyUzRCUzRDpKWkVudjRxZHVyOWJDVEJDJTJCRThGa2clM0QlM0Q";
fullCookieTest.split(';').forEach((el) => {
    document.cookie = el.trim();
});

let testHeader = {
    Authorization: 'Basic cmVzdC1hZG1pbjp0ZXN0',
    "Content-Type": "application/json",
};

let testOptions = {

}
export default {
    /** 
     * Lấy danh sách các process đã được tạo ra
     */
    getListModels() {
        return bpmneApi.get("models", {}, testHeader);
    },
    createModel(data) {
        data = JSON.stringify(data);
        return bpmneApi.post('', data, testHeader, testOptions);
    },
    updateModel(data, idModel) {
        // data = JSON.stringify(data);
        delete testHeader['Content-Type'];
        return bpmneApi.post(`${idModel}/editor/json`, data, testHeader, testOptions);
    },
    getModelData(modelId) {
        return bpmneApi.get(`${modelId}/editor/json`, {}, testHeader);
    },
    getModelXML(modelId) {
        return bpmneApi.get(`${modelId}/editor/bpmn20`, {}, testHeader, { dataType: 'text' });
    },
};