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
	// state.listItemSelected = data
	Vue.set(state, 'listItemSelected', data);
}

export {
	updateListItemSelected

};