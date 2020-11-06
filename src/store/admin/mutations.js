import Vue from "vue";

const setProcessDefination = (state, data) =>{
	Vue.set(state, 'processDefination', data)
}
const setProcessKey = (state, data) =>{
	Vue.set(state, 'processKey', data)
}

export {
	setProcessDefination,
	setProcessKey
};