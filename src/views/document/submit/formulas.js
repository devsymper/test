import sDocument from './../../../store/document'
let dataSubmitStore = sDocument.state.submit
import ClientSQLManager from "./clientSQLManager.js";
export default class Formulas {
    constructor(keyInstance, formulas, type) {
            /**
             * chỉ ra đang ở instance của view submit nào, (trường hợp có sub form thì có 2 key)
             */
            this.keyInstance = keyInstance;
            this.formulas = formulas;
            /**
             * Loại của công thức: validate, data, require, readonly..f
             */
            this.type = type;
            this.inputControl = this.setInputControl();
        }
        /**
         * Hàm xử lí thay các giá trị của input đầu vào để thực hiện truy vấn
         * @param {} dataInput 
         */
    checkExistFormulas() {
        if (this.formulas == "" && this.formulas == false && this.formulas == undefined) {
            return false;
        } else return true;
    }
    handleBeforeRunFormulas(dataInput) {
            let formulas = this.formulas;
            for (let controlName in dataInput) {
                let regex = new RegExp("{" + controlName + "}", "g");
                formulas = formulas.replace(regex, "'" + dataInput[controlName] + "'");
            }
            return this.run(formulas);
        }
        /**
         * Hàm chạy công thức
         */
    run(sql) {
        let rs = ClientSQLManager.run(this.keyInstance, sql, false);
        return rs;

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
    setInputControl() {
        if (this.checkExistFormulas()) {
            let allRelateName = this.formulas.match(/{[A-Za-z0-9_]+}/gi);
            if (!allRelateName) {
                return {};
            }
            let names = allRelateName.reduce((obj, name) => {
                let controlName = name.match(/\w+/g);
                obj[controlName] = true;
                return obj;
            }, {});
            return names;
        }
        return {}
    }
    getInputControl() {
        return this.inputControl;
    }

    getFormulas() {
        return this.formulas;
    }



}