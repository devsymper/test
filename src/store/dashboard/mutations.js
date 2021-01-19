
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
const disSelectCurrentCell = (state, instanceKey) => {
    let viewConfigs = state.allDashboard[instanceKey].currentCellConfigs.viewConfigs;
    if(viewConfigs){
        viewConfigs.isSelecting = false;
    }
}

const setSelectedCell = (state, data) => {
    let cellId = data.id;
    let instanceKey = data.instanceKey;
    let dashboard = state.allDashboard[instanceKey];
    disSelectCurrentCell(state, instanceKey);
    Vue.set(dashboard, 'currentCellConfigs', dashboard.dashboardConfigs.allCellConfigs[cellId]);
    dashboard.currentCellConfigs.viewConfigs.isSelecting = true;
}

export {
    setSelectedCell,
    setAllWorkflowModel,
    addDatasetAndColumnInDashboard,
    setDashboardConfig,
    setListColumnInDataset
};