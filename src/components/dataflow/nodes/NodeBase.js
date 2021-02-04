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
        this.changeConfig(newConfigs, false);
    }

    changeConfig(newConfigs, needPropagate = true){
        this.configs = newConfigs;
        this.output = this.process('change-config');
        // this.checkAndShowValidate();
        if (needPropagate) {
            this.propagate();
        }
    }

    impact(input, needPropagate = true, idJointNode){
        if (this.stackInput) {
            for (let column of input) {
                column.from = idJointNode;
            }
            this.inputMapNode[idJointNode] = input;
            this.input = [];
            this.inputDatasetCount = 0;
            for (let fromNodeId in this.inputMapNode) {
                this.input = this.input.concat(this.inputMapNode[fromNodeId]);
                this.inputDatasetCount += 1;
            }
        } else {
            this.inputMapNode = {};
            this.inputMapNode[idJointNode] = input;

            this.inputDatasetCount = 1;
            this.input = input;
        }
        this.runAfterSetInput(needPropagate);
    }

    propagate(id = null){
        if (id === null) {
            for (let idNode in this.nextNodes) {
                this.nextNodes[idNode].impact(this.output, true, this.id);
            }
        } else {
            this.nextNodes[id].impact(this.output, true, this.id);
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

    getFullConfigsFromSavedData(configs){} // hàm khôi phục toàn bộ cấu hình của node từ dữ liệu được lưu
    process(){} // hàm thực thi logic của node để tạo đầu ra
}