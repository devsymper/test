import {
	getIconFromType
} from './../../components/document/controlPropsFactory.js';
import {
	defaultState
} from "./defaultState";
import {
	util
} from "./../../plugins/util.js";

import Vue from "vue";
import {
	type
} from 'jquery';
const updateListItemSelected = (state, data) => {
	// Vue.set(state, 'listItemSelected', data);
	let listItem = state.listItemSelected[data.type].item;
	if (listItem.includes(data.obj)) {
		listItem.splice(listItem.indexOf(data.obj), 1);
	} else {
		listItem.push(data.obj);
	}
}
const removeItemSelected = (state, data) => {
	state.listItemSelected[data.type].item.splice(state.listItemSelected[data.type].item.indexOf(data.item), 1);
}
const emptyItemSelected = (state) => {
	state.listItemSelected = {
		document_definition: {
			icon: 'mdi-file-edit-outline',
			title: 'Documents',
			name: 'document_definition',
			item: []
		},
		orgchart: {
			icon: 'mdi-widgets-outline',
			title: 'Orgcharts',
			name: 'orgchart',
			item: []
		},
		dasboard: {
			icon: 'mdi-view-dashboard',
			title: 'Reports',
			name: 'dasboard',
			item: []
		},
		workflow_definition: {
			icon: 'mdi-lan',
			title: 'Workflows',
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
	state.listFavorite.splice(state.listFavorite.indexOf(data), 1)
}

export {
	updateListItemSelected,
	removeItemSelected,
	emptyItemSelected,
	updateChildrenApps,
	updateListFavorite,
	insertFavorite,
	delFavorite

};