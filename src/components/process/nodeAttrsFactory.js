import { allAttrDisplayGroup } from "./allAttrDisplayGroup";
import { allNodesAttrs } from "./allAttrsOfNodes";
import { util } from "./../../plugins/util";
// Thuộc tính chung cho tất cả các node của process, thuộc tính mà tất cả các node đều phải có
const commonAttrs = ['id', 'name', 'documentation'];



/**
 * Các thuộc tính giành cho các nhóm khác nhau.
 * Các node có thể nhóm thành các nhóm dựa theo việc chúng có các thuộc tính giống nhau
 * Các thuộc tính trong group ko được trùng với các thuộc tính của  commonAttrs
 */
const groupsAttrs = {
    task: ['asynchronous', 'exclusive', 'cardinality', 'elementVariable', 'completionCondition'],
    gateway: ['asynchronous', 'exclusive', 'cardinality', 'elementVariable', 'completionCondition']
}


// Định nghĩa danh sách các thuộc tính của node
export const nodeAttrsDefinition = {
    'UserTask': {
        group: 'task', // nhóm thuộc tính mà node này thuộc về, giá trị là một hoặc nhiều key trong "groupsAttrs"
        attrs: ['taskAction', 'formReference', 'formKey', 'taskOwner', 'assignee', 'candidateUsers', 'validateFormFields', 'priority', 'taskListeners', 'skipExpression', 'category', 'approvalActions', 'dueDate'],
        exclude: ['asynchronous', 'exclusive'],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {
            let taskAction = attrs.taskAction;
            if (taskAction.value == 'submit') {
                attrs.approvalActions.hidden = true;
                attrs.formReference.hidden = false;
            } else if (taskAction.value == 'approval') {
                attrs.approvalActions.hidden = false;
                attrs.formReference.hidden = true;
            }
        }
    },
    'ScriptTask': {
        group: 'task', // nhóm thuộc tính mà node này thuộc về, giá trị là một hoặc nhiều key trong "groupsAttrs"
        attrs: ['script'],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'ServiceTask': {
        group: 'task', // nhóm thuộc tính mà node này thuộc về, giá trị là một hoặc nhiều key trong "groupsAttrs",
        attrs: ['skipExpression', 'triggerable', 'delegateExpression', 'classFields', 'exceptions', 'resultvariableName', 'failedJobRetryTimeCycle'],
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
    'ParallelGateway': {
        group: 'gateway',
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'ComplexGateway': {
        group: 'gateway',
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'StartEvent': {
        attrs: ['initiator', 'formReference', 'formKey', 'validateFormFields'],
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'StartConditionalEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'StartTimerEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'StartSignalEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'StartMessageEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'IntermediateThrowEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'MessageIntermediateCatchEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'TimerIntermediateCatchEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'EscalationIntermediateThrowEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'ConditionalIntermediateCatchEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'LinkIntermediateCatchEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'LinkIntermediateThrowEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'CompensateIntermediateThrowEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'SignalIntermediateCatchEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'SignalIntermediateThrowEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'EndEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'MessageEndEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'EscalationEndEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'ErrorEndEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'CompensateEndEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'SignalEndEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    },
    'TerminateEndEvent': {
        validate: function(attrs) {

        },
        checkShowOrHideInput: function(attrs) {

        }
    }
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