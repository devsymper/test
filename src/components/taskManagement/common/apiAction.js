import { taskManagementApi } from "@/api/taskManagement.js";
const getDataFilterLogProject = (userId) =>{
    let data={};
    data =  {
        "query":{ 
            "bool":{
                "must": [
                    {
                        "term": {
                            "logObjectType": "task_manager_project"
                        }
                    },
                    {
                        "term": {
                            "userId.keyword": userId
                        }
                    }
                ]  
                    
            }
        },
        "sort":[{
            "logTime":{
                "order":"desc"
            }}
        ],
        "page":1,
        "size":100
    }
    return data;
}

const getDataFilterIssueRecent = (userId) =>{
    let data={};
    data =  {
        "query":{ 
            "bool":{
                "must": [
                    {
                        "term": {
                            "logObjectType": "document_instance"
                        }
                    },
                    {
                        "term": {
                            "documentType": 4
                        }
                    },
                    {
                        "term": {
                            "userAccess": userId
                        }
                    }
                ]  
                    
            }
        },
        "sort":[{
            "logTime":{
                "order":"desc"
            }}
        ],
        "page":1,
        "size":200
    };
    return data;
}
const getIssueAssignRecent = async(data) => { //documentId là all documentId chưa trong all issueType
    let item={
        column : "tmg_assignee",
        operation : "and",
        conditions : [
            {
                name : "in",
                value : [data.userId],
            }
        ],
    }
    let itemSort={
        column : "document_object_create_time",
        type :"desc"
    }
    

    let filter={};
    filter.filter = [];
    filter.sort = [];
    filter.filter.push(item);
    filter.sort.push(itemSort);
    filter.page = 1;
    filter.pageSize = 200;
    filter.distinct = true;

    filter.ids =JSON.stringify(data.documentIds);
    let res = await taskManagementApi.getIssueFilter(filter);
    return res;
   
}

const getLogIssueRecentAccess = async(userId) => {
    let data={};
    data =  {
        "query":{ 
            "bool":{
                "must": [
                    {
                        "term": {
                            "logObjectType": "document_instance"
                        }
                    },
                    {
                        "term": {
                            "documentType": 4
                        }
                    },
                    {
                        "term": {
                            "userAccess": userId
                        }
                    }
                ]  
                    
            }
        },
        "sort":[{
            "logTime":{
                "order":"desc"
            }}
        ],
        "page":1,
        "size":200
    }

    let res = await taskManagementApi.getDataLogService(data);
    return res;
      
}
const getAllCategory = async()=> {
    let res = await taskManagementApi.getAllCategory();
    return res;

}

const getAllIssueType = async() => {
        let filter={};
        filter.page = 1;
        filter.pageSize = 500;
        filter.distinct = true;

        let res = await taskManagementApi.getAllIssueType(filter);
        return res;  

}

const getAllProject = async() => {
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
    let filter={};
    filter.filter = [];
    filter.filter.push(item);
    filter.page = 1;
    filter.pageSize = 200;
    filter.distinct = false;
    let res = await taskManagementApi.getAllProject(filter);
    return res;
    
}

const getAllDocumentIdsInIssueType = async() => {
    let res = await taskManagementApi.getAllDocumentIdsInIssueType();
    return res;
      
}
const getAllStatusCategory = async() => {
    let res = await taskManagementApi.getAllStatusCategory();
    return res;
}
const getAllStatus = async()=> {
    let res = await taskManagementApi.getAllStatus();
    return res;
}
const getAllRole = async(projectId) => {
    let item={
        column : "projectId",
        operation : "and",
        conditions : [
            {
                name : "in",
                value : [projectId],
            }
        ],
    }
    let filter={};
    filter.filter = [];
    filter.filter.push(item);

    filter.page = 1;
    filter.pageSize = 100;
    filter.distinct = false;

    let res = await taskManagementApi.getListRole(filter);
    return res;
        
}
const getListStautsInProject = async(projectId) => {
    let res = await taskManagementApi.getListStatusInProject(projectId)
    return res; 
}
const getListRoleUserInProject = async(projectId) => {
    let res = await taskManagementApi.getListRoleUserInProject(projectId);
    return res; 
}

const getListOperatorInProject = async(projectId) => {
    let res = await taskManagementApi.getListOperatorInProject(projectId);
    return res; 
}
const getListIssueTypeInProjects = async(projectId) => {
    let res = await taskManagementApi.getListIssueTypeInProject(projectId);
    return res; 
}

const getListDocumentIdsInProject = async(projectId) => {
    let res = await taskManagementApi.getDocumentIdsInProject(projectId);
    return res; 
}
const getListColumnInBoard = async(boardId) => {
    let res = await taskManagementApi.getListColumn(boardId);
    return res; 
}

const getListStatusInColumnBoard = async(boardId) => {
    let res = await taskManagementApi.getListStatusInColumnOfBoard(boardId);
    return res;  
}
const getListWorkflowInProject = async(projectId) => {
    let res = await taskManagementApi.getListWorkflowInProject(projectId);
    return res;  
}

const getListDocumentConfigFieldIssue = async()=> {
    let item={
        column : "type",
        operation : "and",
        conditions : [
            {
                name : "in",
                value : [4],
            }
        ],
    }
    let filter={};
    filter.filter = [];
    filter.filter.push(item);
    filter.page = 1;
    filter.pageSize = 500;
    filter.distinct = false;

    let res = await taskManagementApi.getListDocumentConfigFieldIssue(filter);
    return res;  
        
}

const getAllPriority = async() => {
    let res = await taskManagementApi.getListPriority();
    return res;  
}


export {
    getDataFilterLogProject,
    getDataFilterIssueRecent,
    getAllCategory,
    getAllProject,
    getAllStatusCategory,
    getAllRole,
    getListWorkflowInProject,
    getAllPriority,
    getListStautsInProject,
    getListColumnInBoard,
    getListStatusInColumnBoard,
    getListDocumentConfigFieldIssue,
    getListIssueTypeInProjects,
    getLogIssueRecentAccess,
    getIssueAssignRecent,
    getAllDocumentIdsInIssueType,
    getListDocumentIdsInProject,
    getAllStatus,
    getAllIssueType,
    getListRoleUserInProject,
    getListOperatorInProject

};