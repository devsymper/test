import sDocument from './../../../store/document'
import store from './../../../store'
import { util } from "./../../../plugins/util.js";
import { Column } from 'ag-grid-community';

const dataSubmitStore = sDocument.state.submit
const initSqlJs = require('sql.js');

/**
 * hoangnd:26/5/2020
 * Class xử lí việc chạy câu lệnh SQL trên client
 */
export default class ClientSQLManager {

    /**
     * hoangnd:26/5/2020
     * Hàm tạo mới DB
     * @param {String} keyInstance 
     */
    static async createDB(keyInstance) {
            const SQL = await initSqlJs({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.3.0/dist/sql-wasm.wasm`
            });
            let db = new SQL.Database();
            this.addSQLInstanceDBToStore(keyInstance, db);
        }
        /**
         * hoangnd:26/5/2020
         * Hàm lưu instance của DB vào store khi create
         * @param {String} keyInstance 
         * @param {SQLLite} SQLDBInstance 
         */
    static addSQLInstanceDBToStore(keyInstance, SQLDBInstance) {
            store.commit(
                "document/addInstanceSubmitDB", { instance: keyInstance, sqlLite: SQLDBInstance }
            );
        }
        /**
         * hoangnd:26/5/2020
         * Hàm trả về instance của 1 DB dựa vào keyInstance
         * @param {String} keyInstance 
         */
    static getInstanceDB(keyInstance) {
            return dataSubmitStore[keyInstance].SQLLiteDB[keyInstance]
        }
        /**
         * hoangnd:26/5/2020
         * Hàm chạy công thức
         * @param {String} keyInstance      : instance của view submit hiện tại (trường hợp có thêm sub submit thì có trên 2 instance)
         * @param {String} sql              : công thức cần chạy
         * @param {Boolean} isWithoutReturn : biến kiểm tra có trả về kết quả hay ko
         */
    static run(keyInstance, sql, isWithoutReturn = false) {
        let db = this.getInstanceDB(keyInstance);

        if (isWithoutReturn) {

            return db.run(sql);
        } else {
            return db.exec(sql);
        }
    }

    static createTable(keyInstance, tableName, columns, temporary = "", columnInsert, dataInsert = false) {
        let col = "(";
        for (let c in columns) {
            col += c + " " + columns[c] + ", ";
        }
        col = col.trim();
        col = col.substring(0, col.length - 1);
        col += " )";
        let sql = `CREATE ${temporary} TABLE IF NOT EXISTS ${tableName} ${col};`;
        // sql += "INSERT INTO this_document VALUES ('a', 'hello');"
        if (dataInsert != false) {
            sql += `INSERT INTO ${tableName} (${columnInsert}) VALUES ${dataInsert};`
        }
        console.log('sagfad', sql);
        this.run(keyInstance, sql, true);

        // console.log(this.run(keyInstance, 'select * from this_document', false));

    }
    static async insertDataToTable(tableName, columns, data, returnPromise = false) {
        let sql = `INSERT INTO ${tableName} (${columns}) VALUES ${data}`;
        if (returnPromise) {
            return new Promise((resolve, reject) => {
                try {
                    let data = this.run(keyInstance, sql, true);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            return this.run(keyInstance, sql, true);
        }
    }
    static async editRow(keyInstance, tableName, column, value, where, returnPromise = false) {
        let sql = `UPDATE ${tableName} SET ${column} = "${value}" ${where}`;
        if (returnPromise) {
            return new Promise((resolve, reject) => {
                try {
                    let data = this.run(keyInstance, sql, true);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            let x = this.run(keyInstance, sql, true);
            console.log('nnnnn', x);

            return x
        }
    }
    static deleteRow(keyInstance, tableName, where) {
        let sql = `DELETE FROM ${tableName} ${where}`;
        this.run(keyInstance, sql, true);
    }
    static async insertRow(keyInstance, tableName, column, value, returnPromise = false) {
        let tbColumn = column.join();
        let tbValue = value.join()
        let sql = `INSERT INTO ${tableName} (${tbColumn}) VALUES(${tbValue})`;
        console.log('gfsdd', tableName, sql);
        if (returnPromise) {
            return new Promise((resolve, reject) => {
                try {
                    let data = this.run(keyInstance, sql, true);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
        } else {
            return this.run(keyInstance, sql, true);
        }

    }
    static insertMultiple(keyInstance, tableName, columns, columnstype, values) {
        let tbColumns = columns.join();
        let tbValues = "";
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < columnstype.length; j++) {
                if (columnstype[j] == 'numeric') {
                    if (typeof values[i][j] != 'number')
                        values[i][j] = 0;
                } else {
                    if (values[i][j] == null) {
                        values[i][j] = `""`;
                    } else {
                        values[i][j] = `"${values[i][j]}"`
                    }
                }
            }
            values[i].push(i);

            tbValues += ` (${values[i].join()}),`;
        }
        tbValues = tbValues.substring(0, tbValues.length - 1);
        let sql = `INSERT INTO ${tableName} (${tbColumns},s_table_id_sql_lite) VALUES ${tbValues}`;

        this.run(keyInstance, sql, true);

    }
    static delete(keyInstance, tableName, where) {
        let w = "";
        if (where != false) {
            w = ` WHERE ${where}`;
        }
        let sql = `DELETE FROM ${tableName} ${w}`;
        this.run(keyInstance, sql, true);
    }
    static get(keyInstance, sql) {
        return this.run(keyInstance, sql, false);
    }
    static closeDB(keyInstance) {
        let db = this.getInstanceDB(keyInstance);
        if (db != undefined) {
            db.close();
        }
    }
    static getAllTableName(keyInstance) {
        let sql = `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;`
        return this.run(keyInstance, sql, false)
    }


}