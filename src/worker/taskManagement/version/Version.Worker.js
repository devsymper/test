import { taskManagementApi } from "@/api/taskManagement.js";
self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'getListVersion':
            if (data) {
                taskManagementApi.getListVersion(data).then(res => {
                    if(res['status'] == 200 && res['data']){
                        postMessage({action:'getListVersion', dataAfter : res})
                    }
                });
            }
            break;
        case 'removeVersion':
            if (data) {
                taskManagementApi.removeVersion(data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'removeVersion'})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });
            }
            break; 
        case 'handleUpdateVersion':
            if (data) {
                taskManagementApi.updateVersionForProject(data.id,data.data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'handleUpdateVersion'})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });
            }
            break; 
        case 'handleAddVersion':
            if (data) {
                taskManagementApi.addVersionForProject(data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'handleAddVersion'})
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
        case 'getIssueVersion':
            taskManagementApi.getIssueFilter(data).then(res=>{
                if(res['status'] == 200 && res['data']){
                    postMessage({action:'getIssueVersion', dataAfter : res})
                }
            })
            break;
        case 'getMoreInfoListIssue':
            let res = getMoreInfoListIssue(data);
            postMessage({action:'getMoreInfoListIssue', dataAfter : res})
            break;
        case 'countIssueInListVersion':
            let dataCountIssue = getDataFilterCountIssue(data);
            taskManagementApi.countIssue(dataCountIssue).then(res=>{
                if(res['status'] == 200 && res['data']){
                    if (res.data[data.projectId] && res.data[data.projectId].length > 0) {
                        let infoRes =  res.data[data.projectId];
                        let dataProcess = {};
                        let infoTodo = infoRes.find(ele => ele.status == "TO DO");
                        if (infoTodo) {
                            dataProcess.todo = infoTodo.count;
                        }
                        let infoInpro = infoRes.find(ele => ele.status == "IN PROGRESS");
                        if (infoInpro) {
                            dataProcess.inprogress = infoInpro.count;
                        }
                        let infoDone = infoRes.find(ele => ele.status == "DONE");
                        if (infoDone) {
                            dataProcess.done = infoDone.count;
                        }
                        dataProcess.total = 0
                        for (let key in dataProcess) {
                            if(dataProcess[key] && key != 'total'){
                                dataProcess.total += Number(dataProcess[key])
                            }
                        }
                        postMessage({action:'countIssueInListVersion', dataAfter : dataProcess})

                    }

                }
            })
            break;
        default:
            break;
    }
};

function getDataFilterCountIssue(data){
    let projectId = data.projectId;
    let listVersion = data.listVersion;
    let itemCondition = {};
    itemCondition.name = "tmg_version_id";
    let vl = ""
    if (listVersion.length > 0) {
        for (let i = 0; i < listVersion.length; i++) {
            vl += "'"+listVersion[i].id+"',"
        }
        if (vl.length > 1) {
           vl = vl.substring(0, vl.length-1);
        }
        itemCondition.value = vl;
    }

    let dataPost = {};
    dataPost.projectIds = JSON.stringify([projectId]);
    dataPost.moreCondition = JSON.stringify([itemCondition])

    return dataPost;    
}

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

