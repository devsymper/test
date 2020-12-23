




export const customApiCallWorker = async(options) =>{
	if(options.method == "GET"){
		if(Object.keys(options.data).length > 0){
			let str = new URLSearchParams(options.data).toString();
			options.url.includes("?") ? options.url = options.url+"&"+str : options.url = options.url+"?"+str
		}
	}else{
		if(options.dataType == "json"){
			options.body = options.data
		}
	}
	const response = await fetch(options.url,options)
	return  response.status == 204  ? null : response.json()   
}