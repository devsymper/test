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
                            "userId.keyword": userId
                        }
                    }
                ]  
                    
            }
        },
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
                            "userAccess": userId
                        }
                    }
                ]  
                    
            }
        },
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
const getAllRole = async(context,projectId) => {
    if (context.state.allRole.length==0) {
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
}
const getListStautsInProject = async(context,projectId) => {
    try {
        let res = await taskManagementApi.getListStatusInProject(projectId);
        if (res.status == 200) {
            let data={};
            data.key = projectId;
            data.data = res.data.listObject;
            context.commit('setListStautsInProject',data);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get list status in project!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get list status in project!");
    }
}
const getListIssueTypeInProjects = async(context,projectId) => {
    try {
        let res = await taskManagementApi.getListIssueTypeInProject(projectId);
        if (res.status == 200) {
            let data={};
            data.key = projectId;
            data.data = res.data.listObject;
            context.commit('setListIssueTypeInProjects',data);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get list issuetype in project!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get list issuetype in project!");
    }
}

const getListColumnInBoard = async(context,boardId) => {
    try {
        let res = await taskManagementApi.getListColumn(boardId);
        if (res.status == 200) {
            let data={};
            data.key = boardId;
            data.data = res.data ? res.data.listObject : [] ;
            context.commit('setListColumnInBoard',data);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get list column in board!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get list column in board!");
    }
}

const getListStatusInColumnBoard = async(context,boardId) => {
    try {
        let res = await taskManagementApi.getListStatusInColumnOfBoard(boardId);
        if (res.status == 200) {
            let data={};
            data.key = boardId;
            data.data = res.data ? res.data.listObject : [] ;
            context.commit('setListStatusInColumnBoard',data);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get list column in board!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get list column in board!");
    }
}
const getListWorkflowInProject = async(context,projectId) => {
    if (context.state.allWorkflow.length==0) {
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
    getListStautsInProject,
    getListColumnInBoard,
    getListStatusInColumnBoard,
    getListDocumentConfigFieldIssue,
    getListIssueTypeInProjects,
    getLogProjectAccess,
    getLogIssueRecentAccess


};