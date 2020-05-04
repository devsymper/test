/**
 * Danh sách tất cả các thuộc tính có thể có của process
 * trong các item, có thuộc tính "dg" là viết tắt của "display group" tức: 
 *      thuộc tính này thuộc về nhóm hiển thị nào ở thanh panel cấu hình bên phải
 */
export const allNodesAttrs = {
    id: {
        title: 'Id',
        type: 'text',
        value: '',
        info: '',
        dg: 'general'
    },
    name: {
        title: 'Name',
        type: 'text',
        value: '',
        info: '',
        dg: 'general'
    },
    documentation: {
        title: 'Documentation',
        type: 'text',
        value: '',
        info: '',
        dg: 'general'
    },
    asynchronous: {
        title: 'Asynchronous',
        type: 'checkbox',
        value: false,
        info: '',
        dg: 'detail'
    },
    exclusive: {
        title: 'Exclusive',
        type: 'checkbox',
        value: false,
        info: '',
        dg: 'detail'
    },
    cardinality: {
        title: 'Cardinality',
        type: 'numeric',
        value: 1,
        info: '',
        dg: 'multiInstance'
    },
    elementVariable: {
        title: 'Element variable',
        type: 'text',
        value: 1,
        info: '',
        dg: 'multiInstance'
    },
    completionCondition: {
        title: 'Completion condition',
        type: 'script',
        value: 1,
        info: '',
        dg: 'multiInstance'
    },
    script: {
        title: 'Script',
        type: 'script',
        value: '',
        info: '',
        dg: 'formula'
    },
    formKey: {
        title: 'Form key',
        type: 'text',
        value: 1,
        info: '',
        hidden: true,
        dg: 'taskAction'
    },
    formReference: {
        title: 'Form Reference',
        type: 'selectDoc',
        value: 0,
        info: '',
        dg: 'taskAction'
    },
    validateFormFields: {
        title: 'Validate form fields',
        type: 'script',
        value: '',
        info: '',
        dg: 'formula'
    },
    dueDate: {
        title: 'Due date',
        type: 'script',
        value: '',
        info: '',
        dg: 'detail'
    },
    priority: {
        title: 'Priority',
        type: 'select',
        value: 'low',
        info: '',
        options: [{
                text: 'Low',
                value: 'low'
            },
            {
                text: 'Medium',
                value: 'medium'
            },
            {
                text: 'Low',
                value: 'low'
            },
        ],
        dg: 'detail'
    },
    taskListeners: {
        title: 'Task listeners',
        type: 'text',
        value: '',
        info: '',
        hidden: true,
        dg: 'detail'

    },
    skipExpression: {
        title: 'Skip expression',
        type: 'script',
        value: '',
        info: '',
        dg: 'formula'
    },
    category: {
        title: 'Category',
        type: 'text',
        value: '',
        info: '',
        dg: 'detail'
    },
    taskAction: { // loại task: submit hoặc approval
        title: 'Task action',
        type: 'select',
        value: 'submit',
        info: '',
        options: [{
                text: 'Submit',
                value: 'submit'
            },
            {
                text: 'Approval',
                value: 'approval'
            },
        ],
        dg: 'taskAction'
    },
    approvalActions: { // BA tự cấu hình các hành động cho việc duyệt
        title: 'Approval actions',
        type: 'table',
        value: [{
                text: 'Approval',
                value: 'approval',
                color: 'green'
            },
            {
                text: 'Disapproval',
                value: 'disapproval',
                color: 'red'
            }
        ],
        info: '',
        columns: [{
                title: 'Text',
                name: 'text',
                type: 'text',
                renderer: function(instance, td, row, col, prop, value, cellProperties) {
                    let bgColor = instance.getDataAtProp('color')[row];
                    bgColor = bgColor == '' ? 'green' : bgColor;
                    let textColor = bgColor == 'white' ? '#212121' : 'white'
                    let bgColorMap = {
                        "yellow": "#FFD60",
                        "red": "#F44336",
                        "orange": "#FF9800",
                        "green": "#4CAF50",
                        "blue": "#2196F3",
                        "purple": "#9C27B0",
                        "gray": "#9E9E9E",
                        "pink": "#E91E63",
                        "black": "#000000",
                        "white": "#FFFFFF"
                    }
                    let btn = '';
                    if (value) {
                        bgColor = bgColorMap[bgColor];
                        btn = `
                        <button type="button" class="v-btn v-btn--depressed v-size--x-small my-1" style="background-color: ${bgColor};border-color: ${bgColor}">
                            <span class="v-btn__content" style="color:${textColor}">${value}</span>
                        </button>`;
                        btn = btn.replace(/\n/g, '');
                    }
                    $(td).html(btn);
                    return td;
                }
            },
            {
                title: 'Value',
                name: 'value',
                type: 'text'
            },
            {
                title: 'Color',
                name: 'color',
                type: 'autocomplete',
                source: ["yellow", "red", "orange", "green", "blue", "gray", "black", "white"]
            },
        ],
        dg: 'taskAction'
    },
    assignee: {
        title: 'Assignee',
        type: 'userAssignment', // trong user assignment có hai tab: select qua orgchart và viết script
        value: {
            orgChart: [],
            formula: '',
            orgchartSelectorValue: [] // dạng value của orgchartselector để hiển thị lên
        },
        activeTab: 'orgchart', // tab nào sẽ mở: orgchart hoặc script
        dg: 'assignment'
    },
    taskOwner: {
        title: 'Task owner',
        type: 'userAssignment', // trong user assignment có hai tab: select qua orgchart và viết script
        value: {
            orgChart: [],
            formula: '',
            orgchartSelectorValue: [] // dạng value của orgchartselector để hiển thị lên
        },
        activeTab: 'orgchart', // tab nào sẽ mở: orgchart hoặc script
        dg: 'assignment'
    },
    candidateUsers: {
        title: 'Candidate users',
        type: 'userAssignment',
        value: {
            orgChart: [],
            formula: ''
        },
        activeTab: 'orgchart', // tab nào sẽ mở: orgchart hoặc script
        dg: 'assignment'
    },
    useLocalScopeForResultVariable: {
        title: 'Use local scope for result variable',
        type: 'checkbox',
        value: false,
        info: '',
        dg: 'detail',
        hidden: true,
    },
    triggerable: {
        title: 'Set service task to be triggerable',
        type: 'checkbox',
        value: true,
        info: '',
        dg: 'detail',
        hidden: true,
    },
    delegateExpression: {
        title: 'Delegate expression',
        type: 'text',
        value: '',
        info: '',
        dg: 'detail',
        hidden: true,
    },
    classFields: {
        title: 'Class fields',
        type: 'text',
        value: '',
        info: '',
        dg: 'detail',
        hidden: true,
    },
    exceptions: {
        title: 'Exceptions',
        type: 'text',
        value: '',
        info: '',
        dg: 'detail',
        hidden: true,
    },
    resultvariableName: {
        title: 'Result variable name',
        type: 'text',
        value: '',
        info: '',
        dg: 'detail',
        hidden: true,
    },
    failedJobRetryTimeCycle: {
        title: 'Failed job retry time cycle',
        type: 'numeric',
        value: 1,
        info: '',
        dg: 'detail',
    },
    initiator: {
        title: 'Initiator',
        type: 'userAssignment', // trong user assignment có hai tab: select qua orgchart và viết script
        value: {
            orgChart: [],
            formula: '',
            orgchartSelectorValue: [] // dạng value của orgchartselector để hiển thị lên
        },
        activeTab: 'orgchart', // tab nào sẽ mở: orgchart hoặc script
        dg: 'assignment'
    },
}