import Api from "./api"; // import class api vào để sử dụng
import {
    appConfigs
} from "./../configs.js"; // trong trường hợp này ta cần sử dụng domain của từng module nghiệp vụ được định nghĩa trong file config
import {
    util
} from "../plugins/util";

var bpmneApi = new Api(appConfigs.apiDomain.bpmne.models); // Khởi tạo một đối tượng api với domain của service BPMNE

// Phục vụ cho việc test
let fullCookieTest = "abc=xyz;FLOWABLE_REMEMBER_ME=YWNLNEUwTHlxbGNoQThEcUV4RTlpQSUzRCUzRDpsZUJRVTlTOSUyQnF5YzBCblNFZzdLQ3clM0QlM0Q";
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
        return bpmneApi.get("", filter);
    },
    deleteModels(ids) {
        return bpmneApi.delete(ids.join(','));
    },
    createModel(data) {
        return bpmneApi.post('', data);
    },
    updateModel(data, idModel) {
        return bpmneApi.put(`${idModel}`, data);
    },
    validateModel(data) {
        return bpmneApi.post(appConfigs.apiDomain.bpmne.validateModel, data, testHeader);
    },
    getModelData(modelId) {
        return bpmneApi.get(modelId);
    },
    getModelXML(modelId) {
        return bpmneApi.get(`${modelId}/editor/bpmn20`, {}, testHeader, {
            dataType: 'text'
        });
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
        return bpmneApi.get(url, {}, testHeader, {
            dataType: 'text'
        });
    },
    // Lấy data của process definition
    getDefinitionData(id) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.definitions + '/' + id, {}, testHeader);
    },
    // Lấy data của một process instance
    getProcessInstanceData(id) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.instances + '/' + id, {}, testHeader);
    },
    // Lấy các viriable của một process instance
    getProcessInstanceVars(id) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.instances + '/' + id + '/variables', {}, testHeader);
    },
    // Lấy lịch sử chạy các node trong process instance
    getProcessInstanceRuntimeHistory(id) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.history + '/historic-activity-instances?size=1000&processInstanceId=' + id, {}, testHeader);
    },
    getProcessInstance() {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.instances, {}, testHeader);
    },
    addTask(data) {
        return bpmneApi.post(appConfigs.apiDomain.bpmne.tasks, data, testHeader);
    },
    getTask(filter) {
        for (let key in filter) {
            if (!filter[key]) {
                delete filter[key];
            }
        }
        if (filter.nameLike == '%%') {
            delete filter.nameLike;
        }
        //ss
        if (filter.status == 'done') {
            filter.sort = filter.sort == 'createTime' ? 'startTime' : filter.sort;
            if (filter.assignee) {
                filter.taskAssignee = filter.assignee;
            }

            if (filter.owner) {
                filter.taskOwner = filter.owner;
            }

            if (filter.nameLike) {
                filter.taskNameLike = filter.nameLike;
            }
            filter.finished = true
            return bpmneApi.get(appConfigs.apiDomain.bpmne.tasksHistory, filter, testHeader);
        } else {
            return bpmneApi.get(appConfigs.apiDomain.bpmne.tasks, filter, testHeader);
        }
    },
    getSubtasks(idParent, filter) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.tasks + '/' + idParent + '/subtasks', filter, testHeader);
    },
    getATaskInfo(taskId,filter='notDone') {
        if (filter=='done') {
            return bpmneApi.get(appConfigs.apiDomain.bpmne.tasksHistory+'/'+taskId, {}, testHeader);
        }else{
            return bpmneApi.get(appConfigs.apiDomain.bpmne.tasks + '/' + taskId, {}, testHeader);
        }
    },
    getATaskInfoV2(taskId){
        let result1=bpmneApi.get(appConfigs.apiDomain.bpmne.tasksHistory+'/'+taskId, {}, testHeader);
        let result2=bpmneApi.get(appConfigs.apiDomain.bpmne.tasks+'/'+taskId, {}, testHeader);
        let isCheck=false;

        result1.then((res) => {
            console.log("aa",res);
                if (res.status==0) {
                }else{
                    console.log("ge1",res);
                    isCheck=1;
                }
            }
        );
        result2.then((res) => {
            console.log("bb",res);
            if (res.status==0) {
                }else{
                    console.log("ge2",res);
                    isCheck=2;
                }
            }
        );
        if (isCheck==1) {
            return result1
        }else{
            return result2
        }
        
    },
    updateTask(taskId, data) {
        data = JSON.stringify(data);
        return bpmneApi.put(appConfigs.apiDomain.bpmne.tasks + '/' + taskId, data, testHeader);
    },
    actionOnTask(id, data) {
        data = JSON.stringify(data);
        return bpmneApi.post(appConfigs.apiDomain.bpmne.tasks + '/' + id, data, testHeader, {
            dataType: 'text'
        });
    },

    saveDeployHistory(data) {
        return bpmneApi.post('/deploy-history', data);
    },

    getLastestByModel() {
        return bpmneApi.get('/deploy-history/lastest-by-model');
    }
   

};