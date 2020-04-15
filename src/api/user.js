import Api from "./api";
import { appConfigs } from "./../configs.js";
console.log(appConfigs);

var api = new Api(appConfigs.apiDomain.user);
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
    setUserLocale(locale) {
        return api.post("user/locale", { locale: locale });
    }
};