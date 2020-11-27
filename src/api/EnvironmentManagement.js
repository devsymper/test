import Api from "./api";
import { appConfigs } from "./../configs.js";

var api = new Api(appConfigs.uniqueApiDomain.environmentManagement)
export const environmentManagementApi = {
    getAllEnvironment() {
        return api.get('enviromments');
	},
	getEnvServiceInstance(envId){
		return api.post('instances/query', {
			environmentId: envId
		})
	},
	getServerId(data){
		return api.post('instances/query', data)
	},
	getInstanceOfService(data){
		return api.post('instances/query', data)
	},
	addService(data){
		return api.post('services',data )
	},
	addVersion(data){
		return api.post('services/'+data.serviceId+"/versions",data.formData)
	},
	getVersion(serviceId){
		return api.get('services/'+serviceId+"/versions")
	},

	deloy(data){
		return api.post('instances/deploy',data)
	},
	getAllObjTypeOfService(obj){
		let prefix = obj.environmentIdentifier != ""  ?  obj.environmentIdentifier+"." : ""  
		let str = "https://" + prefix + obj.serviceIdentifier + '.symper.vn'
		let domainApi = new Api(str)
		return domainApi.get('env/object-types')
	},
	getAllObjOfTypeOfService(data){
		let domainApi = new Api(appConfigs.envDomain[data.type])
		return domainApi.get('env/'+data.value+'s')
	},
	migrateData(data){
		return api.post('instances/migrate',data)
	}
};