import Api from "./api";
import { appConfigs } from "./../configs.js";

let api = new Api(appConfigs.apiDomain.dashboard);

export const dashboardApi = {
    getAllDashboard() {
        return api.get("/root/falses");
    }
};