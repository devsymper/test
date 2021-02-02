import NodeBase from './NodeBase'
import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';
import NodeIO from "@/components/dataflow/configPool/NodeIO.js";
const defaultConfig = {
    allColumns: [],
    columns: [],
    values: [],
    rows: [],
    autoReplaceNullValue: true
};

export default class PivotData extends NodeBase {
    constructor(symperId){
        super(symperId, 'Pivot', _cloneDeep(defaultConfig));
    }

    removeDuplicateColumns(configsType) {
        let items = this.configs[configsType];
        let itemsMap = {};
        items.forEach(ele => {
            itemsMap[ele.uid] = ele;
        });
        this.configs[configsType] = Object.values(itemsMap);
    }

    convertInputToConfigs(){
        let inputCols = [];
        let inputColMap = {};
        this.input.forEach((item) => {
            inputCols.push(item);
            inputColMap[item.uid] = item;
        });
        let oldConfigs = {
            columns: [],
            values: [],
            rows: []
        };

        for (let name in oldConfigs) {
            if (this.lastConfigCache[name]) {
                for (let item of this.lastConfigCache[name]) {
                    if (inputColMap[item.uid]) {
                        oldConfigs[name].push(item);
                    }
                }
            }
        }

        this.configs = Object.assign(this.configs, {
            newIdDataset: this.getNewDatasetId(),
            allColumns: inputCols,
            columns: oldConfigs.columns,
            values: oldConfigs.values,
            rows: oldConfigs.rows
        });
    }

    process(source){
        if (source == 'impact') {
            this.convertInputToConfigs();
        }
        let rsl = [];
        let newIdDataset = this.configs.newIdDataset;
        let staticOutputs = this.configs.rows;

        if (this.configs.columns.length == 0) {
            staticOutputs = staticOutputs.concat(this.configs.values);
        }
        staticOutputs.forEach((ele) => {
            let item = new NodeIO(
                newIdDataset,
                ele.columnName,
                ele.type,
                newIdDataset,
                ele.title,
                newIdDataset + '_' + ele.columnName,
                this.id
            );
            item.groupRow = true; // phục vụ cho việc hiển thị group các dòng có cùng giá trị với nhau
            rsl.push(item);
        });
        this.lastConfigCache = {
            columns: this.configs.columns,
            values: this.configs.values,
            rows: this.configs.rows,
        };
        return rsl;
    }

    resetOutputColumns(columns){
        let cols = this.process('reset-oupt-columns');
        let newIdDataset = this.configs.newIdDataset;

        columns.forEach(ele => {
            cols.push(new NodeIO(
                newIdDataset,
                ele.name,
                ele.type,
                newIdDataset,
                ele.title,
                newIdDataset + '_' + ele.name,
                this.id
            ));
        });
        this.output = cols;
    }

    getConfigsToSave(){
        let rsl = this.getCommonProp();
        return Object.assign(this.configs, rsl);
    }

    getFullConfigsFromSavedData(configs){
        let rsl = this.restoreSharedProp(configs);
        rsl = Object.assign(rsl, configs);
        return rsl;
    }
}