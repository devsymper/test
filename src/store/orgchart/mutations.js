import {
	SYMPER_HOME_ORGCHART
} from "../../components/orgchart/editor/nodeAttrFactory";

function normalizeNodeStyle(node) {
	if (typeof node.content != 'object') {
		try {
			node.content = JSON.parse(node.content);
		} catch (error) {
			node.content = {};
		}
	}
	return node;
}

const setOrgchartData = (state, params) => {
	Vue.set(state.editor, params.instanceKey, params.data);
};

const setNodeConfig = (state, params) => {
	Vue.set(state.editor[params.instanceKey].allNode, params.nodeId, params.data);
};

const setNodeStyle = (state, nodeStyles) => {
	for (let i in nodeStyles) {
		nodeStyles[i] = normalizeNodeStyle(nodeStyles[i]);
	}
	Vue.set(state, 'allNodeStyle', nodeStyles);
};


const changeSelectingNode = (state, params) => {
	let selectingNode = null;
	if (params.nodeId == SYMPER_HOME_ORGCHART) {
		selectingNode = state.editor[params.instanceKey].homeConfig;
	} else {
		selectingNode = state.editor[params.instanceKey].allNode[params.nodeId];
	}
	Vue.set(state.editor[params.instanceKey], 'selectingNode', selectingNode);
};

const deleteNodeStyle = (state, idx) => {
	state.allNodeStyle.splice(idx, 1);
};

const addNodeStyle = (state, nodeData) => {
	nodeData = normalizeNodeStyle(nodeData);
	state.allNodeStyle.push(nodeData);
};
const updateInstanceKey = (state, data) => {
	state.instanceKey = data
}
const updateUserChildNode = (state, data) => {
	state.editor[data.curentKey].allNode[data.id].users = data.users
}
const updateIdCurrentChildrenNode = (state, data) => {
	state.idCurrentChildrenNode = data
}
const updateCurrentFatherNode = (state, data) => {
	state.currentFatherNode = data
}
const updateUserFatherNode = (state, data) => {
	state.editor[state.currentFatherNode.instanceKey].allNode[state.currentFatherNode.id].users = data
}
export {
	setOrgchartData,
	setNodeConfig,
	changeSelectingNode,
	setNodeStyle,
	deleteNodeStyle,
	addNodeStyle,
	updateInstanceKey,
	updateUserChildNode,
	updateIdCurrentChildrenNode,
	updateCurrentFatherNode,
	updateUserFatherNode
};