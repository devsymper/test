const setOrgchartData = (state, params) => {
    Vue.set(state.editor, params.instanceKey, params.data);
};

const setNodeConfig = (state, params) => {
    Vue.set(state.editor[params.instanceKey].allNodes, params.nodeId, params.data);
};


const changeSelectingNode = (state, params) => {
    let selectingNode = state.editor[params.instanceKey].allNodes[params.nodeId];
    Vue.set(state.editor[params.instanceKey], 'selectingNode', selectingNode);
};

export {
    setOrgchartData,
    setNodeConfig
};