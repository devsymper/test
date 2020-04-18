import { authUtil } from './utilModules/auth';
import { store } from './utilModules/store';
import { cookie } from "./utilModules/cookie.js";
import { serviceWorker } from "./utilModules/serviceWorker.js";


let cloneDeep = require("lodash.clonedeep");
export const util = Object.assign(store, {
    cloneDeep: cloneDeep,
    auth: authUtil,
    cookie: cookie,
    serviceWorker: serviceWorker
});