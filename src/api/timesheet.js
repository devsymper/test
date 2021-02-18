import Api from "./api";
import { appConfigs } from "./../configs.js";

let api = new Api(appConfigs.apiDomain.timesheet);
var userApi = new Api(appConfigs.apiDomain.user);
let taskApi = new Api(appConfigs.apiDomain.workflowExtend);
export default {
    //lấy user
    getListUser({ page, pageSize }) {
        return userApi.get("users?page=" + page + "&pageSize=" + pageSize, { page, pageSize });
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
    createLogTime({ start, end, task, date, duration, type, categoryTask, accountId, desc }) {
        return api.post('log-time', {
            start,
            end,
            task,
            date,
            duration,
            type,
            accountId,
            desc,
            categoryTask,
        })
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
    updateConfigInfo({
        freSubmit,
        firstDOM,
        firstDOW,
        hoursRequired,
        isWorkingMonday,
        isWorkingTuesday,
        isWorkingWednesday,
        isWorkingThursday,
        isWorkingSunday,
        isWorkingFriday,
        isWorkingSaturday

    }) {
        return api.put('config-period', {
            freSubmit,
            firstDOM,
            firstDOW,
            hoursRequired,
            isWorkingMonday,
            isWorkingWednesday,
            isWorkingThursday,
            isWorkingTuesday,
            isWorkingSunday,
            isWorkingFriday,
            isWorkingSaturday,
            isWorkingSunday,


        })
    },
    updateRemindInfo({
        isDailyLog,
        timeDailyLog,
        submitTimesheet,
        timeSubmit,
        dateSubmit,
        weekRemind

    }) {
        return api.put('config-remind', {
            isDailyLog,
            timeDailyLog,
            submitTimesheet,
            timeSubmit,
            dateSubmit,
            weekRemind
        })
    },
    getTask(filter) {
        return taskApi.get('tasks?sort[0][column]=createTime&sort[0][type]=desc&search=%' + filter + '%');
    },
    updateLogTime({ start, end, task, date, duration, type, categoryTask, accountId, desc, id,docObjId }) {
        return api.put('log-time-update' + '/' + id, {
            start,
            end,
            task,
            date,
            duration,
            type,
            accountId,
            desc,
            categoryTask,
            id,
            docObjId
        })
    },
}