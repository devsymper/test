import Api from "./api";
import { appConfigs } from "./../configs.js";

var api = new Api(appConfigs.apiDomain.formulasService)
export const formulasApi = {

    saveMultiFormulas(data) {
        return api.post('formulas/batch', data);
    },
    updateMultiFormulas(data) {
        return api.put('formulas/batch', data);
    },
    saveFormulas(data) {
        return api.post('formulas', data);
    },
    execute(data) {
        return api.post('formulas/get-data', data);
    },
    getRelated(data) {
        return api.post('formulas/query-related', data);
    }
};