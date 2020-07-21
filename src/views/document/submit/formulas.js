import sDocument from './../../../store/document'
let dataSubmitStore = sDocument.state.submit
import ClientSQLManager from "./clientSQLManager.js";
import { formulasApi } from "./../../../api/Formulas";
import Util from "./util";
const BUILD_IN_FUNCTION = ['TODAY', 'BEGIN_WEEK', 'END_WEEK', 'BEGIN_MONTH', 'END_MONTH',
    'BEGIN_YEAR', 'END_YEAR', 'TIMESTAMP', 'PARENT_WORKFLOW', 'CURRENT_WORKFLOW',
    'CURRENT_USER_ID',
    'CURRENT_USER',
    'CURRENT_USER_FULLNAME',
    'CURRENT_USER_EMAIL',
    'CURRENT_USER_PHONE',
    'CURRENT_USER_PHONE_NUMBER'
]
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

            if (this.formulas == "" || this.formulas == false || this.formulas == undefined) {
                return false;
            } else return true;
        }
        /**
         * Hàm xử lí việc thay các giá trị vào {control} và tách công thức server để chạy trước nếu có
         * @param {Object} dataInput 
         */
    async handleBeforeRunFormulas(dataInput, inject = "") {
        let script = this.formulas;
        let listLocal = this.getLocalFormulas(script);
        if (listLocal != null && listLocal.length > 0) {
            for (let i = 0; i < listLocal.length; i++) {
                let sql = listLocal[i].trim();
                sql = sql.replace('local(', '');
                sql = sql.substring(0, sql.length - 1);
                if (Object.keys(dataInput).length == 0) {
                    dataInput = false;
                }
                let formulas = this.replaceParamsToData(dataInput, sql);
                let res = await this.runSQLLiteFormulas(formulas);
                let strBeforeSql = this.checkBeforeReferenceFormulas(listLocal[i].trim(), script);
                let reverse = this.reverseSqliteDataToFormulas(res[0], strBeforeSql.trim().toLowerCase());
                script = script.replace(listLocal[i], reverse);
            }
        }

        let listSyql = this.getReferenceFormulas(script);

        if (listSyql != null && listSyql.length > 0) {
            for (let i = 0; i < listSyql.length; i++) {
                let syql = listSyql[i].trim();
                syql = syql.replace('ref(', '');
                syql = syql.substring(0, syql.length - 1);
                if (Object.keys(dataInput).length == 0) {
                    dataInput = false;
                }
                let res = await this.runSyql(syql, dataInput);

                let beforeStr = this.checkBeforeReferenceFormulas(script, listSyql[i].trim());
                if (!beforeStr) {
                    return { server: true, data: res.data };
                } else {
                    let reverseData = this.reverseDataToFormulas(res.data, beforeStr.trim().toLowerCase());
                    script = script.replace(listSyql[i], reverseData);
                }
                if (i == listSyql.length - 1) {
                    let formulas = this.replaceParamsToData(dataInput, script);
                    return { server: false, data: this.runSQLLiteFormulas(formulas) };
                }
            }
        } else {
            let formulas = this.replaceParamsToData(dataInput, this.formulas);
            return { server: false, data: this.runSQLLiteFormulas(formulas, false, inject) };
        }

    }
    async runLocalFormulas(script, listLocal, dataInput) {
        if (listLocal != null && listLocal.length > 0) {
            for (let i = 0; i < listLocal.length; i++) {
                let sql = listLocal[i].trim();
                sql = sql.replace('local(', '');
                sql = sql.substring(0, sql.length - 1);
                if (Object.keys(dataInput).length == 0) {
                    dataInput = false;
                }
                let formulas = this.replaceParamsToData(dataInput, sql);
                let res = await this.runSQLLiteFormulas(formulas);
                let strBeforeSql = this.checkBeforeReferenceFormulas(listLocal[i].trim(), script);
                let reverse = this.reverseSqliteDataToFormulas(res[0], strBeforeSql.trim().toLowerCase());
                script = script.replace(listLocal[i], reverse);
            }
            return script;
        }
    }
    reverseSqliteDataToFormulas(data, beforeStr) {
        if (data == undefined) {
            return ""
        }
        let strReplace = "";
        if (beforeStr == 'from' || beforeStr == 'union' || beforeStr == 'all' || beforeStr == 'join') {
            if (data.columns.length > 0) {
                let columns = {};
                let columnsInsert = "";
                let dataInsert = "";
                for (let index = 0; index < data.columns.length; index++) {
                    const element = data.columns[index];
                    columnsInsert += element + ","
                    columns[element] = "TEXT";
                }
                dataInsert = ""
                for (let index = 0; index < data.values.length; index++) {
                    const row = data.values[index];
                    let dataRow = row.join();
                    dataInsert += "('" + dataRow + "'),"
                }
                dataInsert = dataInsert.substring(0, dataInsert.length - 1);
                columnsInsert = columnsInsert.substring(0, columnsInsert.length - 1);
                let tableName = Util.generateString(10);
                strReplace = tableName;
                ClientSQLManager.createTable(this.keyInstance, Util.generateString(10), columns, "TEMPORARY", columnsInsert, dataInsert);
                // ClientSQLManager.insertDataToTable(tableName,columnsInsert,dataInsert);

            }
        } else if (beforeStr === 'in') {
            if (data.values.length > 0) {
                strReplace = "(";
                let curData = data.values.filter(data => {
                    return data[0] !== "" && data[0] !== null
                })
                for (let i = 0; i < curData.length; i++) {
                    let row = curData[i];
                    if (i == curData.length - 1) {
                        strReplace += "'" + row + "')";
                    } else {
                        strReplace += "'" + row + "',";
                    }
                }
            }

        } else {
            strReplace = data.values[0][0];
        }
        return strReplace;
    }



    /**
     * Hàm thưc hiện thay thế lại giá trị ở cong thức reference 
     * nếu trả về mảng 1 giá trị thì thay thế = giá trị đó
     * nếu 1 mảng giá trị thì thay thế về dạng ( 1, 'abc', 2, 'aa')
     * @param {Array} data 
     * @param {String} refSyql 
     */
    reverseDataToFormulas(data, beforeStr) {
            let strReplace = "";
            if (beforeStr == 'from' || beforeStr == 'union' || beforeStr == 'all' || beforeStr == 'join') {
                if (data.length > 0) {
                    let columns = {};
                    for (let i in data[0]) {
                        columns[i] = "TEXT";
                    }
                    let tableName = Util.generateString(10);
                    strReplace = tableName;
                    ClientSQLManager.createTable(this.keyInstance, tableName, columns, "TEMPORARY");
                }
            } else if (beforeStr == 'in') {
                strReplace = "(";
                for (let i = 0; i < data.length; i++) {
                    let row = data[i];
                    if (i == data.length - 1) {
                        strReplace += row[Object.keys(row)[0]] + ")";
                    } else {
                        strReplace += row[Object.keys(row)[0]] + ",";
                    }
                }
            } else {
                strReplace = data[0][Object.keys(data[0])[0]];
            }
            return strReplace;
        }
        /**
         * Hàm kiểm tra xem trước từ khóa ref() có các kiểu sql nào để reverse lại giá trị tương ứng (from, union, in, join ,...)
         * from, union,  join => table
         * in => (val,val,val)
         * else => value
         */
    checkBeforeReferenceFormulas(script, refScript) {
            let s = script.replace(/\(/g, "\\(");
            s = s.replace(/\)/g, "\\)");
            let reg = new RegExp("([a-zA-Z_0-9]+)\\s+" + s, "gm")
            let x1 = "([a-zA-Z_0-9]+)\\s+" + s;
            let textBefore = refScript.match(reg);
            if (textBefore != null && textBefore.length > 0) {
                textBefore = textBefore[0].replace(script, "")
                return textBefore;
            } else {
                return false;
            }
        }
        /**
         * Hàm thay thế các giá trị input đầu vào trong công thức (thay thế vào chuỗi {controlName})
         * @param {Object} dataInput 
         * @param {String} formulas 
         */
    replaceParamsToData(dataInput, formulas) {
        let listControlInDoc = this.getDataSubmitInStore();
        for (let controlName in dataInput) {
            let regex = new RegExp("{" + controlName + "}", "g");
            let value = dataInput[controlName];
            if (value == undefined || typeof value == 'undefined' || value == null) {
                value = ""
                if (listControlInDoc[controlName].type == 'number' || listControlInDoc[controlName].type == 'percent') {
                    value = 0;
                }
            }
            if (!BUILD_IN_FUNCTION.includes(controlName)) {
                formulas = formulas.replace(regex, value);
            }
        }
        this.replaceWorkflowParams(formulas);
        return formulas;
    }

    replaceWorkflowParams(formulas) {
        let workflowVariable = dataSubmitStore.workflowVariable;
        console.log('gád', workflowVariable);
        for (let param in workflowVariable) {
            let regex = new RegExp("{" + param + "}", "g");
            let value = workflowVariable[param];
            if (!BUILD_IN_FUNCTION.includes(param)) {
                formulas = formulas.replace(regex, value);
            }

        }
        return formulas;
    }

    handleRunAutoCompleteFormulas(search, dataInput = false) {
        let listSyql = this.getReferenceFormulas(this.formulas);
        let fieldSelect = this.detectFieldSelect();
        let where = " WHERE (";
        for (let i = 0; i < fieldSelect.length; i++) {
            let element = fieldSelect[i];
            element = element.replace(/(?=as ).*/gi, '');
            if (i == fieldSelect.length - 1) {
                where += element + " ILIKE '%" + search + "%' )";
            } else {
                where += element + " ILIKE '%" + search + "%' OR";
            }
        }
        if (listSyql != null && listSyql.length > 0) {
            let syql = listSyql[0].trim();
            syql = this.replaceParamsToData(dataInput, syql);
            syql = syql.replace('ref(', '');
            syql = syql.substring(0, syql.length - 1);
            let sql = ""
            if (/\$\$/.test(syql) == false) {
                if (/\bWHERE|where\b/.test(syql)) {
                    where += " AND "
                    syql = syql.replace(/\bWHERE|where\b/, where);
                    sql = syql + " LIMIT 20 OFFSET 0";

                } else {
                    sql = syql + where + "LIMIT 20 OFFSET 0";
                }
            } else {
                sql = syql;
            }
            return this.runSyql(sql);
        } else {
            let formulas = this.replaceParamsToData(dataInput, this.formulas);
            return this.runSQLLiteFormulas(formulas, true);
        }
    }
    autocompleteDetectAliasControl() {
        let control = this.formulas.match(/(?<=as)(\s+([a-zA-Z_0-9]+)|\s*\"(.*?)\")/gi);
        if (control == null) {
            return "column1";
        }
        return control[0].trim();
    }

    /**
     * Hàm chỉ ra các table gây ảnh hưởng đến các công thức khi có lời gọi hàm local trong reference
     */
    detectTableRelateLocalFormulas() {
            let listTable = []
            let listLocal = this.getLocalFormulas(this.formulas);
            if (listLocal != null && listLocal.length > 0) {
                for (let i = 0; i < listLocal.length; i++) {
                    let sql = listLocal[i];
                    listTable = sql.match(/(?<=from)(.[a-zA-Z0-9_]*)/gm);
                }
            }
            return listTable;
        }
        /**
         * Hàm check các field của control select
         */
    detectFieldSelect() {
            let listField = this.formulas.match(/(?<=select|SELECT ).*(?= from|FROM)/gi);
            let fields = [];
            if (listField != null && listField.length > 0) {
                fields = listField[0];
                fields = fields.trim();
                fields = fields.split(',');
            }
            return fields;
        }
        /**
         * Hàm tách các công thức reference (công thức chạy trên server)
         */
    getReferenceFormulas(syql) {
        let listSyql = syql.match(/ref\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\))*\))*\))*\))*\))*\))*\))*\)/gm);
        return listSyql;
    }

    /**
     * Hàm tách các công thức local (công thức chạy owr client)
     */
    getLocalFormulas(syql) {
        let listSqlite = syql.match(/local\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\))*\))*\))*\))*\))*\))*\))*\)/gm);
        return listSqlite;
    }

    runSyql(formulas, dataInput = false) {
            let syql = formulas;
            if (dataInput != false) {
                syql = this.replaceParamsToData(dataInput, formulas);
            }
            syql = syql.replace(/\r?\n|\r/g, '');

            return formulasApi.execute({ formula: syql });
        }
        /**
         * Hàm chạy công thức
         */
    runSQLLiteFormulas(sql, returnPromise = false, inject = false) {
        // console.log('kjhf', sql);

        if (inject != false) {
            sql = sql.replace('SELECT ', 'SELECT ' + inject + ',');
            sql = sql.replace('select ', 'select ' + inject + ',');
        }
        if (returnPromise) {
            return new Promise((resolve, reject) => {
                try {
                    let data = ClientSQLManager.run(this.keyInstance, sql, false);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            return ClientSQLManager.run(this.keyInstance, sql, false);
        }
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
                if (!BUILD_IN_FUNCTION.includes(controlName[0])) {
                    obj[controlName] = true;
                }
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
    setFormulas(formulas) {
        this.formulas = formulas
    }

    /**
     * Hàm phát hiện công thức của control trong table ảnh hưởng đến control nào khác trong table
     * @param {*} mapControlEffected 
     * @param {*} name 
     * @param {*} script 
     * @param {*} listInputInDocument 
     */
    detectControlInTable(mapControlEffected, name, script, listInputInDocument) {
        let s = script.replace(/ref\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\))*\))*\))*\))*\))*\))*\))*\)/gm, "");
        s = s.replace(/{.}/gm, "");
        let listWord = s.match(/[A-Za-z0-9_]+/g);
        for (let controlName in listInputInDocument) {
            if (listWord != null && listWord.indexOf(controlName) != -1) {
                if (mapControlEffected[controlName] == undefined) {
                    mapControlEffected[controlName] = {};
                }
                mapControlEffected[controlName][name] = true

            }
        }

    }


    // hàm wrap lại formulas của control inputfilter khi có search
    wrapSyqlForSearchInputFilter(search) {
            this.setFormulas(this.oldFormulas);
            let refFormulas = this.getReferenceFormulas(this.formulas);
            if (refFormulas.length > 0) {
                let syql = refFormulas[0].trim();
                syql = syql.replace('ref(', '');
                syql = syql.substring(0, syql.length - 1);
                let columns = this.getColumnsQuery(syql);
                let where = 'WHERE ';
                for (let index = 0; index < columns.length; index++) {
                    const element = columns[index];
                    if (index == columns.length - 1) {
                        where += " CAST(" + element + " AS TEXT) LIKE '%" + search + "%'";
                    } else {
                        where += " CAST(" + element + " AS TEXT) LIKE '%" + search + "%' AND ";
                    }
                }
                let aliasTable = "symper_" + Date.now();
                let newSyql = "ref( SELECT * FROM (" + syql + ") " + aliasTable + " " + where + ")";
                return newSyql;
            }
            return false;
        }
        // hàm lấy các column được query sau select và trước from
    getColumnsQuery(syql) {
        let columns = [];
        let allColumns = syql.match(/(?<=select)(.*?)(?=from)/gm);
        for (let index = 0; index < allColumns.length; index++) {
            let element = allColumns[index];
            element = element.trim();
            element = element.split(',')
            for (let i = 0; i < element.length; i++) {
                let column = element[i];
                column = column.replace(/(.*?)(?<=as)/g, "");
                columns.push(column.trim())
            }

        }
        return columns;
    }


}