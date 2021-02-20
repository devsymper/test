import Api from "./api";
import { appConfigs } from "./../configs.js";

let api = new Api(appConfigs.apiDomain.biService);

export const datasetApi = {
    getListByFilter(filter){
        return api.get(`${appConfigs.apiDomain.biService}datasets/get-list`, filter);
    }
}