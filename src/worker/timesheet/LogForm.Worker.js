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
          end: moment(event.end).add(1, 'h').format("YYYY-MM-DD HH:mm"),
          duration:event.duration,
          task: event.task,
          type: event.type,
          taskName:event.name,
          id: event.id,
          date: event.date,
          categoryTask: event.category,
          desc: event.desc || "",
          cateId: event.cateId
      })
      if(res.status==200){
         check = true
      }
      return check
}
export const resizeLogtime = async function(events) {
    let taskLength = 85*60*1000;
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
        events:[]
    }
    if(res.status == 200){
        const logTimeList = res.data.listLogTime;
        data.events = [...logTimeList.map((logTime, idx) => ({
            name: `${logTime.nameTask}`,
            timed: true,
            date: logTime.date,
            start: Date.parse(logTime.startTimeAt),
            end: Date.parse(logTime.endTimeAt),
            duration: logTime.duration,
            category: logTime.categoryId,
            category_key: logTime.key,
            task: logTime.taskId,
            desc: logTime.description,
            color:'#F0F8FF',
            type: logTime.type,
            id: logTime.id,
            docObjId:logTime.docObjId
        }))];
    }
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