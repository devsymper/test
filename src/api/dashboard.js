import Api from "./api";
import {
	appConfigs
} from "./../configs.js";
import { util } from "../plugins/util";

let api = new Api(appConfigs.apiDomain.biService);

export const dashboardApi = {
	getAllDashboard() {
		return api.get("/report-and-dashboard/root/falses");
	},
	// searchDashboard(filter) {
	// 	return api.get("/root/falses", filter);
	// },
	// getDashboards(filter) {
	// 	return api.get('dashboards', filter)
	// }
	getDashboards(filter) {
		return api.get(appConfigs.apiDomain.dashboard, filter)
	},
	getDashboardsApp(filter) {
		return api.get(appConfigs.apiDomain.biService+'dashboards', filter)
	},
	getDashboardInfo(id){
		return api.get(appConfigs.apiDomain.biService+'dashboards/' + id);
	},
	getData(options){
		return api.post(`${appConfigs.apiDomain.biService}report-get-data`, options, {}, {contentType: 'application/json'});
	},
	createDashboard(data){
		return api.post('dashboards', JSON.stringify(data));
	},
	updateDashboard(id, data){
		return api.put('dashboards/' + id, JSON.stringify(data), {
			"Content-Type": "application/json"
		});
	},
};