import Api from './api';
import {
	appConfigs
} from './../configs.js';

var coreApi = new Api(appConfigs.apiDomain.fileManagement);
export const fileManagementApi = {
	getFileByList(ids) {
		return coreApi.get('getFileByList', {
			ids: ids
		})
	}
};