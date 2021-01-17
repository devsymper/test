import { taskManagementApi } from "@/api/taskManagement.js";
import { documentApi } from "@/api/Document.js";

self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'getListBoard':
            if (data) {
                taskManagementApi.getListBoardInProject(data).then(res => {
                    if(res['status'] == 200 && res['data']){
                        postMessage({action:'getListBoard', dataAfter : res})
                    }
                });
            }
            break;
        case 'getUserInProject':
            if (data) {
                taskManagementApi.getUserInProject(data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'getUserInProject',dataAfter: res})
                    }
                });
            }
            break; 
        case 'handleChangeStatusIssue':
            if (data) {
                let dataPost ={};
                let dataControl ={};
                let issueType = data.allIssueTypeInProject.find(ele => ele.id == data.task.tmg_issue_type);
                if (issueType) {
                    dataPost['documentId'] = issueType.documentId;
                }
                
                dataControl.tmg_status_id = data.status.statusId;
                dataControl.tmg_status_category_id = data.status.statusCategoryId;
                dataControl.tmg_status = data.status.name;
                dataPost['documentObjectWorkflowObjectId'] = "";
                dataPost['documentObjectWorkflowId'] = "";
                dataPost['documentObjectTaskId'] = "";
                dataPost['dataControl'] = JSON.stringify(dataControl);

                documentApi.updateDocument(data.task.document_object_id,dataPost).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'handleChangeStatusIssue'})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });
            }
            break; 
        case 'handleChangeIssueInSprint':
            if (data) {
                let dataPost ={};
                let dataControl ={};
                let issueType = data.allIssueTypeInProject.find(ele => ele.id == data.task.tmg_issue_type);
                if (issueType) {
                    dataPost['documentId'] = issueType.documentId;
                }
                
                dataControl.tmg_sprint_id = data.sprint.id;
                dataControl.tmg_sprint_name = data.sprint.name;
                dataPost['documentObjectWorkflowObjectId'] = "";
                dataPost['documentObjectWorkflowId'] = "";
                dataPost['documentObjectTaskId'] = "";
                dataPost['dataControl'] = JSON.stringify(dataControl);

                documentApi.updateDocument(data.task.document_object_id,dataPost).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'handleChangeIssueInSprint'})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });
            }
            break; 
        case 'setNodeMap':
            if (data) {
                let mappPermission = setNodeMap(data);
                postMessage({action:'setNodeMap',dataAfter : mappPermission})
            }
            break; 
        case 'getListTasks':
            if (data) {
                let listTask = await setLiskTask(data);
                postMessage({action:'getListTasks',dataAfter : listTask})
            }
            break; 
        case 'getListWorkflowInProject':
            if (data) {
                taskManagementApi.getListWorkflowInProject(data).then(res => {
                    if(res['status'] == 200 && res['data']){
                        postMessage({action:'getListWorkflowInProject', dataAfter : res})
                    }
                });
            }
            break; 
        case 'getListDocumentIdsInProject':
            if (data) {
                taskManagementApi.getDocumentIdsInProject(data).then(res => {
                    if(res['status'] == 200 && res['data']){
                        let dataRec={};
                        dataRec.key = data;
                        dataRec.data = res.data;
                        postMessage({action:'getListDocumentIdsInProject', dataAfter : dataRec})
                    }
                });
            }
            break; 
        case 'getDetailProject':
            if (data) {
                taskManagementApi.getDetailProject(data).then(res => {
                    if(res['status'] == 200 && res['data']){
                        postMessage({action:'getListDocumentIdsInProject', dataAfter : res})
                    }
                });
            }
            break;
        case 'getListStatusInProject':
            if (data) {
                taskManagementApi.getListStatusInProject(data).then(res => {
                    if(res['status'] == 200 && res['data']){
                        let dataRec2={};
                        dataRec2.key = data;
                        dataRec2.data = res.data.listObject;
                        postMessage({action:'getListStatusInProject', dataAfter : dataRec2})
                    }
                });
            }
            break;
        case 'getListColumnInBoard':
            if (data) {
                taskManagementApi.getListColumn(data).then(res => {
                    if(res['status'] == 200 && res['data']){
                        let dataRec3={};
                        dataRec3.key = data;
                        dataRec3.data = res.data.listObject;
                        postMessage({action:'getListColumnInBoard', dataAfter : dataRec3})
                    }
                });
            }
            break;
        case 'getListStatusInColumnBoard':
            if (data) {
                taskManagementApi.getListStatusInColumnOfBoard(data).then(res => {
                    if(res['status'] == 200 && res['data']){
                        let dataRec4={};
                        dataRec4.key = data;
                        dataRec4.data = res.data.listObject;
                        postMessage({action:'getListStatusInColumnBoard', dataAfter : dataRec4})
                    }
                });
            }
            break;
        case 'getListIssueTypeInProjects':
            if (data) {
                taskManagementApi.getListIssueTypeInProject(data).then(res => {
                    if(res['status'] == 200 && res['data']){
                        let dataRec5={};
                        dataRec5.key = data;
                        dataRec5.data = res.data.listObject;
                        postMessage({action:'getListIssueTypeInProjects', dataAfter : dataRec5})
                    }
                });
            }
            break;
        case 'getListRoleUserInProject':
            if (data) {
                taskManagementApi.getListRoleUserInProject(data).then(res => {
                    if(res['status'] == 200 && res['data']){
                        let dataRec6={};
                        dataRec6.key = data;
                        dataRec6.data = res.data.listObject;
                        postMessage({action:'getListRoleUserInProject', dataAfter : dataRec6})
                    }
                });
            }
            break;
        case 'getListOperatorInProject':
            if (data) {
                taskManagementApi.getListOperatorInProject(data).then(res => {
                    if(res['status'] == 200 && res['data']){
                        let dataRec7={};
                        dataRec7.key = data;
                        dataRec7.data = res.data.listObject;
                        postMessage({action:'getListOperatorInProject', dataAfter : dataRec7})
                    }
                });
            }
            break;
        case 'getListTasksBackLog':
            if (data) {
                let listTask = await setLiskTaskBackLog(data);
                postMessage({action:'getListTasksBackLog',dataAfter : listTask})
            }
            break; 
        case 'saveColumn':
            if (data) {
                taskManagementApi.addColumnInBoard(data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'saveColumn'})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });
            }
            break;
        case 'updateColumn':
            if (data) {
                taskManagementApi.updateColumnInBoard(data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'updateColumn'})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });
            }
            break;
        case 'updateBoard':
            if (data) {
                taskManagementApi.updateBoard(data.id,data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'updateBoard', dataAfter : data})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });
            }
            break;
        case 'handleAddBoard':
            if (data) {
                taskManagementApi.addBoardForProject(data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'handleAddBoard', dataAfter : res})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });
            }
            break;
        case 'handleAddSprint':
            if (data) {
                taskManagementApi.addSprintForBoard(data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'handleAddSprint',dataAfter : res})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });
            }
            break;
        case 'getListSprintInBoard':
            if (data) {
                taskManagementApi.getListSprint(data).then(res => {
                    if(res['status'] == 200 && res['data'] ){
                        let dataRec8 = {};
                        dataRec8.key = data;
                        dataRec8.data = res.data.listObject;
                        postMessage({action:'getListSprintInBoard',dataAfter : dataRec8})
                    }
                });
            }
            break;
        case 'getIssueInSprint':
            if (data) {
                taskManagementApi.getIssueFilter(data).then(res => {
                    if(res['status'] == 200 && res['data'] ){
                        postMessage({action:'getIssueInSprint',dataAfter : res})
                    }
                });
            }
            break;
        case 'groupIssueInSprint':
            if (data) {
                let dataSprint = groupIssueInSprint(data);
                postMessage({action:'groupIssueInSprint',dataAfter : dataSprint})

            }
            break;
        case 'handleUpdateSprint':
            if (data) {
                taskManagementApi.updateSprintForBoard(data.id,data.data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'handleUpdateSprint'})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });

            }
            break;
        case 'handleStartSprint':
            if (data) {
                taskManagementApi.updateSprintForBoard(data.id,data.data).then(res => {
                    if(res['status'] == 200){
                        postMessage({action:'handleStartSprint'})
                    }else{
                        postMessage({action:'actionError'})
                    }
                });

            }
            break;
        case 'checkUpdateTaskToKanban':
            if (data) {
                let checkUpdateIssue = checkUpdateIssueToKanban(data);
                if (checkUpdateIssue) {
                    postMessage({action:'updateTaskToKanban', dataAfter:checkUpdateIssue.data})
                }
            }
            break;
        case 'checkUpdateTaskInSprint':
            if (data) {
                let checkUpdateIssueSprint = funcCheckUpdateIssueSprint(data);
                if (checkUpdateIssueSprint) {
                    postMessage({action:'pushTaskInSprint', dataAfter:checkUpdateIssueSprint.data})
                }
            }
            break;
        case 'checkUpdateTaskInBacklog':
            if (data) {
                let checkUpdateIssueBacklog = checkUpdateIssueToBacklog(data);
                if (checkUpdateIssueBacklog) {
                    postMessage({action:'updateTaskInBacklog', dataAfter:checkUpdateIssueBacklog.data})
                }
            }
            break;
            
        default:
            break;
    }
};

function funcCheckUpdateIssueSprint(data){
    let dataSprintAfterMapIssue = data.dataSprintAfterMapIssue;
    let issue = data.issue;
    let dataRes ={};
    let sprint = dataSprintAfterMapIssue.find(ele => ele.id == issue.tmg_sprint_id);
    if (sprint) {
        issue = getMoreInfoForTask(issue,data)
        sprint.tasks.unshift(issue);
        dataRes.data = dataSprintAfterMapIssue;
        return dataRes;
    }else{
        return null;
    }
 

}
function checkUpdateIssueToBacklog(data){
    let projectId = data.projectId;
    let dataSend = data.dataSend;
    let issue = data.issue;
    let dataRes ={};
    if (issue.tmg_project_id == projectId) {
        if (dataSend.statusInColumn && dataSend.statusInColumn.length > 0 ) {
            let status = dataSend.statusInColumn.find(ele => ele.statusId == issue.tmg_status_id);
            if (status) {
                issue = getMoreInfoForTask(issue,data);
                status.tasks.unshift(issue);
                dataRes.data = dataSend;
                return dataRes;

            }else{
                return null;
            }
        }
    }
    return null;
}
function checkUpdateIssueToKanban(data){
    let projectId = data.projectId;
    let listBoardColumn = data.listBoardColumn;
    let issue = data.issue;
    let dataRes ={};
    if (issue.tmg_project_id == projectId) {
        for (let i = 0; i < listBoardColumn.length; i++) {
            if (listBoardColumn[i].statusInColumn && listBoardColumn[i].statusInColumn.length > 0) {
                let listStatusInColumn = listBoardColumn[i].statusInColumn;
                for (let j = 0; j < listStatusInColumn.length; j++) {
                    let status = listStatusInColumn[j];
                    if (status.statusId == issue.tmg_status_id) {
                        status.tasks.unshift(issue);
                        dataRes.data = listBoardColumn;
                        return dataRes;
                    }            
                }
            }            
        }
    }
    return null;
}
function groupIssueInSprint(data){
    let listSprintInBoard = data.listSprintInBoard;
    let listAllIssueInSprint = data.listAllIssueInSprint;
    for (let i = 0; i < listSprintInBoard.length; i++) {
        let sprintId = listSprintInBoard[i].id;
        let taskInSprint = listAllIssueInSprint.filter(task=>{
            return task.tmg_sprint_id == sprintId;
        });
        if (taskInSprint.length > 0) {
            for (let j = 0; j < taskInSprint.length; j++) {
                getMoreInfoForTask(taskInSprint[j],data);
            }
        }
        listSprintInBoard[i]['tasks'] = taskInSprint;
    }

    return listSprintInBoard
}


async function setLiskTaskBackLog(data){
    let documentIds = data.allIssueTypeInProject.reduce((arr,obj)=>{
        if(!arr.includes(obj.documentId)){
            arr.push(obj.documentId)
        }
        return arr
    },[])
    data.filter.ids = JSON.stringify(documentIds);

    let allTask = await documentApi.getListObjectByMultipleDocument(data.filter)
    allTask = allTask['data']['listObject'];
    let column = data.columnBacklog;
    if (data.listStatus.length > 0 ) {
        for (let i = 0; i < data.listStatusColumn.length; i++) {
            let statusId = data.listStatusColumn[i].statusId;
            let taskLifeCircleId = data.listStatusColumn[i].taskLifeCircleId;
            let item = data.listStatus.find(ele => ele.statusId == statusId &&  ele.taskLifeCircleId == taskLifeCircleId );
            if (item) {
                let taskInStatus = allTask.filter(task=>{
                    return task.tmg_status_id == statusId && task.tmg_task_life_circle_id == taskLifeCircleId;
                });
                if (taskInStatus.length > 0) {
                    for (let j = 0; j < taskInStatus.length; j++) {
                        getMoreInfoForTask(taskInStatus[j],data);
                    }
                }
                item['tasks'] = taskInStatus;
                column.statusInColumn.push(item);
            }
        }  
    }

    return column;
}

function  getMoreInfoForTask(issue,data){

    let allPriority = data.allPriority;
    let listIssueType = data.listIssueType;
    let allStatus = data.allStatus;

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
    return issue;
}
async function setLiskTask(data){
    let documentIds = data.allIssueTypeInProject.reduce((arr,obj)=>{
        if(!arr.includes(obj.documentId)){
            if (obj.documentId) {
                arr.push(obj.documentId)
            }
        }
        return arr
    },[])
    data.filter.ids = JSON.stringify(documentIds);
    let allTask = await documentApi.getListObjectByMultipleDocument(data.filter)
    allTask = allTask['data']['listObject'];
    let columns = data.listColumn;
    if (data.listStatus.length > 0 ) {
        for (let i = 0; i < data.listStatusColumn.length; i++) {
            let idColumn = data.listStatusColumn[i].columnId;
            let statusId = data.listStatusColumn[i].statusId;
            let taskLifeCircleId = data.listStatusColumn[i].taskLifeCircleId;
            let item = data.listStatus.find(ele => ele.statusId == statusId &&  ele.taskLifeCircleId == taskLifeCircleId );
            if (item) {
                let taskInStatus = allTask.filter(task=>{
                    return task.tmg_status_id == statusId && task.tmg_task_life_circle_id == taskLifeCircleId ;
                })
                item['tasks'] = taskInStatus;
                let column = columns.find(ele => ele.id == idColumn);
                if (column) {
                    column.statusInColumn.push(item);
                }
            }
        }  
    }

    return columns;
}

function setNodeMap(data){
    let allOperator = data.allOperator;
    let allNode = data.allNode;
    let nodeMapPermission = {};
    for (let i = 0; i < allOperator.length; i++) {
        if (allOperator[i].tmg_to_status_id) {
            if (!nodeMapPermission[allOperator[i].tmg_to_status_id]) {
                nodeMapPermission[allOperator[i].tmg_to_status_id] = {};
                nodeMapPermission[allOperator[i].tmg_to_status_id]["allowTo"] = [];
                nodeMapPermission[allOperator[i].tmg_to_status_id]["permission"] = [];
                nodeMapPermission[allOperator[i].tmg_to_status_id]["disable"] = false;
            }
        
            let node = allNode.find(ele => ele.nodeId == allOperator[i].tmg_to_status_id);
            // get role cho node
            if (node) {
                if (node.roleIds.length > 10) {
                    nodeMapPermission[allOperator[i].tmg_to_status_id]["permission"] = JSON.parse(node.roleIds);
                }
            }
            // get status được phép chuyển trạng thái đến
            if (allOperator[i].tmg_from_status_id) {
                if (nodeMapPermission[allOperator[i].tmg_to_status_id]["allowTo"].indexOf(allOperator[i].tmg_from_status_id) == -1) {
                    nodeMapPermission[allOperator[i].tmg_to_status_id]["allowTo"].push(allOperator[i].tmg_from_status_id);
                }
            }else{ // trường hợp cho phép all, add hết status cùng task life circle
                let taskLifeCircleId = allOperator[i].tmg_task_life_circle_id;
                let listNodeInTaskLifeCircle =  allNode.filter( node =>{
                    return node.taskLifeCircleId == taskLifeCircleId;
                });

                if (listNodeInTaskLifeCircle.length > 0) {
                    for (let j = 0; j < listNodeInTaskLifeCircle.length; j++) {
                        if (nodeMapPermission[allOperator[i].tmg_to_status_id]["allowTo"].indexOf(listNodeInTaskLifeCircle[j].nodeId) == -1) {
                            nodeMapPermission[allOperator[i].tmg_to_status_id]["allowTo"].push(listNodeInTaskLifeCircle[j].nodeId);
                        }
                    }
                }
            }
        }
    }

    return nodeMapPermission;
}


