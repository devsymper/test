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
const updateListAvtiveComment = (state, data) => {
	Vue.set(state, 'listAvtiveComment', data)
};
const setComment = (state) => {
	state.listComment = state.listAvtiveComment
};
const setResolve = (state) => {
	state.listComment = state.listResolve
}
export {
	updateCommentTarget,
	addPropertyCommentTarget,
	updateListComment,
	updateListResolve,
	updateListAvtiveComment,
	setComment,
	setResolve
};