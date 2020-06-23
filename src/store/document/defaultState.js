const defaultState = {
    editor: {
        allControl: {
            // tất cả control đã kéo vào {key:tên control, value : [properties control]}
            // s-control-243564534: {
            //     properties: {
            //         name: {

            //         },
            //         display: {

            //         },
            //         print: {

            //         }
            //     },
            //     formulas: {

            //     },
            //     type:"",
            //     listFields:{ // truowng hop table thi co cac control

            //     },
            //      id:0
            // }
        },
        currentSelectedControl: {
            // control đang được click bởi người dùng
            properties: {
                name: {},
                display: {},
                print: {},

            },
            formulas: {

            },
            type: "",
            id: ""
        },
        listControlTreeData: [],
        allControlForTableOption: []
    },
    submit: {
        listInputInDocument: {

        },
        dataInputCache: {

        },
        docStatus: 'init',
        SQLLiteDB: {},
        rootControl: {},
        impactedFieldsList: {},
        impactedFieldsListWhenStart: {},
        rootChangeFieldName: null,
        //biến phục vụ cho autocomplete trong table
        currentTableInteractive: null, //chỉ ra table đang được tương tác
        currentCellSelected: null, // chỉ ra cell đang nhập
        currentControlAutoComplete: null // biến chỉ ra control nào đang autocomplete
    },
    detail: {
        allData: null
    },
    documentProps: {},
    listAllDocument: [], // Khadm: danh sách tất cả các document được active, phục vụ cho việc  autocomplete trong script editor
    viewType: null // chỉ định là submit, detail, hay update
};

export default defaultState;