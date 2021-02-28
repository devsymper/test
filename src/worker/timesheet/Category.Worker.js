import timesheetApi from '@/api/timesheet.js'

self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'getListCategory':
			let listCategory = await getListCategory();
            postMessage({action:'getListCategory', dataAfter: listCategory})
            break;
        default:
            break;
    }
};

export const getListCategory = async function() {
    let listCategory =[];
    let res = await timesheetApi.getAllCategory({});
    if (res.status === 200) {
       res.data.listObject.map(cate=>{
            listCategory.push({
                ...cate,
                fullName:cate.key+"-"+cate.name
            })                 
        })
     }
    return listCategory;
}
