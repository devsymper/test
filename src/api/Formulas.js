import Api from "./api";
import { appConfigs } from "./../configs.js";

var api = new Api(appConfigs.apiDomain.formulasService)
export const formulasApi = {

    saveMultiFormulas(data) {
        return api.post('formulas/batch', data);
    },
    saveFormulas(data) {
        return api.post('formulas', data);
    },
    execute(data) {
        return api.post('formulas/get-data', data);
    }
};