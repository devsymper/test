import Api from "./api";
import { appConfigs } from "./../configs.js";
import { util } from "../plugins/util";

var coreApi = new Api(appConfigs.apiDomain.user);
var permissionApi = new Api(appConfigs.apiDomain.permission);
var operationsApi = new Api(appConfigs.apiDomain.operations);
var systemRoleApi = new Api(appConfigs.apiDomain.systemRole);
export const userApi = {
    /** 
     * Kiểm tra username và password của user
     */
    login(userName, password) {
        let data = {
            email: userName,
            password: password
        };
        return coreApi.post(appConfigs.apiDomain.account + "auth/login", data);
    },
    changePassUser(oldPass, newPass) {
        let data = {
            oldPassword: oldPass,
            newPassword: newPass
        };
        return coreApi.post('user/change-password', data)
    },
    getListUser(page, pageSize) {
        return coreApi.get("users?page=" + page + "&pageSize=" + pageSize);
    },
    getGroupUser() {
        return coreApi.get("user-group");
    },
    addUser(data) {
        return coreApi.post('users', data);
    },
    changeUserProfile(data) {
        return coreApi.put('user/profile', data)
    },
    updateUser(id, data) {
        return coreApi.put('users/' + id, data);
    },
    getDetailUser(id) {
        return coreApi.get("users/" + id);
    },
    getListUserPackage(id) {
        return coreApi.get('users/permission/package/' + id);
    },
    getListUserPosition(id) {
        return coreApi.get('users/permission/position-orgchart/' + id);
    },
    deleteUserPackage(data) {
        return coreApi.delete('users/permission/package', data);
    },
    deleteUserPosition(data) {
        return coreApi.delete('users/permission/position-orgchart', data);
    },
    setUserLocale(locale) {
        return coreApi.post("users/locale", { locale: locale });
    },
    changeDelegate(userInfo) {
        return coreApi.post('auth/change-delegate', { user_id: userInfo.id })
    },
    changeRole(roleId) {
        return coreApi.post('auth/set-role', {
            role: roleId
        });
    },

    createBAAccount(data) {
        return coreApi.post('supporters', data);
    },

    updateBAAccountInfo(id, data) {
        return coreApi.put('supporters/' + id, data);
    },

    deleteBAAccount(ids) {
        let deleteArr = [];
        ids.forEach(id => {
            deleteArr.push(coreApi.delete('supporters/' + id));
        });
        return Promise.all(deleteArr);
    },

    updateBAAccountPassword(id, data) {
        return coreApi.put('supporters/' + id + '/password', data);
    },

    // Lấy các operation của user ở role hiện tại
    getCurrentRoleOperations() {
        let roleIden = util.auth.getCurrentUserRole();
        return api.get(permissionApi + `roles/${roleIden}/accesscontrol`);
    },
    getActionAndObject(role) {
        return permissionApi.get('roles/' + role + '/accesscontrol')
    },
    getOperationsObject(data) {
        return operationsApi.post('objects', data);
    },
    getAllListObj() {
        return operationsApi.get('/actions')
    },
    getListSystemRole() {
        return systemRoleApi.get('/role')
    },
    updateRole(data) {
        return systemRoleApi.put('/set-users-to-roles', data)
    },

};