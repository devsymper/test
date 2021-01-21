import ReportBase from './ReportBase'
import {TranslatorHelper} from '@/components/dashboard/configPool/translatorHelper'

export default class Card extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ['compareValue','value']
        let styleKeys ={
			"card":{
				"title":"Card options",
				"items":["cardMode","revertColor"]
			},
			"dataLabel":{
				"title":"Data label",
				"items":["alignment","fontColor","fontColor","textSize","unit","valueDecimal"]
			},
			"deltaInfo":{
				"title":"Delta",
				"items":["alignment","fontColor","textSize"]
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
        super('card', symperId, columnSettingKeys, styleKeys);
	}
	translate(rawConfig,  data, extraData ,changes = {}, oldOutput = {}){
		let output = TranslatorHelper.Charts.card(data.data , rawConfig.setting , rawConfig.style , 1)
		return output
	}
}