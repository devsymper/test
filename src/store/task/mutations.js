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

const removeFileAttachToStore = (state, id) => {
    let currentArrFileAttach = state.arrFileAttach;
    let obj = currentArrFileAttach.find(data => data.id === id)
    var index = currentArrFileAttach.indexOf(obj);
    if (index > -1) {
        currentArrFileAttach.splice(index, 1);
    }
    Vue.set(state, 'arrFileAttach', currentArrFileAttach);
}
export {
    setArrFileAttach,
    addToListAttachStore,
    setFilter,
    removeFileAttachToStore
  
};