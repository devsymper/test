import { getNewCellConfigLayout } from "@/components/dashboard/configPool/cellLayout.js";
import { autoLoadChartClasses } from "@/components/dashboard/configPool/reportConfig.js";
import { SYMPER_APP } from "./../../main.js";

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

const pasteReport = function(state, data){
    let copiedCellData = localStorage.symper_copied_dashboard_cell_data;
    if(copiedCellData){
        try {
            copiedCellData = JSON.parse(copiedCellData);
            if(copiedCellData.size && copiedCellData.type && copiedCellData.rawConfigs){
                let cellSize = copiedCellData.size;
                let newCellId = addCellToLayout(state, {
                    instanceKey: data.instanceKey,
                    type: copiedCellData.type,
                    cellSize:cellSize,
                    active: true
                });
                let dashboardConfigs = state.allDashboard[data.instanceKey].dashboardConfigs;
                Vue.set(dashboardConfigs.allCellConfigs[newCellId], 'rawConfigs', _.cloneDeep(copiedCellData.rawConfigs));
                setTimeout(() => {
                    SYMPER_APP.$evtBus.$emit('bi-report-change-display', {
                        id: newCellId,
                        type: 'data'
                    });
                }, 0);
            }
        } catch (error) {
            
        } finally {
            localStorage.removeItem('symper_copied_dashboard_cell_data');
        }
    }
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


const copyReport = function(state, data){
    let cellConfig = data.dashboardConfigs.allCellConfigs[data.reportId];
    let currentLayout = data.dashboardConfigs.info.layout[data.dashboardConfigs.info.currentTabPageKey];
    let oldCellLayout = currentLayout.filter((el) => {
        return el.cellId == data.reportId;
    })[0];

    let cellSize = {
        h: oldCellLayout.h,
        w: oldCellLayout.w,
    };
    let cellData = {
        size: cellSize,
        type: cellConfig.sharedConfigs.type,
        rawConfigs: cellConfig.rawConfigs
    };
    localStorage.setItem("symper_copied_dashboard_cell_data", JSON.stringify(cellData));
}



const cutReport = function(state, data){
    copyReport(state, data);
    removeReport(state, data);
}

const removeReport = function(state, data){
    let dashboardConfigs = state.allDashboard[data.instanceKey].dashboardConfigs;
    let reportId = data.reportId;
    let layout = dashboardConfigs.info.layout[dashboardConfigs.info.currentTabPageKey];
    for(let i in layout){
        if(layout[i].cellId == reportId){
            layout.splice(i,1);
            break;
        }
    }
    Vue.delete(dashboardConfigs.allCellConfigs, reportId);
}
export {
    hightlightSelectedDatasetAndCols,
    addCellToLayout,
    setSelectedCell,
    setAllWorkflowModel,
    addDatasetAndColumnInDashboard,
    setDashboardConfig,
    setListColumnInDataset,
    copyReport,
    pasteReport,
    cutReport,
    removeReport
};