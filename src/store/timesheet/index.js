import * as mutations from "./mutations";
import * as getters from './getters';
import defaultState from "./defaultState";

export default {
    namespaced: true,
    state: defaultState,
    mutations,
    getters,
};