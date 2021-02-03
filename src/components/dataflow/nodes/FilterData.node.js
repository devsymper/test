import NodeBase from './NodeBase'
import _cloneDeep from 'lodash/cloneDeep';
import NodeIO from "@/components/dataflow/configPool/NodeIO.js";

const defaultConfig = {
    condition: [{
        id: 'root',
        label: "AND",
        nodeType: "group",
        children: []
    }],
    allColumns: {}
};

export default class FilterData extends NodeBase {
    constructor(symperId){
        super(symperId, 'Filter', _cloneDeep(defaultConfig));
    }

    
    convertInputToConfigs(){
        let configs = _cloneDeep(defaultConfig);
        this.input.forEach(item => {
            configs.allColumns[item.uid] = item;
        });

        if (this.lastConfigCache[0] && this.lastConfigCache[0].children && this.input.length > 0) {
            this.clearUnuseColumn(this.lastConfigCache[0].children, configs.allColumns);
            configs.condition = this.lastConfigCache;
        }

        this.configs = Object.assign(_cloneDeep(this.commonNodeProps), configs);
    }


    clearUnuseColumn(children, allColumns){
        for (let idx in children) {
            let item = children[idx];
            if (item.nodeType == 'group') {
                this.clearUnuseColumn(item.children, allColumns);
            } else if (item.nodeType == 'item') {
                if (!allColumns.hasOwnProperty(item.column)) {
                    delete children[idx];
                }
            }
        }
        children = Object.values(children);
    }

    /**
     * configs có dạng:
     *  
     * condition:[ mỗi item có dạng new NodeIO và thêm operand và value],
     * allColumns:{
     *      uid: new NodeIO
     * }
     */
    process(source){
        if (source == 'impact') {
            this.convertInputToConfigs();
        } else if (!this.configs.allColumns || Object.keys(this.configs.allColumns).length == 0) {
            this.configs.allColumns = {};
            this.input.forEach(item => {
                this.configs.allColumns[item.uid] = item;
            });
        }

        let newIdDataset = this.getNewDatasetId();
        this.configs.newIdDataset = newIdDataset;

        if (this.configs.condition[0].children.length > 0) {
            this.lastConfigCache = this.configs.condition;
        }

        let output = [];
        for (let col of this.input) {
            output.push(new NodeIO(
                newIdDataset,
                col.columnName,
                col.type,
                0,
                col.title,
                newIdDataset + '_' + col.columnName,
                this.id
            ));
        }
        return output;
    }

    getConfigsToSave(){
        let rsl = this.getCommonProp();
        rsl.condition = this.configs.condition;
        return rsl;
    }


    getFullConfigsFromSavedData(configs){
        let rsl = this.restoreSharedProp(configs);

        rsl = Object.assign(rsl, configs);
        return rsl;
    }


}