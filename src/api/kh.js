import Api from "./api";
import { appConfigs } from "./../configs.js";
let knowledge = new Api(appConfigs.apiDomain.knowledge);
let fileManagement = new Api(appConfigs.apiDomain.fileManagement);
export const knowledgeApi = {

    getAllDirectory() {
        return knowledge.get("directory");
    },
    addDirectory(data) {
        return knowledge.post('directory', data);
    },
    deleteDirectory(path) {
        return knowledge.delete('directory/' + path);
    },
    updateDirectory(data) {
        return knowledge.put('directory', data);
    },
    renameDirectory(data) {
        return knowledge.put('directory-rename', data);

    },
    /////////////
    getAllDocument() {
        return knowledge.get("document");
    },
    getDetailDocument(hash) {
        return knowledge.get("document/" + hash);
    },
    addDocument(data) {
        return knowledge.post("document", data);
    },
    getDocFavorite() {
        return knowledge.get("document-favorite");
    },
    updateDocFavorite(id) {
        return knowledge.put("document-favorite/" + id);
    },
    updateDocument(data) {
        return knowledge.put('document', data);
    },
    deleteDocument(id) {
        return knowledge.delete('document/' + id);

    },
    renameDocument(data) {
        return knowledge.put('document-rename', data);

    },
    /////
    getDirectoryRoot() {
        return knowledge.get("directory-table");
    },
    getDirectoryChildren(hash) {
        return knowledge.get("directory-table/" + hash);
    },

    ////
    getLogAll() {
        return knowledge.get("log");
    },
    getLogDocument(hash) {
        return knowledge.get("log/" + hash);
    },
    /// get slug
    getSlug(hash) {
        return knowledge.get("get-slug/" + hash);
    },
    getBackupDocument(hash) {
        return knowledge.get("backup/" + hash);
    },
    addBackupDocument(data) {
        return knowledge.post("backup", data);
    },
    restoreDocumentBackup(id) {
        return knowledge.put("backup/" + id);
    },
    getDocuQuickAccess() {
        return knowledge.get("document-quickaccess");

    },
    moveItemToDirectory(data) {
        return knowledge.put("directory-move", data);
    },
    // upload file
    uploadFileDocument(data) {
        return knowledge.post("upload", data);
    },
    getListFileDocument(hash) {
        return knowledge.get("upload/" + hash);
    },
    removeFileAttach(data) {
        return fileManagement.put('changeStatusSymperFile', data);
    },
    downloadFile(id) {
        window.open(appConfigs.apiDomain.fileManagement+'downloadS/' + id, '_blank');
    },
    renameFile(data) {
        return fileManagement.put('renameFile', data);
    },
    getFileByList(data) {
        return fileManagement.get('getFileByObjectIdentifier', { objectIdentifier: data.objectIdentifier, objectType: data.objectType });
    },

}