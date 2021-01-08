import importApi from '@/api/ImportExcel'
self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'getMappingTable':
			let mapping = await getMappingTable(data);
		    postMessage({action:'getMappingTable', dataAfter : mapping})
            break;
        default:
            break;
    }
};