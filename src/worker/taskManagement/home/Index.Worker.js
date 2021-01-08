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
                    postMessage({action:'getAllIssueType', dataAfter : res})
                }
            })
            break;
        case 'getAllStatus':
            taskManagementApi.getAllStatus().then(res=>{
                if(res['status'] == 200 && res['data']){
                    postMessage({action:'getAllStatus', dataAfter : res})
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
        case 'countIssueInListProject':
            taskManagementApi.countIssueInListProject(data).then(res=>{
                if(res['status'] == 200 && res['data']){
                    postMessage({action:'countIssueInListProject', dataAfter : res})
                }
            })
            break;
        case 'updateFavorite':
            taskManagementApi
            .updateProjectFavorite(data).then(res=>{
                if(res['status'] == 200 ){
                    postMessage({action:'updateFavorite'})
                }
            })
            break;
        case 'countBoardInProject':
            taskManagementApi
            .countBoardInListProject(data).then(res=>{
                if(res['status'] == 200 ){
                    postMessage({action:'countBoardInProject',dataAfter : res})
                }
            })
            break;
        case 'getDataProjectRecent':
            let res = setDataProjectRecent(data);
            postMessage({action:'getDataProjectRecent',dataAfter : res})
            break;
        case 'getListItemIssueGroupDateTime':
            let res = setDataListItemIssueGroupDateTime(data);
            postMessage({action:'getListItemIssueGroupDateTime',dataAfter : res})
            break;
            
        default:
            break;
    }
};

function setDataProjectRecent(data){
    let allProject = data.allProject;
    let listItemLog = data.listItemLog;
    let listProject = [];
    let projectIds = [];
    if (listItemLog.length > 0) {
        for (let i = 0; i < listItemLog.length; i++) {
            let projectLog = JSON.parse(listItemLog[i]['project']);
            let project = allProject.find(ele => ele.id == projectLog.id);
            if (project) {
                if (listProject.length > 0) {
                    let isCheck = listProject.find(ele => ele.id == project.id);
                    if (isCheck) {
                        continue; // thoát khỏi vòng lặp
                    }
                }
                projectIds.push(project.id);
                listProject.push(project);
            }
        }
    }

    return {
        listProject:listProject,
        projectIds: projectIds
    }
}

function setDataListItemIssueGroupDateTime(data){
    let listIssue = [];
    let listItemLog = data.listItemLog;
    let allPriority = data.allPriority;
    let listIssueType = data.listIssueType;
    let allStatus = data.allStatus;
    if (listItemLog.length > 0) {
        for (let i = 0; i < listItemLog.length; i++) {
            if (!listItemLog[i].timeAccess) {
                continue; // thoát khỏi vòng lặp
            }
            let issue = JSON.parse(listItemLog[i]['data']);
            issue.timeAccess = listItemLog[i].timeAccess;
            if (listIssue.length > 0) { // check xem arr list Issue đã tồn tại issue này chưa
                let isCheck = listIssue.find(ele => ele.document_object_uuid == issue.document_object_uuid);
                if (isCheck) {
                    continue; // thoát khỏi vòng lặp
                }
            }

            if (issue.tmg_priority_id) { 
                let priority = allPriority.find(ele => ele.id == issue.tmg_priority_id);
                if (priority) {
                    let infoPriority = {};
                    infoPriority.id = priority.id;
                    infoPriority.name = priority.name;
                    infoPriority.color = priority.color;
                    infoPriority.icon = priority.icon;

                    issue["infoPriority"] = infoPriority;
                }
            }    
            // get info issue type
            if (issue.tmg_issue_type) { 
                let issueType = listIssueType.find(ele => ele.id == issue.tmg_issue_type);
                if (issueType) {
                    let infoIssueType = {};
                    infoIssueType.id = issueType.id;
                    infoIssueType.name = issueType.name;
                    infoIssueType.icon = issueType.icon;

                    issue["infoIssueType"] = infoIssueType;
                }
            }    
            // get staus issue
            if (issue.tmg_status_id) { 
                let status = allStatus.find(ele => ele.id == issue.tmg_status_id);
                if (status) {
                    let infoStatus = {};
                    infoStatus.id = status.id;
                    infoStatus.name = status.name;
                    infoStatus.color = status.color;
                    issue["infoStatus"] = infoStatus;
                }
            } 
            listIssue.push(issue);
        }
    }

    const groups = listIssue.reduce((groups, issue) => {
        let timeAccess = issue.timeAccess.split(" ")[0];
        let fromNow = timeAccess;
        if (!groups[fromNow]) {
            groups[fromNow] = [];
        }
        groups[fromNow].push(issue);
        return groups;
    }, {});
    // Edit: to add it in the array format instead
    const groupArraysIssue = Object.keys(groups).map(fromNow => {
        return {
          fromNow,
          issues: groups[fromNow]
        };
    });
    return groupArraysIssue;
}