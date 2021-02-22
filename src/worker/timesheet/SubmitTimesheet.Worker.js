import timesheetApi from '@/api/timesheet.js'
import _groupBy from 'lodash/groupBy';

self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'showTotalHourInSubmitView':
			let rows = await showTotalHourInSubmitView(data);
            postMessage({action:'showTotalHourInSubmitView', dataAfter : rows})
            break;
        default:
            break;
    }
};

export const showTotalHourInSubmitView = async function(data) {
    let sum = 0;
    let dataTable = [];
    let res = await timesheetApi.sendStartEnd({
            startEnd: data.data.startEnd
        }) 
    if (res.status === 200) {
        const ranges = data.data.allColumns.slice(2, data.data.allColumns.length).map(c => c.colId);
        const logTimeList = _groupBy(res.data.listLogTime, 'task_id');
        const dateList = _groupBy(res.data.listLogTime, 'date');
        //console.log(dateList);
        const rows = Object.keys(logTimeList).map(k => {
            let name = res.data.listLogTime.filter(log=>log.task_id==k).length>0?res.data.listLogTime.filter(log=>log.task_id==k)[0].task_name:'Chưa có';
            const returnObj = {
                // name: [logTimeList[k][0].account_id],
                category: logTimeList[k][0].category_task,
                name: [name],

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

        Object.keys(dateList).forEach(key => {
        dateList[key] = dateList[key].reduce((acc, date) => acc + date.duration/60, 0).toFixed(1);
    //    console.log( dateList[key]);
        });
        dateList.name = ["Tổng"];
        dateList.category ='';
        // dateList.cellStyle = {color: 'red', 'background-color': 'green'};
        dateList.logged = "0";
        dateList.logged = (rows.reduce((acc,r) => +r.logged + acc, 0));
        //console.log(typeof dateList.logged);
        sum = dateList.logged.toFixed(1);
        rows.push(dateList);
        // this.dataTable = ;
        dataTable=rows;
    }
	return {
        dataTable:dataTable,
        sum:sum
    }

}