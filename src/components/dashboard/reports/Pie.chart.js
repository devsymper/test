import ReportBase from './ReportBase'
import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import {TranslatorHelper} from '@/components/dashboard/configPool/translatorHelper'
export default class Pie extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group3.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group3.styleKeys
        super('pie', symperId, columnSettingKeys, styleKeys);
    }

    translate(rawConfig,  data, extraData ,changes = {}, oldOutput = {}){
		let output = TranslatorHelper.Charts.pie(data, rawConfig.setting, rawConfig.style , false, 1)
		return output
	}

	// convertSeries(options,data){
    //     let series = [];
    //     let legends = [];
    //     if(options.setting.yAxis1){
    //         options.setting.yAxis1.selectedColums.forEach(element => {
    //             series.push({
    //                 name:element.as,
    //                 data:[]
    //             });            
    //         });
    //     }

    //     if(options.setting.legend){
    //         options.setting.legend.selectedColums.forEach(element => {
    //             legends.push(element.as);
    //         });
    //     }
        

    //     let name ='';
    //     if(legends.length > 0){
    //         series.forEach((element,idx) => {
    //             data.forEach(dt => {
    //                 name = dt[legends[idx]?legends[idx]:legends[legends.length - 1]];
    //                 name = name?name:'';
    //                 element.data.push({
    //                     name:name,
    //                     y:Number(dt[element.name])
    //                 });
    //             });
    //         });
    //     }        
    //     return series
	// }
	// convertStyle(options){
	// 	let obj = {}
	// 	if(options.style.length > 0){
	// 		options.style.forEach(function(e){
	// 			obj[e.name] = StyleConvert[e.name+'Convert'](e.children)
	// 		})
	// 	}
	// 	return obj
	// }
}