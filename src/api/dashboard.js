import Api from "./api";
import {
	appConfigs
} from "./../configs.js";

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
		return api.get('https://bi-service.symper.vn/dashboards', filter)
	}

};