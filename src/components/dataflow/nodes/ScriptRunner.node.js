import NodeBase from './NodeBase'
import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';
import NodeIO from "@/components/dataflow/configPool/NodeIO.js";

const defaultConfig = {
    allColumns: [],
    script: ''
};

export default class ScriptRunner extends NodeBase {
    constructor(symperId){
        let defaultConfig = {
            
        };
        super(symperId, 'Script', _cloneDeep(defaultConfig));
    }
    
    convertInputToConfigs(){
        let allColumns = {};
        this.input.forEach((item) => {
            allColumns[item.uid] = item;
        });
        this.configs = Object.assign(this.configs, {
            allColumns: allColumns,
            script: ''
        });
    }


    process(source){
        if (source == 'impact') {
            this.convertInputToConfigs();
        }
        return [];
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