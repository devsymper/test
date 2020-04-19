import { authUtil } from './utilModules/auth';
import { store } from './utilModules/store';
import { cookie } from "./utilModules/cookie.js";
import { serviceWorker } from "./utilModules/serviceWorker.js";


let cloneDeep = require("lodash.clonedeep");
/**
 * Các hàm trong store sẽ được đưa ra ngoài cùng của cây phân cấp.
 */
export const util = Object.assign(store, {
    cloneDeep: cloneDeep,
    auth: authUtil,
    cookie: cookie,
    serviceWorker: serviceWorker
});