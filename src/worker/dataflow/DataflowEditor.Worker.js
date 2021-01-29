import { dataflowApi } from "@/api/dataflow.js";
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
    getGrapData(res){
        let nodes = res.data.nodes;
        let mapVisualNodes = {};
        for(let nodeId in nodes){
            mapVisualNodes[nodeId] = nodes[nodeId].jointInfo;
        }
        return {
            nodes: mapVisualNodes,
            links: res.data.links
        };
    },
    async getDataflowInfo(data){
        let idDataflow = data.id;
        let res = await dataflowApi.getInfo(idDataflow);
        let graph = this.getGrapData(res);
        self.postMessage({
			action: 'restoreDataflowData',
			data: {
                graph
            }
		});
    }
}