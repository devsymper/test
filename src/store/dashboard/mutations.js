
const setAllWorkflowModel = (state, data) => {
    Vue.set(state, 'allProcessModel', data);
}


const addDatasetAndColumnInDashboard = (state, data) => {
    let currentAllDashboard = state.allDashboard;
    currentAllDashboard[data.key].allDatasetColumns = data.data; // đẩy vào vị trí cuối
    Vue.set(state, 'allDashboard', currentAllDashboard);
}

export {
    setAllWorkflowModel,
    addDatasetAndColumnInDashboard,
};