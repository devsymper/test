
/**
 * Class chứa các thuộc tính và các phương thức chung của toàn bộ các node trong dataflow 
 */
export default class NodeBase {
    type = '';
    configs = {}; // cấu hình của node này
    input = {}; // object map với key là id của node, value là mảng các của ouput tương ứng với node đó
    output = []; // mảng chứa các cột đầu ra của node này sau process
    lastConfigCache = {}; // cache lưu config đã qua chế biến của lần gần cấu hình gần nhất
    nextNodes = {}; // map các node tiếp theo, key là id duy nhất của từng node, value là object của class kế thừa NodeBase này
    id = '';
    
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
        this.configs = defaultConfig;
    }

    getType(){
        return this.type;
    }
    
    process(){}
}