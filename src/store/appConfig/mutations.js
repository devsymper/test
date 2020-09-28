import {
	getIconFromType
} from '../../components/document/controlPropsFactory.js';
import {
	defaultState
} from "./defaultState";
import {
	util
} from "../../plugins/util.js";

import Vue from "vue";
import {
	type
} from 'jquery';
const updateListItemSelected = (state, data) => {
	let listItem = state.listItemSelected[data.type].item;
	let check = false
	listItem.forEach(function (e) {
		if (e.id == data.obj.id) {
			check = true
			listItem.splice(listItem.indexOf(e), 1)
		}
	});
	if (check == false) {
		listItem.push(data.obj)
	}
}
const removeItemSelected = (state, data) => {
	state.listItemSelected[data.type].item.splice(state.listItemSelected[data.type].item.indexOf(data.item), 1);
}
const emptyItemSelected = (state) => {
	state.listItemSelected = {
		document_category: {
			icon: 'mdi-file-document-outline',
			title: "apps.listType.documentCategory",
			name: 'document_category',
			item: [

			]
		},
		document_major: {
			icon: 'mdi-file-edit-outline',
			title: "apps.listType.documentMajor",
			name: 'document_major',
			item: []
		},
		orgchart: {
			icon: 'mdi-widgets-outline',
			title: "apps.listType.orgchart",
			name: 'orgchart',
			item: []
		},
		dashboard: {
			icon: 'mdi-view-dashboard',
			title: "apps.listType.dashboard",
			name: 'dashboard',
			item: []
		},
		workflow_definition: {
			icon: 'mdi-lan',
			title: "apps.listType.workflow",
			name: 'workflow_definition',
			item: []
		},
	}
}
const updateChildrenApps = (state, data) => {
	state.listItemSelected[data.type].item = data.obj
}
const updateListFavorite = (state, data) => {
	Vue.set(state, 'listFavorite', data)
}
const insertFavorite = (state, data) => {
	state.listFavorite.push(data)
}
const delFavorite = (state, data) => {
	state.listFavorite.forEach(function (e) {
		if (e.id === data.id && e.type === data.type) {
			state.listFavorite.splice(state.listFavorite.indexOf(e), 1)
		}
	})
}
const changeTypeView = (state) => {
	state.viewSideBySide = !state.viewSideBySide
}
const updateCurrentAppId = (state, data) => {
	state.currentAppId = data
}

const updateActionDef = (state, data) => {
	Vue.set(state, 'actionDef', data)
}
const updateParam = (state, data) => {
	Vue.set(state, 'param', data)
}
const showDetailAppArea = (state) => {
	Vue.set(state, 'showDetailArea', true)
}
const setListApps = (state, data) => {
	Vue.set(state, "listApps", data);
}
const updateFavoriteMyAppItem = (state, data) => {
	let items = state.listApps[data.appId].childrenAppReduce[state.selectingItemType].item;
	for (let e of items) {
		if (e.objectIdentifier == data.itemId) {
			e.favorite = data.value;
			break;
		}
	}
	// state.listApps[data.appId].childrenAppReduce[state.selectingItemType].item.forEach(function(e){
	//     if(e.objectIdentifier == data.itemId){
	//         Vue.set(e, "favorite" , data.value)
	//         debugger
	//         // e.favorite = data.value
	//         // Vue.set(e)
	//     }
	// })

}
const updateSelectingItemType = (state, data) => {
	state.selectingItemType = data
}
export {
	updateListItemSelected,
	removeItemSelected,
	emptyItemSelected,
	updateChildrenApps,
	updateListFavorite,
	insertFavorite,
	delFavorite,
	changeTypeView,
	updateCurrentAppId,
	updateActionDef,
	updateParam,
	showDetailAppArea,
	setListApps,
	updateFavoriteMyAppItem,
	updateSelectingItemType
};