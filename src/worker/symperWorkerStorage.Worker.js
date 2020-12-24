 let symperWorkerStorage = {
	loginInfor: ""
}
self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
	let data = workerDataReceive.data;
	switch (action) {
        case 'setLoginInfor':
			symperWorkerStorage.loginInfor = data.loginInfor
			debugger
			break;
        case 'getLoginInfor':
			postMessage({action:'getLoginInfor', data: symperWorkerStorage.loginInfor})
			debugger
			break;
		default:
			break;
	}		
}