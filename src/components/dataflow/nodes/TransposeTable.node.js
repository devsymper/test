import NodeBase from './NodeBase'
import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';
import NodeIO from "@/components/dataflow/configPool/NodeIO.js";

const defaultConfig = {
    keyColumns: [],
    dataColumns: [],
    keyColumnTitle: 'Name',
    dataColumnTitle: 'Value',
    autoReplaceNullValue: true
};
export default class TransposeTable extends NodeBase {
    autoRemoveNullValue = true;
    constructor(symperId){
        super(symperId, 'TransposeTable', _cloneDeep(defaultConfig));
    }

    convertInputToConfigs(){
        let allInputCols = [];
        this.input.forEach((item) => {
            allInputCols.push({
                uid: item.uid,
                id_dataset: item.idDataset,
                name: item.columnName,
                columnName: item.columnName,
                title: item.title,
                type: item.type,
                selected: false
            });
        });

        let keyColumns = _cloneDeep(allInputCols);
        allInputCols.forEach((item) => {
            item.selected = true
        });
        this.configs = Object.assign(this.configs, {
            dataColumns: allInputCols,
            keyColumns: keyColumns,
            newIdDataset: this.configs.newIdDataset,
            keyColumnTitle: this.configs.keyColumnTitle ? this.configs.keyColumnTitle : 'Name',
            dataColumnTitle: this.configs.dataColumnTitle ? this.configs.dataColumnTitle : 'Value',
        });
    }

    process(source){
        if (source == 'impact') {
            this.convertInputToConfigs();
        }

        let cols = [];
        let newIdDataset = this.configs.newIdDataset;
        for(let col of this.configs.keyColumns){
            if(col.selected){
                cols.push(new NodeIO(
                    newIdDataset,
                    col.columnName,
                    col.type,
                    newIdDataset,
                    col.title,
                    newIdDataset + '_' + col.name,
                    this.id
                ));
            }
        }

        cols.push(new NodeIO(
            newIdDataset,
            'symper_new_column_name',
            'text',
            newIdDataset,
            this.configs.keyColumnTitle ? this.configs.keyColumnTitle : 'Name',
            newIdDataset + '_symper_new_column_name',
            this.id
        ));

        cols.push(new NodeIO(
            newIdDataset,
            'symper_new_column_value',
            'text',
            newIdDataset,
            this.configs.dataColumnTitle ? this.configs.dataColumnTitle : 'Value',
            newIdDataset + '_symper_new_column_value',
            this.id
        ));
        return cols;
    }


    getConfigsToSave(){
        let rsl = this.getCommonProp();
        let savedConfigs = Object.assign({}, this.configs);
        return Object.assign(savedConfigs, rsl);
    }

    getFullConfigsFromSavedData(configs){
        let rsl = this.restoreSharedProp(configs);
        rsl = Object.assign(rsl, configs);
        return rsl;
    }
}