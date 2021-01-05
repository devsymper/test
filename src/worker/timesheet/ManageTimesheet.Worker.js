import timesheetApi from '@/api/timesheet.js'
import _groupBy from 'lodash/groupBy';
import moment from 'moment';

self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'showTotalHourManageView':
			let rows = await showTotalHourManageView(data);
            postMessage({action:'showTotalHourManageView', dataAfter : rows})
            break;
        default:
            break;
    }
};

export const showTotalHourManageView = async function(data) {
    let dataTable = [];
    let sum = 0;
    let res = await timesheetApi.getLogTimeList({
            startEnd: data.startEnd
        }) 
    if (res.status === 200) {
        const ranges = data.allColumns.slice(2, data.allColumns.length).map(c => c.colId);
        const logTimeListByAccount = _groupBy(res.data.listLogTime, 'account_id');
        let userName = res.data.userName;
        dataTable = Object.keys(logTimeListByAccount).map(k => {
            const returnObj = {
                name:[userName],
                department: 'department',
            };
            let logged = 0;
            ranges.forEach(r => {
                const start = r.split(" ")[0];
                const end = r.split(" ")[1];
                logTimeListByAccount[k] = logTimeListByAccount[k].map(log => {
                    if (log.checked) {
                        return {
                            ...log,
                            checked: true,
                        }
                    }
                    let checked = false;
                    if (moment(log.date).isBetween(start, end, 'day', '[]')) {
                        const duration = (log.duration / 60);                        
                        returnObj[r] = (returnObj[r] || 0) + duration;
                        logged += duration;
                        checked = true;
                    }
                    return {
                        ...log,
                        checked,
                    }
                })
            });
            returnObj['logged'] = logged.toFixed(2);
            return returnObj;
        })
        return dataTable
    }
}