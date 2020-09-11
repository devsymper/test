import Api from "./api";
import { appConfigs } from "./../configs.js";

let api = new Api(appConfigs.apiDomain.timesheet);
var bpmneApi = new Api(appConfigs.apiDomain.bpmne.models);
var userApi = new Api(appConfigs.apiDomain.user);

// Phục vụ cho việc test API task
let fullCookieTest = "abc=xyz;FLOWABLE_REMEMBER_ME=YWNLNEUwTHlxbGNoQThEcUV4RTlpQSUzRCUzRDpsZUJRVTlTOSUyQnF5YzBCblNFZzdLQ3clM0QlM0Q";
fullCookieTest.split(';').forEach((el) => {
    document.cookie = el.trim();
});

let testHeader = {
    Authorization: 'Basic cmVzdC1hZG1pbjp0ZXN0',
    "Content-Type": "application/json",
};

let testOptions = {}

export default {
    //lấy user
    getListUser({ page, pageSize }) {
        return userApi.get("users?page=" + page + "&pageSize=" + pageSize, { page, pageSize });
    },
    // lấy danh sách Log time
    getLogTimeList() {
        return api.get('log-time');
    },
    getAllUserLogTimeList() {
        return api.get('manage-timesheet');
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
    updateCategory({ taskName, key, id }) {
        return api.put('category' + '/' + id, { taskName, key, id })
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
    deleteLogTime({ id }) {
        return api.put('log-time-delete' + '/' + id, { id })
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
        return bpmneApi.get(appConfigs.apiDomain.bpmne.tasks, filter, testHeader);
    },
    updateLogTime({ start, end, task, date, duration, type, categoryTask, accountId, desc, id }) {
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
        })
    },
}