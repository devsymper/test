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
                        let listVersion = data.listVersion;
                        let infoDataProgress = {};
                        for (let i = 0; i < listVersion.length; i++) {
                            let infoCountIssue = infoRes.filter(item => {
                                return item.tmg_version_id == listVersion[i].id;
                            });          
                            if (infoCountIssue.length > 0) {
                                let dataProcess = {
                                    item : {},
                                };
                                let sum = 0;
                                let infoTodo = infoCountIssue.find(ele => ele.status == "TO DO");
                                if (infoTodo && Number(infoTodo.count) > 0 ) {
                                    let item1 = {};
                                    item1.value = Number(infoTodo.count);
                                    item1.color = "grey";
                                    dataProcess.item.todo = item1;
                                    sum += Number(infoTodo.count);
                                }
                                let infoInpro = infoCountIssue.find(ele => ele.status == "IN PROGRESS");
                                if (infoInpro  && Number(infoInpro.count) > 0) {
                                    let item2 = {};
                                    item2.value = Number(infoInpro.count);
                                    item2.color = "blue";
                                    dataProcess.item.inprogress = item2;
                                    sum += Number(infoInpro.count);

                                }
                                let infoDone = infoCountIssue.find(ele => ele.status == "DONE");
                                if (infoDone  && Number(infoDone.count) > 0) {
                                    let item3 = {};
                                    item3.value = Number(infoDone.count);
                                    item3.color = "green";
                                    dataProcess.item.done = item3;
                                    sum += Number(infoDone.count);
                                }
                                dataProcess.total = sum;
                              
                                infoDataProgress[ listVersion[i].id] = dataProcess;
                            }             
                        }
                       
                        postMessage({action:'countIssueInListVersion', dataAfter : infoDataProgress})
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
    let vl = [];
    if (listVersion.length > 0) {
        for (let i = 0; i < listVersion.length; i++) {
            vl.push(listVersion[i].id)
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

