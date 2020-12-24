
import SymperWorkerStorage from "worker-loader!@/worker/symperWorkerStorage.Worker.js"

var symperWorker = new SymperWorkerStorage()

export const setLoginInforWorker = function(loginInfor){
	symperWorker.postMessage(
		{
			action:'setLoginInfor',
			data:{
				loginInfor: loginInfor
			}
		}
	);
}
export const getLoginInforWorker = function(){
	symperWorker.postMessage(
		{
			action:'getLoginInfor',
		}
	);
	symperWorker.addEventListener("message", function (event) {
		let data = event.data;
		if(data.action == 'getLoginInfor'){
			debugger
			return data.data
		}
	});
}