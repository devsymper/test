const defaultState = {
    editor: {
        /**
         * Thuộc tính của tất cả các node trong process, 
         * dạng: object, key là id của node, value dạng: 
         * {
         *      id: '',
         *      type: '' , // loại node: UserTask, ScriptTask ...
         *      marker: '', // loại marker: 
         *      name: '', Tên của node để hiển thị
         *      attrs: {
         *      },
         * }
         */
        // allNodes: {

        // },
        // // Node hiện tại đang được click chọn
        // selectingNode: {

        // }
    },
    // danh sách tất cả các definition theo dạng id definition: object definition đó
    allDefinitions: {

    }
};

export default defaultState;