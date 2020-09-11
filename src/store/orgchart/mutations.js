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
	if (state.editor[data.currentInstanceKey].allNode[data.id]) {
		state.editor[data.currentInstanceKey].allNode[data.id].users = data.users
	} else {
		let key = state.editor[data.currentInstanceKey].selectingNode.positionDiagramCells.instanceKey
		state.editor[key].allNode[data.id].users = data.users
	}
}
const updateCurrentChildrenNodeId = (state, data) => {
	state.currentChildrenNodeId = data
}
const updateCurrentFatherNode = (state, data) => {
	state.currentFatherNode = data
}
const updateUserFatherNode = (state, data) => {
	state.editor[state.currentFatherNode.instanceKey].allNode[state.currentFatherNode.id].users = data
}
const updateFirstChildNodeId = (state, data) => {
	state.firstChildNodeId = data
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
	updateCurrentChildrenNodeId,
	updateCurrentFatherNode,
	updateUserFatherNode,
	updateFirstChildNodeId
};