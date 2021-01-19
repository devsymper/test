const defaultState = {
    allDashboard: { // lưu lại tất cả các config của các dashboard theo instanceKey
        
    },
    listColumnInDataset: {
        columns : {},
        subDatasets : []
    },  // lưu lại các column trong dataset và subDataset khi call api https://bi-service.symper.vn/datasets/2891,3637/columns   // data có dạng {column : { "list_id_dataset" : [{columns}] }, subDatasets:[{}]}

};

export default defaultState;