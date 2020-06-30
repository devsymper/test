import { SYMPER_HOME_ORGCHART } from "../../components/orgchart/editor/nodeAttrFactory";

SYMPER_HOME_ORGCHART
const setOrgchartData = (state, params) => {
    Vue.set(state.editor, params.instanceKey, params.data);
};

const setNodeConfig = (state, params) => {
    Vue.set(state.editor[params.instanceKey].allNode, params.nodeId, params.data);
};


const changeSelectingNode = (state, params) => {
    let selectingNode = null;
    if (params.nodeId == SYMPER_HOME_ORGCHART) {
        selectingNode = state.editor[params.instanceKey].homeConfig;
    } else {
        selectingNode = state.editor[params.instanceKey].allNode[params.nodeId];
    }
    Vue.set(state.editor[params.instanceKey], 'selectingNode', selectingNode);
};

export {
    setOrgchartData,
    setNodeConfig,
    changeSelectingNode
};