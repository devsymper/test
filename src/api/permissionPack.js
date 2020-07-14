import Api from "./api";
import { appConfigs } from "../configs.js";
import { util } from "../plugins/util";

var moduleApi = new Api(appConfigs.apiDomain.permission);
export const permissionApi = {
    getAllPermission() {
        return moduleApi.get("permission_packs");
    },
    getPermissionOfRole(roleId) {
        return moduleApi.get("roles/" + roleId + "/permissions");
    },
};