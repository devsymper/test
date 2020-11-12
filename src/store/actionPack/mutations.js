import Vue from "vue";

const cacheAllResourceItem = (state, data) => {
    let type = data.type;
    let items = data.data;
    if(type == "department"){
        Vue.set(state.allResource, 'department', []);
    }
    if (!state.allResource[type] && !$.isEmptyObject(items)) {
        Vue.set(state.allResource, type, items);

        if (type == 'document_definition') {
            Vue.set(state.allResource, 'document_instance_all_by_def', items);
        }
    }

};

const setAllActionByObjectType = (state, data) => {
    Vue.set(state, 'allActionByObjectType', data);
};

export {
    cacheAllResourceItem,
    setAllActionByObjectType
};