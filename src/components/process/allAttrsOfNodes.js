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
        dg: 'formula'
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
                color: ''
            },
            {
                text: 'Disapproval',
                value: 'disapproval',
                color: ''
            }
        ],
        info: '',
        columns: [{
                title: 'Text',
                dataKey: 'text',
                type: 'text'
            },
            {
                title: 'Value',
                dataKey: 'value',
                type: 'text'
            },
            {
                title: 'Color',
                dataKey: 'color',
                type: 'text'
            },
        ],
        dg: 'taskAction'
    },
    assignee: {
        title: 'Assignee',
        type: 'script',
        value: '',
        dg: 'assignment'
    },
    candidateUsers: {
        title: 'Candidate users',
        type: 'script',
        value: '',
        dg: 'assignment'
    }
}