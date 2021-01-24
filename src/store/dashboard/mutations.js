import { getNewCellConfigLayout } from "@/components/dashboard/configPool/cellLayout.js";
import { autoLoadChartClasses } from "@/components/dashboard/configPool/reportConfig.js";
var mapTypeToClasses = autoLoadChartClasses();

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

const hightlightSelectedDatasetAndCols = function (state, data){
    let dashboard = state.allDashboard[data.instanceKey];
    let cell = dashboard.dashboardConfigs.allCellConfigs[data.id];
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
}

const setSelectedCell = (state, data) => {
    let cellId = data.id;
    let instanceKey = data.instanceKey;
    let dashboard = state.allDashboard[instanceKey];
    disSelectCurrentCell(state, instanceKey);
    let cell = dashboard.dashboardConfigs.allCellConfigs[cellId];
    // hightlightSelectedDatasetAndCols(state, data);
    Vue.set(dashboard, 'currentCellConfigs', cell);
    dashboard.currentCellConfigs.viewConfigs.isSelecting = true;
}

const addCellToLayout = function(state, data){
    let dashboardConfig = state.allDashboard[data.instanceKey].dashboardConfigs;
    let currentLayout = dashboardConfig.info.layout[dashboardConfig.info.currentTabPageKey];
    let newCellConfigsLayout = getNewCellConfigLayout(data.type, currentLayout, false, data.cellSize, data.active);
    currentLayout.push(newCellConfigsLayout);
    let cellId = newCellConfigsLayout.cellId;
    let cellConfig = new mapTypeToClasses[data.type](cellId);
    Vue.set(dashboardConfig.allCellConfigs,
        cellId, 
        cellConfig
    );

    if(data.autoSelectedCell !== false){
        setSelectedCell(state, {id: cellId, instanceKey: data.instanceKey});
    }
    return cellId;
}

export {
    hightlightSelectedDatasetAndCols,
    addCellToLayout,
    setSelectedCell,
    setAllWorkflowModel,
    addDatasetAndColumnInDashboard,
    setDashboardConfig,
    setListColumnInDataset
};