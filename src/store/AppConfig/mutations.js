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
		documents: {
			icon: 'mdi-file-document',
			title: 'Documents',
			name: 'documents',
			item: []
		},
		orgcharts: {
			icon: 'mdi-widgets',
			title: 'Orgcharts',
			name: 'orgcharts',
			item: []
		},
		reports: {
			icon: 'mdi-view-dashboard',
			title: 'Reports',
			name: 'reports',
			item: []
		},
		workflows: {
			icon: 'mdi-lan',
			title: 'Workflows',
			name: 'workflows',
			item: []
		},
	}
}
const updateChildrenApps = (state, data) => {
	// Vue.set(state, 'listItemSelected', data);
	state.listItemSelected[data.type].item = data.obj
}

export {
	updateListItemSelected,
	removeItemSelected,
	emptyItemSelected,
	updateChildrenApps,

};