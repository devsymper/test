import {environmentManagementApi} from '@/api/EnvironmentManagement'

const getAllEnvirontment = (context) => {
    if (context.state.allEnvironment.length == 0) {
        try {
			environmentManagementApi.getAllEnvironment().then(res=>{
				if (res.status == 200) {
					context.commit('setAllEnvironment', res.data.listObject);
				} else {
					SYMPER_APP.$snotifyError(error, "Can not get all node style!");
				}
			}).catch(err=>{

			})
           
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get all node style !");
        }
    }
}

const getInstanceInEnv = (context , id) => {
	context.commit('setCurrentEnvId', id)
        try {

			if(!context.state.serviceInstanceInEnv[id]){
				environmentManagementApi.getEnvServiceInstance(id).then(res=>{
					if (res.status == 200) {
						let arr = res.data.length > 0 ? res.data : []
						context.commit('setServiceInstanceInEnvironment', arr)
					} else {
						SYMPER_APP.$snotifyError(error, "Can not get all node style!");
					}
				}).catch(err=>{
	
				})
			}
			
           
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get all node style !");
        }
}
const getObjectTypeOfService = (context , type) => {
	context.commit('setCurrentServiceType', type)
	let self = this
        try {
			if(!context.state.listObjectTypeInService[type]){
				environmentManagementApi.getAllObjTypeOfService(type).then(res=>{
					if (res.status == 200) {
						debugger
						let arr = res.data.length > 0 ? res.data : []
						context.commit('setObjectTypeOfService', arr)
					} else {
						SYMPER_APP.$snotifyError(error, "Can not get data");
					}
				}).catch(err=>{
					debugger
					self.$snotify({
						type: "error",
						title: err
					})
				})
			}
			
           
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get data");
        }
}

export { 
	getAllEnvirontment,
	getInstanceInEnv,
	getObjectTypeOfService
};