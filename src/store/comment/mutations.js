import {
	database
} from "firebase";

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
const updateReplyStatus = (state, data) => {
	state.isReply = data
}
const updateParentCommentTarget = (state, data) => {
	state.commentTarget.parentId = data
}
const updateResolve = (state, data) => {
	state.listAvtiveComment.splice(state.listAvtiveComment.indexOf(data), 1)
	state.listComment.splice(state.listComment.indexOf(data), 1)
	state.listResolve.push(data)
}
const updateUnResolve = (state, data) => {
	state.listAvtiveComment.splice(state.listAvtiveComment.indexOf(data), 1)
	state.listResolve.splice(state.listResolve.indexOf(data), 1)
	state.listComment.push(data)
}
export {
	updateCommentTarget,
	addPropertyCommentTarget,
	updateListComment,
	updateListResolve,
	updateListAvtiveComment,
	setComment,
	setResolve,
	updateReplyStatus,
	updateParentCommentTarget,
	updateResolve,
	updateUnResolve
};