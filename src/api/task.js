import Api from "./api";
import { appConfigs } from "./../configs.js";
let fileManagement = new Api(appConfigs.apiDomain.fileManagement);
let document = new Api(appConfigs.apiDomain.sdocumentManagement);
let workfloweExtend = new Api(appConfigs.apiDomain.workflowExtend);

export const taskApi = {
    getFileByList(data) {
        return fileManagement.get('getFileByObjectIdentifier', { objectIdentifier: data.objectIdentifier, objectType: data.objectType });
    },
    downloadFile(id) {
        window.open('https://file.symper.vn/downloadS/' + id, '_blank');
    },
    deleteFile(data) {
        return fileManagement.put('changeStatusSymperFile', data);

    },
    renameFile(data) {
        return fileManagement.put('renameFile', data);
    },
    getDocumentObjIds(data) {
        return document.post('documents/object/batch', data);
    },
    getListDocumentWithUserSubmit(userId){
        return document.get('documents/objects-out-workflow/'+ userId);
    },
    getListNodeInProcess(){
        return workfloweExtend.get("activities");
    },
    getVariableWorkflow(filter){
        if (filter.size) {
            filter.pageSize = filter.size;
            delete filter.size;
        }
        return workfloweExtend.post("variables/query",filter);
    },
    getDocumentInVariables(filter){
        return workfloweExtend.get("variables/documents",{page:filter.page,pageSize:filter.pageSize});
    },

    getListWork(filter){
        return workfloweExtend.get("works",filter);
    }
   

    

}