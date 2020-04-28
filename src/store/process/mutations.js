const addNewNode = (state, nodeData) => {
    Vue.set(state.allNodes, nodeData.id, nodeData);
};

const changeSelectingNode = (state, nodeData) => {
    Vue.set(state, 'selectingNode', nodeData);
};

export {
    addNewNode,
    changeSelectingNode
};