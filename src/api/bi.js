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
	},
	getListRelations(searchKey, pageSize = 1000){
		let searchParam = searchKey != "" ? 'search='+searchKey+"&" : ""
		return api.get('relations?' + searchParam + 'page=1&pageSize='+ pageSize)
	},
	getDatasetColumn(id){
		return api.get('datasets/' + id + '/columns')
	},
	getDetailDataflowWithDatasetIds(strDatasetIds){
        return api.get("dataflow/nodes/datasets-inside/"+strDatasetIds);
	},
	
};