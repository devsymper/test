import Api from "./api";
import {
	appConfigs
} from "./../configs.js";
import { util } from "../plugins/util";

let api = new Api(appConfigs.apiDomain.dashboard);

export const dashboardApi = {
	getAllDashboard() {
		return api.get("/root/falses");
	},
	// searchDashboard(filter) {
	// 	return api.get("/root/falses", filter);
	// },
	// getDashboards(filter) {
	// 	return api.get('dashboards', filter)
	// }
	getDashboards(filter) {
		let url = util.addEnvToUrl('https://bi-service.symper.vn/dashboards');
		return api.get(url, filter)
	}

};