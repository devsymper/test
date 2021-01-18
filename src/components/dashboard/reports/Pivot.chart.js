import ReportBase from './ReportBase'

export default class Pivot extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ['columns','rows','value']
        let styleKeys ={
			"headerFormat":{
				"title":"Header Style",
				"items":["alignment","bgColor","borderColor","borderWidth","fontColor","tableColumnWidthMode","textSize","verticalAlign","wrapText"]
			},
			"cellFormat":{
				"title":"Row data Style",
				"items":["borderBottomColor","borderBottomWidth","fontColor","textSize","tooltipDecimalNumber","verticalAlign","zeroValueDisplay"]
			},
			"total":{
				"title":"Total",
				"items":["bgColor","fontColor","show","textSize"]
			},
			"conditionalFormat":{
				"title":"Conditional Format",
				"items":["conditionalFormatCondition"]
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
        super('pivot', symperId, columnSettingKeys, styleKeys);
    }
}