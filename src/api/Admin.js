import Api from "./api";
import { appConfigs } from "./../configs.js";

var bpmneApi = new Api(appConfigs.apiDomain.bpmne.models);
var documentApi = new Api(appConfigs.apiDomain.sdocumentManagement);
var workflowExtendApi = new Api(appConfigs.apiDomain.workflowExtend)
let testHeader = {
    Authorization: 'Basic cmVzdC1hZG1pbjp0ZXN0',
    "Content-Type": "application/json",
};
export const adminApi = {
    getLatestWD(key) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.definitions, {key:key, latest:true}, testHeader);
	},
	stopProcessInstances(id){
		return bpmneApi.put(appConfigs.apiDomain.bpmne.instances+'/'+id ,
			JSON.stringify({
				"action": "suspend",
			}),
			testHeader
		)
	},
	activeProcessInstances(id){
		return bpmneApi.put(appConfigs.apiDomain.bpmne.instances+'/'+id ,
			JSON.stringify({
				"action": "activate",
			}),
			testHeader
		)
	},
	deleteProcessInstances(id){
		return bpmneApi.delete(appConfigs.apiDomain.bpmne.instances+'/'+id ,
			{},
			testHeader
		)
	},
	stopWorkFlow(id){
		return bpmneApi
	},
	aggregateWorkflow(id){
		return workflowExtendApi.get('workflow/'+id+'/aggregate')
	},
	deleteDocumentObject(objectIds) {
        return documentApi.delete("documents/objects", objectIds);
    },
}