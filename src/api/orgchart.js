import Api from "./api";
import {
    appConfigs
} from "./../configs.js";

let orgchart = new Api(appConfigs.apiDomain.orgchart);
let coreApi = new Api(appConfigs.apiDomain.core);
import Vue from "vue";


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
    getOrgchartList(filter) {
        // filter = {
        // 	search: 'dsdsd',
        // 	pageSize:50,
        // filter: [
        // 	{
        // 		column: 'id',
        // 		valueFilter: {
        // 			operation: 'IN',
        // 			values: [1,5,5,3]						
        // 		}
        // 	}
        // ]
        // };
        return orgchart.get('orgchart', filter);
    },

    getOrgchartDetail(id) {
        return orgchart.get('orgchart/' + id);
    },

    deleteOrgcharts(ids) {
        ids = ids.join(',');
        return orgchart.delete('orgchart/' + ids);
    },

    updateOrgchart(id, data) {
        return orgchart.put('orgchart/' + id, data);
    },

    createOrgchart(data) {
        return orgchart.post('orgchart', data);
    },

    createNodeStyle(data) {
        return orgchart.post('node-style', data);
    },
    getListNodeStyle() {
        return orgchart.get('node-style');
    },
    deleteNodeStyle(ids) {
        return orgchart.delete('node-style/' + ids);
    },
    getRolesByUser(queryData) {
        let queryParam = {
            items: queryData
        };
        return orgchart.post('orgchart-role/query/roles-by-users', queryParam);
    },
    getAllNodes() {
        return orgchart.get("orgchart/nodes");
    },
    queryOrgchart(data) {
        return orgchart.post("orgchart/query", data);
    }
};