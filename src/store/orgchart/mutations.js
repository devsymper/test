const setOrgchartData = (state, params) => {
    Vue.set(state.editor, params.instanceKey, params.data);
};

const setNodeConfig = (state, params) => {
    Vue.set(state.editor[params.instanceKey].allNode, params.nodeId, params.data);
};


const changeSelectingNode = (state, params) => {
    let selectingNode = state.editor[params.instanceKey].allNode[params.nodeId];
    Vue.set(state.editor[params.instanceKey], 'selectingNode', selectingNode);
};

export {
    setOrgchartData,
    setNodeConfig,
    changeSelectingNode
};