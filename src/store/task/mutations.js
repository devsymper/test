const setArrFileAttach = (state, arrFileAttach) => {
    Vue.set(state, 'arrFileAttach', arrFileAttach);
}
const addToListAttachStore = (state, item) => {
    let currentarrFileAttach = state.arrFileAttach;
    currentarrFileAttach.unshift(item)
    Vue.set(state, 'arrFileAttach', currentarrFileAttach);
}
export {
    setArrFileAttach,
    addToListAttachStore
  
};