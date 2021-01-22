import Api from "./api";
import { appConfigs } from "./../configs.js";

let api = new Api(appConfigs.apiDomain.biService);

export const biApi = {
    getAllDataFlow() {
        return api.get("dataflow");
    },
    getColumnWithDatasetIds(strDatasetIds){
        return api.get("datasets/"+strDatasetIds+"/columns");
	},
	searchDataset(value){
		return api.get('datasets/get-list?search=' + value)
	}
	
};