// const changeCollapseSidebar = (state, newValue) => {
//   state.collapseSideBar = newValue;
// };
// const decreaseUnreadNotification = (state, delta = 1) => {
//   state.unreadNotification -= delta;
// };
// const increaseUnreadNotification = (state, delta = 1) => {
//   state.unreadNotification += delta;
// };
const changeSubCollapseSidebar = (state, newValue) => {
    state.subCollapseSideBar = newValue;
    if (!newValue) {
        state.widthSideBar = 250;
    } else {
        state.widthSideBar = 0;
    }
};
const changeStatusRightBar = (state, newValue) => {
    state.statusRightBar = newValue;
};

const changeHeaderSlugKH = (state, newValue) => {
    state.header_slug = newValue;
};
const changeStatusEdit = (state, newValue) => {
    state.statusEdit = newValue;
};
const changeStatusBackup = (state, newValue) => {
    state.statusBackup = newValue;
}
const changeStatusRestore = (state, newValue) => {
    state.statusRestore = newValue;
}
const changeStatusFormAddSizeTable = (state, newValue) => {
    state.statusFormAddSizeTable = newValue;
}

const changeStatusHansonTable = (state, newValue) => {
    state.statusHansonTable = newValue;
}
const changeStatusShowImage = (state, newValue) => {
    state.statusShowImage = newValue;
}
const setSizeTable = (state, size) => {
    Vue.set(state, 'arrSizeTable', size);
}

const setHotData = (state, hotData) => {
    Vue.set(state, 'hotData', hotData);
}
const setDataTable = (state, dataTable) => {
    Vue.set(state, 'dataTable', dataTable);
}
const setIdTable = (state, idTable) => {
    Vue.set(state, 'idTable', idTable);
}
const setAllDiretory = (state, allDirectory) => {
    if (state.allDirectory.length == 0) {
        Vue.set(state, 'allDirectory', allDirectory);

    }
}

const setCurrentDocument = (state, currentDocument) => {
    Vue.set(state, 'currentDocument', currentDocument);
}
const setAllDocument = (state, allDocument) => {
    if (state.allDocument.length == 0) {
        Vue.set(state, 'allDocument', allDocument);
    }
}

const setDocumentFavorite = (state, listDocumentFavorite) => {
    Vue.set(state, 'listDocumentFavorite', listDocumentFavorite);
}

const setListTableRoot = (state, listDataTableRoot) => {
    Vue.set(state, 'listDataTableRoot', listDataTableRoot);
}

const setListTableChildren = (state, listDataTableRoot) => {
    Vue.set(state, 'listDataTableChildren', listDataTableRoot);
}

const setLogDocument = (state, listLogDocument) => {
    Vue.set(state, 'listLogDocument', listLogDocument);
}

const setLogAll = (state, listLogAll) => {
    Vue.set(state, 'listLogAll', listLogAll);
}

const setArrIdFileAttach = (state, arrIdFileAttach) => {
    Vue.set(state, 'arrIdFileAttach', arrIdFileAttach);
}

const setArrFileAttach = (state, arrFileAttach) => {
    Vue.set(state, 'arrFileAttach', arrFileAttach);
}
const setBackupDocument = (state, listBackupDocument) => {
    Vue.set(state, 'listBackupDocument', listBackupDocument);
}
const addToTreeViewStore = (state, item) => {
    let currentListDirectory = state.allDirectory;
    currentListDirectory.unshift(item)
    Vue.set(state, 'allDirectory', currentListDirectory);
}

const addDocToTreeViewStore = (state, item) => {
    let currentListDocument = state.allDocument;
    currentListDocument.unshift(item)
    Vue.set(state, 'allDocument', currentListDocument);
}
const removeNodeToTreeViewStore = (state, path) => {
    let currentListDirectory = state.allDirectory;
    let obj = currentListDirectory.find(data => data.path === path)
    var index = currentListDirectory.indexOf(obj);
    if (index > -1) {
        currentListDirectory.splice(index, 1);
    }
    Vue.set(state, 'allDirectory', currentListDirectory);
}

const removeDocToTreeViewStore = (state, id) => {
    let currentListDocument = state.allDocument;
    let obj = currentListDocument.find(data => data.id === id)
    var index = currentListDocument.indexOf(obj);
    if (index > -1) {
        currentListDocument.splice(index, 1);
    }
    Vue.set(state, 'allDocument', currentListDocument);
}

const updateNodeToTreeViewStore = (state, item) => {
    let currentListDirectory = state.allDirectory;

    let obj = currentListDirectory.find(data => data.path === item.path)
    var index = currentListDirectory.indexOf(obj);

    if (index > -1) {
        currentListDirectory[index].name = item.name;
    }
    Vue.set(state, 'allDirectory', currentListDirectory);
}



const updateDocumentToTreeViewStore = (state, item) => {
    let currentListDocument = state.allDocument;

    let obj = currentListDocument.find(data => data.id === item.id)
    var index = currentListDocument.indexOf(obj);

    if (index > -1) {
        currentListDocument[index].name = item.name;
    }
    Vue.set(state, 'allDocument', currentListDocument);
}

const removeDocumentToListFavoriteStore = (state, id) => {
    let currentListDocFavorite = state.listDocumentFavorite;

    let obj = currentListDocFavorite.find(data => data.id === id)
    var index = currentListDocFavorite.indexOf(obj);

    if (index > -1) {
        currentListDocFavorite.splice(index, 1);
    }
    Vue.set(state, 'listDocumentFavorite', currentListDocFavorite);
}


const removeDirToTableRootStore = (state, path) => {
    let currentListDataTableRoot = state.listDataTableRoot;
    let obj = currentListDataTableRoot.find(data => data.path === path)
    var index = currentListDataTableRoot.indexOf(obj);
    if (index > -1) {
        currentListDataTableRoot.splice(index, 1);
    }
    Vue.set(state, 'listDataTableRoot', currentListDataTableRoot);
}

const removeDocToListChildTableStore = (state, id) => {
    let currentListDataTableChildren = state.listDataTableChildren;

    let obj = currentListDataTableChildren.find(data => data.id === id)
    var index = currentListDataTableChildren.indexOf(obj);

    if (index > -1) {
        currentListDataTableChildren.splice(index, 1);
    }
    Vue.set(state, 'listDataTableChildren', currentListDataTableChildren);

}

const removeDirToListChildTableStore = (state, path) => {
    let currentListDataTableChildren = state.listDataTableChildren;

    let obj = currentListDataTableChildren.find(data => data.path === path)
    var index = currentListDataTableChildren.indexOf(obj);

    if (index > -1) {
        currentListDataTableChildren.splice(index, 1);
    }
    Vue.set(state, 'listDataTableChildren', currentListDataTableChildren);
}
const addDocumentToListFavoriteStore = (state, item) => {
    let currentListDocFavorite = state.listDocumentFavorite;
    currentListDocFavorite.unshift(item)
    Vue.set(state, 'listDocumentFavorite', currentListDocFavorite);
}
const updateStatusDocumentFavoriteStore = (state, id) => {
    let currentListDocument = state.allDocument;

    let obj = currentListDocument.find(data => data.id === id)
    var index = currentListDocument.indexOf(obj);

    if (index > -1) {
        if (currentListDocument[index].isFavorite == 1) {
            currentListDocument[index].isFavorite = 0;
        } else {
            currentListDocument[index].isFavorite = 1;
        }
    }
    Vue.set(state, 'allDocument', currentListDocument);
}
const MoveDocToTreeViewStore = (state, item) => {
    let currentListDocument = state.allDocument;

    let obj = currentListDocument.find(data => data.id === item.id)
    var index = currentListDocument.indexOf(obj);

    if (index > -1) {
        currentListDocument[index].parentPath = item.parentPath;
        currentListDocument[index].name = item.name;
    }
    Vue.set(state, 'allDocument', currentListDocument);
}
const MoveFolderToTreeViewStore = (state, item) => {
    let currentListDirectory = state.allDirectory;

    let obj = currentListDirectory.find(data => data.path === item.path)
    var index = currentListDirectory.indexOf(obj);

    if (index > -1) {
        currentListDirectory[index].name = item.name;
        currentListDirectory[index].parentPath = item.parentPath;
    }
    Vue.set(state, 'allDirectory', currentListDirectory);
}
const addToTableRootStore = (state, item) => {
    let currentlistDataTableRoot = state.listDataTableRoot;
    currentlistDataTableRoot.unshift(item)
    Vue.set(state, 'listDataTableRoot', currentlistDataTableRoot);
}
const addToTableChildStore = (state, item) => {
    let currentlistDataTableChild = state.listDataTableChildren;
    currentlistDataTableChild.unshift(item)
    Vue.set(state, 'listDataTableChildren', currentlistDataTableChild);
}
const addToListAttachStore = (state, item) => {
    let currentarrFileAttach = state.arrFileAttach;
    currentarrFileAttach.unshift(item)
    Vue.set(state, 'arrFileAttach', currentarrFileAttach);
}
const removeFileAttachToStore = (state, id) => {
    let currentArrFileAttach = state.arrFileAttach;
    let obj = currentArrFileAttach.find(data => data.id === id)
    var index = currentArrFileAttach.indexOf(obj);
    if (index > -1) {
        currentArrFileAttach.splice(index, 1);
    }
    Vue.set(state, 'arrFileAttach', currentArrFileAttach);
}

const removeListArrFileAttach = (state, id) => {
    let currentArrIdFileAttach = state.arrIdFileAttach;
    var index = currentArrIdFileAttach.indexOf(id);
    if (index > -1) {
        currentArrIdFileAttach.splice(index, 1);
    }
    Vue.set(state, 'arrIdFileAttach', currentArrIdFileAttach);
}
const resetData = (state, status) => {
    if (status) {
        Vue.set(state, 'header_slug', 1);
        Vue.set(state, 'statusEdit', true);
        Vue.set(state, 'statusRightBar', -1);
        Vue.set(state, 'currentDocument', '');
    }
}
const setFlagFirst = (state, item) => {
    Vue.set(state, 'flagFirst', item);
}

const setFlagErrEditor = (state, item) => {
    Vue.set(state, 'flagErrEditor', item);
}
export {
    changeSubCollapseSidebar,
    changeStatusRightBar,
    changeHeaderSlugKH,
    changeStatusEdit,
    setAllDiretory,
    setAllDocument,
    addToTreeViewStore,
    removeNodeToTreeViewStore,
    updateNodeToTreeViewStore,
    setDocumentFavorite,
    updateDocumentToTreeViewStore,
    removeDocumentToListFavoriteStore,
    addDocumentToListFavoriteStore,
    updateStatusDocumentFavoriteStore,
    addDocToTreeViewStore,
    removeDocToTreeViewStore,
    setListTableRoot,
    setListTableChildren,
    setLogDocument,
    setLogAll,
    setBackupDocument,
    changeStatusRestore,
    changeStatusBackup,
    changeStatusFormAddSizeTable,
    changeStatusHansonTable,
    setSizeTable,
    setHotData,
    MoveDocToTreeViewStore,
    MoveFolderToTreeViewStore,
    addToTableRootStore,
    removeDocToListChildTableStore,
    removeDirToListChildTableStore,
    addToTableChildStore,
    removeDirToTableRootStore,
    setDataTable,
    setIdTable,
    setCurrentDocument,
    setArrIdFileAttach,
    setArrFileAttach,
    addToListAttachStore,
    changeStatusShowImage,
    removeFileAttachToStore,
    removeListArrFileAttach,
    resetData,
    setFlagFirst,
    setFlagErrEditor,
};