import Api from "./api";
import { appConfigs } from "./../configs.js";
console.log(appConfigs);

var api = new Api(appConfigs.apiDomain.user);
var coreApi = new Api(appConfigs.apiDomain.core);
export const userApi = {
    /** 
     * Kiểm tra username và password của user
     */
    login(userName, password) {
        let data = {
            email: userName,
            password: password
        };
        return api.post("login", data);
    },
    getListUser() {
        return coreApi.get("users");
    },
    getGroupUser() {
        return coreApi.get("user-group");
    },
    addUser(data) {
        return coreApi.post('user', data);
    },
    getDetailUser(id) {
        return coreApi.get("user/detail/" + id);
    }
};