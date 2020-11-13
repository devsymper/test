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


function hasShowListPermission(opsMap, objectType) {
    /**
     * nếu object id là 0 thì là có tác dụng với toàn bộ object trong definition
     */
    // return mapObjectTypeAndMenu[objectType] &&
    //     opsMap[objectType][0] &&
    //     opsMap[objectType][0].list;
    if (objectType == 'application_definition') {
        if (opsMap[objectType][0]) {
            return true;
        } else {
            return false;
        }
    } else {
        return mapObjectTypeAndMenu[objectType]
    }
}

const userMenuItems = function(state) {
    let opsMap = state.userOperations;
    let userInfo = util.auth.getSavedUserInfo();
    let userType = userInfo.profile.type;

    for (let objectType in mapObjectTypeAndMenu) {
        mapObjectTypeAndMenu[objectType].active = false;
    }

    if (userType == 'ba') {
        return Object.values(mapObjectTypeAndMenu);
    } else {
        // let allwaysHave = ['tasks', 'myItem', 'works', 'my_application'];
        let allwaysHave = ['my_application', 'myItem', 'lisTaskToDo', 'orgchart.viewOrgchart', 'settingNotication.settingNotificationUser'];
        let items = [];
        for (let objectType in opsMap) {
            if (hasShowListPermission(opsMap, objectType)) {
                items.push(mapObjectTypeAndMenu[objectType]);
            }
        }

        for (let objType of allwaysHave) {
            if (objType.includes('.')) {
                let data = objType.split('.')
                let father = mapObjectTypeAndMenu[data[0]]
                let children = father.children[data[1]]
                father.children = {}
                father.children[data[1]] = children
                items.push(father)
            }
            if (mapObjectTypeAndMenu[objType]) {
                items.push(mapObjectTypeAndMenu[objType]);
            }
        }
        return items;
    }
}


export {
    listOrgcNodeAsFlat,
    mapIdToUser,
    userMenuItems
};