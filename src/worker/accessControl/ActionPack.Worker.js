import {uiConfigApi} from "@/api/uiConfig";
import { permissionApi } from "@/api/permissionPack";


self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'getAppInActionPack':
			let getAppInActionPackRes = await getAppInActionPack(data.str);
            postMessage({action:'getAppInActionPack', dataAfter : getAppInActionPackRes})
            break;
        case 'deleteActionPack':
			let deleteActionPackRes = await deleteActionPack(data.ids);
            postMessage({action:'deleteActionPack', dataAfter : deleteActionPackRes})
            break;
        
        default:
            break;
    }
};


export const getAppInActionPack = async function(str) {
	let res = await uiConfigApi.getUiConfig(str)
	let arr = []
	if(res.status == 200){
		arr = JSON.parse(res.data.detail)
	}
	
	return arr
}
export const deleteActionPack = async function(ids) {
	let res = await permissionApi.deleteActionPack(ids);
	if(res.status == 200){
		return 'success'
	}else{
		return 'error'
	}
}

