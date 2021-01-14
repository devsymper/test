import Api from "./api";
import { appConfigs } from "./../configs.js";

let api = new Api(appConfigs.apiDomain.biService);

export const biApi = {
    getAllDataFlow() {
        return api.get("dataflow");
	},
	
};