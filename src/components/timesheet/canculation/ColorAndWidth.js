import { SYMPER_APP } from "./../../../main"
export const getWidthMonth = function (event,hour){
    let width = '0';
    if(event){
        width =((event.reduce((acc, d) => +d.duration + acc, 0) / 60) / hour)* 100
    }
    if(width>100) width = 100;
    return width;
}
export const getPercentage = function(event,hour){
    let width = '0';
      if(event){
          width = ((event.reduce((acc, d) => +d.duration + acc, 0) / 60) / hour)* 100
      }
      let percent = (Math.round(width * 100)/100).toFixed(1);
      if(percent == '0.0') percent = 0
      return percent+'%'
}
export const getStatusHeader = function (color){
    let result = 'New';
    switch(color){
      case 'grey-color':
          result = 'New'
          break
      case 'dark-red-color':
          result = 'Overload'
          break
      case 'green':
          result = 'Fullload'
          break
      case 'dark-yellow-color':
          result = 'Underload'
          break
    }
    return SYMPER_APP.$t('timesheet.status.'+result)
}
export const coloringHeader = function (date,hoursRequired,type){
    let color = 'grey-color';
    let hour = hoursRequired.trim()
    if(date){
        let totalHour =  date.reduce((acc, d) => +d.duration + acc, 0);
        if(totalHour>hour*60){
            color = type=='status'?"dark-red-color":"light-red-color"
        }else if(totalHour==hour*60){
            color =  type=="status"?"green":"light-green-color"
        }
        else{
            color = type=="status"?"dark-yellow-color":"light-yellow-color"
        }
    }
    return color
}
    
   

