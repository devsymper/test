import Vue from "vue";

const setAllEnvironment = (state, data) => {
    Vue.set(state, 'allEnvironment', data);
};
const setServiceInstanceInEnvironment = (state, data) => {
    Vue.set(state.serviceInstanceInEnv, state.currentEnvId, data);
};
const setCurrentEnvId = (state, data) => {
    Vue.set(state, 'currentEnvId', data);
};

export {
	setAllEnvironment,
	setServiceInstanceInEnvironment,
	setCurrentEnvId
};