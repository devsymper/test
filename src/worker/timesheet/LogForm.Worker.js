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
export const deleteLogTime = async function(event) {
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