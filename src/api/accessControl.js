import Api from "./api";
import { appConfigs } from "./../configs.js";

var api = new Api(appConfigs.apiDomain.permission);
var appApi = new Api(appConfigs.apiDomain.appManagement);
export const accessControlApi = {
    getAllTypeAction() {
        return api.get("operations/actions");
	},
	getAllApp(){
		return appApi.get('application')
	}
	
}