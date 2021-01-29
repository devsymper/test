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
			debugger
			let deleteActionPackRes = await deleteActionPack(data.ids);
            postMessage({action:'handleDeleteActionPack', dataAfter : deleteActionPackRes})
            break;
        case 'updateActionPack':
			let updateActionPackRes = await updateActionPack(data);
            postMessage({action:'updateActionPack', dataAfter : updateActionPackRes})
            break;
        case 'createActionPack':
			let createActionPackRes = await createActionPack(data);
            postMessage({action:'createActionPack', dataAfter : createActionPackRes})
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
	let arr = []
	debugger
	ids.forEach(async function(e){
		let res = await permissionApi.deleteActionPackById(e);
		debugger
		if(res.status == 200){
			arr.push('success')
		}else{
			arr.push('error')
		}
	})
	debugger
	return arr
	// if(res.status == 200){
	// 	return 'success'
	// }else{
	// 	return 'error'
	// }
}
export const updateActionPack = async function(data) {
	let res = await permissionApi.updateActionPack(data.dataActionPack.id , data.dataActionPack.dataToSave);
	if(res.status == 200){
		let resUi = await uiConfigApi.saveUiConfig(data.dataUi)
		return 'success'
	}else{
		return 'error'
	}
}
export const createActionPack = async function(data) {
	let res = await permissionApi.createActionPack(data.dataActionPack.dataToSave);
	if(res.status == 200){
		data.dataUi.widgetIdentifier = "action-pack:" + res.data.id
		let resUi = await uiConfigApi.saveUiConfig(data.dataUi)
		return 'success'
	}else{
		return 'error'
	}
}

