import sDocument from './../../../store/document'
import store from './../../../store'
const dataSubmitStore = sDocument.state.submit
const initSqlJs = require('sql.js');

/**
 * hoangnd:26/5/2020
 * Class xử lí việc chạy công thức của form submit doc
 */
export default class SQLLiteDB {

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
            console.log(db);

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
    getInstanceDB(keyInstance) {
            return dataSubmitStore.SQLLiteDB[keyInstance]
        }
        /**
         * hoangnd:26/5/2020
         * Hàm chạy công thức
         * @param {String} keyInstance      : instance của view submit hiện tại (trường hợp có thêm sub submit thì có trên 2 instance)
         * @param {String} sql              : công thức cần chạy
         * @param {Boolean} isWithoutReturn : biến kiểm tra có trả về kết quả hay ko
         */
    static run(keyInstance, sql, isWithoutReturn = false) {
        let db = this.getInstanceDB(keyInstance)
        console.log("runnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");

        if (isWithoutReturn) {
            return db.run(sql);
        } else {
            return db.exec(sql);
        }
    }

}