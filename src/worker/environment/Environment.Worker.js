import {environmentManagementApi} from '@/api/EnvironmentManagement'
import { setWorkerDataStore } from '@/worker/common/workerUtil';


self.onmessage = async function (event) {
	setWorkerDataStore(event);
	var workerDataReceive = event.data;
    let action = workerDataReceive.data.action;
	let data = workerDataReceive.data.data;
	switch (action) {
        case 'addVersion':
			let addVersionRes = await addVersion(data);
			await postMessage({action:'addVersion', dataAfter : addVersionRes})
            break;
        case 'deployVersion':
			let deployVersionRes = await deployVersion(data);
			await postMessage({action:'deployVersion', dataAfter : deployVersionRes})
            break;
        case 'updateVersion':
			let updateVersionRes = await updateVersion(data);
			await postMessage({action:'updateVersion', dataAfter : updateVersionRes})
            break;
        case 'upgradeVersion':
			let upgradeVersionRes = await upgradeVersion(data);
			await postMessage({action:'upgradeVersion', dataAfter : upgradeVersionRes})
            break;
        case 'changeServer':
			let changeServerRes = await changeServer(data);
			await postMessage({action:'changeServer', dataAfter : changeServerRes})
            break;
        case 'migrateData':
			let migrateDataRes = await migrateData(data);
			await postMessage({action:'migrateData', dataAfter : migrateDataRes})
            break;
        default:
            break;
    }
};
export const addVersion = async function(data){
	let res = await environmentManagementApi.addVersion(data)
	return res
}
export const deployVersion = async function(data){
	let res = await environmentManagementApi.getServerId(data.dataGetServerId)
	let formData = {
		serverId: res.data[0].serverId,
		versionId: data.versionId,
		environmentId: data.environmentId
	}
	let resDeploy = await environmentManagementApi.deloy(formData)
	return resDeploy
}
export const upgradeVersion = async function(data){
	let upgradeVersionRes = await environmentManagementApi.deloy(data.formData)
	return upgradeVersionRes
}
export const updateVersion = async function(data){
	let res = await environmentManagementApi.getServerId(data.dataGetServerId)
	let formData = {
		serverId: res.data[0].serverId,
		versionId: data.versionId,
		environmentId: data.environmentId
	}
	let resUpdateVersion = await environmentManagementApi.updateVersion(formData)
	return resUpdateVersion
}
export const changeServer = async function(data){
	let res = await environmentManagementApi.changeServer(data)
	return res
}
export const migrateData = async function(data){
	let res = await environmentManagementApi.getServerId(data.dataGetServerId)
	data.formData.targetInstanceId = res.data[0].id
	let migrateDataRes = await environmentManagementApi.migrateData(data.formData)
	return migrateDataRes
}
