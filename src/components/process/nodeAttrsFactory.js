import { allAttrDisplayGroup } from "./allAttrDisplayGroup";
import { allNodesAttrs } from "./allAttrsOfNodes";
import { util } from "./../../plugins/util";
// Thuộc tính chung cho tất cả các node của process, thuộc tính mà tất cả các node đều phải có
const commonAttrs = ['overrideid', 'name', 'documentation'];



/**
 * Các thuộc tính giành cho các nhóm khác nhau.
 * Các node có thể nhóm thành các nhóm dựa theo việc chúng có các thuộc tính giống nhau
 * Các thuộc tính trong group ko được trùng với các thuộc tính của  commonAttrs
 */
const groupsAttrs = {
    task: ["asynchronousdefinition", "exclusivedefinition", "executionlisteners", "multiinstance_type", "multiinstance_cardinality", "multiinstance_collection", "multiinstance_variable", "multiinstance_condition", "isforcompensation"],
    gateway: ["asynchronousdefinition", "exclusivedefinition", "sequencefloworder"]
}


// Định nghĩa danh sách các thuộc tính của node
export const nodeAttrsDefinition = {
    'UserTask': {
        group: 'task', // nhóm thuộc tính mà node này thuộc về, giá trị là một hoặc nhiều key trong "groupsAttrs"
        // attrs: ['taskAction', 'formReference', 'formkeydefinition', 'taskOwner', 'assignee', 'candidateUsers', 'notificationTitle', 'notificationContent', 'formfieldvalidation', 'prioritydefinition', 'taskListeners', 'skipexpression', 'category', 'approvalActions', 'approvalForElement', 'duedatedefinition'],
        attrs: ['taskAction', "usertaskassignment", 'taskOwner', 'assignee', 'candidateUsers', 'notificationTitle', 'notificationContent', "formkeydefinition", "formreference", "formfieldvalidation", "duedatedefinition", "prioritydefinition", 'approvalActions', 'approvalForElement', "formproperties", "tasklisteners", "skipexpression", "categorydefinition"],
        exclude: ['asynchronousdefinition', 'exclusivedefinition'],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {
            let taskAction = attrs.taskAction;
            if (taskAction.value == 'submit') {
                attrs.approvalActions.hidden = true;
                attrs.formreference.hidden = false;
                attrs.approvalForElement.hidden = true;
            } else if (taskAction.value == 'approval') {
                attrs.approvalActions.hidden = false;
                attrs.formreference.hidden = true;
                attrs.approvalForElement.hidden = false;
            }
        }
    },
    'ScriptTask': {
        group: 'task', // nhóm thuộc tính mà node này thuộc về, giá trị là một hoặc nhiều key trong "groupsAttrs"
        attrs: ["scriptformat", "scripttext", , "scriptautostorevariables"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'ServiceTask': {
        group: 'task', // nhóm thuộc tính mà node này thuộc về, giá trị là một hoặc nhiều key trong "groupsAttrs",
        attrs: ["servicetasktriggerable", "servicetaskclass", "servicetaskexpression", "servicetaskdelegateexpression", "servicetaskfields", "servicetaskexceptions", "servicetaskresultvariable", "servicetaskresultvariableUseLocalScope", "skipexpression", "servicetaskfailedjobretrytimecycle", "servicetaskstoreresultvariabletransient"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'ReceiveTask': {
        group: 'task', // nhóm thuộc tính mà node này thuộc về, giá trị là một hoặc nhiều key trong "groupsAttrs"
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'SendTask': {
        group: 'task', // nhóm thuộc tính mà node này thuộc về, giá trị là một hoặc nhiều key trong "groupsAttrs"
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'ExclusiveGateway': {
        group: 'gateway',
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'InclusiveGateway': {
        group: 'gateway',
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'EventGateway': {
        group: 'gateway',
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'ParallelGateway': {
        group: 'gateway',
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'StartNoneEvent': {
        attrs: ["executionlisteners", "initiator", "formkeydefinition", "formreference", "formfieldvalidation", "formproperties"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'StartConditionalEvent': {
        attrs: ["executionlisteners", "conditionalevent", "interrupting"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'StartTimerEvent': {
        attrs: ["executionlisteners", "timercycledefinition", "timerdatedefinition", "timerdurationdefinition"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'StartSignalEvent': {
        attrs: ["executionlisteners", "signalref", "interrupting"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'StartMessageEvent': {
        attrs: ["executionlisteners", "messageref", "interrupting"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'ThrowNoneEvent': {
        attrs: ["executionlisteners", "asynchronousdefinition"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'CatchMessageEvent': {
        attrs: ["executionlisteners", "messageref"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'CatchTimerEvent': {
        attrs: ["executionlisteners", "timercycledefinition", "timerdatedefinition", "timerdurationdefinition"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'ThrowEscalationEvent': {
        attrs: ["executionlisteners", "escalationref", "asynchronousdefinition"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'CatchConditionalEvent': {
        attrs: ["executionlisteners", "conditionalevent"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'CatchLinkEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'ThrowLinkEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'ThrowCompensateEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'CatchSignalEvent': {
        attrs: ["executionlisteners", "signalref"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'ThrowSignalEvent': {
        attrs: ["executionlisteners", "signalref", "asynchronousdefinition"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'EndNoneEvent': {
        attrs: ["executionlisteners"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'EndMessageEvent': {
        attrs: ["executionlisteners"],

        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'EndEscalationEvent': {
        attrs: ["executionlisteners", "escalationref"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'EndErrorEvent': {
        attrs: ["executionlisteners", "errorref"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'EndCompensateEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'EndSignalEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'EndTerminateEvent': {
        attrs: ["executionlisteners", "terminateAll"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'CallActivity': {
        attrs: ["asynchronousdefinition", "exclusivedefinition", "callactivitycompleteasync", "executionlisteners", "callactivitycalledelement", "callactivitycalledelementtype", "callactivityinparameters", "callactivityoutparameters", "callactivityinheritvariables", "callactivitysamedeployment", "callactivityfallbacktodefaulttenant", "callactivityidvariablename", "callactivityprocessinstancename", "callactivityinheritbusinesskey", "callactivitybusinesskey", "callactivityuselocalscopeforoutparameters", "multiinstance_type", "multiinstance_cardinality", "multiinstance_collection", "multiinstance_variable", "multiinstance_condition", "isforcompensation"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'SubProcess': {
        attrs: ["asynchronousdefinition", "exclusivedefinition", "dataproperties", "executionlisteners", "multiinstance_type", "multiinstance_cardinality", "multiinstance_collection", "multiinstance_variable", "multiinstance_condition", "istransaction"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'AdhocSubProcess': {
        attrs: ["completioncondition", "ordering", "cancelremaininginstances"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'TransactionSubProcess': {
        attrs: ["asynchronousdefinition", "exclusivedefinition", "dataproperties", "executionlisteners", "multiinstance_type", "multiinstance_cardinality", "multiinstance_collection", "multiinstance_variable", "multiinstance_condition", "istransaction"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'EventSubProcess': {
        attrs: ["asynchronousdefinition", "exclusivedefinition", "executionlisteners"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'BPMNDiagram': {
        attrs: ["process_id", "name", "documentation", "process_author", "process_version", "process_namespace", "process_historylevel", "isexecutable", "dataproperties", "executionlisteners", "eventlisteners", "signaldefinitions", "messagedefinitions", "escalationdefinitions", "process_potentialstarteruser", "process_potentialstartergroup", "iseagerexecutionfetch"],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
};


/**
 * Lấy ra các thuộc tính  mặc định của một loại node trong process
 * @param {String} nodeType loại node cần lấy thuộc tính
 */
export const getNodeAttrs = function(nodeType) {
    let allAttrKeys = util.cloneDeep(commonAttrs);
    let nodeAttrs = {};
    let nodeDef = nodeAttrsDefinition[nodeType];
    if (nodeDef) {
        if (nodeDef.attrs) {
            allAttrKeys = allAttrKeys.concat(nodeDef.attrs);
        }

        if (nodeDef.group) {
            allAttrKeys = allAttrKeys.concat(groupsAttrs[nodeDef.group]);
        }
    }

    for (let i = 0; i < allAttrKeys.length; i++) {
        let attrName = allAttrKeys[i];
        nodeAttrs[attrName] = allNodesAttrs[attrName];
    }

    if (nodeDef && nodeDef.exclude) {
        for (let item of nodeDef.exclude) {
            delete nodeAttrs[item];
        }
    }

    let rsl = util.cloneDeep(nodeAttrs);
    if (nodeDef) {
        if (nodeDef.checkShowOrHideInput) {
            nodeDef.checkShowOrHideInput(rsl);
        }
    }
    return rsl;
}