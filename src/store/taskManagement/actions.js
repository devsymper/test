import { taskManagementApi } from "./../../api/taskManagement.js";
import { SYMPER_APP } from "./../../main.js";

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
            let res = await taskManagementApi.getAllProject();
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
const getAllRole = async(context) => {
    if (context.state.allRole.length==0) {
        try {
            let res = await taskManagementApi.getListRole();
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
    getAllPriority


};