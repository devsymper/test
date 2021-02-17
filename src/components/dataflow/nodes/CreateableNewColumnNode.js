import { util } from '../../../plugins/util';
import NodeBase from './NodeBase'

export default class CreateableNewColumnNode extends NodeBase {
    newColumnNames = {}; // chứa map tên các cột mới được tạo ra trong quá trình chạy
    constructor(symperId, type ,defaultConfig){
        super(symperId, type, defaultConfig);
    }

    resetNewColumnNames(){
        this.newColumnNames = {};
    }

    getNewColumnName(name){
        if (typeof name != 'string') {
            return '';
        }
        name = util.str.nonAccentVietnamese(name, true);
        let newName = name;

        if (this.newColumnNames[name]) {
            newName += '___' + this.newColumnNames[name];
            this.newColumnNames[name] += 1;
        } else {
            this.newColumnNames[name] = 1;
        }
        return newName;
    }
}