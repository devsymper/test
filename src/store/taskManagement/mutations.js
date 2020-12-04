const setAllCategory = (state, allCategory) => {
        // let newCategories = allCategory.reduce((arr,obj)=>{
        //     let item = {name: obj.name, id: obj.id}
        //     arr.push(item);
        //     return arr
        // },[])
        Vue.set(state, 'allCategory', allCategory);
}

const setAllProject = (state, allProject) => {
    Vue.set(state, 'allProject', allProject);
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
const addBoardToStore = (state, item) => {
    let currentListBoard = state.listBoardInProject;
    currentListBoard.unshift(item)
    Vue.set(state, 'listBoardInProject', currentListBoard);
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

const removeCategoryToStore = (state, id) => {
    let currentListCategory = state.allCategory;
    let obj = currentListCategory.find(data => data.id === id)
    var index = currentListCategory.indexOf(obj);
    if (index > -1) {
        currentListCategory.splice(index, 1);
    }
    Vue.set(state, 'allCategory', currentListCategory);
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

};