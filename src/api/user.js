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
        return api.post(appConfigs.apiDomain.account + "auth/login", data);
    },
    getListUser(page, pageSize) {
        return coreApi.get("users?page=" + page + "&pageSize=" + pageSize);
    },
    getGroupUser() {
        return coreApi.get("user-group");
    },
    addUser(data) {
        return coreApi.post('user', data);
    },

    updateUser(data) {
        return coreApi.put('user', data);
    },
    getDetailUser(id) {
        return coreApi.get("user/detail/" + id);
    },
    getListUserPackage(id) {
        return coreApi.get('user/permission/package/' + id);
    },
    getListUserPosition(id) {
        return coreApi.get('user/permission/position-orgchart/' + id);
    },
    deleteUserPackage(data) {
        return coreApi.delete('user/permission/package', data);
    },
    deleteUserPosition(data) {
        return coreApi.delete('user/permission/position-orgchart', data);
    },
    uploadAvatar(data) {
        return coreApi.post('https://kh.symper.vn/publicapi/uploadFile/', data, {}, {
            cache: false,
            contentType: false,
            processData: false
        });
    },
    setUserLocale(locale) {
        return api.post("user/locale", { locale: locale });
    },
    saveUserViewConfig(configType, viewName, configs) {
        return coreApi.put('https://v2khadm.dev.symper.vn/user/view-configs', {
            configType: configType,
            viewName: viewName,
            configs: configs,
        });
    },
    getUserViewConfig(viewName, configType) {
        return coreApi.get(`https://v2khadm.dev.symper.vn/user/view-configs/${viewName}/${configType}`);
    }
};