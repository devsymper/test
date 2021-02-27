function changeCalendarType(state, type) {
    state.calendarType = type;
}
function getListColor(state, color) {
    state.listColor = color;
}
function getListCategory(state, cate) {
    state.listCate = cate;
}           
function updateObjId(state, objId){
    debugger
    state.log.docObjId = objId
}

function getLogForm(state, { action, category, task, category_key,date, duration, start, end, description, type,color,id,docObjId}) {
    state.log.category = category;
    state.log.task = task;
    state.log.action = action;
    debugger
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
    getListColor,
    getListCategory,
    changeCalendarType,
    updateCalendarStartEnd,
    updateCalendarShowDate,
    updatePeriod,
    changeManageTimesheetType,
    changeManageTimesheetRange,
    adjustCalendar,
    adjustManageTimesheet,
    adjustSubmit,
    updateTotalHours,
    setShowErrorDialog
}