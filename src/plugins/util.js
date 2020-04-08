import { authUtil } from './utilModules/auth';

let cloneDeep = require("lodash.clonedeep");
export const util = {
    cloneDeep: cloneDeep,
    auth: authUtil
};
