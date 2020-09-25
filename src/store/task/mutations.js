const setArrFileAttach = (state, arrFileAttach) => {
    Vue.set(state, 'arrFileAttach', arrFileAttach);
}
const addToListAttachStore = (state, item) => {
    let currentarrFileAttach = state.arrFileAttach;
    currentarrFileAttach.unshift(item)
    Vue.set(state, 'arrFileAttach', currentarrFileAttach);
}
const setFilter = (state, item) => {
    Vue.set(state, 'filter', item);
}

const setStatusPopupTracking= (state, item) => {
    Vue.set(state, 'statusPopupTracking', item);
}
const setArrDocObjId = (state, arrDocObjId) => {
    Vue.set(state, 'arrDocObjId', arrDocObjId);
}
const removeFileAttachToStore = (state, id) => {
    let currentArrFileAttach = state.arrFileAttach;
    let obj = currentArrFileAttach.find(data => data.id === id)
    var index = currentArrFileAttach.indexOf(obj);
    if (index > -1) {
        currentArrFileAttach.splice(index, 1);
    }
    Vue.set(state, 'arrFileAttach', currentArrFileAttach);
}
const setListTaskInProcessInstance = (state, listTaskInProcessInstance) => {
    Vue.set(state, 'listTaskInProcessInstance', listTaskInProcessInstance);
}
const setListTaskInProcessParent = (state, listTaskInProcessParent) => {
    Vue.set(state, 'listTaskInProcessParent', listTaskInProcessParent);
}
const setListTaskInProcessSub = (state, listTaskInProcessSub) => {
    Vue.set(state, 'listTaskInProcessSub', listTaskInProcessSub);
}

const setListTaskDoneInProcessInstance = (state, listTaskDoneInProcessInstance) => {
    Vue.set(state, 'listTaskDoneInProcessInstance', listTaskDoneInProcessInstance);
}
const setListTaskDoneInProcessParent = (state, listTaskDoneInProcessParent) => {
    Vue.set(state, 'listTaskDoneInProcessParent', listTaskDoneInProcessParent);
}
const setListTaskInProcessSibling = (state, listTaskInProcessSibling) => {
    Vue.set(state, 'listTaskInProcessSibling', listTaskInProcessSibling);
}
const setIsStatusSubmit = (state, isStatusSubmit) => {
    Vue.set(state, 'isStatusSubmit', isStatusSubmit);
}

export {
    setArrFileAttach,
    addToListAttachStore,
    setFilter,
    removeFileAttachToStore,
    setArrDocObjId,
    setStatusPopupTracking,
    setListTaskInProcessInstance,
    setListTaskInProcessParent,
    setListTaskInProcessSub,
    setListTaskDoneInProcessInstance,
    setListTaskDoneInProcessParent,
    setListTaskInProcessSibling,
    setIsStatusSubmit


};