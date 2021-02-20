import NodeBase from './NodeBase'
import _cloneDeep from 'lodash/cloneDeep';
import NodeIO from "@/components/dataflow/configPool/NodeIO.js";
const defaultConfig = {
    allColumns: [],
    goods: '',
    stock: '',
    exchangeStock: '',
    quantity: '',
    totalAmount: ''
};

export default class WeightAvg extends NodeBase {
    constructor(symperId){
        super(symperId, 'WeightAvg', _cloneDeep(defaultConfig));
    }

    convertInputToConfigs = () => {
        this.configs = _cloneDeep(defaultConfig);
        this.configs.allColumns = this.input;
    }

    
    process(source){
        if (source == 'impact') {
            this.convertInputToConfigs();
        }
        return [
            this.makeOutByShort('ma_kho', 'Mã kho', 'text'),
            this.makeOutByShort('ma_hang', 'Mã hàng', 'text'),
            this.makeOutByShort('gia', 'Giá', 'number')
        ];
    }


    makeOutByShort(name, title, type){
        let newIdDataset = this.configs.newIdDataset;
        return new NodeIO(
            newIdDataset,
            name,
            type,
            newIdDataset,
            title,
            newIdDataset + '_' + name,
            this.id
        );
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