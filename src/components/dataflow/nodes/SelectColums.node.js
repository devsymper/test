import NodeBase from './NodeBase'
import _cloneDeep from 'lodash/cloneDeep';
import NodeIO from "@/components/dataflow/configPool/NodeIO.js";

export default class SelectColumns extends NodeBase {
    constructor(symperId){
        let defaultConfig = {
            columns: []
        };
        super(symperId, 'Select', defaultConfig);
    }

    convertInputToConfigs(){
        let columns = [];
        let selected = false;

        this.input.forEach(item => {
            selected = this.lastConfigCache[item.columnName] ? true : false;
            columns.push({
                uid: item.uid,
                id_dataset: item.idDataset,
                name: item.columnName,
                columnName: item.columnName,
                title: item.title,
                type: item.type,
                selected: selected
            });
        });
        this.configs.columns = columns;
    }

    process(source){
        if (source == 'impact') {
            this.convertInputToConfigs();
        }

        let newIdDataset = this.getNewDatasetId();
        this.configs.newIdDataset = newIdDataset;
        let rsl = [];
        this.configs.columns.forEach(item => {
            if (item.selected) {
                rsl.push(new NodeIO(
                    newIdDataset,
                    item.columnName,
                    item.type,
                    0,
                    item.title ? item.title : item.name,
                    newIdDataset + '_' + item.columnName,
                    this.id));
                // set cache cho lần tiếp theo
                this.lastConfigCache[item.columnName] = true;
            } else if (this.lastConfigCache.hasOwnProperty(item.columnName)) {
                delete this.lastConfigCache[item.columnName];
            }
        });
        return rsl;
    }

    // afterNodeSelected() {
    //     SDataflowEditor.$emit('check-selected-rows', {});
    // }
    
    getConfigsToSave(){
        let configs = this.configs;
        let rsl = this.getCommonProp();
        rsl.columns = {};

        configs.columns.forEach(column => {
            rsl.columns[column.uid] = {
                uid: column.uid,
                title: column.title,
                type: column.type,
                selected: column.selected
            }
        });
        return rsl;
    }

    getFullConfigsFromSavedData(configs){
        let fullConfigs = this.restoreSharedProp(configs);
        let prevNode = Object.values(this.prevNodes)[0];
        let mapColumnAndUid = {};
        if(prevNode){
            mapColumnAndUid = prevNode.getOutput().reduce((map, el) => {
                map[el.uid] = el;
                return map;
            }, {});
        }


        fullConfigs.columns = [];
        for (let uid in configs.columns) {
            let col = mapColumnAndUid[uid];
            if (!col) {
                console.log(mapColumnAndUid, uid, this.id);
            }else{
                let newCol = _cloneDeep(col);
                newCol = Object.assign(newCol, configs.columns[uid]);
                fullConfigs.columns.push(newCol);
            }
        }
        return fullConfigs;
    }
}