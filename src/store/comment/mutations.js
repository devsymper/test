const updateCommentTarget = (state, data) => {
    Vue.set(state, 'commentTarget', data)
};
const addPropertyCommentTarget = (state, data) => {
    state.commentTarget[data.property] = data.value
};
const updateListComment = (state, data) => {
    if (typeof data !== 'undefined') {
        Vue.set(state, 'listComment', data)
    } else {
        Vue.set(state, 'listComment', [])
    }

};
const updateListResolve = (state, data) => {
    if (typeof data !== 'undefined') {
        Vue.set(state, 'listResolve', data)
    } else {
        Vue.set(state, 'listResolve', [])
    }
};
const updateListAvtiveComment = (state, data) => {
    if (typeof data !== 'undefined') {
        Vue.set(state, 'listAvtiveComment', data)
    } else {
        Vue.set(state, 'listAvtiveComment', [])
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

    state.listResolve.push(data)
    state.listAvtiveComment.forEach(function(e) {
        if (e.id == data.id) {
            state.listAvtiveComment.splice(state.listAvtiveComment.indexOf(e), 1)
        }
    })
    state.listComment.forEach(function(e) {
            if (e.id == data.id) {
                state.listComment.splice(state.listComment.indexOf(e), 1)
            }
        })
        // state.listAvtiveComment.splice(state.listAvtiveComment.indexOf(data), 1)
        // state.listComment.splice(state.listComment.indexOf(data), 1)
}
const updateUnResolve = (state, data) => {
    state.listAvtiveComment.push(data)
    state.listResolve.forEach(function(e) {
        if (e.id == data.id) {
            state.listResolve.splice(state.listResolve.indexOf(e), 1)
        }
    })
    state.listComment.forEach(function(e) {
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

/**
 * 
 * @param {array | string} objIdens một hoặc nhiều các object identify, có dạng: ['task:123', 'doc:456']
 */
const setWaitingCommentCountPerObj = function(state, objIdens) {
    if (typeof objIdens == 'string') {
        if (state.commentCountPerObj.list.hasOwnProperty(objIdens)) {
            state.commentCountPerObj.list[objIdens] = '';
        } else {
            Vue.set(state.commentCountPerObj.list, objIdens, '');
        }
        Vue.set(state.commentCountPerObj.waiting, objIdens, true);
    } else {
        for (let id of objIdens) {
            if (state.commentCountPerObj.list.hasOwnProperty(id)) {
                state.commentCountPerObj.list[id] = '';
            } else {
                Vue.set(state.commentCountPerObj.list, id, '');
            }
            Vue.set(state.commentCountPerObj.waiting, id, true);
        }
    }
}


/**
 * 
 * @param {object} data chứa tổng số comment của mỗi object id, dạng: {'comment:123':2}
 */
const setCommentCountPerObj = function(state, data) {
    for (let id in data) {
        if (state.commentCountPerObj.list.hasOwnProperty(id)) {
            state.commentCountPerObj.list[id] = data[id];
        } else {
            Vue.set(state.commentCountPerObj.list, id, data[id]);
        }
        Vue.delete(state.commentCountPerObj.waiting, id);
    }
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
    deleteResolve,
    setWaitingCommentCountPerObj,
    setCommentCountPerObj
};