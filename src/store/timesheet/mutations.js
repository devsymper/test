function changeCalendarType(state, type) {
    state.calendarType = type;
}

function getLogForm(state, { category, task, date, duration, start, end, description, type }) {
    state.category = category;
    state.task = task;
    state.date = date;
    state.duration = duration;
    state.start = start;
    state.end = end;
    state.description = description;
    state.type = type;
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