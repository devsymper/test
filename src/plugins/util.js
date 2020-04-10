import { authUtil } from './utilModules/auth';
import { others } from './utilModules/others';

let cloneDeep = require("lodash.clonedeep");
export const util = Object.assign(others, {
    cloneDeep: cloneDeep,
    auth: authUtil
});
