import Api from "./api";
import {
	appConfigs
} from "./../configs.js";


var coreApi = new Api(appConfigs.apiDomain.appManagement);
var accessControlApi = new Api(appConfigs.apiDomain.operations);
let trashApi = new Api(appConfigs.apiDomain.trash);
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
	addFavoriteItem(userId, objectIdentifier, objectType, action, appId) {
		return coreApi.post('app-item-favorite', {
			userId: userId,
			objectIdentifier: objectIdentifier,
			objectType: objectType,
			action: action,
			appId: appId
		})
	},
	getItemFavorite(userId) {
		return coreApi.get('app-item-favorite/' + userId)
	},
	getAppDetailBa(id) {
		return coreApi.get('application-ba/' + id)
	},
	getListObjectIdentifier(data){
		return accessControlApi.post('objects',data)
	},
	restore(id){
		return coreApi.put('application/restore',{id: id})
	},
	deleteTrashItem(id){
        return trashApi.delete('items/object/application_definition:'+id)
    },
};