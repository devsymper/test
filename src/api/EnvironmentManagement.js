import Api from "./api";
import { appConfigs } from "./../configs.js";

var api = new Api(appConfigs.apiDomain.environmentManagement)
export const environmentManagementApi = {
    getAllEnvironment() {
        return api.get('enviromments');
	},
	getEnvServiceInstance(envId){
		return api.post('instances/query', {
			environmentId: envId
		})
	}
};