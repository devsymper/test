<template>
	<div class="config-settings" >
		<VuePerfectScrollbar :style="{height: height + 'px'}">
				<cell-config-setting-template 
					@add-y-axis="addYAxis" 
					@change-column-setting="changeColumnSetting" 
					v-for="(item,settingName) in settings" 
					:key="settingName" 
					:settingItem="item" 
					:selectedCell="selectedCell"
					:settingTplAgg="settingTplAgg"> 
				</cell-config-setting-template>
		</VuePerfectScrollbar>
	</div>
</template>
<script> 
import CellConfigSettingTemplate from '@/components/dashboard/components/reportConfig/CellConfigSettingTemplate';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import settingTplAgg from '@/components/dashboard/configPool/settingTplAgg';
import PieChart from '@/components/dashboard/reports/Pie.chart.js'

export default {
    components:{
		'CellConfigSettingTemplate': CellConfigSettingTemplate,
		VuePerfectScrollbar
    },
	props:{
		selectedCell:{
			type: Object,
			default(){
				return {
					"sharedConfigs":{
						"type":"stackedColumn",
						"yAxisCount":2,
						"cellId":"cell-1610424019645",
						"data":[
							{
								"ASSIGNEE":"",
								"Tổng thời gian KH":129,
								"Tổng thời gian TT":0
							},
							{
								"ASSIGNEE":"0",
								"Tổng thời gian KH":1,
								"Tổng thời gian TT":0
							},
							{
								"ASSIGNEE":"1077",
								"Tổng thời gian KH":24,
								"Tổng thời gian TT":0
							},
							{
								"ASSIGNEE":"1160",
								"Tổng thời gian KH":0,
								"Tổng thời gian TT":0
							},
							{
								"ASSIGNEE":"925",
								"Tổng thời gian KH":0,
								"Tổng thời gian TT":0
							},
							{
								"ASSIGNEE":"969",
								"Tổng thời gian KH":0,
								"Tổng thời gian TT":0
							},
							{
								"ASSIGNEE":"970",
								"Tổng thời gian KH":628.75,
								"Tổng thời gian TT":0
							},
							{
								"ASSIGNEE":"971",
								"Tổng thời gian KH":337,
								"Tổng thời gian TT":0
							},
							{
								"ASSIGNEE":"972",
								"Tổng thời gian KH":0,
								"Tổng thời gian TT":0
							},
							{
								"ASSIGNEE":"973",
								"Tổng thời gian KH":352.3,
								"Tổng thời gian TT":0
							},
							{
								"ASSIGNEE":"974",
								"Tổng thời gian KH":0,
								"Tổng thời gian TT":0
							},
							{
								"ASSIGNEE":"975",
								"Tổng thời gian KH":13.5,
								"Tổng thời gian TT":0
							},
							{
								"ASSIGNEE":"976",
								"Tổng thời gian KH":516,
								"Tổng thời gian TT":0
							},
							{
								"ASSIGNEE":"977",
								"Tổng thời gian KH":192,
								"Tổng thời gian TT":0
							}
						]
					},
					"rawConfigs":{
						"setting":{
							"xAxis":{
								"name":"X Axis",
								"slot":"n",
								"selectedColums":[
								{
									"as":"ASSIGNEE",
									"agg":"first",
									"cond":{
										"val":"",
										"type":"isall"
									},
									"edit":false,
									"name":"assignee",
									"type":"text",
									"dataset":"3665",
									"origin_type":"text"
								}
								]
							},
							"legend":{
								"name":"Legend",
								"slot":"1",
								"selectedColums":[
								
								]
							},
							"tooltips":{
								"name":"Tooltips",
								"slot":"n",
								"hasAgg":true,
								"selectedColums":[
								
								]
							},
							"yAxis1":{
								"name":"Y Axis 1",
								"slot":"1",
								"hasAgg":true,
								"lastYaxis":1,
								"selectedColums":[
								{
									"as":"Tổng thời gian KH",
									"agg":"sum",
									"cond":{
										"val":"",
										"type":"isall"
									},
									"edit":false,
									"name":"tong_tg",
									"type":"number",
									"dataset":"3665",
									"yAxisNum":0,
									"origin_type":"number"
								},
								{
									"as":"Tổng thời gian TT",
									"agg":"sum",
									"cond":{
										"val":"",
										"type":"isall"
									},
									"edit":false,
									"name":"tong_tg_tt",
									"type":"number",
									"dataset":"3665",
									"yAxisNum":0,
									"origin_type":"number"
								}
								]
							},
							"yAxis2":{
								"name":"Y Axis 2",
								"slot":"1",
								"hasAgg":true,
								"lastYaxis":1,
								"selectedColums":[
								
								]
							}
						},
						"style":[
							{
								"label":"Legend",
								"name":"legend",
								"show":true,
								"children":{
								"show":{
									"label":"Show",
									"type":"switch",
									"default":true,
									"value":true,
									"name":"show"
								},
								"name":{
									"label":"Name",
									"type":"text",
									"default":"",
									"value":"",
									"name":"name"
								},
								"legendPosition":{
									"label":"Position",
									"type":"btnSelect",
									"default":"vertical-bottom",
									"options":[
										{
											"name":"Left",
											"icon":"ms-Icon ms-Icon--AlignHorizontalLeft",
											"value":"vertical-left",
											"text":""
										},
										{
											"name":"Top",
											"icon":"ms-Icon ms-Icon--AlignVerticalTop",
											"value":"horizontal-top",
											"text":""
										},
										{
											"name":"Right",
											"icon":"ms-Icon ms-Icon--AlignHorizontalRight",
											"value":"vertical-right",
											"text":""
										},
										{
											"name":"Bottom",
											"icon":"ms-Icon ms-Icon--AlignVerticalBottom",
											"value":"horizontal-bottom",
											"text":""
										}
									],
									"value":"horizontal-top",
									"name":"legendPosition"
								},
								"fontColor":{
									"label":"Font Corlor",
									"type":"color",
									"default":"#344750",
									"value":"#344750",
									"name":"fontColor"
								},
								"textSize":{
									"label":"Text Size",
									"type":"number",
									"default":"13",
									"value":12,
									"name":"textSize"
								},
								"showLegendTitle":{
									"label":"Show Legend Title",
									"type":"switch",
									"default":true,
									"value":false,
									"name":"showLegendTitle"
								},
								"titleText":{
									"label":"Title text",
									"type":"text",
									"default":"",
									"value":"",
									"name":"titleText"
								}
								}
							},
							{
								"label":"Data label",
								"name":"dataLabel",
								"show":true,
								"children":{
								"show":{
									"label":"Show",
									"type":"switch",
									"default":true,
									"value":false,
									"name":"show"
								},
								"fontColor":{
									"label":"Font Corlor",
									"type":"color",
									"default":"#344750",
									"value":"#344750",
									"name":"fontColor"
								},
								"textSize":{
									"label":"Text Size",
									"type":"number",
									"default":"13",
									"value":11,
									"name":"textSize"
								},
								"bgColor":{
									"label":"Background Corlor",
									"type":"color",
									"default":"#ffffff",
									"value":"#ffffff00",
									"name":"bgColor"
								},
								"borderWidth":{
									"label":"Border Width",
									"type":"number",
									"default":0,
									"value":0,
									"name":"borderWidth"
								},
								"borderColor":{
									"label":"Border Corlor",
									"type":"color",
									"default":"#000000",
									"value":"#ffffff00",
									"name":"borderColor"
								},
								"tooltipDecimalNumber":{
									"label":"Decimal number",
									"type":"number",
									"default":2,
									"value":2,
									"name":"tooltipDecimalNumber"
								}
								}
							},
							{
								"label":"X axis",
								"name":"xAxis",
								"show":true,
								"children":{
								"show":{
									"label":"Show",
									"type":"switch",
									"default":true,
									"value":true,
									"name":"show"
								},
								"axistitle":{
									"label":"Axis title",
									"type":"switch",
									"default":true,
									"value":false,
									"name":"axistitle"
								},
								"titleText":{
									"label":"Title text",
									"type":"text",
									"default":"",
									"value":"",
									"name":"titleText"
								},
								"textSize":{
									"label":"Text Size",
									"type":"number",
									"default":"13",
									"value":11,
									"name":"textSize"
								},
								"alignment":{
									"label":"Alignment",
									"type":"btnSelect",
									"default":"left",
									"options":[
										{
											"name":"left",
											"icon":"ms-Icon ms-Icon--AlignHorizontalLeft",
											"value":"left",
											"text":""
										},
										{
											"name":"center",
											"icon":"ms-Icon ms-Icon--AlignHorizontalCenter",
											"value":"center",
											"text":""
										},
										{
											"name":"right",
											"icon":"ms-Icon ms-Icon--AlignHorizontalRight",
											"value":"right",
											"text":""
										}
									],
									"value":"center",
									"name":"alignment"
								},
								"gridLine":{
									"label":"Show Gridline",
									"type":"switch",
									"default":true,
									"value":false,
									"name":"gridLine"
								},
								"gridLineWidth":{
									"label":"Gridline Width",
									"type":"number",
									"default":1,
									"value":1,
									"name":"gridLineWidth"
								},
								"gridLineColor":{
									"label":"Gridline Color",
									"type":"color",
									"default":"#e6e6e6",
									"value":"#e6e6e6",
									"name":"gridLineColor"
								},
								"gridLineType":{
									"label":"Gridline Type",
									"type":"select",
									"default":"LongDash",
									"options":[
										{
											"value":"LongDash",
											"text":"Dashed"
										},
										{
											"value":"Dot",
											"text":"Dot"
										},
										{
											"value":"Solid",
											"text":"Solid"
										}
									],
									"value":"LongDash",
									"name":"gridLineType"
								},
								"unit":{
									"label":"Display Unit",
									"type":"select",
									"default":"auto",
									"options":[
										{
											"value":"auto",
											"text":"Auto"
										},
										{
											"value":"none",
											"text":"None"
										},
										{
											"value":"thousands",
											"text":"Thousands"
										},
										{
											"value":"milions",
											"text":"Milions"
										},
										{
											"value":"bilions",
											"text":"Bilions"
										},
										{
											"value":"trilions",
											"text":"Trilions"
										}
									],
									"value":"none",
									"name":"unit"
								}
								}
							},
							{
								"label":"Y Axis 1",
								"name":"yAxis1",
								"show":true,
								"children":{
								"show":{
									"label":"Show",
									"type":"switch",
									"default":true,
									"value":true,
									"name":"show"
								},
								"axistitle":{
									"label":"Axis title",
									"type":"switch",
									"default":true,
									"value":false,
									"name":"axistitle"
								},
								"titleText":{
									"label":"Title text",
									"type":"text",
									"default":"",
									"value":"",
									"name":"titleText"
								},
								"textSize":{
									"label":"Text Size",
									"type":"number",
									"default":"13",
									"value":11,
									"name":"textSize"
								},
								"alignment":{
									"label":"Alignment",
									"type":"btnSelect",
									"default":"left",
									"options":[
										{
											"name":"left",
											"icon":"ms-Icon ms-Icon--AlignHorizontalLeft",
											"value":"left",
											"text":""
										},
										{
											"name":"right",
											"icon":"ms-Icon ms-Icon--AlignHorizontalRight",
											"value":"right",
											"text":""
										}
									],
									"value":"left",
									"name":"alignment"
								},
								"gridLine":{
									"label":"Show Gridline",
									"type":"switch",
									"default":true,
									"value":true,
									"name":"gridLine"
								},
								"gridLineWidth":{
									"label":"Gridline Width",
									"type":"number",
									"default":1,
									"value":1,
									"name":"gridLineWidth"
								},
								"gridLineColor":{
									"label":"Gridline Color",
									"type":"color",
									"default":"#e6e6e6",
									"value":"#e6e6e6",
									"name":"gridLineColor"
								},
								"gridLineType":{
									"label":"Gridline Type",
									"type":"select",
									"default":"LongDash",
									"options":[
										{
											"value":"LongDash",
											"text":"Dashed"
										},
										{
											"value":"Dot",
											"text":"Dot"
										},
										{
											"value":"Solid",
											"text":"Solid"
										}
									],
									"value":"LongDash",
									"name":"gridLineType"
								},
								"unit":{
									"label":"Display Unit",
									"type":"select",
									"default":"auto",
									"options":[
										{
											"value":"auto",
											"text":"Auto"
										},
										{
											"value":"none",
											"text":"None"
										},
										{
											"value":"thousands",
											"text":"Thousands"
										},
										{
											"value":"milions",
											"text":"Milions"
										},
										{
											"value":"bilions",
											"text":"Bilions"
										},
										{
											"value":"trilions",
											"text":"Trilions"
										}
									],
									"value":"auto",
									"name":"unit"
								}
								}
							},
							{
								"label":"General",
								"name":"general",
								"show":true,
								"children":{
								"fontFamily":{
									"label":"Font family",
									"type":"select",
									"default":"roboto",
									"options":[
										{
											"value":"roboto",
											"text":"Roboto"
										}
									],
									"value":"roboto",
									"name":"fontFamily"
								},
								"bgColor":{
									"label":"Background Corlor",
									"type":"color",
									"default":"#ffffff",
									"value":"rgba(255, 255, 255)",
									"name":"bgColor"
								},
								"borderWidth":{
									"label":"Border Width",
									"type":"number",
									"default":0,
									"value":1,
									"name":"borderWidth"
								},
								"borderColor":{
									"label":"Border Corlor",
									"type":"color",
									"default":"#000000",
									"value":"#e5e5e5",
									"name":"borderColor"
								},
								"colorPalette":{
									"label":"Color palette",
									"type":"colorArray",
									"default":[
										
									],
									"value":[
										"rgba(242, 200, 15, 1)",
										"#5F6B6D",
										"#8AD4EB",
										"rgba(254, 150, 102, 1)",
										"#A66999 #73B761",
										"#4A588A",
										"#CD4C46",
										"#71AFE2",
										"#8D6FD1",
										"#EE9E64",
										"#95DABB #074650",
										"#009292",
										"#FE6DB6",
										"#FEB5DA",
										"#480091",
										"#B66DFF",
										"#B5DAFE",
										"rgba(62, 117, 173, 1)",
										"rgba(230, 225, 225, 1)"
									],
									"name":"colorPalette"
								}
								}
							},
							{
								"label":"Title",
								"name":"title",
								"show":true,
								"children":{
								"show":{
									"label":"Show",
									"type":"switch",
									"default":true,
									"value":true,
									"name":"show"
								},
								"titleText":{
									"label":"Title text",
									"type":"text",
									"default":"",
									"value":"TỔNG WH CHƯA DONE (THÁNG)",
									"name":"titleText"
								},
								"fontColor":{
									"label":"Font Corlor",
									"type":"color",
									"default":"#344750",
									"value":"rgba(232, 99, 3, 1)",
									"name":"fontColor"
								},
								"textSize":{
									"label":"Text Size",
									"type":"number",
									"default":"13",
									"value":14,
									"name":"textSize"
								},
								"alignment":{
									"label":"Alignment",
									"type":"btnSelect",
									"default":"left",
									"options":[
										{
											"name":"left",
											"icon":"ms-Icon ms-Icon--AlignHorizontalLeft",
											"value":"left",
											"text":""
										},
										{
											"name":"center",
											"icon":"ms-Icon ms-Icon--AlignHorizontalCenter",
											"value":"center",
											"text":""
										},
										{
											"name":"right",
											"icon":"ms-Icon ms-Icon--AlignHorizontalRight",
											"value":"right",
											"text":""
										}
									],
									"value":"center",
									"name":"alignment"
								},
								"bgColor":{
									"label":"Background Corlor",
									"type":"color",
									"default":"#ffffff",
									"value":"rgba(255, 255, 255)",
									"name":"bgColor"
								}
								}
							},
							{
								"label":" Y Axis 2",
								"name":"yAxis2",
								"show":true,
								"children":{
								"show":{
									"label":"Show",
									"type":"switch",
									"default":true,
									"value":true,
									"name":"show"
								},
								"axistitle":{
									"label":"Axis title",
									"type":"switch",
									"default":true,
									"value":false,
									"name":"axistitle"
								},
								"titleText":{
									"label":"Title text",
									"type":"text",
									"default":"",
									"value":"",
									"name":"titleText"
								},
								"textSize":{
									"label":"Text Size",
									"type":"number",
									"default":"13",
									"value":11,
									"name":"textSize"
								},
								"alignment":{
									"label":"Alignment",
									"type":"btnSelect",
									"default":"left",
									"options":[
										{
											"name":"left",
											"icon":"ms-Icon ms-Icon--AlignHorizontalLeft",
											"value":"left",
											"text":""
										},
										{
											"name":"right",
											"icon":"ms-Icon ms-Icon--AlignHorizontalRight",
											"value":"right",
											"text":""
										}
									],
									"value":"right",
									"name":"alignment"
								},
								"gridLine":{
									"label":"Show Gridline",
									"type":"switch",
									"default":true,
									"value":true,
									"name":"gridLine"
								},
								"gridLineWidth":{
									"label":"Gridline Width",
									"type":"number",
									"default":1,
									"value":1,
									"name":"gridLineWidth"
								},
								"gridLineColor":{
									"label":"Gridline Color",
									"type":"color",
									"default":"#e6e6e6",
									"value":"#e6e6e6",
									"name":"gridLineColor"
								},
								"gridLineType":{
									"label":"Gridline Type",
									"type":"select",
									"default":"LongDash",
									"options":[
										{
											"value":"LongDash",
											"text":"Dashed"
										},
										{
											"value":"Dot",
											"text":"Dot"
										},
										{
											"value":"Solid",
											"text":"Solid"
										}
									],
									"value":"LongDash",
									"name":"gridLineType"
								},
								"unit":{
									"label":"Display Unit",
									"type":"select",
									"default":"auto",
									"options":[
										{
											"value":"auto",
											"text":"Auto"
										},
										{
											"value":"none",
											"text":"None"
										},
										{
											"value":"thousands",
											"text":"Thousands"
										},
										{
											"value":"milions",
											"text":"Milions"
										},
										{
											"value":"bilions",
											"text":"Bilions"
										},
										{
											"value":"trilions",
											"text":"Trilions"
										}
									],
									"value":"auto",
									"name":"unit"
								}
								}
							}
						],
						"condition":[
							
						],
						"extra":{
							
						}
					},
					"viewConfigs":{
						"isSelecting":true,
						"selectedDataset":{
							"3665":{
								"assignee":true,
								"tong_tg":true,
								"tong_tg_tt":true
							}
						},
						"showIcon":false,
						"commentCount":0,
						"displayOptions":{
							"lang":{
								"numericSymbols":[
								"K",
								"M",
								"B",
								"T",
								"P",
								"E"
								],
								"thousandsSep":","
							},
							"chart":{
								"height":233.70141220092773,
								"width":357.0000305175781,
								"style":{
								"fontFamily":"roboto"
								},
								"backgroundColor":"rgba(255, 255, 255)"
							},
							"title":{
								"text":""
							},
							"xAxis":{
								"labels":{
								"style":{
									"fontSize":11
								}
								},
								"gridLineColor":"#e6e6e6",
								"gridLineDashStyle":"LongDash",
								"gridLineWidth":0,
								"visible":true,
								"title":{
								"align":"middle",
								"enabled":false,
								"text":""
								},
								"categories":[
								"",
								"0",
								"1077",
								"1160",
								"925",
								"969",
								"970",
								"971",
								"972",
								"973",
								"974",
								"975",
								"976",
								"977",
								"",
								"0",
								"1077",
								"1160",
								"925",
								"969",
								"970",
								"971",
								"972",
								"973",
								"974",
								"975",
								"976",
								"977"
								]
							},
							"general":{
								"textOutline":"0px",
								"display":"",
								"backgroundColor":"rgba(255, 255, 255)",
								"color":"",
								"fontFamily":"roboto",
								"fontSize":"13px",
								"textAlign":"",
								"borderBottomWidth":"",
								"borderWidth":"1px",
								"borderColor":"#e5e5e5"
							},
							"symperTitle":{
								"text":"TỔNG WH CHƯA DONE (THÁNG)",
								"style":{
								"textOutline":"0px",
								"display":"",
								"backgroundColor":"rgba(255, 255, 255)",
								"color":"rgba(232, 99, 3, 1)",
								"fontFamily":"roboto",
								"fontSize":"14px",
								"textAlign":"center",
								"borderBottomWidth":"",
								"borderWidth":""
								}
							},
							"yAxis":[
								{
								"gridLineColor":"#e6e6e6",
								"gridLineDashStyle":"LongDash",
								"gridLineWidth":1,
								"visible":true,
								"labels":{
									"style":{
										"fontSize":11
									}
								},
								"title":{
									"align":"low",
									"enabled":false,
									"text":""
								},
								"opposite":false
								},
								{
								"gridLineColor":"#e6e6e6",
								"gridLineDashStyle":"LongDash",
								"gridLineWidth":1,
								"visible":true,
								"labels":{
									"style":{
										"fontSize":11
									}
								},
								"title":{
									"align":"high",
									"enabled":false,
									"text":""
								},
								"opposite":true
								}
							],
							"plotOptions":{
								"series":{
								"dataLabels":{
									"align":"center",
									"borderRadius":2,
									"padding":4,
									"enabled":false,
									"borderColor":"#ffffff00",
									"borderWidth":0,
									"backgroundColor":"#ffffff00",
									"style":{
										"textOutline":"0px",
										"display":"none",
										"backgroundColor":"#ffffff00",
										"color":"#344750",
										"fontFamily":"roboto",
										"fontSize":"11",
										"textAlign":"",
										"borderBottomWidth":"",
										"borderWidth":"0",
										"borderColor":"#ffffff00",
										"fontWeight":300
									}
								}
								}
							},
							"legend":{
								"itemMarginBottom":5,
								"padding":0,
								"style":{
								"textOutline":"0px",
								"display":"",
								"backgroundColor":"",
								"color":"#344750",
								"fontFamily":"roboto",
								"fontSize":"12",
								"textAlign":"",
								"borderBottomWidth":"",
								"borderWidth":""
								},
								"enabled":true,
								"title":{
								"text":"",
								"style":{
									"fontSize":13,
									"fontWeight":"400"
								}
								},
								"itemStyle":{
								"fontSize":12,
								"color":"#344750"
								},
								"layout":"horizontal",
								"align":"center",
								"verticalAlign":"top"
							},
							"series":[
								{
								"yAxis":0,
								"stacking":"normal",
								"name":"Tổng thời gian KH",
								"zIndex":1,
								"type":"column",
								"data":[
									129,
									1,
									24,
									0,
									0,
									0,
									628.75,
									337,
									0,
									352.3,
									0,
									13.5,
									516,
									192
								],
								"color":"rgba(242, 200, 15, 1)"
								},
								{
								"yAxis":0,
								"stacking":"normal",
								"name":"Tổng thời gian TT",
								"zIndex":1,
								"type":"column",
								"data":[
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0,
									0
								],
								"color":"#5F6B6D"
								}
							],
							"tooltip":{
								
							},
							"contentSize":{
								"w":358.0000305175781,
								"h":234.70141220092773
							}
						},
						"needSaveExtraOptions":{
							
						},
						"filter":{
							
						},
						"loadingData":false
					}
				}
			}
		},
		height:{
			type: Number,
			default: 0
		},
		settings:{
			type: Object,
			default(){
				return 	{
					"xAxis":{"name":"X Axis","slot":"n","selectedColums":[{"as":"ASSIGNEE","agg":"first","cond":{"val":"","type":"isall"},"edit":false,"name":"assignee","type":"text","dataset":"3665","origin_type":"text"}]},
					"legend":{"name":"Legend","slot":"1","selectedColums":[]},
					"tooltips":{"name":"Tooltips","slot":"n","hasAgg":true,"selectedColums":[]},
					"yAxis1":{"name":"Y Axis 1","slot":"1","hasAgg":true,"lastYaxis":1,"selectedColums":[{"as":"Tổng thời gian KH","agg":"sum","cond":{"val":"","type":"isall"},"edit":false,"name":"tong_tg","type":"number","dataset":"3665","yAxisNum":0,"origin_type":"number"},{"as":"Tổng thời gian TT","agg":"sum","cond":{"val":"","type":"isall"},"edit":false,"name":"tong_tg_tt","type":"number","dataset":"3665","yAxisNum":0,"origin_type":"number"}]},
					"yAxis2":{"name":"Y Axis 2","slot":"1","hasAgg":true,"lastYaxis":1,"selectedColums":[]}
				}
			}
		}
	},
    created(){
		let pie = new PieChart()
		let output = pie.translate(this.testData.rawConfigs, this.testData.sharedConfigs.data)
		debugger
    },
    methods:{
        addYAxis(newLast){
            let newYAxis =  JSON.parse(JSON.stringify(this.settingItems.yAxis1));
            newYAxis.selectedColums = [];
            newYAxis.num = newLast;
            newYAxis.name = 'Y Axis '+newLast;

            let tooltips = this.settingItems.tooltips;
            delete this.settingItems.tooltips;
            this.$set(this.settingItems,'yAxis'+newLast,newYAxis);
            this.$set(this.settingItems,'tooltips',tooltips);

            
            for(let name in this.settingItems){
                
                
                if(name.includes('yAxis')){
                    this.settingItems[name].lastYaxis = newLast;
                }
            }

        },
        changeColumnSetting(){
            window.SDashboardEditor.onChangeCellConfigs('column');
        }
    },
    data() {
        return {
            cpnType: 'config_setting',
            settingItems:{},
			settingTplAgg: settingTplAgg,
			testData:{
				"sharedConfigs":{
					"type":"pie",
					"yAxisCount":1,
					"cellId":"cell-1608884881484",
					"data":[
						{
							"TRẠNG THÁI":"APPROVED",
							"NGÀY":"2021-01-13",
							"Số lượng":19
						},
						{
							"TRẠNG THÁI":"FIXED",
							"NGÀY":"2020-01-08",
							"Số lượng":87
						},
						{
							"TRẠNG THÁI":"QA LEAD APPROVED",
							"NGÀY":"2021-01-12",
							"Số lượng":1
						},
						{
							"TRẠNG THÁI":"REVIEWING",
							"NGÀY":"2020-10-16",
							"Số lượng":18
						},
						{
							"TRẠNG THÁI":"RE-OPEN",
							"NGÀY":"2020-08-17",
							"Số lượng":4
						},
						{
							"TRẠNG THÁI":"TO DO",
							"NGÀY":"2020-08-17",
							"Số lượng":19
						},
						{
							"TRẠNG THÁI":"NEW",
							"NGÀY":"2020-02-12",
							"Số lượng":144
						},
						{
							"TRẠNG THÁI":"WIP",
							"NGÀY":"2020-11-21",
							"Số lượng":5
						},
						{
							"TRẠNG THÁI":"TESTING",
							"NGÀY":"2020-08-17",
							"Số lượng":22
						}
					],
					"total":0
				},
				"rawConfigs":{
					"setting":{
						"legend":{
							"name":"Legend",
							"slot":"1",
							"selectedColums":[
							{
								"as":"TRẠNG THÁI",
								"agg":"count",
								"cond":{
									"val":"",
									"type":"isall"
								},
								"edit":false,
								"name":"ttsd",
								"type":"text",
								"dataset":"3614",
								"origin_type":"text"
							}
							]
						},
						"tooltips":{
							"name":"Tooltips",
							"slot":"n",
							"hasAgg":true,
							"selectedColums":[
							{
								"as":"NGÀY",
								"agg":"first",
								"cond":{
									"val":"",
									"type":"isall"
								},
								"edit":false,
								"name":"ngay",
								"type":"date",
								"dataset":"3614",
								"origin_type":"date"
							}
							]
						},
						"yAxis1":{
							"name":"Y Axis 1",
							"slot":"1",
							"hasAgg":true,
							"lastYaxis":1,
							"selectedColums":[
							{
								"as":"Số lượng",
								"agg":"count",
								"cond":{
									"val":"",
									"type":"isall"
								},
								"edit":false,
								"name":"ma_module",
								"type":"text",
								"dataset":"3614",
								"origin_type":"text"
							}
							]
						}
					},
					"style":[
						{
							"label":"Legend",
							"name":"legend",
							"show":true,
							"children":{
							"show":{
								"label":"Show",
								"type":"switch",
								"default":true,
								"value":true,
								"name":"show"
							},
							"name":{
								"label":"Name",
								"type":"text",
								"default":"",
								"value":"",
								"name":"name"
							},
							"legendPosition":{
								"label":"Position",
								"type":"btnSelect",
								"default":"vertical-bottom",
								"options":[
									{
										"name":"Left",
										"icon":"ms-Icon ms-Icon--AlignHorizontalLeft",
										"value":"vertical-left",
										"text":""
									},
									{
										"name":"Top",
										"icon":"ms-Icon ms-Icon--AlignVerticalTop",
										"value":"horizontal-top",
										"text":""
									},
									{
										"name":"Right",
										"icon":"ms-Icon ms-Icon--AlignHorizontalRight",
										"value":"vertical-right",
										"text":""
									},
									{
										"name":"Bottom",
										"icon":"ms-Icon ms-Icon--AlignVerticalBottom",
										"value":"horizontal-bottom",
										"text":""
									}
								],
								"value":"vertical-left",
								"name":"legendPosition"
							},
							"fontColor":{
								"label":"Font Corlor",
								"type":"color",
								"default":"#344750",
								"value":"#344750",
								"name":"fontColor"
							},
							"textSize":{
								"label":"Text Size",
								"type":"number",
								"default":"13",
								"value":12,
								"name":"textSize"
							},
							"showLegendTitle":{
								"label":"Show Legend Title",
								"type":"switch",
								"default":true,
								"value":false,
								"name":"showLegendTitle"
							},
							"titleText":{
								"label":"Title text",
								"type":"text",
								"default":"",
								"value":"",
								"name":"titleText"
							}
							}
						},
						{
							"label":"Data label",
							"name":"pieDetailLabel",
							"show":true,
							"children":{
							"show":{
								"label":"Show",
								"type":"switch",
								"default":true,
								"value":true,
								"name":"show"
							},
							"pieLableStyle":{
								"label":"Label style",
								"type":"select",
								"default":"category",
								"options":[
									{
										"value":"category",
										"text":"Category"
									},
									{
										"value":"value",
										"text":"Data value"
									},
									{
										"value":"percent",
										"text":"percent"
									},
									{
										"value":"categoryPercent",
										"text":"Category, percent"
									},
									{
										"value":"valuePercent",
										"text":"Data value, percent"
									},
									{
										"value":"all",
										"text":"All detail"
									}
								],
								"value":"categoryPercent",
								"name":"pieLableStyle"
							},
							"fontColor":{
								"label":"Font Corlor",
								"type":"color",
								"default":"#344750",
								"value":"#344750",
								"name":"fontColor"
							},
							"textSize":{
								"label":"Text Size",
								"type":"number",
								"default":"13",
								"value":11,
								"name":"textSize"
							},
							"bgColor":{
								"label":"Background Corlor",
								"type":"color",
								"default":"#ffffff",
								"value":"#ffffff",
								"name":"bgColor"
							},
							"borderWidth":{
								"label":"Border Width",
								"type":"number",
								"default":0,
								"value":0,
								"name":"borderWidth"
							},
							"borderColor":{
								"label":"Border Corlor",
								"type":"color",
								"default":"#000000",
								"value":"#000000",
								"name":"borderColor"
							},
							"tooltipDecimalNumber":{
								"label":"Decimal number",
								"type":"number",
								"default":2,
								"value":2,
								"name":"tooltipDecimalNumber"
							}
							}
						},
						{
							"label":"General",
							"name":"general",
							"show":true,
							"children":{
							"fontFamily":{
								"label":"Font family",
								"type":"select",
								"default":"roboto",
								"options":[
									{
										"value":"roboto",
										"text":"Roboto"
									}
								],
								"value":"roboto",
								"name":"fontFamily"
							},
							"bgColor":{
								"label":"Background Corlor",
								"type":"color",
								"default":"#ffffff",
								"value":"rgba(255, 255, 255)",
								"name":"bgColor"
							},
							"borderWidth":{
								"label":"Border Width",
								"type":"number",
								"default":0,
								"value":"1",
								"name":"borderWidth"
							},
							"borderColor":{
								"label":"Border Corlor",
								"type":"color",
								"default":"#000000",
								"value":"rgba(216, 216, 216, 1)",
								"name":"borderColor"
							},
							"colorPalette":{
								"label":"Color palette",
								"type":"colorArray",
								"default":[
									
								],
								"value":[
									"rgba(37, 128, 57, 1)",
									"rgba(245, 190, 65, 1)",
									"rgba(207, 55, 33, 1)",
									"rgba(49, 169, 184, 1)",
									"rgba(191, 191, 191, 1)",
									"",
									"",
									"",
									"",
									"",
									"",
									"",
									"",
									"",
									"",
									""
								],
								"name":"colorPalette"
							}
							}
						},
						{
							"label":"Title",
							"name":"title",
							"show":true,
							"children":{
							"show":{
								"label":"Show",
								"type":"switch",
								"default":true,
								"value":true,
								"name":"show"
							},
							"titleText":{
								"label":"Title text",
								"type":"text",
								"default":"",
								"value":"Số lượng bug theo status",
								"name":"titleText"
							},
							"fontColor":{
								"label":"Font Corlor",
								"type":"color",
								"default":"#344750",
								"value":"#344750",
								"name":"fontColor"
							},
							"textSize":{
								"label":"Text Size",
								"type":"number",
								"default":"13",
								"value":14,
								"name":"textSize"
							},
							"alignment":{
								"label":"Alignment",
								"type":"btnSelect",
								"default":"left",
								"options":[
									{
										"name":"left",
										"icon":"ms-Icon ms-Icon--AlignHorizontalLeft",
										"value":"left",
										"text":""
									},
									{
										"name":"center",
										"icon":"ms-Icon ms-Icon--AlignHorizontalCenter",
										"value":"center",
										"text":""
									},
									{
										"name":"right",
										"icon":"ms-Icon ms-Icon--AlignHorizontalRight",
										"value":"right",
										"text":""
									}
								],
								"value":"center",
								"name":"alignment"
							},
							"bgColor":{
								"label":"Background Corlor",
								"type":"color",
								"default":"#ffffff",
								"value":"rgba(255, 255, 255, 1)",
								"name":"bgColor"
							}
							}
						}
					],
					"condition":[
						{
							"as":"TRẠNG THÁI",
							"agg":"first",
							"cond":{
							"val":"",
							"type":"notblank"
							},
							"edit":false,
							"name":"ttsd",
							"type":"text",
							"dataset":"3614",
							"validValue":true,
							"origin_type":"text"
						},
						{
							"as":"MODULE",
							"agg":"first",
							"cond":{
							"val":"",
							"type":"notblank"
							},
							"edit":false,
							"name":"ma_module",
							"type":"text",
							"dataset":"3614",
							"validValue":true,
							"origin_type":"text"
						},
						{
							"as":"TRẠNG THÁI",
							"agg":"first",
							"cond":{
							"val":"DONE",
							"type":"isnot"
							},
							"edit":false,
							"name":"ttsd",
							"type":"text",
							"dataset":"3614",
							"validValue":true,
							"origin_type":"text"
						},
						{
							"as":"TRẠNG THÁI",
							"agg":"first",
							"cond":{
							"val":"BACKLOG",
							"type":"isnot"
							},
							"edit":false,
							"name":"ttsd",
							"type":"text",
							"dataset":"3614",
							"validValue":true,
							"origin_type":"text"
						},
						{
							"as":"TRẠNG THÁI",
							"agg":"first",
							"cond":{
							"val":"CLOSED",
							"type":"isnot"
							},
							"edit":false,
							"name":"ttsd",
							"type":"text",
							"dataset":"3614",
							"validValue":true,
							"origin_type":"text"
						},
						{
							"as":"TRẠNG THÁI",
							"agg":"first",
							"cond":{
							"val":"ON-HOLD",
							"type":"isnot"
							},
							"edit":false,
							"name":"ttsd",
							"type":"text",
							"dataset":"3614",
							"validValue":true,
							"origin_type":"text"
						}
					],
					"extra":{
						
					}
				},
				"viewConfigs":{
					"isSelecting":false,
					"selectedDataset":{
						"3614":{
							"ttsd":true,
							"ngay":true,
							"ma_module":true
						}
					},
					"showIcon":false,
					"commentCount":0,
					"displayOptions":{
						"lang":{
							"numericSymbols":[
							"K",
							"M",
							"B",
							"T",
							"P",
							"E"
							],
							"thousandsSep":","
						},
						"chart":{
							"height":503.7013816833496,
							"width":547,
							"style":{
							"fontFamily":"roboto"
							},
							"type":"pie",
							"backgroundColor":"rgba(255, 255, 255)"
						},
						"title":{
							"text":""
						},
						"xAxis":{
							"labels":{
							"autoRotation":[
								-45,
								-90
							]
							}
						},
						"general":{
							"textOutline":"0px",
							"display":"",
							"backgroundColor":"rgba(255, 255, 255)",
							"color":"",
							"fontFamily":"roboto",
							"fontSize":"13px",
							"textAlign":"",
							"borderBottomWidth":"",
							"borderWidth":"1px",
							"borderColor":"rgba(216, 216, 216, 1)"
						},
						"symperTitle":{
							"text":"Số lượng bug theo status",
							"style":{
							"textOutline":"0px",
							"display":"",
							"backgroundColor":"rgba(255, 255, 255, 1)",
							"color":"#344750",
							"fontFamily":"roboto",
							"fontSize":"14px",
							"textAlign":"center",
							"borderBottomWidth":"",
							"borderWidth":""
							}
						},
						"plotOptions":{
							"pie":{
							"showInLegend":true,
							"allowPointSelect":true,
							"cursor":"pointer",
							"dataLabels":{
								"backgroundColor":"#ffffff",
								"borderColor":"#000000",
								"borderWidth":0,
								"borderRadius":2,
								"enabled":true,
								"format":"<b>{point.name}</b>:<br>{point.percentage:.1f} %",
								"style":{
									"textOutline":"0px",
									"display":"",
									"backgroundColor":"#ffffff",
									"color":"#344750",
									"fontFamily":"roboto",
									"fontSize":"11",
									"textAlign":"",
									"borderBottomWidth":"",
									"borderWidth":"0",
									"borderColor":"#000000",
									"fontWeight":300
								}
							}
							}
						},
						"legend":{
							"itemMarginBottom":5,
							"padding":0,
							"style":{
							"textOutline":"0px",
							"display":"",
							"backgroundColor":"",
							"color":"#344750",
							"fontFamily":"roboto",
							"fontSize":"12",
							"textAlign":"",
							"borderBottomWidth":"",
							"borderWidth":""
							},
							"enabled":true,
							"title":{
							"text":"",
							"style":{
								"fontSize":13,
								"fontWeight":"400"
							}
							},
							"itemStyle":{
							"fontSize":12,
							"color":"#344750"
							},
							"layout":"vertical",
							"align":"left",
							"verticalAlign":"top"
						},
						"series":{
							"name":"Số lượng",
							"colorByPoint":true,
							"data":[
							{
								"name":"APPROVED",
								"y":19,
								"color":"rgba(37, 128, 57, 1)"
							},
							{
								"name":"FIXED",
								"y":87,
								"color":"rgba(245, 190, 65, 1)"
							},
							{
								"name":"QA LEAD APPROVED",
								"y":1,
								"color":"rgba(207, 55, 33, 1)"
							},
							{
								"name":"REVIEWING",
								"y":18,
								"color":"rgba(49, 169, 184, 1)"
							},
							{
								"name":"RE-OPEN",
								"y":4,
								"color":"rgba(191, 191, 191, 1)"
							},
							{
								"name":"TO DO",
								"y":19,
								"color":""
							},
							{
								"name":"NEW",
								"y":144,
								"color":""
							},
							{
								"name":"WIP",
								"y":5,
								"color":""
							},
							{
								"name":"TESTING",
								"y":22,
								"color":""
							}
							]
						},
						"tooltip":{
							
						},
						"contentSize":{
							"w":548,
							"h":504.7013816833496
						}
					},
					"needSaveExtraOptions":{
						
					},
					"filter":{
						
					},
					"loadingData":false
				}
			}
        }    
    }
}
</script>
<style scoped>

</style>