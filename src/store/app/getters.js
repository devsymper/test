/**
 * Biến dữ liệu của orgchart từ dạng tree sang dạng phẳng 
 * @param {*} state 
 */
const listOrgcNodeAsFlat = function(state) {
    let nodes = [];
    let orcharts = state.orgchartNodes;
    for (let idOrgc in orcharts) {
        nodes = nodes.concat(Object.values(orcharts[idOrgc].children));
    }
    return nodes;
}
export { listOrgcNodeAsFlat };