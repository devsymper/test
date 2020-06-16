const changeCollapseSidebar = (state, newValue) => {
    state.collapseSideBar = newValue;
};
const decreaseUnreadNotification = (state, delta = 1) => {
    state.unreadNotification -= delta;
};
const increaseUnreadNotification = (state, delta = 1) => {
    state.unreadNotification += delta;
};

const changeCurrentBAInfo = (state, data) => {
    debugger
    for (let name in data) {
        Vue.set(state.baInfo, name, data[name]);
    }
};

const changeCurrentUserInfo = (state, data) => {
    debugger
    for (let name in data) {
        Vue.set(state.endUserInfo, name, data[name]);
    }
};

const changeUrlsToTabs = (state, data) => {
    console.log(Vue, state, data);
    Vue.set(state.urlToTabTitleMap, data.url, data.title);
}

const updateCurrentTabIndex = (state, data) => {
    state.currentTabIndex = data;
}

const removeTab = (state, url) => {
    Vue.delete(state.urlToTabTitleMap, url);
}

/**
 * 
 * @param {Object} state state của app
 * @param {Object} orgchartNodes chứa danh sách các node của các orgchart, dạng: 
 * {
 *      idOrgchart: {
 *          ... Thông tin orgchart,
 *          children: { // thông tin các node trong orgchart này
 *              idNode: {
 *                  ... thông tin node
 *              }
 *          }
 *      }
 * }
 */
const setOrgchartNodes = (state, orgchartNodes) => {
    for (let idOrgchart in orgchartNodes) {
        Vue.set(state.orgchartNodes, 'orgcid' + idOrgchart, orgchartNodes[idOrgchart]);
    }
}

const setAllUsers = (state, allUsers) => {
    Vue.set(state, 'allUsers', allUsers);
}

export {
    changeCollapseSidebar,
    increaseUnreadNotification,
    decreaseUnreadNotification,
    changeCurrentBAInfo,
    changeCurrentUserInfo,
    changeUrlsToTabs,
    updateCurrentTabIndex,
    removeTab,
    setOrgchartNodes,
    setAllUsers
};