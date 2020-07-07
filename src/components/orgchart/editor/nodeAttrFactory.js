import { DEPARTMENT_NODE_DATA } from "../nodeDefinition/departmentDefinition";
import { POSITION_NODE_DATA } from "../nodeDefinition/positionDefinition";

export const SYMPER_HOME_ORGCHART = 'SYMPER_HOME_ORGCHART';


export const getNodeStyleConfig = function() {
    return {
        highlight: {
            "title": "Highlight color",
            "type": "color",
            "value": "#f58634",
            "info": "",
        },
        public: {
            "title": "Public this style",
            "type": "checkbox",
            "value": false,
            "info": "",
        },
    }
}

export const getAllNodeAttrs = function() {
    return {
        name: {
            "title": "Name",
            "type": "text",
            "value": "",
            "info": "",
        },
        description: {
            "title": "Description",
            "type": "text",
            "value": "",
            "info": "",
        },
        code: {
            "title": "Code",
            "type": "text",
            "value": "",
            "info": "",
        },
    }
}





export const getDefaultConfigNodeData = function(nodeId, isDepartment = false) {
    let config = {
        commonAttrs: getAllNodeAttrs(),
        customAttributes: [],
        id: nodeId,
        style: getNodeStyleConfig(),
        collapseExpandStatus: 'expand' // expand | collapse
    };

    if (isDepartment) {
        config.positionDiagramCells = {
            instanceKey: Date.now(),
            cells: false,
        }
    } else {
        config.users = []
    }
    return config;
}

export const getDynamicAttr = function() {
    return {
        "name": "",
        "value": "",
        "doseFutureApply": 0,
        "dosePastApply": 0
    }
}


export const getOrgchartEditorData = function() {
    return {
        allNode: {},
        selectingNode: {
            positionDiagramCells: {
                cells: {
                    cells: []
                },
                instanceKey: ''
            }
        },
        homeConfig: getDefaultConfigNodeData(SYMPER_HOME_ORGCHART)
    }
}