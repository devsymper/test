const setAllPermissionPack = (state, pks) => {
    let map = pks.reduce((map, el) => {
        map[el.id] = el;
        return map;
    }, {});
    Vue.set(state, 'allPermissionPack', map);
};

export {
    setAllPermissionPack,
};