import ReportBase from './ReportBase'
import {TranslatorHelper} from '@/components/dashboard/configPool/translatorHelper'

export default class ReportFilter extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ['value']
        let styleKeys ={
			"selectionControl":{
				"title":"Selection Control",
				"items":["selectionMode","selectionType"]
			},
			"filterItem":{
				"title":"Filter item",
				"items":["fontColor","textSize"]
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
        super('filter', symperId, columnSettingKeys, styleKeys);
	}
	translate(rawConfig,  data, extraData ,changes = {}, oldOutput = {}){
		let output = TranslatorHelper.Charts.filter(data.data , rawConfig.setting , rawConfig.style , 1 , extraData)
		return output
	}

}