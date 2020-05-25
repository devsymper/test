import sDocument from './../../../store/document'
let dataSubmitStore = sDocument.state.submit
export default class Formulas {
    constructor(formulas, type) {
        this.formulas = formulas;
        /**
         * Loại của công thức: validate, data, require, readonly..f
         */
        this.type = type;
    }
    init() {
        this.effectedControl = null;
        this.inputControl = this.getInputControl();;
    }
    run(dataInput) {

    }

    getDataSubmitInStore() {
        return dataSubmitStore.listInputInDocument;
    }
    getDataInput() {

    }

    /**
     * Lấy tên các control mà công thức này cần lấy giá trị để thực thi
     * Đồng thời đẩy vào thông tin về việc control nào thay đổi dẫn đến các control khác thay đổi theo
     */
    getInputControl() {
        let fml = thisObj.formula;
        if (!fml) {
            return {};
        }
        let alterFml = fml.replace(/as\s+f\.([A-Za-z0-9_]+)/gi, '');
        let allRelateName = alterFml.match(/f\.([A-Za-z0-9_]+)/gi);
        if (!allRelateName) {
            return {};
        }
        let names = allRelateName.reduce((obj, name) => {
            obj[name.replace('f.', '').trim()] = true;
            return obj;
        }, {});
        return names;
    }

}