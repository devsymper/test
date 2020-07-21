import { SYMPER_APP } from "./../../main.js";
import { orgchartApi } from "./../../api/orgchart";
import { userApi } from "../../api/user.js";
import { userRoleApi } from "../../api/userRole.js";
import { systemRoleApi } from "../../api/systemRole.js";
import { util } from "../../plugins/util.js";

var countGetRoleType = 0;
const handleUrlChanges = (context, data) => {
    console.log(context, data, 'xxx');
    context.commit('changeUrlsToTabs', data);
    // urlToTabTitleMap
};


/**
 * Lấy đường dẫn từ root trong orgchart (orgc) xuống tới node (node)
 */
function addPathInfoForANode(orgc, node) {
    if (!node.path) {
        if (node.id_parent_node == 'general') {
            node.path = `${orgc.name} / ${node.name}`;
        } else {
            let parentId = node.id_parent_node;
            let parentNode = orgc.children[parentId];
            if (parentNode.path) {
                node.path = `${parentNode.path} / ${node.name}`;
            } else {
                addPathInfoForANode(orgc, parentNode);
            }
        }
    }
}

// Thêm đường đi (breadscrum) từ root đến node
function addPathInfoForAllNodes(orgchartNodes) {
    for (let idOrgc in orgchartNodes) {
        let orgc = orgchartNodes[idOrgc];
        for (let nodeId in orgc.children) {
            addPathInfoForANode(orgc, orgc.children[nodeId]);
        }
    }
    return orgchartNodes;
}

// Chuyển data của orchart từ dạng phẳng sang dạng map key-value
function makeNodesMap(orgchartNodes) {
    let rsl = {};
    for (let orgc of orgchartNodes) {
        let newOrgc = {
            id: orgc['id'], // thêm _ ở đầu để có thể khởi động reactive của vue
            id_node: orgc['id_node'],
            id_node: orgc['id_node'],
            id_parent_node: orgc['id_parent_node'],
            name: orgc['name'],
            root_id: orgc['root_id'],
            children: {}
        };

        for (let node of orgc.children) {
            node.gid = orgc['id'] + '-' + node.id_node; // gid là general id là kết hợp giữa id orgchart và id node tạo thành key duy nhất để xác định một node bất kỳ giữa tất cả các orgchart 
            newOrgc.children[node.id_node] = node;
        }
        rsl[orgc.id] = newOrgc;
    }
    return rsl;
}

/**
 * Lấy data của tất cả orgchart ở server
 */
const getAllOrgChartData = (context) => {
    if ($.isEmptyObject(context.state.orgchartNodes)) {
        orgchartApi.getAllNodes()
            .then(res => {
                if (res.status == 200) {
                    let orgchartNodes = makeNodesMap(res.data);
                    orgchartNodes = addPathInfoForAllNodes(orgchartNodes);
                    context.commit('setOrgchartNodes', orgchartNodes);
                }
            })
            .catch(err => {
                console.warn(err);
                SYMPER_APP.$snotify({
                    type: 'error',
                    title: 'Error!',
                    text: 'Error when get and prepare data for orchart selector component',
                });
            });
    }
}

/**
 * Lấy data của tất cả user trong hệ thống
 */

const getAllUsers = async(context) => {
    if (context.state.allUsers.length == 0) {
        try {
            let res = await userApi.getListUser(1, 2000);
            if (res.status == 200) {
                context.commit('setAllUsers', res.data.listObject);
            } else {
                SYMPER_APP.$snotifyError(error, "Can not get all user!");
            }
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get all user!");
        }
    }
}


function getRolesByType(userInfo, type, apiObj, context) {
    apiObj.getRolesByUser(userInfo).then((res) => {
        if (res.status == 200) {
            if (res.data[0]) {
                countGetRoleType += 1;
                context.commit('setUserRoleByType', {
                    type: type,
                    data: res.data[0].roles,
                    countGetRoleType: countGetRoleType
                });
            }
        } else {
            self.$snotifyError(res, "Can not get user role in orgchart");
        }

        setTimeout(() => {

            SYMPER_APP.$evtBus.$emit('symper-user-add-loaded-role-type', {
                type: type
            });
        }, 0);
    }).catch((err) => {
        self.$snotifyError(err, "Can not get user role in orgchart");
    });
}


async function checkAndRefreshCurrentRole(data, context) {
    // Nếu chưa load thông tin của role hiện tại lên thì lấy thông tin về để hiển thị
    if (data.profile.userDelegate &&
        data.profile.userDelegate.role &&
        data.profile.userDelegate.role != context.state.endUserInfo.currentRole.id) {

        let res = await userRoleApi.getRoleData(data.profile.userDelegate.role);
        if (res.status == 200) {
            context.commit("changeCurrentUserInfo", {
                currentRole: res.data
            });
        } else {
            SYMPER_APP.$snotifyError(res, "Can not get role detail");
        }
    }
}

const setUserInfo = (context, data) => {
    let accData = {
        accType: data.profile.type,
        info: data.profile
    };
    let endUserInfo = data.profile;
    let accInfo = {
        token: data.token,
        baId: 0,
        endUserId: 0,
        profile: data.profile
    }

    if (data.profile.type == 'ba') {
        accInfo.baId = data.profile.id;
        context.commit("changeCurrentBAInfo", data.profile);
        endUserInfo = endUserInfo.userDelegate;
        accInfo.endUserId = data.profile.userDelegate.id;
    } else {
        accInfo.endUserId = data.profile.id;
    }
    context.commit("changeCurrentUserInfo", endUserInfo);
    util.auth.saveLoginInfo(accInfo);
    checkAndRefreshCurrentRole(data, context);
}


const getAllRoles = async function(context, userId) {
    countGetRoleType = 0;

    let roles = {
        orchart: [],
        systemRole: []
    };
    getRolesByType([{
        idUser: userId
    }], 'orgchart', orgchartApi, context);

    getRolesByType([userId], 'systemRole', systemRoleApi, context);
}

const changeUserRole = async function(context, role) {
    let res = await userApi.changeRole(role.id);
    if (res.status == 200) {
        setUserInfo(context, res.data);
        location.reload();
    } else {
        SYMPER_APP.$snotifyError(res, "Can not change user role");
    }
}
export { getAllOrgChartData, getAllUsers, getAllRoles, setUserInfo, changeUserRole };