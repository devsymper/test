import sTaskManager from '@/store/taskManagement'
export const checkPermission = (objectType, action) => {
    let allAction = sTaskManager.state.userOperations
    if(allAction[objectType] && allAction[objectType].includes(action)){
        return true;
    }
    return false
}