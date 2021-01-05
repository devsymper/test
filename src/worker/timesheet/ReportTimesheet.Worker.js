import timesheetApi from '@/api/timesheet.js'
import _groupBy from 'lodash/groupBy';

self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'showTotalHourInReportView':
			let rows = await showTotalHourInReportView(data);
            postMessage({action:'showTotalHourInReportView', dataAfter : rows})
            break;
        default:
            break;
    }
};

export const showTotalHourInReportView = async function(data) {
    debugger
    let listUser = data.data.listUser;
    let sum = 0;
    let dataTable = [];
    let res = await timesheetApi.getListReport({
            startEnd: data.data.startEnd
        }) 
    if (res.status === 200) {
        if (res.status === 200) {
            const ranges = data.data.allColumns.slice(2, data.data.allColumns.length).map(c => c.colId);
            const logTimeList = _groupBy(res.data.listLogTime, 'id');
            const dateList = _groupBy(res.data.listLogTime, 'date');
            const userName = _groupBy(res.data.listLogTime, 'account_id');
            const rows = Object.keys(logTimeList).map(k => {
                const returnObj = {
                    category: logTimeList[k][0].category_task,
                    name: [getName(listUser, logTimeList[k][0].account_id),k+'-'+logTimeList[k][0].task_id],
                };
                let logged = 0;
                logTimeList[k].forEach(log => {
                    const loggedByDay = (log.duration / 60);
                    returnObj[log.date] = loggedByDay.toFixed(1);
                    if (ranges.includes(log.date))
                        logged += loggedByDay;
                })
                returnObj['logged'] = logged.toFixed(1);
                return returnObj;
            }).filter(logTime => logTime.logged > 0);

            // tính tổng theo từng ngày 
            Object.keys(userName).forEach(key => {
                let time =  _groupBy(userName[key], 'date');
                let totalByDays = {name:[getName(key)]};
                let totalByUser = 0;
                Object.keys(time).forEach(day => {
                    let totalByDay = time[day].reduce((acc, duration) => acc + duration.duration/60, 0);
                    totalByUser += totalByDay;
                    totalByDays[day] = totalByDay.toFixed(1);
                });
                totalByDays['logged'] = totalByUser.toFixed(1);
                totalByDays.summary = true;
                rows.push(totalByDays);
            });
            
            Object.keys(dateList).forEach(key => {
                dateList[key] = dateList[key].reduce((acc, date) => acc + date.duration/60, 0).toFixed(1);
            });
            // tính số log theo ngày 
            dateList.name = ["Tổng"];
            dateList.logged = (rows.reduce((acc,r) => r.logged && r.summary ? +r.logged + acc : acc, 0)).toFixed(1);
            sum = dateList.logged;
            rows.push(dateList);
            dataTable=rows;
        }
    }
	return {
        dataTable:dataTable,
        sum:sum
    }
}
export const getName = function(listUser, id){
    for(let i = 0; i<listUser.length;i++){
        if(listUser[i].id==id){
           // this.nameUser.push(listUser[i].userName);
            return listUser[i].userName;
        }
    }
}