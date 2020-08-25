const setSearch = (state, newValue) => {
    state.newSearch = newValue;
};
const setSearchAll = (state, newValue) => {
    state.newSearchAll = newValue;
};
const setWordSearch = (state, newValue) => {
    state.wordSearch = newValue;
};
const setType = (state, newValue) => {
    state.type = newValue;
}
export {
    setSearch,
    setSearchAll,
    setWordSearch,
    setType
};