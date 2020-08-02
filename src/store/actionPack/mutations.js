import Vue from "vue";

const cacheAllResourceItem = (state, data) => {
    let type = data.type;
    let items = data.data;
    if (!state.allResource[type] && !$.isEmptyObject(items)) {
        Vue.set(state.allResource, type, items);
    }
};

const setAllActionByObjectType = (state, data) => {
    Vue.set(state, 'allActionByObjectType', data);
};

export {
    cacheAllResourceItem,
    setAllActionByObjectType
};