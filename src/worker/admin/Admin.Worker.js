import {adminApi} from '@/api/Admin.js'

self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'getDetailWorkflow':
			let dataDetail = await getWorkflowDetail(data.processKey);
            postMessage({action:'getDetailWorkflow', dataAfter : dataDetail})
            break;
        case 'endProcessInstance':
			let dataEndProcessInstance = await endProcessInstance(data.listItemSelected)
            postMessage({action:'endProcessInstance', dataAfter : dataEndProcessInstance})
            break;
        case 'stopProcessInstance':
			let dataStopProcessInstance = await stopProcessInstance(data.listItemSelected)
            postMessage({action:'endProcessInstance', dataAfter : dataStopProcessInstance})
            break;
        
        default:
            break;
    }
};


export const getWorkflowDetail = async function(id) {
	let obj = {}
	let res = await adminApi.getLatestWD(id)
	if(res.data[0]){
		obj.processDefination = res.data[0]
		obj.processId = id
		let dataTracking = await adminApi.trackingProcess(res.data[0].id)
		if(dataTracking.status == 200){
			obj.currentTrackingProcess = dataTracking.data
		}

		let dataAggreate  = await adminApi.aggregateWorkflow(res.data[0].id)
		if(dataAggreate.status == 200){
			obj.aggregateWorkflow = dataAggreate.data
		}
	}
	return obj
}
export const endProcessInstance = async function(lists) {
	let newLists = []
	for(let i in lists){
		if(lists[i].status == "3"){
			newLists.push('isDone') 
		}else{
			let res = await adminApi.deleteProcessInstances(lists[i].id)
			newLists.push('done')
		}
	}	
	return newLists
}
export const stopProcessInstance = async function(lists) {
	let newLists = []
	for(let i in lists){
		if(lists[i].status == "3"){
			newLists.push('isDone') 
		}else{
			let res = await adminApi.stopProcessInstances(lists[i].id)
			if(res.suspended == true){
				newLists.push('done')
			}else{
				newLists.push('isStop')
			}
		}
	}	
	return newLists
}