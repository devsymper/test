import { SYMPER_APP } from "./../../main.js";
import { orgchartApi } from "./../../api/orgchart";
import { userApi } from "../../api/user.js";

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
export { getAllOrgChartData, getAllUsers };