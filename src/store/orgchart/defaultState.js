const defaultState = {
    editor: { // lưu các cấu hình của orgchart editor, có dạng instanceKey(timestamp unix) -> cấu hình của từng instance
        /**
         * allNodes: {
         *      idNode: {
         *          id: '',
         *          name: '',
         *          ...
         *      }
         * },
         * 
         * selectingNode: {
         *      id: '',
         *      name: '',
         *      ...
         * },
         * 
         * homeConfig: {
         * }
         */
    },
    allNodeStyle: []
};

export default defaultState;