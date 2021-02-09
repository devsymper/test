import { documentApi } from "@/api/Document.js";
import { syqlFunctionApi } from "@/api/SyqlFunction.js";
onmessage = function (event) {
    let data = event.data;
    let action = data.action;
    if(handler[action]){
        handler[action](data.data);
    } else {
        console.error(` action ${action} not found `);
    }
};

var handler = {
    async getListDocumentBefor(data){
        let filter = data.filter;
        let res = await documentApi.getListDocumentFilter(filter);
        if (res.status == 200 && res.data && res.data.listObject.length > 0) {
            self.postMessage({action:'getListDocumentBeforAfter', data :{listDocument:res.data.listObject}});
        }
    },
    async saveUpdateGanttBefor(data){
        let dataSend = {};
        dataSend.formulas = JSON.stringify(data.data);
        dataSend.variables = {};
        let isErr = false;
        let res = await syqlFunctionApi.updateBulk(dataSend); // res là arr 
        if (res && res.length > 0) {
            for (let i = 0; i < res.length; i++) {
                if (res[i].indexOf("ref") > -1) { // có trường update k thành công
                    isErr = true;
                    self.postMessage({action:'haveErrorUpdateGantt',data: {dataError:res}});
                }                
            }
            if (!isErr) {
                self.postMessage({action:'saveUpdateGanttAfter'});
            }
        }
    },
    async getListDocumentSubmitTaskBefor(data){
        let filter = data.filter;
        let res = await documentApi.getListDocumentFilter(filter);
        if (res.status == 200 && res.data && res.data.listObject.length > 0) {
            self.postMessage({action:'getListDocumentSubmitTaskAfter', data :{listDocument:res.data.listObject}});
        }
    },
    async ganttChartRemoveTask(data){
        let task = data.task;
        if (task.documentObjectId) {
            let res = await documentApi.deleteDocumentObject({objectIds:JSON.stringify([task.documentObjectId])});
            if (res.status == 200) {
                self.postMessage({action:'ganttChartRemoveTaskAfter'});
            }
        }
    }
    
}