import sDocument from './../../../store/document'
import store from './../../../store'
import ClientSQLManager from "./clientSQLManager.js";
import { formulasApi } from "./../../../api/Formulas";
import { orgchartApi } from "./../../../api/orgchart";
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
            this.refFormulas = this.getReferenceFormulas();
            this.orgChartFormulas = this.getOrgChartFormulas();
            this.localFormulas = this.getLocalFormulas();
            this.inputForLocalFormulas = this.setInputLocal();
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
        if (Object.keys(dataInput).length == 0) {
            dataInput = false;
        }
        var formulas = this.formulas;
        formulas = await this.handleRunLocalFormulas(formulas, dataInput);
        formulas = await this.handleRunOrgChartFormulas(formulas, dataInput);
        let listSyql = this.getReferenceFormulas(formulas);
        if (listSyql != null && listSyql.length > 0) {
            for (let i = 0; i < listSyql.length; i++) {
                let syql = listSyql[i].trim();
                syql = syql.replace('ref(', '');
                syql = syql.replace('REF(', '');
                syql = syql.substring(0, syql.length - 1);
                let res = await this.runSyql(syql, dataInput);
                let beforeStr = this.checkBeforeReferenceFormulas(formulas, listSyql[i].trim());
                if (!beforeStr) {
                    return { server: true, data: res.data };
                } else {
                    debugger
                    let reverseData = await this.reverseDataToFormulas(res.data, beforeStr.trim().toLowerCase());

                    formulas = formulas.replace(listSyql[i], reverseData);
                }
                if (i == listSyql.length - 1) {
                    let formulas = this.replaceParamsToData(dataInput, formulas);
                    return { server: false, data: this.runSQLLiteFormulas(formulas) };
                }
            }
        } else {
            let sql = this.replaceParamsToData(dataInput, formulas);
            return { server: false, data: this.runSQLLiteFormulas(sql, false, inject) };
        }

    }

    async handleRunLocalFormulas(formulas, dataInput) {
        let listLocal = this.localFormulas;
        if (listLocal != null && listLocal.length > 0) {
            for (let index = 0; index < listLocal.length; index++) {
                let sql = listLocal[index];
                sql = sql.replace('local(', '');
                sql = sql.replace('LOCAL(', '');
                sql = sql.substring(0, sql.length - 1);
                sql = sql.replace(/\r?\n|\r/g, ' ');
                if (Object.keys(dataInput).length == 0) {
                    dataInput = false;
                }
                sql = this.replaceParamsToData(dataInput, sql)
                let res = await this.runSQLLiteFormulas(sql);
                let strBeforeSql = this.checkBeforeReferenceFormulas(formulas, listLocal[index].trim());
                let reverse = this.reverseSqliteDataToFormulas(res[0], strBeforeSql.trim().toLowerCase());
                formulas = formulas.replace(listLocal[index], reverse);
            }
        }
        return formulas
    }
    async handleRunOrgChartFormulas(formulas, dataInput) {
            let listOrgChartFormulas = this.orgChartFormulas;
            if (listOrgChartFormulas != null && listOrgChartFormulas.length > 0) {
                let item = {};
                for (let i = 0; i < listOrgChartFormulas.length; i++) {
                    let reverseData = sDocument.state.submit[this.keyInstance].orgchartTableSqlName[listOrgChartFormulas[i].trim()];
                    if (reverseData == undefined) {
                        let orgChartFormulas = listOrgChartFormulas[i].trim();
                        orgChartFormulas = orgChartFormulas.replace('orgchart(', '');
                        orgChartFormulas = orgChartFormulas.replace('ORGCHART(', '');
                        orgChartFormulas = orgChartFormulas.substring(0, orgChartFormulas.length - 1);
                        if (Object.keys(dataInput).length == 0) {
                            dataInput = false;
                        }
                        orgChartFormulas = this.replaceParamsToData(dataInput, orgChartFormulas)
                        let res = await this.queryOrgchart(orgChartFormulas);
                        let beforeStr = this.checkBeforeReferenceFormulas(formulas, listOrgChartFormulas[i].trim());
                        if (!beforeStr) {
                            return res.data;
                        } else {
                            reverseData = await this.reverseDataToFormulas(res.data.fullInfo, beforeStr.trim().toLowerCase());
                            item[listOrgChartFormulas[i].trim()] = reverseData;
                            store.commit("document/addToDocumentSubmitStore", {
                                key: 'orgchartTableSqlName',
                                value: item,
                                instance: this.keyInstance
                            });
                        }
                    }
                    formulas = formulas.replace(listOrgChartFormulas[i].trim(), reverseData);


                }
            }
            return formulas;
        }
        /**
         * Hàm xử lí chạy formulas cho các cột trong table 
         * 1. chạy các công thức local() nếu có và thực hiện tạo ra 1 params mới thay thế cho công thức cùng data input của nó
         * 
         * @param {*} dataInput 
         */
    async getDataMultiple(dataInput) {
        let formulas = this.formulas;
        let listLocal = this.localFormulas;
        if (listLocal != null && listLocal.length > 0) {
            for (let index = 0; index < listLocal.length; index++) {
                let sql = listLocal[index];
                sql = sql.replace('local(', '');
                sql = sql.replace('LOCAL(', '');
                sql = sql.substring(0, sql.length - 1);
                sql = sql.replace(/\r?\n|\r/g, ' ');
                let res = await this.runSQLLiteFormulas(sql);
                let strBeforeSql = this.checkBeforeReferenceFormulas(formulas, listLocal[index].trim());
                let reverse = this.reverseSqliteDataToFormulas(res[0], strBeforeSql.trim().toLowerCase());
                formulas = formulas.replace(listLocal[index], reverse);


            }
        }
        let listSyql = this.getReferenceFormulas(formulas);

        if (listSyql != null) {
            if (listSyql.length > 1) {
                // let script = this.formulas;
                // let dataRespone = {}
                // for (let id in dataInput) {
                //     let dataInputRow = dataInput[id];
                //     script = script.replace(/\r?\n|\r/g, ' ');
                //     let formulas = this.replaceParamsToData(dataInputRow, script);
                //     let res = await this.runSQLLiteFormulas(formulas);
                //     dataRespone[id] = res[0].values[0][0];
                // }
                // return { data: dataRespone, from: 'local' }
            } else if (listSyql.length == 1) {
                let syql = listSyql[0];
                syql = syql.replace('ref(', '');
                syql = syql.replace('REF(', '');
                syql = syql.substring(0, syql.length - 1);
                syql = syql.replace(/\r?\n|\r/g, ' ');
                let dataPost = {
                    formula: syql,
                    dataInput: JSON.stringify(dataInput)
                };
                return formulasApi.getMultiData(dataPost);
            }
        } else {
            let dataRes = {}
            for (let rowId in dataInput) {
                let formula = this.replaceParamsToData(dataInput[rowId], formulas);
                let res = await this.runSQLLiteFormulas(formula);
                dataRes[rowId] = res[0].values[0][0];
            }
            return {
                data: dataRes
            }

        }

    }

    // hàm xử lí chạy các công thức có khóa local trong script sau khi chạy xong thay thế lại giá tri cho script

    async runLocalFormulas(script, listLocal, dataInput) {
        if (listLocal != null && listLocal.length > 0) {
            for (let i = 0; i < listLocal.length; i++) {
                let sql = listLocal[i].trim();
                sql = sql.replace('local(', '');
                sql = sql.replace('LOCAL(', '');
                sql = sql.substring(0, sql.length - 1);
                if (Object.keys(dataInput).length == 0) {
                    dataInput = false;
                }
                let formulas = this.replaceParamsToData(dataInput, sql);
                let res = await this.runSQLLiteFormulas(formulas);
                let strBeforeSql = this.checkBeforeReferenceFormulas(script, listLocal[i].trim());
                let reverse = this.reverseSqliteDataToFormulas(res[0], strBeforeSql.trim().toLowerCase());
                script = script.replace(listLocal[i], reverse);
            }
            return script;
        }
    }

    // Hàm xử lí kiểm tra các từ khóa sql trước công thức local() để thay thế lại giá trị tương ứng sau khi chạy công lức local trong script
    // nếu là IN -> return (1,1,2,3);
    // Nếu là union || union all -> return table sqlite
    // nếu là giá trị bình thường thì trả về chuỗi tương ứng
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
            }
        } else if (beforeStr === 'in') {
            if (data.values.length > 0) {
                strReplace = "(";
                let curData = data.values.filter(data => {
                    return data[0] !== "" && data[0] !== null
                })
                if (curData.length == 0) {
                    strReplace = "('')";
                } else {
                    for (let i = 0; i < curData.length; i++) {
                        let row = curData[i];
                        if (i == curData.length - 1) {
                            strReplace += "'" + row + "')";
                        } else {
                            strReplace += "'" + row + "',";
                        }
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
    async reverseDataToFormulas(data, beforeStr) {
            let strReplace = "";
            if (beforeStr == 'from' || beforeStr == 'union' || beforeStr == 'all' || beforeStr == 'join') {
                if (data.length > 0) {
                    let columns = {};
                    let columnsTable = [];
                    for (let i in data[0]) {
                        if (['id', 'createAt', 'style', 'departmentVizId', 'orgchartId', 'listForeignKey', 'nodeIdentify', 'vizParentId', 'vizId'].includes(i)) {
                            continue;
                        }
                        columns[i] = "TEXT";
                        columnsTable.push(i + " TEXT");
                    }
                    let dataTable = []
                    for (let index = 0; index < data.length; index++) {
                        let rowData = []
                        let row = data[index];
                        for (let columnName in columns) {
                            // let columnData = row[columnName.replace()
                            rowData.push("'" + row[columnName] + "'");
                        }
                        rowData = "(" + rowData.join(',') + ")";
                        dataTable.push(rowData);
                    }
                    let tableName = Util.generateString(10);
                    strReplace = tableName;
                    await ClientSQLManager.createTable(this.keyInstance, tableName, columnsTable.join(','), "TEMPORARY", Object.keys(columns).join(','), dataTable.join(','), true);
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
            let s = refScript.replace(/\(/g, "\\(");
            s = s.replace(/\)/g, "\\)");
            s = s.replace(/\|/g, "\\|");
            let reg = new RegExp("([a-zA-Z_0-9]+)\\s+(?=" + s + ")", "gm")
            let textBefore = script.match(reg);
            if (textBefore != null && textBefore.length > 0) {
                textBefore = textBefore[0].trim()
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
        if (Object.keys(dataInput).length == 0 || dataInput == false) {
            return formulas;
        }
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
        formulas = this.replaceWorkflowParams(formulas);
        return formulas;
    }


    // Hàm kiểm tra các tham số của workflow và thay thế lại giá trị tương ứng
    // hàm này thực hiện khi chạy quy trình
    replaceWorkflowParams(formulas) {
        let workflowVariable = sDocument.state.submit[this.keyInstance].workflowVariable;
        for (let param in workflowVariable) {
            let regex = new RegExp("{" + param + "}", "g");
            let value = workflowVariable[param];
            if (!BUILD_IN_FUNCTION.includes(param)) {
                formulas = formulas.replace(regex, value);
            }
        }
        let regex = new RegExp("{workflow_.*}", "gm");
        formulas = formulas.replace(regex, "");
        return formulas;
    }


    // Hàm chạy công thức cho autocomplete
    handleRunAutoCompleteFormulas(dataInput = false) {
        let listSyql = this.refFormulas;
        if (listSyql != null && listSyql.length > 0) {
            let syql = listSyql[0].trim();
            syql = syql.replace('ref(', '');
            syql = syql.replace('REF(', '');

            syql = syql.substring(0, syql.length - 1);
            return this.runSyql(syql, dataInput);
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
            let listLocal = this.localFormulas;
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
    getReferenceFormulas(formulas = false) {
        if (formulas == false) {
            formulas = this.formulas
        }
        let listSyql = formulas.match(/(REF|ref)\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\))*\))*\))*\))*\))*\))*\))*\)/gm);
        return listSyql;
    }

    /**
     * Hàm tách các công thức local (công thức chạy owr client)
     */
    getLocalFormulas() {
            let listSqlite = this.formulas.match(/(LOCAL|local)\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\))*\))*\))*\))*\))*\))*\))*\)/gm);
            return listSqlite;
        }
        /**
         * Hàm tách các công thức local (công thức chạy owr client)
         */
    getOrgChartFormulas() {
        let listSqlite = this.formulas.match(/(ORGCHART|orgchart)\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\))*\))*\))*\))*\))*\))*\))*\)/gm);
        return listSqlite;
    }

    runSyql(formulas, dataInput = false) {
        let syql = formulas;
        syql = syql.replace(/\r?\n|\r/g, ' ');

        let dataPost = { formula: syql, data_input: JSON.stringify(dataInput) };
        if (dataInput == false)
            dataPost = { formula: syql };
        return formulasApi.execute(dataPost);
    }
    queryOrgchart(formulas) {
            let syql = formulas;
            syql = syql.replace(/\r?\n|\r/g, ' ');
            let dataPost = { query: syql };
            return orgchartApi.queryOrgchart(dataPost);
        }
        /**
         * Hàm chạy công thức
         */
    runSQLLiteFormulas(sql, returnPromise = false, inject = false) {
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
        return sDocument.state.submit[this.keyInstance].listInputInDocument;
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
                    if (!BUILD_IN_FUNCTION.includes(controlName[0]) && !this.detectWorkflowParams(controlName[0]) && controlName[0] != 'search_value') {
                        obj[controlName] = true;
                    }
                    return obj;
                }, {});


                return names;
            }
            return {}
        }
        /**
         * Hàm lấy các cột được select trong công thức local
         * mục đích để đưa vào biến effeted của control đó (cột trong table)
         * lúc nào có sự thay đổi của cột đó thì chạy lại công thức chứa local này
         */
    setInputLocal() {
            let listLocalFormulas = this.localFormulas;
            let listInputLocal = {}
            if (listLocalFormulas != null && listLocalFormulas.length > 0) {
                for (let index = 0; index < listLocalFormulas.length; index++) {
                    let localFormulas = listLocalFormulas[index];
                    let columns = this.getColumnsQuery(localFormulas);

                    columns = columns.reduce((obj, name) => {
                        obj[name] = true;
                        return obj
                    }, {});
                    Object.assign(listInputLocal, columns);

                }
            }
            return listInputLocal;
        }
        // hàm kiểm tra có tham số workflow trong công thức hay k
    detectWorkflowParams(str) {
        if (str.includes('workflow_')) {
            return true;
        }
        return false;
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
            let valueInputControlItem = sDocument.state.submit[this.keyInstance].listInputInDocument[inputControlName].value;
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


    // hàm thay thế tham số search của input filer lúc gõ search
    wrapSyqlForSearchInputFilter(search) {
            this.setFormulas(this.oldFormulas);
            let refFormulas = this.formulas;
            let regex = new RegExp("{search_value}", "g");
            refFormulas = refFormulas.replace(regex, search);
            return refFormulas;
        }
        // hàm lấy các column được query sau select và trước from
    getColumnsQuery(syql) {
        let columns = [];
        syql = syql.replace(/[\s\r]+/gm, " ");
        let allColumns = syql.match(/(?<=SELECT|select).*(?=FROM|from)/gm);
        for (let index = 0; index < allColumns.length; index++) {
            let element = allColumns[index];
            element = element.trim();
            element = element.split(',')
            for (let i = 0; i < element.length; i++) {
                let column = element[i];
                column = column.replace(/(.*?)(?<= as )/g, "");
                columns.push(column.trim())
            }

        }
        return columns;
    }

    //\s+as\s+(([a-zA-Z0-9_]+)|("(.*?)"))
}