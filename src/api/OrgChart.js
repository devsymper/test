import Api from "./api";
import { appConfigs } from "./../configs.js";

let orgchart = new Api(appConfigs.apiDomain.orgchart);
let coreApi = new Api(appConfigs.apiDomain.core);

export const orgchartApi = {

    getAllOrgChart() {
        return coreApi.get("org-charts");
    },
    getDetailOrgChart(id) {
        return coreApi.get("org-charts/" + id);
    },
    getAllNodes() {
        return coreApi.get("org-charts/nodes");
    },


    getOrgchartList() {
        return orgchart.get('orgchart');
    },

    getOrgchartDetail(id) {
        return orgchart.get('orgchart/' + id);
    },

    deleteOrgcharts(ids) {
        ids = ids.join(',');
        return orgchart.delete('orgchart/' + ids);
    },

    createOrgchart(data) {
        return orgchart.post('orgchart', data);
    },
};