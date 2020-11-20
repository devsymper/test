import Vue from "vue";

const setAllEnvironment = (state, data) => {
    Vue.set(state, 'allEnvironment', data);
};

export {
	setAllEnvironment
};