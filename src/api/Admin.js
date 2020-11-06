import Api from "./api";
import { appConfigs } from "./../configs.js";

var bpmneApi = new Api(appConfigs.apiDomain.bpmne.models);
let testHeader = {
    Authorization: 'Basic cmVzdC1hZG1pbjp0ZXN0',
    "Content-Type": "application/json",
};
export const adminApi = {
    getLatestWD(key) {
        return bpmneApi.get(appConfigs.apiDomain.bpmne.definitions, {key:key, latest:true}, testHeader);
    },
}