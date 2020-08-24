const updateCommentTarget = (state, data) => {
	Vue.set(state, 'commentTarget', data)
};
const addPropertyCommentTarget = (state, data) => {
	state.commentTarget[data.property] = data.value
};
const updateListComment = (state, data) => {
	Vue.set(state, 'listComment', data)
};
const updateListResolve = (state, data) => {
	Vue.set(state, 'listResolve', data)
};
export {
	updateCommentTarget,
	addPropertyCommentTarget,
	updateListComment,
	updateListResolve
};