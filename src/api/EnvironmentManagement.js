import Api from "./api";
import { appConfigs } from "./../configs.js";

var api = new Api(appConfigs.apiDomain.environmentManagement)
export const documentServiceApi = {
    getAllEnvironment() {
        return api.get('enviromments');
    }
};