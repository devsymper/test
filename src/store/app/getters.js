import mapObjectTypeAndMenu from "./allMenuItems";
import { util } from "../../plugins/util";
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

const mapIdToUser = function(state) {
    return state.allUsers.reduce((map, el, idx) => {
        map[el.id] = el;
        return map;
    }, {});
}


const userMenuItems = function(state) {
    let opsMap = state.userOperations;
    let userInfo = util.auth.getSavedUserInfo();
    let userType = userInfo.profile.type;

    if (userType == 'ba') {
        return Object.values(mapObjectTypeAndMenu);
    } else {
        let allwaysHave = ['tasks', 'works'];
        let items = [];
        for (let objectType in opsMap) {
            if (mapObjectTypeAndMenu[objectType]) {
                items.push(mapObjectTypeAndMenu[objectType]);
            }
        }

        for (let objectType of allwaysHave) {
            items.push(mapObjectTypeAndMenu[objectType]);
        }
        return items;
    }
}


export {
    listOrgcNodeAsFlat,
    mapIdToUser,
    userMenuItems
};