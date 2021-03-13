import moment from 'moment';
export const sumDuration = function (_event){
     _event.sort((after, before)=>{return after.start - before.start;});
    let lastLogStart =_event[0].start;
    let lastLogEnd =_event[0].end;
    let duration = 0;
    let lastDuration = 0;
    let lastId =_event[0].id;
    _event.map(log=>{
          // TH1: trường hợp log sau bắt đầu lớn hơn log trước
        if(log.start>lastLogStart){
            if(log.end>lastLogEnd){// log sau và log trước có 1 phần trùng nhau
                if(log.start<lastLogEnd){// trùng nhau
                    // duration += 1;
                    duration += Number(moment(moment(lastLogStart,"x").diff(moment(log.end,"x"))).format("mm"))
                }else{// sắp sau nhau
                    duration += Number(lastDuration);
                }
            }
        }else{// trường hợp bằng nhau
            // do cùng log
            if(log.id==lastId){
                duration = Number(log.duration)
            }else{// khác log
                if(log.end>lastLogEnd){//lấy log mới
                    duration += Number(log.duration)
                }else{
                    // lấy log cũ
                    duration += 0
                }
            }
        }
        lastLogStart = log.start;
        lastLogEnd = log.end;
        lastDuration = Number(log.duration);
        lastId = log.id;
      })
      return changeDuration(duration)
}
function changeDuration(duration){
    let hour = duration / 60;
    let minutes = duration % 60;
    if (Math.floor(hour) > 0) {
        hour = Math.floor(hour) + 'h';
    } else {
        hour = hour==0?0:''
    }
    if (minutes > 0) {
        minutes = minutes + 'm';
    } else {
        minutes = '';
    }
    return hour + minutes
}

  
    
   

