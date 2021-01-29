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
        let res = await syqlFunctionApi.updateBulk(dataSend);
        self.postMessage({action:'saveUpdateGanttAfter'});

    }
    
}