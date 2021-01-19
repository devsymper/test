import Api from "./api";
import { appConfigs } from "./../configs.js";

let api = new Api(appConfigs.apiDomain.biService);

export const datasetApi = {
    getListByFilter(filter){
        filter = new URLSearchParams(filter);
        let url = `${biUrl}datasets/get-list?${filter}`;
        return api.get(url);
    }
}