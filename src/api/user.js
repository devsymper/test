import Api from "./api";
import { appConfigs } from "./../configs.js";

var api = new Api(appConfigs.apiDomain.user);
var coreApi = new Api(appConfigs.apiDomain.user);
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
        return api.get("users?page=" + page + "&pageSize=" + pageSize);
    },
    getGroupUser() {
        return api.get("user-group");
    },
    addUser(data) {
        return api.post('users', data);
    },

    updateUser(data) {
        return api.put('users', data);
    },
    getDetailUser(id) {
        return api.get("users/" + id);
    },
    getListUserPackage(id) {
        return api.get('users/permission/package/' + id);
    },
    getListUserPosition(id) {
        return api.get('users/permission/position-orgchart/' + id);
    },
    deleteUserPackage(data) {
        return api.delete('users/permission/package', data);
    },
    deleteUserPosition(data) {
        return api.delete('users/permission/position-orgchart', data);
    },
    uploadAvatar(data) {
        return coreApi.post('https://kh.symper.vn/publicapi/uploadFile/', data, {}, {
            cache: false,
            contentType: false,
            processData: false
        });
    },
    setUserLocale(locale) {
        return api.post("users/locale", { locale: locale });
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
    },
    changeDelegate(userInfo) {
        return api.post('auth/change-delegate', { user_id: userInfo.id })
    },
    changeRole(roleId) {
        return api.post('auth/set-role', {
            role: roleId
        });
    }
};