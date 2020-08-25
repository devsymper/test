import Api from './api';
import {
	appConfigs
} from './../configs.js';

var coreApi = new Api(appConfigs.apiDomain.commnent);
export const commentApi = {
	getCommentById(objType, objId) {
		return coreApi.get('comment/' + objType + '/' + objId);
	},
	getCommentByUuid(objType, objId, uuid) {
		return coreApi.get('comment-uuid/' + objType + '/' + objId + '/' + uuid);
	},
	deleteComment(id) {
		return coreApi.delete('comment/' + id);
	},
	changeStatus(id) {
		return coreApi.put('comment-status/' + id)
	},
	addComment(data) {
		return coreApi.post('comment', data)
	},
	editComment(data) {
		return coreApi.put('comment', data)
	},
};