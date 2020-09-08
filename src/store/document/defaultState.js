const defaultState = {
    editor: {
        editor_123: {
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
                    table: {},

                },
                formulas: {

                },
                type: "",
                id: ""
            },
            listControlTreeData: [],
            allControlForTableOption: [],
            listDataFlow: []
        }
    },
    submit: {
        submit_123: {
            listInputInDocument: {

            },
            docStatus: 'init',
            SQLLiteDB: {},
            rootControl: {},
            impactedFieldsList: {},
            impactedFieldsListWhenStart: {},
            rootChangeFieldName: null,
            //biến phục vụ cho autocomplete trong table
            currentTableInteractive: null, //chỉ ra table đang được tương tác
            currentControlActive: null, // biến chỉ ra control nào đang active
            currentControlAutoComplete: null, // biến chỉ ra control nào đang autocomplete
            submitFormulas: null,
            listUser: null,
            localRelated: {},
            workflowVariable: {},
            currentControlEditByUser: null,
            autocompleteData: { // lưu lại các giá trị của autocomplete khi đã gõ
                controlName: {
                    header: [],
                    cacheData: {
                        letter: { // giá trị nhập và dữ liệu tương ứng
                            data: []
                        }
                    }
                }
            },
            orgchartTableSqlName: {},
            tableLoaded: {},
            readyLoaded: false
        }
    },
    detail: {
        detail_123: {
            allData: null
        }
    },
    documentProps: {
        instance: {}
    },
    listAllDocument: [], // Khadm: danh sách tất cả các document được active, phục vụ cho việc  autocomplete trong script editor
    needGetAllDoc: true, // flag đánh dấu có cần lấy tất cả các doc hay không, thằng đầu tiên muốn lấy sẽ set biến này về false để những thằng sau ko cần lấy nữa
    viewType: {
        instance: null
    } // chỉ định là submit, detail, hay update
};

export default defaultState;