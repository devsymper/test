import Api from "./api";
import {
	appConfigs
} from "./../configs.js";
import { util } from "../plugins/util";

let api = new Api(appConfigs.apiDomain.biService);

export const dataflowApi = {
	getInfo(id) {
		return api.get(`dataflow/${id}/get_info`);
	},
	createDataflow(config) {
		return api.post('');
	},
	updateDataflow(id, config) {
		return api.put('');
	},
};