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
        if (node.vizParentId == '') {
            node.path = `${orgc.name} / ${node.name}`;
        } else {
            let parentId = node.vizParentId;
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
            id_node: 'general',
            id_parent_node: 'general',
            name: orgc['name'],
            root_id: orgc['id'],
            children: {}
        };

        for (let node of orgc.nodes) {
            node.gid = orgc['id'] + ':' + node.vizId; // gid là general id là kết hợp giữa id orgchart và id node tạo thành key duy nhất để xác định một node bất kỳ giữa tất cả các orgchart 
            newOrgc.children[node.vizId] = node;
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
    return new Promise((resolve, reject) => {
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
                resolve()
            } else {
                self.$snotifyError(res, "Can not get user role in orgchart");
                reject();
            }
        }).catch((err) => {
            self.$snotifyError(err, "Can not get user role in orgchart");
            reject();
        });
    });
}


function checkAndRefreshCurrentRole(data, context) {
    return new Promise(async(resolve, reject) => {
        // Nếu chưa load thông tin của role hiện tại lên thì lấy thông tin về để hiển thị
        let role = '';
        if (data.profile.userDelegate &&
            data.profile.userDelegate.role &&
            data.profile.userDelegate.role != context.state.endUserInfo.currentRole.id) {
            role = data.profile.userDelegate.role;
        } else {
            role = data.profile.role;
        }

        if (role) {

            let res = await userRoleApi.getRoleData(role);
            if (res.status == 200) {
                context.commit("changeCurrentUserInfo", {
                    currentRole: res.data
                });
                resolve();
            } else {
                SYMPER_APP.$snotifyError(res, "Can not get role detail");
                reject();
            }
        } else {
            resolve();
        }
    });
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    let currentDomain = document.domain;
    if (currentDomain != 'localhost') {
        const domain = "domain=" + (currentDomain.match(/[^\.]*\.[^.]*$/)[0]) + ";";
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;" + domain;
    }
}

const setUserInfo = (context, data) => {
    return new Promise(async(resolve, reject) => {
        try {
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
            setCookie('symper_token', "Bearer " + data.token, 365);
            await checkAndRefreshCurrentRole(data, context);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}


const getAllRoles = async function(context, userId) {
    countGetRoleType = 0;

    let roles = {
        orchart: [],
        systemRole: []
    };
    await getRolesByType([{
        idUser: userId
    }], 'orgchart', orgchartApi, context);

    await getRolesByType([userId], 'systemRole', systemRoleApi, context);
    SYMPER_APP.$evtBus.$emit('symper-user-add-loaded-role-type');
}

const changeUserRole = async function(context, role) {
    try {
        let res = await userApi.changeRole(role.id);
        if (res.status == 200) {
            await setUserInfo(context, res.data);
            location.reload();
        } else {
            SYMPER_APP.$snotifyError(res, "Can not change user role");
        }
    } catch (error) {
        console.error(error);
    }
}

const getAndSetUserOperations = async function(context) {
    let res = await userApi.getCurrentRoleOperations();
    if (res.status == 200) {
        let ops = res.data;
        /**
         * Biến lưu lại các operation nhóm bởi object type và id của object,
         * có dạng: {
         *      document_definition: {
         *          1787: {
         *              submit: true,
         *              delete: true,..
         *          },...
         *      }
         * }
         */
        let opsByObjectType = {};
        for (let op of ops) {
            let type = op.objectType;
            if (!opsByObjectType[type]) {
                opsByObjectType[type] = {}
            }

            let sections = op.objectIdentifier.split(':');
            let id = sections[0];
            if (!opsByObjectType[type][id]) {
                opsByObjectType[type][id] = {};
            }

            if (id == type) { // nếu là operation đối với chính object type hiện tại thì quy định id sẽ là self
                opsByObjectType[type]['self'][op.action] = true;
            } else {
                opsByObjectType[type][id][op.action] = true;
            }
        }
        context.commit('setUserActionsForObjects', opsByObjectType);
    } else {
        SYMPER_APP.$snotifyError(res, "Can not get operations of current role");
    }
}
export {
    getAndSetUserOperations,
    getAllOrgChartData,
    getAllUsers,
    getAllRoles,
    setUserInfo,
    changeUserRole
};
