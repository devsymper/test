
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

    let cell = dashboard.dashboardConfigs.allCellConfigs[cellId];
    let selectedColums = {};
    for(let key in cell.rawConfigs.setting){
        for(let col of cell.rawConfigs.setting[key].selectedColums){
            if(!selectedColums[col.dataset]){
                selectedColums[col.dataset] = {};
            }
            selectedColums[col.dataset][col.name] = true;
            selectedColums[col.dataset][col.columnName] = true;
        }
    }
    Vue.set(cell.viewConfigs, 'selectedDataset', selectedColums);
    Vue.set(dashboard, 'currentCellConfigs', cell);
    dashboard.currentCellConfigs.viewConfigs.isSelecting = true;
}

export {
    setSelectedCell,
    setAllWorkflowModel,
    addDatasetAndColumnInDashboard,
    setDashboardConfig,
    setListColumnInDataset
};