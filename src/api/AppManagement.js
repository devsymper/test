import Api from "./api";
import {
	appConfigs
} from "./../configs.js";


var coreApi = new Api(appConfigs.apiDomain.appManagement);
// var formulasApi = new Api(appConfigs.apiDomain.formulasService)
export const appManagementApi = {
	addApp(data) {
		return coreApi.post("application", data);
	},
	deleteApp(id) {
		return coreApi.delete('application/' + id)
	},
	getAppDetails(id) {
		return coreApi.get('application/' + id)
	},
	getActiveApp() {
		return coreApi.get('application-active')
	},
	updateApp(data) {
		return coreApi.put("application", data)
	},
	addFavoriteItem(userId, objectIdentifier, objectType) {
		return coreApi.post('app-item-favorite', {
			userId: userId,
			objectIdentifier: objectIdentifier,
			objectType: objectType
		})
	},
	getItemFavorite(userId) {
		return coreApi.get('app-item-favorite/' + userId)
	}

};