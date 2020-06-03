import sDocument from './../../../store/document'
let dataSubmitStore = sDocument.state.submit
import ClientSQLManager from "./clientSQLManager.js";
import { documentServiceApi } from "./../../../api/DocumentService";

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
        /**
         * Hàm xử lí việc thay các giá trị vào {control} và tách công thức server để chạy trước nếu có
         * @param {Object} dataInput 
         */
    async handleBeforeRunFormulas(dataInput) {
        let listSyql = this.formulas.match(/(?<=ref\().*?(?=\))/gi);
        if (listSyql != null && listSyql.length > 0) {
            for (let i = 0; i < listSyql.length; i++) {
                let res = await this.runSyql(listSyql[i]);
                return { server: true, data: res.data };
            }
        } else {
            let formulas = this.replaceParamsToData(dataInput, this.formulas);
            return { server: false, data: this.runSQLLiteFormulas(formulas) };
        }

    }

    replaceParamsToData(dataInput, formulas) {
        for (let controlName in dataInput) {
            let regex = new RegExp("{" + controlName + "}", "g");
            formulas = formulas.replace(regex, "'" + dataInput[controlName] + "'");
        }
        return formulas;
    }
    handleRunAutoCompleteFormulas(search) {
        let listSyql = this.getSyqlFormulas();
        let fieldSelect = this.detectFieldSelect();
        let where = " WHERE ";
        for (let i = 0; i < fieldSelect.length; i++) {
            let element = fieldSelect[i];
            element = element.replace(/(?=as ).*/gi, '');

            if (i == fieldSelect.length - 1) {
                where += element + " LIKE '%" + search + "%'";
            } else {
                where += element + " LIKE '%" + search + "%' OR";
            }
        }
        if (listSyql != null && listSyql.length > 0) {
            let sql = listSyql[0] + where;
            return this.runSyql(sql);
        }
    }
    autocompleteDetectAliasControl() {
        let control = this.formulas.match(/(?=as ).*?(?=,)/gi);
        let controlName = control[0].replace('as ', '');
        return controlName.trim();
    }
    detectFieldSelect() {
        let listField = this.formulas.match(/(?<=select ).*?(?= from)/gi);
        let fields = [];
        if (listField != null && listField.length > 0) {
            fields = listField[0];
            fields = fields.trim();
            fields = fields.split(',');
        }
        return fields;
    }
    getSyqlFormulas() {
        let listSyql = this.formulas.match(/(?<=ref\().*?(?=\))/gi);
        return listSyql;
    }

    runSyql(formulas) {
            console.log(formulas);

            let syql = this.replaceParamsToData(this.getDataInputFormulas(), formulas);
            console.log(syql);

            return documentServiceApi.query({ query: syql });
        }
        /**
         * Hàm chạy công thức
         */
    runSQLLiteFormulas(sql) {
        let rs = ClientSQLManager.run(this.keyInstance, sql, false);
        return rs;

    }

    getDataSubmitInStore() {
        return dataSubmitStore.listInputInDocument;
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
        /**
         * Hàm lấy dữ liệu của các control trong store để chuân bị cho việc run formulas
         * dataInput : {controlName : value}
         */
    getDataInputFormulas() {
        let inputControl = this.getInputControl();
        let dataInput = {};
        for (let inputControlName in inputControl) {
            let valueInputControlItem = dataSubmitStore.listInputInDocument[inputControlName].value;
            dataInput[inputControlName] = valueInputControlItem;
        }
        return dataInput;
    }
    getFormulas() {
        return this.formulas;
    }



}