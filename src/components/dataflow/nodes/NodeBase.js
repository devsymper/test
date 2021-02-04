import _cloneDeep from 'lodash/cloneDeep';
const commonNodeProps = {
    wgName: '',
    wgDes: '',
    saveAs: [],
    saveAsDataset: false,
    nameToSaveAs: '',
    newIdDataset: '',
    selectedDataset: false,
    errorList: {},
    autoUpdatePeriod: {
        time: '5',
        unit: 'minutes'
    }
};
 
/**
 * Class chứa các thuộc tính và các phương thức chung của toàn bộ các node trong dataflow 
 */
export default class NodeBase {
    type = '';
    commonNodeProps = commonNodeProps;
    configs = _cloneDeep(commonNodeProps); // cấu hình của node này
    input = {}; // object map với key là id của node, value là mảng các của ouput tương ứng với node đó
    output = []; // mảng chứa các cột đầu ra của node này sau process
    lastConfigCache = {}; // cache lưu config đã qua chế biến của lần gần cấu hình gần nhất
    nextNodes = {}; // map các node tiếp theo, key là id duy nhất của từng node, value là object của class kế thừa NodeBase này
    prevNodes = {}; // map các node đầu vào của node này, key là id duy nhất của từng node, value là object của class kế thừa NodeBase này
    id = '';
    autoRemoveNullValue = false;// có thể tự động loại bỏ các giá trị null không
    
    /**
     * Hàm khởi tạo
     * @param {String} symperId chuỗi id duy nhất đại diện cho node trong một dataflow 
     * @param {String} type loại node
     * @param {Object} defaultConfig cấu hình mặc định của node này
     * @param {Object} jointChild object chứa instance của một node trong jointjs
     */
    constructor(symperId, type, defaultConfig){
        this.id = symperId;
        this.type = type;
        this.configs.newIdDataset = this.getNewDatasetId();
        this.configs = Object.assign(_cloneDeep(this.configs), defaultConfig);
    }

    getNewDatasetId(){
        if (this.configs.newIdDataset) {
            return this.configs.newIdDataset;
        } else {
            return 'stmp_' + Date.now();
        }
    }

    getType(){
        return this.type;
    }
    
    getOutput(){
        return this.output;
    }

    loadInputFromPrevNodes(){
        this.inputMapNode = {};
        this.input = [];
        this.inputDatasetCount = 0;
        for (let idPrevNode in this.prevNodes) {
            let prevOutput = this.prevNodes[idPrevNode].getOutput();
            this.inputMapNode[idPrevNode] = prevOutput;
            this.input = this.input.concat(prevOutput);
            this.inputDatasetCount += 1;
        }
    }

    restoreNodeFromSavedConfig(savedConfigs, mapDatasetAndColumn){
        this.loadInputFromPrevNodes();
        let newConfigs = this.getFullConfigsFromSavedData(savedConfigs, mapDatasetAndColumn);
        this.configs = newConfigs;
        this.run(false);
    }
    
    isValidConfig(){
        return true;
    }

    run(needPropagate = true, source = 'change-config'){
        if(this.isValidConfig()){
            this.output = this.process(source);
            if (needPropagate) {
                this.propagate();
            }
        }
    }

    impact(needPropagate = true, sourceNodeChange){
        this.loadInputFromPrevNodes();
        this.run(needPropagate, 'impact');
    }

    propagate(id = null){
        if (id === null) {
            for (let idNode in this.nextNodes) {
                this.nextNodes[idNode].impact(true, this.id);
            }
        } else {
            this.nextNodes[id].impact(true, this.id);
        }
    }

    restoreSharedProp(configs){
        let fullConfigs = _cloneDeep(commonNodeProps);
        fullConfigs = Object.assign(fullConfigs, configs);
        if (!Array.isArray(fullConfigs.saveAs)) {
            fullConfigs.saveAs = [];
        }
        if(this.autoRemoveNullValue){
            fullConfigs.autoReplaceNullValue = true;
            if(configs.hasOwnProperty('autoReplaceNullValue')){
                fullConfigs.autoReplaceNullValue = configs.autoReplaceNullValue;
            }
        }
        return fullConfigs;
    }

    getCommonProp(){
        let prop = _cloneDeep(commonNodeProps);
        for (let name in prop) {
            prop[name] = this.configs[name] ? this.configs[name] : '';
        }
        prop.nextNodes = Object.keys(this.nextNodes);
        prop.prevNodes = Object.keys(this.prevNodes);

        if(this.configs.hasOwnProperty('autoReplaceNullValue')){
            prop.autoReplaceNullValue = this.configs.autoReplaceNullValue;
        }
        return prop;
    }

    getFullConfigsFromSavedData(configs){} // hàm khôi phục toàn bộ cấu hình của node từ dữ liệu được lưu
    process(){} // hàm thực thi logic của node để tạo đầu ra
}