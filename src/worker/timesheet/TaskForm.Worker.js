import timesheetApi from '@/api/timesheet.js'
import moment from 'moment';

self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'getCategory':
			let listCategory = await getCategory(data);
            postMessage({action:'getCategory', dataAfter: listCategory})
            break;
        case 'createTask':
            let isSuccess = await createTask(data);
            postMessage({action:'createTask', dataAfter: isSuccess})
            break;
        default:
            break;
    }
};

export const getCategory = async function() {
    let listCategory =[];
    let res = await timesheetApi.getAllCategory({});
    if (res.status === 200) {
        let category = res.data.listObject;
            for(let i=0; i<category.length; i++){
                listCategory.push(
                    category[i].key+"-"+category[i].name
            )
        }
    }
    return listCategory;
}

export const createTask = async function(data) {
    let check = false;
    let res = await timesheetApi.createTask(data);
    if(res.status ==200){
        check = true
    }
    return check
}