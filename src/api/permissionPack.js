import Api from "./api";
import { appConfigs } from "../configs.js";
import { util } from "../plugins/util";

var permissionModuleApi = new Api(appConfigs.apiDomain.permission);
var actionModuleApi = new Api(appConfigs.apiDomain.actionPacks);
var permissionPackApi = new Api(appConfigs.apiDomain.permissionPacks);
var operationPackApi = new Api(appConfigs.apiDomain.operations);

export const permissionApi = {
    createPermission(data) {
        data.status = 1;
        return permissionPackApi.post("", data);
    },

    updatePermission(id, data) {
        data.status = 1;
        return permissionPackApi.put(id, data);
    },

    getAllPermission() {
        return permissionPackApi.get("");
    },
    getPermissionOfRole(roleId) {
        return permissionModuleApi.get("roles/" + roleId + "/permissions");
    },

    deletePermissionPack(idPacks) {
        if ($.isArray(idPacks)) {
            idPacks = idPacks.join(',');
        }
        return permissionPackApi.delete('', idPacks);
    },
    getActionPackOfPermission(permissionId) {
        return permissionPackApi.get(permissionId + '/action_packs');
    },
    getAllActionPack() {
        return actionModuleApi.get("");
    },
    deleteActionPack(idPacks) {
        if ($.isArray(idPacks)) {
            idPacks = idPacks.join(',');
        }
        return actionModuleApi.delete('', idPacks);
    },

    createOperation(data) {
        return operationPackApi.post(data);
    },

    getOperationOfActionPack(actionId) {
        return operationPackApi.get('/' + actionId + '/operations');
    }
};