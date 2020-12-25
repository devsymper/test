import {documentApi} from '@/api/Document';
import {orgchartApi} from '@/api/orgchart';
import {dashboardApi} from '@/api/dashboard';
import BpmnEngine from '@/api/BPMNEngine';


self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'search':
			let searchData = await searchItem(data);
            postMessage({action:'search', dataAfter : searchData})
            break;
       
        default:
            break;
    }
};


export const searchItem = async function(data){
	let obj = {}
	let orgchartData = await orgchartApi.getOrgchartList({search: data.value, pageSize:50})
	obj.orgchart = orgchartData.data.listObject;

	let documnentData = await documentApi.searchListDocuments({search: data.value, pageSize:100})
	let arrCategory = []
	let arrMajor = []
	documnentData.data.listObject.forEach(function(e){
		if(e.type == "Nghiệp vụ"){
			arrMajor.push(e)
		}else if(e.type == "Danh mục"){
			arrCategory.push(e)
		}
	})
	obj.document_category = arrCategory
	obj.document_major = arrMajor

	let workflowData = await BpmnEngine.getListModels({search: data.value, pageSize:50})
	obj.workflow_definition = workflowData.data.listObject;

	let dashboardData = await dashboardApi.getDashboardsApp({search: data.value, pageSize:50})
	obj.dashboard = dashboardData.data.listObject;
	return obj
}