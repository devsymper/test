import { taskManagementApi } from "@/api/taskManagement.js";
import { getDataFilterLogProject, getDataFilterIssueRecent} from '@/components/taskManagement/common/apiAction';
self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'getLogProjectAccess':
            if (data) {
                let filter = getDataFilterLogProject(data);
                taskManagementApi.getDataLogService(filter).then(res => {
                    if(res['status'] == 200 && res['data']){
                        postMessage({action:'getLogProjectAccess', dataAfter : res})
                    }
                });
            }
            break;
        case 'getLogIssueRecentAccess':
            if (data) {
                let filter2 = getDataFilterIssueRecent(data);
                taskManagementApi.getDataLogService(filter2).then(res => {
                    if(res['status'] == 200 && res['data']){
                        postMessage({action:'getLogIssueRecentAccess', dataAfter : res})
                    }
                })
            }
            break;
        case 'getAllPriority':
            taskManagementApi.getListPriority().then(res=>{
                if(res['status'] == 200 && res['data']){
                    postMessage({action:'getAllPriority', dataAfter : res})
                }
            })
            break;
        case 'getAllProject':
            let item={
                column : "isDelete",
                operation : "and",
                conditions : [
                    {
                        name : "in",
                        value : [0],
                    }
                ],
            }
            let filter3={};
            filter3.filter = [];
            filter3.filter.push(item);
            filter3.page = 1;
            filter3.pageSize = 200;
            filter3.distinct = true;
            taskManagementApi.getAllProject(filter3).then(res=>{
                if(res['status'] == 200 && res['data']){
                    postMessage({action:'getAllProject', dataAfter : res})
                }
            })
            break;
        case 'getAllIssueType':
            let filter4={};
            filter4.page = 1;
            filter4.pageSize = 500;
            filter4.distinct = true;
            taskManagementApi.getAllIssueType(filter4).then(res=>{
                if(res['status'] == 200 && res['data']){
                    postMessage({action:'getAllProject', dataAfter : res})
                }
            })
            break;
        case 'getAllStatus':
            taskManagementApi.getAllStatus().then(res=>{
                if(res['status'] == 200 && res['data']){
                    postMessage({action:'getAllProject', dataAfter : res})
                }
            })
            break;
        case 'getAllDocumentIdsInIssueType':
            taskManagementApi.getAllDocumentIdsInIssueType().then(res=>{
                if(res['status'] == 200 && res['data']){
                    postMessage({action:'getAllDocumentIdsInIssueType', dataAfter : res})
                }
            })
            break;
        default:
            break;
    }
};