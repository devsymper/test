import moment from 'moment';

export default {
    // timesheet
    calendarType: 'week',
    calendarStartDate: moment().format('YYYY-MM-DD'),
    calendarEndDate: moment().format('YYYY-MM-DD'),
    calendarShowDate: moment().format('YYYY-MM-DD'),
    calendarAdjustment: 0,
    totalHours: '0',

    // manage timesheet
    manageTimesheetType: 'week',
    manageTimesheetRange: 'month',
    manageTimesheetAdjustment: 0,
    period: {
        freqSubmission: 'biweekly',
        firstDoM: '1',
        firstDoW: 'Monday',
        hoursRequired: '08:00',
        workingDays: {
            'Mon': true,
            'Tue': true,
            'Wed': true,
            'Thu': true,
            'Fri': true,
            'Sat': true,
            'Sun': false
        }
    },

    // submit
    submitAdjustment: 0,

    // error dialog
    showErrorDialog: false,
    errorMsg: ''
}