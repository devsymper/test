import Vue from "vue";

const cacheAllResourceItem = (state, data) => {
    let type = data.type;
    let items = data.data;
    if (!state.allResource[type] && items.length > 0) {
        Vue.set(state.allResource, type, items);
    }
};

export {
    cacheAllResourceItem
};