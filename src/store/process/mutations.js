const addNewNode = (state, info) => {
    let instanceKey = info.instanceKey;
    let nodeData = info.data;

    Vue.set(state.editor[instanceKey].allNodes, nodeData.id, nodeData);
};

const initInstance = (state, instanceKey) => {
    if (!state.editor[instanceKey]) {
        Vue.set(state.editor, instanceKey, {
            allNodes: {

            },
            selectingNode: {

            }
        });
    }
};

const changeSelectingNode = (state, info) => {
    let instanceKey = info.instanceKey;
    let nodeData = info.data;

    Vue.set(state.editor[instanceKey], 'selectingNode', nodeData);
};

export {
    addNewNode,
    changeSelectingNode,
    initInstance
};