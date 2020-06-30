export const SYMPER_HOME_ORGCHART = 'SYMPER_HOME_ORGCHART';
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

export const getDefaultConfigNodeData = function(nodeId) {
    return {
        commonAttrs: getAllNodeAttrs(),
        customAttributes: [],
        id: nodeId
    };
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
        selectingNode: {},
        homeConfig: getDefaultConfigNodeData(SYMPER_HOME_ORGCHART)
    }
}