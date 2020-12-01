import { taskManagementApi } from "./../../api/taskManagement.js";
import { SYMPER_APP } from "./../../main.js";

const getAllCategory = async(context) => {
    if (context.state.allCategory.length==0) {
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
    updateCategoryToStore


};