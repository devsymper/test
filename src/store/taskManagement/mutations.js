const setAllCategory = (state, allCategory) => {
        // let newCategories = allCategory.reduce((arr,obj)=>{
        //     let item = {name: obj.name, id: obj.id}
        //     arr.push(item);
        //     return arr
        // },[])
        Vue.set(state, 'allCategory', allCategory);
}

const setAllDocumentIdsInIssueType = (state, listDocumentIdsInIssueType) => {
    Vue.set(state, 'listDocumentIdsInIssueType', listDocumentIdsInIssueType);
}

const setIssueAssignRecent = (state, listIssueAssignRecent) => {
    Vue.set(state, 'listIssueAssignRecent', listIssueAssignRecent);
}


const setListProjectRecentAccess = (state, listProjectRecentAccess) => {
    Vue.set(state, 'listProjectRecentAccess', listProjectRecentAccess);
}
const setLogIssueRecentAccess = (state, listIssueRecentAccess) => {
    Vue.set(state, 'listIssueRecentAccess', listIssueRecentAccess);
}

const setAllStatusCategory = (state, allStatusCategory) => {
    Vue.set(state, 'allStatusCategory', allStatusCategory);
}
const setAllStatus = (state, allStatus) => {
    Vue.set(state, 'allStatus', allStatus);
}
const setListStautsInProject = (state, data) => {
    Vue.set(state.listStatusInProjects, data.key , data.data);
}

const setAllProject = (state, allProject) => {
    Vue.set(state, 'allProject', allProject);
}
const setAllPriority = (state, allPriority) => {
    Vue.set(state, 'allPriority', allPriority);
}
const setListBoardInProject = (state, listBoardInProject) => {
    Vue.set(state, 'listBoardInProject', listBoardInProject);
}
const setListComponent = (state, listComponentInProject) => {
    Vue.set(state, 'listComponentInProject', listComponentInProject);
}
const setListVersion = (state, listVersionInProject) => {
    Vue.set(state, 'listVersionInProject', listVersionInProject);
}
const setListColumnInBoard = (state, data) => {
    Vue.set(state.listColumnInBoard, data.key , data.data);
}
const setListStatusInColumnBoard = (state, data) => {
    Vue.set(state.listStatusInColumnBoard, data.key , data.data);
}
const setListIssueTypeInProjects = (state, data) => {
    Vue.set(state.listIssueTypeInProjects, data.key , data.data);
}

const setAllWorkflow = (state, allWorkflow) => {
    Vue.set(state, 'allWorkflow', allWorkflow);
}
const setAllRole = (state, allRole) => {
    Vue.set(state, 'allRole', allRole);
}

const setListDocumentConfigFieldIssue = (state, listDocumentConfigFieldIssue) => {
    Vue.set(state, 'listDocumentConfigFieldIssue', listDocumentConfigFieldIssue);
}
const setCurrentProject = (state, currentProject) => {
    Vue.set(state, 'currentProject', currentProject);
}
const setInfoVersionCurrent = (state, infoVersionCurrent) => {
    Vue.set(state, 'infoVersionCurrent', infoVersionCurrent);
}

const setInfoComponentCurrent = (state, infoComponentCurrent) => {
    Vue.set(state, 'infoComponentCurrent', infoComponentCurrent);
}
const addProjectToStore = (state, item) => {
    let currentListProject = state.allProject;
    currentListProject.unshift(item)
    Vue.set(state, 'allProject', currentListProject);
}

const addCategoryToStore = (state, item) => {
    let currentListCategory = state.allCategory;
    currentListCategory.unshift(item)
    Vue.set(state, 'allCategory', currentListCategory);
}

const addWorkflowToStore = (state, item) => {
    let currentAllWorkflow = state.allWorkflow;
    currentAllWorkflow.unshift(item)
    Vue.set(state, 'allWorkflow', currentAllWorkflow);
}
const addBoardToStore = (state, item) => {
    let currentListBoard = state.listBoardInProject;
    currentListBoard.unshift(item)
    Vue.set(state, 'listBoardInProject', currentListBoard);
}

const addPriorityToStore = (state, item) => {
    let currentAllPriority = state.allPriority;
    currentAllPriority.push(item); // đẩy vào vị trí cuối
    Vue.set(state, 'allPriority', currentAllPriority);
}
const updateStatusFavoriteProject = (state, id) => {
    let currentListProject = state.allProject;

    let obj = currentListProject.find(data => data.id === id)
    var index = currentListProject.indexOf(obj);

    if (index > -1) {
        if (currentListProject[index].isFavorite == 1) {
            currentListProject[index].isFavorite = 0;
        } else {
            currentListProject[index].isFavorite = 1;
        }
    }
    Vue.set(state, 'allProject', currentListProject);
}

const updateProjectToStore = (state, item) => {
    let currentListProject = state.allProject;

    let obj = currentListProject.find(data => data.id === item.id)
    var index = currentListProject.indexOf(obj);

    if (index > -1) {
        currentListProject[index].name = item.name;
        currentListProject[index].description = item.description;
        currentListProject[index].categoryId = item.categoryId;
        currentListProject[index].icon = item.icon;
        currentListProject[index].key = item.key;
        currentListProject[index].userLeader = item.userLeader;
    }
    Vue.set(state, 'allProject', currentListProject);
}
const updateBoardToStore = (state, item) => {
    let currentListBoard = state.listBoardInProject;

    let obj = currentListBoard.find(data => data.id === item.id)
    var index = currentListBoard.indexOf(obj);
    if (index > -1) {
        currentListBoard[index].name = item.name;
        currentListBoard[index].description = item.description;
    }
    Vue.set(state, 'listBoardInProject', currentListBoard);
}

const updateWorkflowToStore = (state, item) => {
    let currentAllWorkflow = state.allWorkflow;
    let obj = currentAllWorkflow.find(data => data.id === item.id)
    var index = currentAllWorkflow.indexOf(obj);
    if (index > -1) {
        currentAllWorkflow[index].name = item.name;
        currentAllWorkflow[index].description = item.description;
    }
    Vue.set(state, 'allWorkflow', currentAllWorkflow);
}


const updateCategoryToStore = (state, item) => {
    let currentListCategory = state.allCategory;

    let obj = currentListCategory.find(data => data.id === item.id)
    var index = currentListCategory.indexOf(obj);

    if (index > -1) {
        currentListCategory[index].name = item.name;
        currentListCategory[index].description = item.description;
        currentListCategory[index].icon = item.icon;
    }
    Vue.set(state, 'allCategory', currentListCategory);
}

const updatePriorityToStore = (state, item) => {
    let currentAllPriority = state.allPriority;

    let obj = currentAllPriority.find(data => data.id === item.id)
    var index = currentAllPriority.indexOf(obj);

    if (index > -1) {
        currentAllPriority[index].name = item.name;
        currentAllPriority[index].description = item.description;
        currentAllPriority[index].icon  = item.icon;
        currentAllPriority[index].color = item.color;
    }
    Vue.set(state, 'allPriority', currentAllPriority);
}

const removeCategoryToStore = (state, id) => {
    let currentListCategory = state.allCategory;
    let obj = currentListCategory.find(data => data.id === id)
    var index = currentListCategory.indexOf(obj);
    if (index > -1) {
        currentListCategory.splice(index, 1);
    }
    Vue.set(state, 'allCategory', currentListCategory);
}
const removeProjectToStore = (state, id) => {
    let currentListProject = state.allProject;
    let obj = currentListProject.find(data => data.id === id)
    var index = currentListProject.indexOf(obj);
    if (index > -1) {
        currentListProject.splice(index, 1);
    }
    Vue.set(state, 'allProject', currentListProject);
}
const removeWorkflowToStore = (state, id) => {
    let currentAllWorkflow = state.allWorkflow;
    let obj = currentAllWorkflow.find(data => data.id === id)
    var index = currentAllWorkflow.indexOf(obj);
    if (index > -1) {
        currentAllWorkflow.splice(index, 1);
    }
    Vue.set(state, 'allWorkflow', currentAllWorkflow);
}

const removePriorityToStore = (state, id) => {
    let currentAllPriority = state.allPriority;
    let obj = currentAllPriority.find(data => data.id === id)
    var index = currentAllPriority.indexOf(obj);
    if (index > -1) {
        currentAllPriority.splice(index, 1);
    }
    Vue.set(state, 'allPriority', currentAllPriority);
}
const addToTaskManagementStore = (state, data) =>{
    let key = data.key;
    let value = data.value;
    Vue.set(state, key, value)
}
export {
    setAllCategory,
    setAllProject,
    addProjectToStore,
    updateStatusFavoriteProject,
    updateProjectToStore,
    addCategoryToStore,
    updateCategoryToStore,
    removeCategoryToStore,
    setCurrentProject,
    setListBoardInProject,
    addBoardToStore,
    addToTaskManagementStore,
    updateBoardToStore,
    setListComponent,
    setListVersion,
    setInfoVersionCurrent,
    setInfoComponentCurrent,
    removeProjectToStore,
    setListColumnInBoard,
    setAllWorkflow,
    removeWorkflowToStore,
    setAllStatusCategory,
    updateWorkflowToStore,
    setAllRole,
    addWorkflowToStore,
    setAllPriority,
    addPriorityToStore,
    removePriorityToStore,
    updatePriorityToStore,
    setAllStatus,
    setListStautsInProject,
    setListStatusInColumnBoard,
    setListDocumentConfigFieldIssue,
    setListIssueTypeInProjects,
    setListProjectRecentAccess,
    setLogIssueRecentAccess,
    setAllDocumentIdsInIssueType,
    setIssueAssignRecent

};