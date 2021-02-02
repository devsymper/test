import NodeBase from './NodeBase'
import _cloneDeep from 'lodash/cloneDeep';
import NodeIO from "@/components/dataflow/configPool/NodeIO.js";

const defaultConfig = {
    addedColumns: [],
    allColumns: [],
    autoReplaceNullValue: true,
};

export default class Formula extends NodeBase {
    autoRemoveNullValue = true;
    constructor(symperId){
        super(symperId, 'Formula', _cloneDeep(defaultConfig));
    }

    
    convertInputToConfigs(){
        /**
         * configs có dạng:
         * {
         *      
                addedColumns:{},
                allColumns:[] // lấy từ input
         * }
         */
        let inputCols = {};
        this.input.forEach((item) => {
            inputCols[item.uid] = item;
        });

        let addedColumns = [];
        if (this.lastConfigCache[0]) {
            addedColumns = this.lastConfigCache;
        }
        this.configs = Object.assign(this.configs, {
            addedColumns: addedColumns,
            allColumns: inputCols
        });
        this.validateConfig();
    }


    process(source){
        if (source == 'impact') {
            this.convertInputToConfigs();
        }
        let outCols = [];
        let datasetId = this.configs.newIdDataset;
        for (let uid in this.configs.allColumns) {
            let item = this.configs.allColumns[uid];
            let newUid = datasetId + '_' + item.columnName;
            let newOutputCol = new NodeIO(
                datasetId,
                item.columnName,
                item.type,
                datasetId,
                item.title,
                newUid,
                this.id
            );
            outCols.push(newOutputCol);
        }

        if (this.input.length == 0) {
            return [];
        }

        for (let item of this.configs.addedColumns) {
            if (item.columnAdd.type == 'new') {
                let newUid = datasetId + '_' + item.name;
                let newOutputCol = new NodeIO(
                    datasetId,
                    item.name,
                    item.type,
                    datasetId,
                    item.title,
                    newUid,
                    this.id
                );
                outCols.push(newOutputCol);
            }
        }

        if(this.input.length > 0){
            this.lastConfigCache = this.configs.addedColumns;
        }
        this.validateConfig();
        return outCols;
    }


    getConfigsToSave(){
        let rsl = this.getCommonProp();
        rsl = Object.assign(this.configs, rsl);
        return rsl;
    }

    getFullConfigsFromSavedData(configs){
        return Object.assign(_cloneDeep(this.commonNodeProps), configs);
    }

    validateConfig(){
        let addedColumns = this.configs.addedColumns;
        let inputColMap = {};
        for(let uid in this.configs.allColumns){
            let col = this.configs.allColumns[uid];
            inputColMap[col.columnName] = col;
        }

        for(let column of addedColumns){
            let usedColumns = column.formula.match(/\[(.*?)\]/g);
            usedColumns = usedColumns ? usedColumns : [];
            let invalidCols = [];
            let detail = [];
            for(let colName of usedColumns){
                colName = colName.replace(/\]/,'').replace(/\[/,'');
                if(!inputColMap[colName]){
                    invalidCols.push(colName);
                    detail.push(`[${colName}]`);
                }
            }

            detail = detail.join(' , ');
            if(invalidCols.length > 0){
                this.configs.errorList.notFoundColumns = invalidCols;
                column.invalidConfigs = `invalid columns:     ${detail}!`;
            }else{
                column.invalidConfigs = false;
            }
        }
    }
}