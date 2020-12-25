import {appManagementApi} from '@/api/AppManagement.js';


self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'getActiveAppSBS':
			let res = await getActiveAppSBS();
			await postMessage({action:'getActiveAppSBS', dataAfter : res})
            break;
        case 'getItemByAccessControl':
			let resItem = await getItemByAccessControl(data.ids);
			await postMessage({action:'getItemByAccessControl', dataAfter : resItem})
            break;
        default:
            break;
    }
};
export const getActiveAppSBS = async function(){
	let res = await appManagementApi.getActiveAppSBS()
	return res
}
export const getItemByAccessControl = async function(ids){
	let res = await appManagementApi.getListObjectIdentifier({
		pageSize:1000,
		ids: ids
	})
	return res
}