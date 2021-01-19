import ReportBase from './ReportBase'
import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'

export default class StackedBar extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group1.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group1.styleKeys
        super('stackedBar', symperId, columnSettingKeys, styleKeys);
    }
    
    translate(rawConfig,  data, changes = {}, oldOutput = {}){
        let displayOptions = getDefaultDisplayOption();

        let xAxis = []; // các cột được chọn làm x axis (thường chỉ có một cột)
        let yAxis = [[]]; // các cột chọn làm y axis, bắt đầu bằng 1
        let mergedYAxis = []; // các cột chọn làm y axis, nhưng dưới dạng liệt kê, không phân trái phải

        if(rawConfig.settings.xAxis && rawConfig.settings.xAxis.selectedColums !== undefined){
            for(let cln of rawConfig.settings.xAxis.selectedColums){
                xAxis.push(cln.as);
            }
        }
        
        if(rawConfig.settings.yAxis1){
            let maxYAxis = rawConfig.settings.yAxis1.lastYaxis;
            for(let i = 1 ;i<=maxYAxis;i++){
                yAxis.push([]);
                if(rawConfig.settings['yAxis'+i].selectedColums !== undefined){
                    for(let cln of rawConfig.settings['yAxis'+i].selectedColums){
                        yAxis[i].push(cln);
                        mergedYAxis.push(cln);
                    }
                }
                
            }
        };

        return getStructuredOptions(xAxis,mergedYAxis,yAxis,data,"stackedBar");

    }
}

export const getDefaultDisplayOption = function() {
    return {
        symperTitle: {},
        general: {},
        data: [],
        contentSize: {
            h: 0,
            w: 0
        }
    };
}

function getStructuredOptions(xAxis,mergedYAxis,yAxis,data,chartType){
    let xAxisCategory = [];
    let convertedYAxis = [];
    let series = [];

    let activeYAxisCount = 0;
    if(yAxis.length > 0){
        for(let i = 0; i < yAxis.length;i++ ){
            let yAxisColumns = yAxis[i];
            if(yAxisColumns.length > 0){
                // Đặt tiêu đề cho các yaxis
                let yConfig = {
                    title: {
                        text: '',
                    },
                };
                yConfig.title.text =  yAxisColumns[0].as;
                convertedYAxis.push(yConfig);

                // tạo luôn series ứng với yaxis nào
                 for(let column of yAxisColumns){
                    let newSery = {
                        yAxis: activeYAxisCount,
                        name:column.as,
                        data:[]
                    };
                    series.push(newSery);
                }
                activeYAxisCount += 1;
            }
        }
    }
    

    xAxis = xAxis[0]; // Thường chỉ có 1 xaxis nên chỉ lấy thằng đầu tiên
    for(let dt of data){
        xAxisCategory.push(dt[xAxis]);
        for(let sr of series){
            sr.data.push(Number(dt[sr.name]));
        }
    }

    return {
        series:series,
        xAxis: {
            categories: xAxisCategory
        },
        yAxis:convertedYAxis
    }
}