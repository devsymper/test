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
    for (let name in data) {
        state.baInfo[name] = data[name];
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
 * @param {Object} orgchartNodes chứa danh sách các node của các orgchart, dạng: {idOrgchart: [danh sách node]}
 */
const setOrgchartNodes = (state, orgchartNodes) => {

    for (let id in orgchartNodes) {
        for (let i = 0; i < orgchartNodes[id].children.length; i++) {
            orgchartNodes[id].children[i].orgchartName = orgchartNodes[id].name;
        }
    }
    let nodes = state.orgchartNodes;
    nodes = Object.assign(nodes, orgchartNodes);
    state.orgchartNodes = nodes;
    Vue.set(state, 'orgchartNodes', nodes);
    console.log(state, 'orgchartNodesorgchartNodesorgchartNodes');

}

export {
    changeCollapseSidebar,
    increaseUnreadNotification,
    decreaseUnreadNotification,
    changeCurrentBAInfo,
    changeUrlsToTabs,
    updateCurrentTabIndex,
    removeTab,
    setOrgchartNodes
};