
self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'getDetailWorkflow':
			let dataDetail = await getWorkflowDetail(data.processKey);
            postMessage({action:'getDetailWorkflow', dataAfter : dataDetail})
            break;
       
        default:
            break;
    }
};


export const getWorkflowDetail = async function(id) {
	let obj = {}
	return obj
}
