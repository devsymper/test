import { getNewCellConfigLayout } from "@/components/dashboard/configPool/cellLayout.js";
import { autoLoadChartClasses } from "@/components/dashboard/configPool/reportConfig.js";
import { SYMPER_APP } from "./../../main.js";

export const setDataflowConfig = function(state, data){
    Vue.set(state.allDataflow, data.instanceKey, data.data);
}

export const setSelectingWidget = function(state, data){
    let nodeData = state.allDataflow[data.instanceKey].allWidget[data.id];
    Vue.set(state.allDataflow[data.instanceKey], 'selectedWidget', nodeData);
}

export const setAllNodeRunning = function(state, data){
    state.allDataflow[data.instanceKey].allWidget = Object.assign(state.allDataflow[data.instanceKey].allWidget, data.data);
}