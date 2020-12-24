export const symperAjax = async(options) =>{
	if(options.method == "GET"){
		if(Object.keys(options.data).length > 0){
			let str = new URLSearchParams(options.data).toString();
			options.url.includes("?") ? options.url = options.url + "&" + str : options.url = options.url + "?" + str
		}
	}else{
		// if(options.dataType == "json"){
		// 	if(Object.keys(options.data).length > 0){
		// 		options.body = typeof options.data == 'object' ? JSON.stringify(options.data) : options.data;
		// 	}
		// }

		if(!options.contentType){
			options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
			let data = new URLSearchParams(options.data)
			options.body = data;
		}else {
			options.headers['Content-Type'] = options.contentType;
			options.body = typeof options.data == 'object' ? JSON.stringify(options.data) : options.data;
		}
	}
	const response = await fetch(options.url,options)
	return  response.status == 204  ? null : response.json()   
}