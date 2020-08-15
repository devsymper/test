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
	Vue.set(state, 'listItemSelected', data);
}
const removeItemSelected = (state, data) => {
	state.listItemSelected[data.type].item.splice(state.listItemSelected[data.type].item.indexOf(data.id), 1);
}
const emptyItemSelected = (state) => {
	state.listItemSelected = {}
}
export {
	updateListItemSelected,
	removeItemSelected,
	emptyItemSelected

};