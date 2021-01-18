
const setAllWorkflowModel = (state, data) => {
    Vue.set(state, 'allProcessModel', data);
}


const addDatasetAndColumnInDashboard = (state, data) => {
    let currentAllDashboard = state.allDashboard;
    currentAllDashboard[data.key].allDatasetColumns = data.data; // đẩy vào vị trí cuối
    Vue.set(state, 'allDashboard', currentAllDashboard);
}

const setDashboardConfig = (state, data) => {
    Vue.set(state.allDashboard, data.instanceKey, data.data);
}

const setListColumnInDataset = (state, data) => {
    Vue.set(state.listColumnInDataset, data);

}
export {
    setAllWorkflowModel,
    addDatasetAndColumnInDashboard,
    setDashboardConfig,
    setListColumnInDataset
};