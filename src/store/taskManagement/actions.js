import { taskManagementApi } from "./../../api/taskManagement.js";
import { SYMPER_APP } from "./../../main.js";


const getLogProjectAccess = async(context,userId) => {
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
                            "logUser": userId
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
    try {

        let res = await taskManagementApi.getDataLogService(data);
        if (res.status == 200) {
            context.commit('setListProjectRecentAccess', res.data);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get log project access!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get log project access!");
    }

}


const getIssueAssignRecent = async(context,data) => { //documentId là all documentId chưa trong all issueType
    try {
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
        if (res.status == 200) {
            context.commit('setIssueAssignRecent', res.data.listObject);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get all Project!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get all Project!");
    }
}

const getLogIssueRecentAccess = async(context,userId) => {
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
                            "logUser": userId
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

    try {
        let res = await taskManagementApi.getDataLogService(data);
        if (res.status == 200) {
            context.commit('setLogIssueRecentAccess', res.data);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get log project access!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get log project access!");
    }

}
const getAllCategory = async(context) => {
    if (context.state.allCategory.length==0 ) {
        try {
            let res = await taskManagementApi.getAllCategory();
            if (res.status == 200) {
                context.commit('setAllCategory', res.data.listObject);
            } else {
                SYMPER_APP.$snotifyError(error, "Can not get all category!");
            }
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get all category!");
        }
    }

}

const getAllIssueType = async(context) => {
    try {
        let filter={};
        filter.page = 1;
        filter.pageSize = 500;
        filter.distinct = true;

        let res = await taskManagementApi.getAllIssueType(filter);
        if (res.status == 200) {
            context.commit('setAllIssueType', res.data.listObject);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get all issue type!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get all issue type!");
    }

}

const getAllProject = async(context) => {
    if (context.state.allProject.length==0) {
        try {
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
            if (res.status == 200) {
                context.commit('setAllProject', res.data.listObject);
            } else {
                SYMPER_APP.$snotifyError(error, "Can not get all Project!");
            }
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get all Project!");
        }
    }
}

const getAllDocumentIdsInIssueType = async(context) => {
        try {
            let res = await taskManagementApi.getAllDocumentIdsInIssueType();
            if (res.status == 200) {
                context.commit('setAllDocumentIdsInIssueType', res.data);
            } else {
                SYMPER_APP.$snotifyError(error, "Can not get list documentIds in issue type!");
            }
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get list documentIds in issue type!");
        }
}
const getAllStatusCategory = async(context) => {
    if (context.state.allStatusCategory.length==0) {
        try {
            let res = await taskManagementApi.getAllStatusCategory();
            if (res.status == 200) {
                context.commit('setAllStatusCategory', res.data.listObject);
            } else {
                SYMPER_APP.$snotifyError(error, "Can not get all StatusCategory!");
            }
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get all StatusCategory!");
        }
    }
}
const getAllStatus = async(context) => {
    if (context.state.allStatus.length==0) {
        try {
            let res = await taskManagementApi.getAllStatus();
            if (res.status == 200) {
                context.commit('setAllStatus', res.data.listObject);
            } else {
                SYMPER_APP.$snotifyError(error, "Can not get all Status!");
            }
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get all Status!");
        }
    }
}
const getAllRole = async(context,projectId) => {
    try {
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
        if (res.status == 200) {
            context.commit('setAllRole', res.data.listObject);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get all role!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get all role!");
    }
}
const getListStatusInProject = async(context,projectId) => {
    return new Promise((resolve, reject) => {
        try {
            taskManagementApi.getListStatusInProject(projectId).then(res=>{
                if (res.status == 200) {
                    let data={};
                    data.key = projectId;
                    data.data = res.data.listObject;
                    context.commit('setListStautsInProject',data);
                    resolve(data);
                } else {
                    SYMPER_APP.$snotifyError(error, "Can not get list status in project!");
                }
            })
        } catch (error) {
            reject(error);
        }
    });
}
const getListRoleUserInProject = async(context,projectId) => {
    return new Promise((resolve, reject) => {
        try {
            taskManagementApi.getListRoleUserInProject(projectId).then(res=>{
                if (res.status == 200) {
                    let data={};
                    data.key = projectId;
                    data.data = res.data.listObject;
                    context.commit('setListRoleUserInProject',data);
                    resolve(data);
                } else {
                    SYMPER_APP.$snotifyError(error, "Can not get list role of enduser in project!");
                }
            })
        } catch (error) {
            reject(error);
        }
    });
}

const getListOperatorInProject = async(context,projectId) => {
    return new Promise((resolve, reject) => {
        try {
            taskManagementApi.getListOperatorInProject(projectId).then(res=>{
                if (res.status == 200) {
                    let data={};
                    data.key = projectId;
                    data.data = res.data.listObject;
                    context.commit('setListOperatorInProject',data);
                    resolve(data);
                } else {
                    SYMPER_APP.$snotifyError(error, "Can not get list operation in project!");
                }
            })
        } catch (error) {
            reject(error);
        }
    });
}
const getListIssueTypeInProjects = async(context,projectId) => {
    return new Promise((resolve, reject) => {
        try {
            taskManagementApi.getListIssueTypeInProject(projectId).then(res=>{
                if (res.status == 200) {
                    let data={};
                    data.key = projectId;
                    data.data = res.data.listObject;
                    context.commit('setListIssueTypeInProjects',data);
                    resolve(data);
                } else {
                    SYMPER_APP.$snotifyError(error, "Can not get list issuetype in project!");
                }
            })
        } catch (error) {
            reject(error);
        }
    });
}

const getListDocumentIdsInProject = async(context,projectId) => {
    return new Promise((resolve, reject) => {
        try {
            taskManagementApi.getDocumentIdsInProject(projectId).then(res=>{
                if (res.status == 200) {
                    let data={};
                    data.key = projectId;
                    data.data = res.data;
                    context.commit('setListDocumentIdsInProject',data);
                    resolve(data);
                } else {
                    SYMPER_APP.$snotifyError(error, "Can not get list documentIds in project!");
                }
            })
        } catch (error) {
            reject(error);
        }
    });
}
const getListColumnInBoard = (context,boardId) => {
    return new Promise((resolve, reject) => {
        try {
            taskManagementApi.getListColumn(boardId).then(res=>{
                if (res.status == 200) {
                    let data={};
                    data.key = boardId;
                    data.data = res.data ? res.data.listObject : [] ;
                    context.commit('setListColumnInBoard',data);
                    resolve(data);
                } else {
                    SYMPER_APP.$snotifyError(error, "Can not get list column in board!");
                }
            })
            
        } catch (error) {
            reject(error);
        }
    });
}

const getListStatusInColumnBoard = (context,boardId) => {
    return new Promise((resolve, reject) => {
        try {
            taskManagementApi.getListStatusInColumnOfBoard(boardId).then(res=>{
                if (res.status == 200) {
                    let data={};
                    data.key = boardId;
                    data.data = res.data ? res.data.listObject : [] ;
                    context.commit('setListStatusInColumnBoard',data);
                    resolve(data)
                } else {
                    SYMPER_APP.$snotifyError(error, "Can not get list column in board!");
                }
            })
            
        } catch (error) {
            reject(error);
        }
    });
}
const getListWorkflowInProject = async(context,projectId) => {
    try {
        let res = await taskManagementApi.getListWorkflowInProject(projectId);
        if (res.status == 200) {
            context.commit('setAllWorkflow', res.data.listObject);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get all Workflow role!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get all Workflow role!");
    }
}

const getListDocumentConfigFieldIssue = async(context) => {
        try {
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
            if (res.status == 200) {
                context.commit('setListDocumentConfigFieldIssue', res.data.listObject);
            } else {
                SYMPER_APP.$snotifyError(error, "Can not get document config field!");
            }
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get document config field!");
        }
}

const getAllPriority = async(context,isResetData=false) => {
    if (context.state.allPriority.length==0 || isResetData) {
        try {
            let res = await taskManagementApi.getListPriority();
            if (res.status == 200) {
                context.commit('setAllPriority', res.data.listObject);
            } else {
                SYMPER_APP.$snotifyError(error, "Can not get all priority!");
            }
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get all priority!");
        }
    }
}

const addProjectToStore = async(context, item) => {
    context.commit('addProjectToStore', item);
}
const addCategoryToStore = async(context, item) => {
    context.commit('addCategoryToStore', item);
}
const updateProjectToStore = async(context, data) => {
    context.commit('updateProjectToStore', data);
}

const updateCategoryToStore = async(context, data) => {
    context.commit('updateCategoryToStore', data);
}



export {
    getAllCategory,
    getAllProject,
    addProjectToStore,
    updateProjectToStore,
    addCategoryToStore,
    updateCategoryToStore,
    getAllStatusCategory,
    getAllRole,
    getListWorkflowInProject,
    getAllPriority,
    getListStatusInProject,
    getListColumnInBoard,
    getListStatusInColumnBoard,
    getListDocumentConfigFieldIssue,
    getListIssueTypeInProjects,
    getLogProjectAccess,
    getLogIssueRecentAccess,
    getIssueAssignRecent,
    getAllDocumentIdsInIssueType,
    getListDocumentIdsInProject,
    getAllStatus,
    getAllIssueType,
    getListRoleUserInProject,
    getListOperatorInProject

};