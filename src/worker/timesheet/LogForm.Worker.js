import timesheetApi from '@/api/timesheet.js'
import moment from 'moment';

self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'copyLogTime':
			let isSuccessCopy = await copyLogTime(data);
            postMessage({action:'copyLogTime', dataAfter: isSuccessCopy})
            break;
        case 'getLogTimeList':
            let logTime = await getLogTimeList(data);
            postMessage({action:'getLogTimeList', dataAfter: logTime})
            break;
        case 'resizeLogtime':
            let task = await resizeLogtime(data);
            postMessage({action:'resizeLogtime', dataAfter: task})
            break;
        case 'changeDuration':
            let duration = await changeDuration(data);
            postMessage({action:'changeDuration', dataAfter: duration})
            break;
        default:
            break;
    }
};

export const copyLogTime = async function(event) {
    let check = false;
    let res = await timesheetApi.createLogTime({
          start:moment(event.start).add(1, 'h').format("YYYY-MM-DD HH:mm"),
          start:moment(event.start).add(1, 'h').format("YYYY-MM-DD HH:mm"),
          end: moment(event.end).add(1, 'h').format("YYYY-MM-DD HH:mm"),
          duration:event.duration,
          task: event.task,
          type: event.type,
          id: event.id,
          date: event.date,
          categoryTask: event.category,
          desc: event.desc || ""
      })
      if(res.status==200){
         check = true
      }
      return check
}
export const resizeLogtime = async function(events) {
    let taskLength = 60*60*1000;
    let padding = 60*60*300;
    let lastDate, lastEnd;
    let newTasks = events.map(task=>{
        if(task.date!== lastDate){
            lastDate = task.date;
            task.start = moment(task.start).startOf('day').hour(1).toDate().getTime()
            task.end = task.start + taskLength;
            lastEnd = task.end
        }else{
            task.start = lastEnd+padding;
            task.end = task.start + taskLength;
            lastEnd = task.end
        }
        return task;
    })
    return newTasks
}
export const getLogTimeList = async function(dateStartEnd){
    let res = await timesheetApi.getLogTimeList(dateStartEnd);
    let data = {
        sumLogTime: 0,
        hoursRequired: 0,
        events:[]
    }
    if(res.status == 200){
        const logTimeList = res.data.listLogTime;
        data.sum = res.data.sumLogTime;
        data.hoursRequired = res.data.hourRequired[0].hoursRequired;
        data.events = [...logTimeList.map((logTime, idx) => ({
            name: `${logTime.task_id}`,
            timed: true,
            // log form data
            date: logTime.date,
            start: Date.parse(logTime.start_time_at),
            end: Date.parse(logTime.end_time_at),
            duration: logTime.duration,
            category: logTime.category_task,
            category_key: logTime.key,
            task: logTime.task_id,
            desc: logTime.description,
            type: logTime.type,
            id: logTime.id,
            docObjId:logTime.doc_obj_id
        }))];
    }
    debugger
    return data
}
export const changeDuration = async function(duration){
    let hour = duration / 60;
    let minutes = duration % 60;
    if (Math.floor(hour) > 0) {
        hour = Math.floor(hour) + 'h';
    } else {
        hour = ''
    }
    if (minutes > 0) {
        minutes = minutes + 'm';
    } else {
        minutes = '';
    }
    return hour + minutes
}