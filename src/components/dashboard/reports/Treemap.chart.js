import ReportBase from './ReportBase'

export default class TreeMap extends ReportBase {
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
}