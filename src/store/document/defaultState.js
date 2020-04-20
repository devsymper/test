const defaultState = {
    editor: {
        allControl: {
            // tất cả control đã kéo vào {key:tên control, value : [properties control]}
            // sct: {
            //     properties: {
            //         name: {

            //         },
            //         display: {

            //         },
            //         print: {

            //         }
            //     },
            //     formulas: {

            //     }
            // }
        },
        currentSelectedControl: {
            // control đang được click bởi người dùng
            properties: {

            },
            formulas: {

            }
        }
    }
};

export default defaultState;