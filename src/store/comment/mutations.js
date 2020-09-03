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
	if (typeof data !== 'undefined'){
		Vue.set(state, 'listComment', data)
	}else{
		Vue.set(state, 'listComment',[] )
	}

};
const updateListResolve = (state, data) => {
	if (typeof data !== 'undefined'){
		Vue.set(state, 'listResolve', data)
	}else{
		Vue.set(state, 'listResolve',[] )
	}
};
const updateListAvtiveComment = (state, data) => {
	if (typeof data !== 'undefined'){
		Vue.set(state, 'listAvtiveComment', data)
	}else{
		Vue.set(state, 'listAvtiveComment',[] )
	}
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
	debugger

	state.listResolve.push(data)
	state.listAvtiveComment.forEach(function (e) {
		if (e.id == data.id) {
			state.listAvtiveComment.splice(state.listAvtiveComment.indexOf(e), 1)
		}
	})
	state.listComment.forEach(function (e) {
		if (e.id == data.id) {
			state.listComment.splice(state.listComment.indexOf(e), 1)
		}
	})
	// state.listAvtiveComment.splice(state.listAvtiveComment.indexOf(data), 1)
	// state.listComment.splice(state.listComment.indexOf(data), 1)
}
const updateUnResolve = (state, data) => {
	debugger
	state.listAvtiveComment.push(data)
	state.listResolve.forEach(function (e) {
		if (e.id == data.id) {
			state.listResolve.splice(state.listResolve.indexOf(e), 1)
		}
	})
	state.listComment.forEach(function (e) {
		if (e.id == data.id) {
			state.listComment.splice(state.listComment.indexOf(e), 1)
		}
	})
	// state.listResolve.splice(state.listResolve.indexOf(data), 1)
	// state.listComment.splice(state.listComment.indexOf(data), 1)
}
const updateCurrentTab = (state, data) => {
	Vue.set(state, 'currentTab', data)
}
const deleteComment = (state, data) => {
	state.listComment.splice(state.listComment.indexOf(data))
}
const deleteResolve = (state, data) => {
	state.listResolve.splice(state.listResolve.indexOf(data))
}
const deleteChildComment = (state, data) => {

}
const deleteChildResolve = (state, data) => {

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
	updateUnResolve,
	updateCurrentTab,
	deleteComment,
	deleteResolve
};