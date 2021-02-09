import ReportBase from './ReportBase'
import {TranslatorHelper} from '@/components/dashboard/configPool/translatorHelper'
	
export default class Treemap extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ['detail','group','tooltips','value' ]
        let styleKeys ={
			"legend":{
				"title":"Legend",
				"items":["fontColor","legendPosition","name","show","showLegendTitle","textSize","titleText"]
			},
			"lvl1DataLabel":{
				"title":"Group Data label",
				"items":["alignment","bgColor","borderColor","borderWidth","fontColor","show","textSize","tooltipDecimalNumber","verticalAlign"]
			},
			"lvl2DataLabel":{
				"title":"Detail Data label",
				"items":["alignment","bgColor","borderColor","borderWidth","fontColor","show","textSize","verticalAlign"]
			},
			"general":{
				"title":"General",
				"items":["bgColor","borderColor","borderWidth","colorPalette","fontFamily"]
			},
			"title":{
				"title":"Title",
				"items":["alignment","bgColor","fontColor","show","textSize","titleText"]
			},
		}
        super('treeMap', symperId, columnSettingKeys, styleKeys);
	}
	translate(rawConfig,  data, extraData ,changes = {}, oldOutput = {}){
		let output =  TranslatorHelper.Charts.treeMap(data.data, rawConfig.setting, rawConfig.style , 1 , extraData)
		return output
	}

}