import { util } from "./../plugins/util.js";

export const routeMiddleware = {
    common: {
        checkLogin(to, from, next) {
            const noNeedTokenPages = {
                login: true,
                pageNotFound: true
            };
            if (noNeedTokenPages.hasOwnProperty(to.name) || util.auth.getToken()) {
                next();
            } else { 
                next({name:'login'});
            }
        }
    }
}