import ReportBase from './ReportBase'
import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import {getDefaultDisplayOption} from '@/components/dashboard/configPool/dashboardConfigs'
import {legendConvert, titleConvert , pieDetailLabelConvert, generalConvert } from '@/components/dashboard/configPool/styleConvert'

export default class Pie extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group3.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group3.styleKeys
        super('pie', symperId, columnSettingKeys, styleKeys);
    }

    translate(rawConfig,  data, extraData ,changes = {}, oldOutput = {}){
		let defConfig = getDefaultDisplayOption()
		defConfig.series = this.convertSeries(rawConfig, data)
		let styleConvert = this.convertStyle(rawConfig)
		let obj = Object.assign(defConfig , styleConvert)
		debugger
		return obj
	}

	convertSeries(options,data){
        let series = [];
        let legends = [];
        if(options.setting.yAxis1){
            options.setting.yAxis1.selectedColums.forEach(element => {
                series.push({
                    name:element.as,
                    data:[]
                });            
            });
        }

        if(options.setting.legend){
            options.setting.legend.selectedColums.forEach(element => {
                legends.push(element.as);
            });
        }
        

        let name ='';
        if(legends.length > 0){
            series.forEach((element,idx) => {
                data.forEach(dt => {
                    name = dt[legends[idx]?legends[idx]:legends[legends.length - 1]];
                    name = name?name:'';
                    element.data.push({
                        name:name,
                        y:Number(dt[element.name])
                    });
                });
            });
        }        

        return series
	}
	convertStyle(options){
		let obj = {}
		if(options.style.length > 0){
			options.style.forEach(function(e){
				// let converter = e.name+'Convert'
				// obj[e.name] = eval(converter+'(e.children)')
				if(e.name == 'legend'){
					obj[e.name] = legendConvert(e.children)
				}else if(e.name == 'title'){
					obj[e.name] = titleConvert(e.children)
				}else if(e.name == 'pieDetailLabel'){
					obj[e.name] = pieDetailLabelConvert(e.children)
				}else if(e.name == 'general'){
					obj[e.name] = generalConvert(e.children)
				}
				debugger
			})
		}
		return obj
	}
}