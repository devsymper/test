import { biApi } from "@/api/bi.js";

onmessage = function (event) {
    let data = event.data;
	let action = data.action;
	
    if(handler[action]){
        handler[action](data.data);
    } else {
        console.error(` action ${action} not found `);
    }
};

let relaventIcon = {
	number:'image/relations/number.svg',
	text:'image/relations/text.svg',
	time:'image/relations/time.svg',
	date:'image/relations/date.svg',
	datetime:'image/relations/datetime.svg',
	table:'image/relations/table.svg'
};
var handler = {
	async getAllDataset(){
		let res = await biApi.getAllDataset()
		self.postMessage({
			action: 'handleGetAllDataset',
			data: res
		})
	},
	async handleChangeSelectDataset(data){
		let resColumn = await biApi.getDatasetColumn(data.node.id)

		let dtsColumns = resColumn.data.columns;
		let subDatasets = resColumn.data.subDatasets;
		let datasets = handler.getRappidItems(dtsColumns, subDatasets)
		self.postMessage({
			action: 'handlerDatasetSelected',
			data:{
				datasets: datasets
			}
		})
	},
	getRappidItems(dtsColumns,subDatasets){
		let datasets = {};
		for(let dtsId in dtsColumns ){
			datasets[dtsId] = [];
			for(let column of dtsColumns[dtsId]){
				datasets[dtsId].push({
					id:dtsId+'_'+column.name,
					label:column.title?column.title:column.name,
					icon:relaventIcon[column.type]
				});
			}
		}

		for(let subDts of subDatasets){
			datasets[subDts.id_parent].push({
				id:subDts.id,
				label:subDts.alias_name?subDts.alias_name:subDts.name,
				icon:relaventIcon['table'],
				items:datasets[subDts.id]
			});
		}
		return datasets;
	},
}