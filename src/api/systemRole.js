import Api from "./api";
import { appConfigs } from "./../configs.js";

var moduleApi = new Api(appConfigs.apiDomain.systemRole);
export const systemRoleApi = {
    create(data) {
        return moduleApi.post("system-role", data);
    },
    update(id, data) {
        return moduleApi.put('system-role/' + id, data);
    },
    detail(id) {
        return moduleApi.get('system-role/' + id);
    },
    delete(ids) {
        if (typeof ids != 'string') {
            ids = ids.join(',');
        }
        return moduleApi.delete('system-role/' + ids);
    },
};