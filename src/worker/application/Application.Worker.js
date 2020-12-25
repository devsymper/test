import {documentApi} from '@/api/Document';
import {orgchartApi} from '@/api/orgchart';
import {dashboardApi} from '@/api/dashboard';
import BpmnEngine from '@/api/BPMNEngine';
import {appManagementApi} from '@/api/AppManagement.js';


self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'search':
			let searchData = await searchItem(data);
            postMessage({action:'search', dataAfter : searchData})
            break;
        case 'updateApp':
			let updateAppData = await updateApp(data);
			debugger
            postMessage({action:'search', dataAfter : updateAppData})
            break;
        case 'createApp':
			let createAppData = await createApp(data);
            postMessage({action:'search', dataAfter : createAppData})
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
export const updateListItem = function(listItemSelected, childrenAppData , currentAppData){
	for(let i in childrenAppData){
		childrenAppData[i] = []
	}
	if(listItemSelected.document_category.item.length > 0){
		listItemSelected.document_category.item.forEach(function(e){
			childrenAppData.document_definition.push(e.id);
		});
	}
	if(listItemSelected.document_major.item.length > 0){
		listItemSelected.document_major.item.forEach(function(e){
			childrenAppData.document_definition.push(e.id);
		});
	}
	if(listItemSelected.orgchart.item.length > 0){
		listItemSelected.orgchart.item.forEach(function(e){
		childrenAppData.orgchart.push(e.id);
	});
	}
	if(listItemSelected.dashboard.item.length > 0){
		listItemSelected.dashboard.item.forEach(function(e){
		childrenAppData.dashboard.push(e.id);
	});
	}
	if(listItemSelected.workflow_definition.item.length > 0){
		listItemSelected.workflow_definition.item.forEach(function(e){
			childrenAppData.workflow_definition.push(e.id);
		});
	}
	currentAppData.childrenApp =  childrenAppData
	return currentAppData
}
export const updateApp = async function(data){
	let dataApp = JSON.stringify(updateListItem(data.listItemSelected, data.childrenAppData, data.currentAppData))
	let res =  await appManagementApi.updateApp(dataApp)
	debugger
	if(res.status == 200){
		return 'success'
	}else{
		return 'false'
	}
}
export const createApp = async function(data){
	let dataApp = JSON.stringify(updateListItem(data.listItemSelected, data.childrenAppData, data.currentAppData))
	debugger
	let res =  await appManagementApi.addApp(dataApp)
	return res
}