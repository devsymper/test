import { knowledgeApi } from "./../../api/kh.js";
import { SYMPER_APP } from "./../../main.js";

const getAllDirectory = async(context) => {

    try {
        let res = await knowledgeApi.getAllDirectory();
        if (res.status == 200) {
            context.commit('setAllDiretory', res.data.listObject);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get all folder!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get all folder!");
    }
}

const getAllDocument = async(context) => {
    try {
        let res = await knowledgeApi.getAllDocument();
        if (res.status == 200) {
            context.commit('setAllDocument', res.data.listObject);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get all document!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get all document!");
    }
}

const getDocumentFavorite = async(context) => {
    try {
        let res = await knowledgeApi.getDocFavorite();
        if (res.status == 200) {
            context.commit('setDocumentFavorite', res.data.listObject);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get all document favorite!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get all document favorite!");
    }
}

const getListTableRoot = async(context) => {
    try {
        let res = await knowledgeApi.getDirectoryRoot();
        if (res.status == 200) {
            context.commit('setListTableRoot', res.data.listObject);
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get all folder root!");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get all folder root!");
    }
}

const getDirectoryChildren = async(context, hash) => {
    if (hash != undefined) {
        try {
            let res = await knowledgeApi.getDirectoryChildren(hash);
            if (res.status == 200) {

                context.commit('setListTableChildren', res.data.listObject);
            } else if (res.status == 201) {} else {
                SYMPER_APP.$snotifyError(error, "Can not get list table !");
            }
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get list table !");
        }
    }

}

const getLogDocument = async(context, hash) => {
    try {
        let res = await knowledgeApi.getLogDocument(hash);
        if (res.status == 200) {
            if (res.data != null) {
                context.commit('setLogDocument', res.data.listObject);

            }
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get log document !");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get log document !");
    }
}
const getLogAll = async(context) => {
    try {
        let res = await knowledgeApi.getLogAll();
        if (res.status == 200) {
            if (res.data != null) {
                context.commit('setLogAll', res.data.listObject);
            }
        } else if (res.status == 403) {
            SYMPER_APP.$snotifyError("Error", res.message + ' get all log');
        } else {
            SYMPER_APP.$snotifyError(error, "Can not get log !");
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get log !");
    }
}

const getBackupDocument = async(context, hash) => {
    try {
        let res = await knowledgeApi.getBackupDocument(hash);
        if (res.status == 200) {
            if (res.data != null) {
                context.commit('setBackupDocument', res.data.listObject);
            }
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get backup document !");
    }
}
const getFileAttachment = async(context, hash) => {
    try {
        let res = await knowledgeApi.getListFileDocument(hash);
        if (res.status == 200) {
            if (res.data != null) {
                context.commit('setArrIdFileAttach', res.data);

            }
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get file attachment document !");
    }
}
const getArrFileAttachment = async(context, data) => {
    try {
        let res = await knowledgeApi.getFileByList(data);
        if (res.status == 200) {
            if (res.data != null) {
                context.commit('setArrFileAttach', res.data);
            }
        } else {
            context.commit('setArrFileAttach', []);
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get list file attachment document !");
    }
}
const addToTreeViewStore = async(context, item) => {
    context.commit('addToTreeViewStore', item);
}

const addDocToTreeViewStore = async(context, item) => {
    context.commit('addDocToTreeViewStore', item);
}
const removeNodeToTreeViewStore = async(context, item) => {
    context.commit('removeNodeToTreeViewStore', item);
}

const removeDocToTreeViewStore = async(context, item) => {
    context.commit('removeDocToTreeViewStore', item);
}

const updateNodeToTreeViewStore = async(context, item) => {
    context.commit('updateNodeToTreeViewStore', item);
}

const updateDocumentToTreeViewStore = async(context, item) => {
    context.commit('updateDocumentToTreeViewStore', item);
}

const removeDocumentToListFavoriteStore = async(context, id) => {
    context.commit('removeDocumentToListFavoriteStore', id);
}

const addDocumentToListFavoriteStore = async(context, item) => {
    context.commit('addDocumentToListFavoriteStore', item);
}

const updateStatusDocumentFavoriteStore = async(context, id) => {
    context.commit('updateStatusDocumentFavoriteStore', id);
}

const MoveDocToTreeViewStore = async(context, item) => {
    context.commit('MoveDocToTreeViewStore', item);
}

const MoveFolderToTreeViewStore = async(context, item) => {
    context.commit('MoveFolderToTreeViewStore', item);
}

const addToTableRootStore = async(context, item) => {
    context.commit('addToTableRootStore', item);
}
const removeDirToTableRootStore = async(context, item) => {
    context.commit('removeDirToTableRootStore', item);
}
const addToTableChildStore = async(context, item) => {
    context.commit('addToTableChildStore', item);
}

const removeDocToListChildTableStore = async(context, item) => {
    context.commit('removeDocToListChildTableStore', item);
}
const removeDirToListChildTableStore = async(context, item) => {
    context.commit('removeDirToListChildTableStore', item);
}
const addToListAttachStore = async(context, item) => {
    context.commit('addToListAttachStore', item);
}
const removeFileAttachToStore = async(context, id) => {
    context.commit('removeFileAttachToStore', id);
}
const removeListArrFileAttach = async(context, id) => {
    context.commit('removeListArrFileAttach', id);
}
export {
    getAllDirectory,
    getAllDocument,
    addToTreeViewStore,
    removeNodeToTreeViewStore,
    updateNodeToTreeViewStore,
    getDocumentFavorite,
    updateDocumentToTreeViewStore,
    removeDocumentToListFavoriteStore,
    addDocumentToListFavoriteStore,
    updateStatusDocumentFavoriteStore,
    addDocToTreeViewStore,
    removeDocToTreeViewStore,
    getListTableRoot,
    getDirectoryChildren,
    getLogDocument,
    getLogAll,
    getBackupDocument,
    MoveDocToTreeViewStore,
    MoveFolderToTreeViewStore,
    addToTableRootStore,
    removeDocToListChildTableStore,
    removeDirToListChildTableStore,
    removeDirToTableRootStore,
    addToTableChildStore,
    getFileAttachment,
    getArrFileAttachment,
    addToListAttachStore,
    removeFileAttachToStore,
    removeListArrFileAttach,
};