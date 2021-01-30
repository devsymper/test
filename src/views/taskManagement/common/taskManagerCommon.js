import sTaskManager from '@/store/taskManagement';
import sApp from '@/store/app';

export const checkPermission = (objectType, action) => {
    if (sApp.state.baInfo.email) {
        return true;
    }
    if (sApp.state.endUserInfo.id == sTaskManager.state.currentProject.userLeader) {
        return true;
    }
    let allAction = sTaskManager.state.userOperations
    if(allAction[objectType] && allAction[objectType].includes(action)){
        return true;
    }


    return false
}