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

            //     }
            // }
        },
        currentSelectedControl: {
            // control đang được click bởi người dùng
            properties: {

            },
            formulas: {

            },
            type: ""
        },
        listControlTreeData: []
    }
};

export default defaultState;