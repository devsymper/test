import moment from 'moment';

export default {
    // timesheet
    calendarType: 'week',
    listCate:[],
    objId:0,
    calendarStartDate: moment().format('YYYY-MM-DD'),
    calendarEndDate: moment().format('YYYY-MM-DD'),
    calendarShowDate: moment().format('YYYY-MM-DD'),
    calendarAdjustment: 0,
    totalHours: '0',
    listColor:{},
    log:{
        action:'create',
        category: '',
        task : '',
        taskName:'',
        date : moment().format('YYYY-MM-DD'),
        duration :0,
        start :moment(),
        end :moment(),
        description :'',
        type :1,
        color :'',
        category_key :'',
        id :'',
        docObjId :0,
    },

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