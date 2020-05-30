import Api from "./api"; // import class api vào để sử dụng
import { appConfigs } from "./../configs.js"; // trong trường hợp này ta cần sử dụng domain của từng module nghiệp vụ được định nghĩa trong file config
import { util } from "../plugins/util";

var bpmneApi = new Api(appConfigs.apiDomain.bpmne.models); // Khởi tạo một đối tượng api với domain của service BPMNE

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
    getListModels(filter = {}) {
        return bpmneApi.get("models", filter, testHeader);
    },
    deleteModel(id) {
        return bpmneApi.delete(id + "?cascade=true", {}, testHeader);
    },
    createModel(data) {
        data = JSON.stringify(data);
        return bpmneApi.post('', data, testHeader, testOptions);
    },
    updateModel(data, idModel) {
        // data = JSON.stringify(data);
        let testHeaderClone = util.cloneDeep(testHeader);
        delete testHeaderClone['Content-Type'];
        return bpmneApi.post(`${idModel}/editor/json`, data, testHeaderClone, testOptions);
    },
    getModelData(modelId) {
        return bpmneApi.get(`${modelId}/editor/json`, {}, testHeader);
    },
    getModelXML(modelId) {
        return bpmneApi.get(`${modelId}/editor/bpmn20`, {}, testHeader, { dataType: 'text' });
    },
    deployProcess(params, file) {
        let subfix = [];
        for (let key in params) {
            subfix.push(`${key}=${params[key]}`);
        }
        subfix = "?" + subfix.join('&');
        let testHeaderClone = util.cloneDeep(testHeader);
        delete testHeaderClone['Content-Type'];
        var fd = new FormData();
        fd.append('file', file);
        return bpmneApi.post(appConfigs.apiDomain.bpmne.deployments + subfix, fd, testHeaderClone, {
            processData: false,
            contentType: false,
        });
    },
    getDeployments(filter) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.deployments, filter, testHeader);
    },
    createProcessInstance(data) {
        data = JSON.stringify(data);
        return bpmneApi.post(appConfigs.apiDomain.bpmne.instances, data, testHeader);
    },
    // Lấy data model của process definition 
    getDefinitionModel(id) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.definitions + '/' + id + '/model', {}, testHeader);
    },
    // Lấy danh sách của process definition 
    getDefinitions(filter = {}) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.definitions, filter, testHeader);
    },
    // Lấy data của process definition
    getDefinitionXML(url) {
        return bpmneApi.get(url, {}, testHeader, { dataType: 'text' });
    },
    // Lấy data của process definition
    getDefinitionData(id) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.definitions + '/' + id, {}, testHeader);
    },
    // Lấy data của một process instance
    getProcessInstanceData(id) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.instances + '/' + id, {}, testHeader);
    },
    // Lấy lịch sử chạy các node trong process instance
    getProcessInstanceRuntimeHistory(id) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.history + '/historic-activity-instances?processInstanceId=' + id, {}, testHeader);
    },
    getProcessInstance() {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.instances, {}, testHeader);
    },
    addTask(data) {
        return bpmneApi.post(appConfigs.apiDomain.bpmne.tasks, data, testHeader);
    },
    getTask(filter) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.tasks, filter, testHeader);
    }
};