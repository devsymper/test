import ReportBase from './ReportBase'

export default class Filter extends ReportBase {
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
}