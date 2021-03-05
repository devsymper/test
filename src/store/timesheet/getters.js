import moment from 'moment';
const dayOfWeekMap = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    '0': 'Sun',
    '1': 'Mon',
    '2': 'Tue',
    '3': 'Wed',
    '4': 'Thu',
    '5': 'Fri',
    '6': 'Sat'
};

function getStartEndBy(adjustment, range, type, firstDoM) {
    let adjustedToday = moment().add(adjustment, range);
    const monthDist = range === 'month' ? 1 : (range === 'quarter' ? 3 : 12);

    const start = adjustedToday.startOf(range).add(firstDoM - 1, 'day');
    const end = start.add(monthDist, 'month').subtract(1, 'day');
    return { start: start, end: end };
}

function manageTimesheetStartEndDate(state) {
    let { start, end } = getStartEndBy(state.manageTimesheetAdjustment, state.manageTimesheetRange, state.manageTimesheetType, state.period.firstDoM);
    return start.format('DD/MM/YY') + ' - ' + end.format('DD/MM/YY');
}

function manageTableColumns(state) {
    const type = state.manageTimesheetType;
    const range = state.manageTimesheetRange;

    switch (type) {
        case 'day':
            let { start: day_start, end: day_end } = getStartEndBy(state.manageTimesheetAdjustment, range, type, state.period.firstDoM);
            const days = [];
            while (day_start.isSameOrBefore(day_end)) {
                const col = day_start.format("DD/MM");
                let id = day_start.format("YYYY-MM-DD");
                id = id + " " + id;
                days.push({
                    "headerName": col,
                    "field": id,
                    "width": 50,
                    "colId": id,
                });
                day_start = day_start.add(1, 'day');
            }
            return days;
        case 'week':
            let { start: week_start, end: week_end } = getStartEndBy(state.manageTimesheetAdjustment, range, type, state.period.firstDoM);
            const len = week_end.diff(week_start, 'week');
            return Array.from(Array(len), (_, i) => {
                let _start = week_start.format("YYYY-MM-DD");
                let _end = week_start.add(6, 'day').format("YYYY-MM-DD");
                const id = _start + " " + _end;
                week_start = week_start.add(1, 'week');
                return {
                    "headerName": "Week " + moment(week_start).week(),
                    "field": id,
                    "width": 50,
                    "colId": id,
                }
            });
        case 'month':
            let { start: month_start, end: month_end } = getStartEndBy(state.manageTimesheetAdjustment, range, type, state.period.firstDoM);
            const months = [];
            while (month_start.isSameOrBefore(month_end)) {
                const col = month_start.format("MMM");
                let _start = month_start.format("YYYY-MM-DD");
                let _end = month_start.add(1, 'month').subtract(1, 'day').format("YYYY-MM-DD");
                const id = _start + " " + _end;
                months.push({
                    "headerName": col,
                    "field": id,
                    "width": 50,
                    "colId": id,
                });
                month_start = month_start.add(1, 'month');
            }
            return months;
    }
}

function submitStartEndDate(state) {
    const freqSubmission = state.period.freqSubmission;
    let type;
    switch (freqSubmission) {
        case 'weekly':
            type = 'week';
            break;
        case 'biweekly':
            type = 'week';
            break;
        case 'monthly':
            type = 'month';
            break;
    }
    let adjustment = state.submitAdjustment;
    if (freqSubmission === 'biweekly') {
        adjustment *= 2;
    }

    let adjustedToday = moment().add(adjustment, type);

    let start;
    if (type === 'month') {
        start = adjustedToday.startOf("month").add(state.period.firstDoM - 1, 'day');
    } else {
        start = adjustedToday.startOf('week').add(dayOfWeekMap[state.period.firstDoW], 'day');
    }

    switch (freqSubmission) {
        case 'weekly':
            return start.format('DD-MM-YYYY') + "-" + start.add(6, 'day').format('DD-MM-YYYY');
        case 'biweekly':
            return start.format('DD-MM-YYYY') + " - " + start.add(13, 'day').format('DD-MM-YYYY');
        case 'monthly':
            return start.format('DD/MM');
            //+ " - " + end.format('DD/MM/YY')
    }
}

function submitTableColumns(state) {
    const freqSubmission = state.period.freqSubmission;
    let type;
    switch (freqSubmission) {
        case 'weekly':
            type = 'week';
            break;
        case 'biweekly':
            type = 'week';
            break;
        case 'monthly':
            type = 'month';
            break;
    }
    let adjustment = state.submitAdjustment;
    if (freqSubmission === 'biweekly') {
        adjustment *= 2;
    }

    let adjustedToday = moment().add(adjustment, type);

    let start, end;
    if (type === 'month') {
        start = adjustedToday.startOf("month").add(state.period.firstDoM - 1, 'day');
        end = start.add(1, 'month').subtract(1, 'day');
    } else {
        start = adjustedToday.startOf('week').add(dayOfWeekMap[state.period.firstDoW], 'day');
    }

    switch (freqSubmission) {
        case 'weekly':
            const daysWeek = [];
            for (let i = 0; i < 7; i++) {
                const col = start.format('ddd DD');
                const id = start.format('YYYY-MM-DD');
                daysWeek.push({
                    "headerName": col,
                    "field": id,
                    "width": 50,
                    "colId": id,
                });
                start = start.add(1, 'day');
            }
            return daysWeek;
        case 'biweekly':
            const daysBiWeek = [];
            for (let i = 0; i < 14; i++) {
                const col = start.format('ddd DD');
                const id = start.format('YYYY-MM-DD');
                daysBiWeek.push({
                    "headerName": col,
                    "field": id,
                    "width": 50,
                    "colId": id,
                });
                start = start.add(1, 'day');
            }
            return daysBiWeek;
        case 'monthly':
            let startOfAdjustedMonth = start.clone();
            const daysMonth = [];
            while (startOfAdjustedMonth.isSameOrBefore(end)) {
                const col = startOfAdjustedMonth.format('ddd DD');
                const id = startOfAdjustedMonth.format('YYYY-MM-DD');
                daysMonth.push({
                    "headerName": col,
                    "field": id,
                    "width": 50,
                    "colId": id,
                });
            }
            return daysMonth;
    }
}

function totalColumn(state, getters) {
    return getters.manageTableColumns.length;
}

function getTotalHoursBy(state, getters) {
    function parseHour(hour) {
        return (+hour.split(':')[0] + (hour.split(':')[1] / 60));
    }

    return function(view) {
        let _type = '';
        let multiplier = 1;
        let adjustedToday = moment();

        if (view === 'timesheet') {
        _type = state.calendarType.replace('weekday', 'week');
            adjustedToday = adjustedToday.add(state.calendarAdjustment, _type);
        } else if (view === 'manage-timesheet') {
            _type = state.manageTimesheetType.replace('weekday', 'week');
            multiplier = getters.totalColumn;
            adjustedToday = adjustedToday.add(state.manageTimesheetAdjustment, _type);
        } else if (view === 'submit') {
            _type = state.period.freqSubmission.replace('ly', '');
            adjustedToday = adjustedToday.add(state.submitAdjustment, _type.replace('bi-', ''));
        }

        const hourPerDay = parseHour(state.period.hoursRequired);
        const workingDayPerWeek = Object.values(state.period.workingDays).reduce((acc, val) => val ? acc + 1 : acc, 0);

        if (_type) {
            switch (_type) {
                case 'day':
                    return hourPerDay * multiplier + "h";
                case 'week':
                    return (hourPerDay * multiplier * workingDayPerWeek) + "h";
                case 'bi-week':
                    return ((hourPerDay * multiplier * workingDayPerWeek) * 2) + "h";
                case 'month':
                    let startDateOfMonth = adjustedToday.startOf('month').add(state.period.firstDoM - 1, 'day');
                    let lastDateOfMonth = startDateOfMonth.add(1, 'month').subtract(1, 'day');

                    // |------Tuần chẵn-----|------Ngày dư
                    let total = 0;
                    for (let i = 0; i < multiplier; i++) {
                        // Tuần chẵn
                        const evenWeek = lastDateOfMonth.diff(startDateOfMonth, 'week');
                        total += (evenWeek * workingDayPerWeek) * hourPerDay;
                        // Ngày dư
                        let reservedDays = lastDateOfMonth.diff(startDateOfMonth, 'day') + 1 - evenWeek * 7;
                        let _lastDoM = lastDateOfMonth.clone();
                        for (let cnt = 0; cnt < reservedDays; cnt++) {
                            _lastDoM = _lastDoM.subtract(cnt, 'day');
                            if (state.period.workingDays[dayOfWeekMap[`${_lastDoM.day()}`]]) {
                                total += hourPerDay;
                            }
                        }
                        lastDateOfMonth = startDateOfMonth.subtract(1, 'day');
                        startDateOfMonth = lastDateOfMonth.subtract(1, 'month').add(1, 'day');
                    }
                    return +total.toFixed(1) + "h";
            }
        } else {
            return '0h';
        }
    }
}

export {
    getTotalHoursBy,
    manageTableColumns,
    totalColumn,
    manageTimesheetStartEndDate,
    submitTableColumns,
    submitStartEndDate
}