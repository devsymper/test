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

const setAllDefinition = (state, data) => {
    let info = data.reduce((map, item) => {
        map[item.id] = item;
        return map;
    }, {});
    Vue.set(state, 'allDefinitions', info);
};


const setAllWorkflowModel = (state, data) => {
    Vue.set(state, 'allProcessModel', data);
}


export {
    addNewNode,
    changeSelectingNode,
    initInstance,
    setAllDefinition,
    setAllWorkflowModel
};