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

export const getDefaultConfigNodeData = function() {
    return {
        commonAttrs: getAllNodeAttrs(),
        customAttributes: []
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
        selectingNode: {}
    }
}