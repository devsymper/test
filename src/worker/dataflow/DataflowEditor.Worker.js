import { dataflowApi } from "@/api/dataflow.js";
import { autoLoadNodeClasses } from "@/components/dataflow/configPool/dataflowConfig.js";
import _cloneDeep from "lodash/cloneDeep";
let mapTypeToNodeClass = autoLoadNodeClasses();

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
    getInitOrderOneField(idNode, mapNodes, nodesOrder) {
        if (nodesOrder[idNode]) {
            delete nodesOrder[idNode];
        }
        nodesOrder[idNode] = true;
        for (let nextNodeId of mapNodes[idNode].symperConfigs.nextNodes) {
            this.getInitOrderOneField(nextNodeId, mapNodes, nodesOrder);
        }
    },

    /**
     * Lấy thứ tự thực thi của các node, đảm bảo việc: khi đến một node nào thì các input của node đó đã được xử lý đầy đủ
     * @param {Object} mapNodes map id với saved node config khi lấy từ db lên
     */
    getNodeExeOrder(mapNodes){
        let nodesOrder = {};
        for (let nodeId in mapNodes) {
            this.getInitOrderOneField(nodeId, mapNodes, nodesOrder);
        }
        return Object.keys(nodesOrder);
    },
    
    makeMapDatasetAndColumn(datasetColumns){
        let rsl = {};
        let dtsColMap = datasetColumns.columns;

        for(let id in datasetColumns.datasetInfo){
            rsl[id] = {
                columns: {},
                info: datasetColumns.datasetInfo[id],
                subDatasets: []
            }
            rsl[id].columns[id] = dtsColMap[id];
        }

        for(let subDts of datasetColumns.subDatasets){
            let parentId = subDts.id_parent;
            rsl[parentId].columns[subDts.id] = dtsColMap[subDts.id];
            rsl[parentId].subDatasets.push(subDts);
        }
        return rsl;
    },

    restoreRunningNodeData(datasetColumns, nodes, links){
        let nodesIdOrder = this.getNodeExeOrder(nodes);
        let mapRunNode = {};
        let savedNode = null;
        let type = '';
        let nodeObj = null;
        let mapDatasetAndColumn = this.makeMapDatasetAndColumn(datasetColumns);

        for(let id of nodesIdOrder){
            savedNode = nodes[id];
            type = savedNode.jointInfo.type.replace('app.','');
            nodeObj = new mapTypeToNodeClass[type](id);
            for(let prevId of savedNode.symperConfigs.prevNodes){
                nodeObj.prevNodes[prevId] = mapRunNode[prevId];
            }
            nodeObj.restoreNodeFromSavedConfig(savedNode.symperConfigs, mapDatasetAndColumn);
            
            mapRunNode[id] = nodeObj;
        }

        
        for(let id of nodesIdOrder){
            savedNode = nodes[id];
            let nodeObj = mapRunNode[id];
            for(let nextId of savedNode.symperConfigs.nextNodes){
                nodeObj.nextNodes[nextId] = mapRunNode[nextId];
            }
        }
        return mapRunNode;
    },

    async getDataflowInfo(data){
        let idDataflow = data.id;
        let res = await dataflowApi.getInfo(idDataflow);
        let graph = this.getGrapData(res);
        let info = res.data;
        let dataflow = info.dataflow;

        graph.homeConfigs = {
            name: dataflow.name,
            variables: dataflow.variables,
            description: dataflow.description ? dataflow.description : ''
        };

        // gửi data lên để hiển thị
        self.postMessage({
			action: 'restoreDataflowDisplay',
			data: {
                graph
            }
        });
        
        // gửi data lên để chạy logic
        let runningNodeData = this.restoreRunningNodeData(
            info.columnsAndSubdatasets,
            res.data.nodes,
            res.data.links
        );
        self.postMessage({
			action: 'restoreRunningNodeData',
			data: runningNodeData
        });
    }
}