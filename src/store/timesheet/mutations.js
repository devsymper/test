function changeCalendarType(state, type) {
    state.calendarType = type;
}
function getListColor(state, color) {
    state.listColor = color;
}
function showSubmitTask(state, showSubmitTask) {
    state.showSubmitTask = showSubmitTask;
}
function showListProcess(state, showListProcess) {
    state.showListProcess = showListProcess;
}
function getListCategory(state, cate) {
    state.listCate = cate;
}           
function updateObjId(state, objId){
    state.log.docObjId = objId
}
//xem calendar theo id user
function updateUserId(state, userId){
    state.userId = userId
}

function getLogForm(state, { action,name, taskName, category, task, category_key,date, duration, start, end, description, type,color,id,docObjId}) {
    state.log.category = category;
    state.log.task = task;
    state.log.name = name;
    state.log.taskName = taskName;
    state.log.action = action;
    state.log.date = date;
    state.log.duration = duration;
    state.log.start = start;
    state.log.end = end;
    state.log.description = description;
    state.log.type = type;
    state.log.color = color;
    state.log.category_key = category_key;
    state.log.id = id;
    state.log.docObjId = docObjId;
}

function updateCalendarStartEnd(state, { start, end }) {
    state.calendarStartDate = start;
    state.calendarEndDate = end;
}

function updateCalendarShowDate(state, date) {
    state.calendarShowDate = date;
}

function updatePeriod(state, period) {
    state.period = period;
}

function changeManageTimesheetType(state, type) {
    state.manageTimesheetType = type;
}

function changeManageTimesheetRange(state, range) {
    state.manageTimesheetRange = range;
}

function adjustCalendar(state, value) {
    state.calendarAdjustment = value;
}

function adjustManageTimesheet(state, value) {
    state.manageTimesheetAdjustment = value;
}

function adjustSubmit(state, value) {
    state.submitAdjustment = value;
}

function updateTotalHours(state, value) {
    state.totalHours = value;
}

function setShowErrorDialog(state, { msg, show }) {
    state.showErrorDialog = show;
    state.errorMsg = msg;
}

export {
    getLogForm,
    updateObjId,
    showListProcess,
    getListColor,
    getListCategory,
    changeCalendarType,
    updateCalendarStartEnd,
    updateCalendarShowDate,
    updatePeriod,
    showSubmitTask,
    changeManageTimesheetType,
    changeManageTimesheetRange,
    adjustCalendar,
    updateUserId,
    adjustManageTimesheet,
    adjustSubmit,
    updateTotalHours,
    setShowErrorDialog
}