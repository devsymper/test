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
        case 'resizeLogtime':
            debugger
            let task = await resizeLogtime(data);
            postMessage({action:'resizeLogtime', dataAfter: task})
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
    debugger
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