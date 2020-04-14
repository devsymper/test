import Api from "./api";
import { appConfigs } from "./../configs.js";

var coreApi = new Api(appConfigs.apiDomain.core);
export const orgChartApi = {

    getAllOrgChart() {
        return coreApi.get("org-charts");
    },
    getDetailOrgChart(id) {
        return coreApi.get("org-charts/" + id);
    },
    getAllNodes() {
        return coreApi.get("org-charts/nodes");
    }

};