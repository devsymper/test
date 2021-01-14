
const setAllWorkflowModel = (state, data) => {
    Vue.set(state, 'allProcessModel', data);
}


const addDatasetAndColumnInDashboard = (state, data) => {
    let currentDatasetAndColumn = state.datasetAndColumn;
    if (!currentDatasetAndColumn[data.key]) {
        currentDatasetAndColumn[boardId] = {};
    }
    currentDatasetAndColumn[boardId] = data.data; // đẩy vào vị trí cuối
    Vue.set(state, 'datasetAndColumn', currentDatasetAndColumn);
}

export {
    setAllWorkflowModel,
    addDatasetAndColumnInDashboard,
};