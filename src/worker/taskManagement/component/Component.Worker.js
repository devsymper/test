import { taskManagementApi } from "@/api/taskManagement.js";
self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'getListComponent':
            if (data) {
                taskManagementApi.getListComponent(data).then(res => {
                    if(res['status'] == 200 && res['data']){
                        postMessage({action:'getListComponent', dataAfter : res})
                    }
                });
            }
            break;
        case 'removeComponent':
            if (data) {
                taskManagementApi.removeComponent(data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'removeComponent'})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });
            }
            break; 
        case 'handleUpdateComponent':
            if (data) {
                taskManagementApi.updateComponentForProject(data.id,data.data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'handleUpdateComponent'})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });
            }
            break; 
        case 'handleAddComponent':
            if (data) {
                taskManagementApi.addComponentForProject(data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'handleAddComponent'})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });
            }
            break; 
        case 'getListDocumentIdsInProject':
            if (data) {
                taskManagementApi.getDocumentIdsInProject(data).then(res => {
                    if(res['status'] == 200){
                        let kq={};
                        kq.key = data;
                        kq.data = res.data;
                        postMessage({action:'getListDocumentIdsInProject',dataAfter : kq})
                    }
                });
            }
            break; 
        case 'getListIssueTypeInProject':
            if (data) {
                taskManagementApi.getListIssueTypeInProject(data).then(res => {
                    if(res['status'] == 200){
                        let kq={};
                        kq.key = data;
                        kq.data = res.data.listObject;
                        postMessage({action:'getListIssueTypeInProject',dataAfter : kq})
                    }
                });
            }
            break; 
        case 'getAllStatus':
            taskManagementApi.getAllStatus().then(res=>{
                if(res['status'] == 200 && res['data']){
                    postMessage({action:'getAllStatus', dataAfter : res})
                }
            })
            break;
        case 'getIssueComponent':
            taskManagementApi.getIssueFilter(data).then(res=>{
                if(res['status'] == 200 && res['data']){
                    postMessage({action:'getIssueComponent', dataAfter : res})
                }
            })
            break;
        case 'getMoreInfoListIssue':
            let res = getMoreInfoListIssue(data);
            postMessage({action:'getMoreInfoListIssue', dataAfter : res})
            break;
        default:
            break;
    }
};

function getMoreInfoListIssue(data){
    let issues = data.issues;
    let allPriority = data.allPriority;
    let listIssueType = data.listIssueType;
    let allStatus = data.allStatus;
    for (let i = 0; i < issues.length; i++) {
            // get info priority
        if (issues[i].tmg_priority_id) { 
            let priority = allPriority.find(ele => ele.id == issues[i].tmg_priority_id);
            if (priority) {
                let infoPriority = {};
                infoPriority.id = priority.id;
                infoPriority.name = priority.name;
                infoPriority.color = priority.color;
                infoPriority.icon = priority.icon;

                issues[i]["infoPriority"] = infoPriority;
            }
        }    
        // get info issue type
        if (issues[i].tmg_issue_type) { 
            let issueType = listIssueType.find(ele => ele.id == issues[i].tmg_issue_type);
            if (issueType) {
                let infoIssueType = {};
                infoIssueType.id = issueType.id;
                infoIssueType.name = issueType.name;
                infoIssueType.icon = issueType.icon;

                issues[i]["infoIssueType"] = infoIssueType;
            }
        }    
        // get staus issue
        if (issues[i].tmg_status_id) { 
            let status = allStatus.find(ele => ele.id == issues[i].tmg_status_id);
            if (status) {
                let infoStatus = {};
                infoStatus.id = status.id;
                infoStatus.name = status.name;
                infoStatus.color = status.color;
                issues[i]["infoStatus"] = infoStatus;
            }
        } 
    }

    return issues
}

