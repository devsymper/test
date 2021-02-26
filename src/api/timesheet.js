import Api from "./api";
import { appConfigs } from "./../configs.js";

let api = new Api(appConfigs.apiDomain.timesheet);
var userApi = new Api(appConfigs.apiDomain.user);
let taskApi = new Api(appConfigs.apiDomain.workflowExtend);
let sdocumentManagementApi = new Api(appConfigs.apiDomain.sdocumentManagement);
export default {
    //lấy user
    getListUser({ page, pageSize }) {
        return userApi.get("users?page=" + page + "&pageSize=" + pageSize, { page, pageSize });
    },
    getFilterLog(data,docId){
        return sdocumentManagementApi.get('documents/' + docId + '/objects?search='+data+'&page=1&pageSize=50')
    },
    getPreLog(data){
        return userApi.get('pre-log',data)
    },
    // lấy danh sách Log time
    getLogTimeList(dateStartEnd) {
        return api.get('log-time',dateStartEnd);
    },
    getAllUserLogTimeList() {
        return api.get('manage-timesheet');
    },
    getLogByUserId(id) {
        return api.get("log-time-othersUser", id);
    },
    createCategory(data) {
        return api.post('category', data)
    },
    getAllCategory() {
        return api.get('category')
    },
    deleteCategory(id) {
        return api.delete('category' + '/' + id, id)
    },
    updateCategory(data) {
        return api.put('category' + '/' + data.id, data)
    },
    createTask(data) {
        return api.post('task', data)
    },
    sendStartEnd(data) {
        return api.post('submit', data)
    },
    getListReport(data) {
        return api.post('report', data)
    },
    getTaskDB() {
        return api.get('task');
    },
    createLogTime(data) {
        return api.post('log-time', data)
    },
    createListLog(data){
        return api.post('list-log-time', data);
    },
    deleteLogTime({ id, docObjId }) {
        return api.put('log-time-delete' + '/' + id, { id, docObjId })
    },
    getConfigInfo() {
        return api.get('config');
    },
    updateConfigInfo(data) {
        return api.put('config-period', data)
    },
    updateRemindInfo(data) {
        return api.put('config-remind', data)
    },
    getTask(filter) {
             return taskApi.get('tasks?sort[0][column]=createTime&sort[0][type]=desc&search=%' + filter + '%&page=1&pageSize=50&variables=symper_last_executor_id%2Csymper_user_id_start_workflow%2Csymper_last_executor_name');
    },
    updateLogTime(data,id) {
        return api.put('log-time-update' + '/' + id, data)
    },
    checkHasRepeatLog(data){
        return api.post('check-repeat',data);
    }
}