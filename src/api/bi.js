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
	},
	getAllDataset(){
		return api.get('datasets/get-list?page=1&pageSize=1000')
	},
	getDatasetColumn(datasetId){
		return api.get('datasets/' + datasetId + '/columns')
	},
	getRelationsConfigs(id){
		return api.get('relations/' + id + '/get_configs/')
	},
	saveRelations(data){
		return api.post('relations', data , {}, {contentType: 'application/json'})
	}
	
};