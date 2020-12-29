import {uiConfigApi} from "@/api/uiConfig";


self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'getAppInActionPack':
			let getAppInActionPackRes = await getAppInActionPack(data.str);
            postMessage({action:'getAppInActionPack', dataAfter : getAppInActionPackRes})
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

