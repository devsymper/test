import ReportBase from './ReportBase'
export default class Global extends ReportBase {
    constructor(){
        let columnSettingKeys = [];
        let styleKeys = {
            "legend":{
                "title":"Cell legend",
                "items":["show","name","legendPosition","fontColor","textSize","showLegendTitle","titleText"]
            },
            "dataLabel":{
                "title":"Cell Data label",
                "items":["show","fontColor","textSize","bgColor","borderWidth","borderColor"]
            },
            "dashboardSize":{
                "title":"Dashboard Size",
                "items":["dashboardSizeType","dashboardSizeMode","width","height"]
            },
            "dashboarStyle":{
                "title":"Dashboard Style",
                "items":["cellMargin","bgColor"]
            },
            "xAxis":{
                "title":"Cell X axis",
                "items":["show","axistitle","titleText","textSize","alignment","gridLine","gridLineWidth","gridLineColor","gridLineType","unit"]
            },
            "yAxis1":{
                "title":"Cell Y Axis 1",
                "items":["show","axistitle","titleText","textSize","alignment","gridLine","gridLineWidth","gridLineColor","gridLineType","unit"]
            }
        };
        super('global', 'global', columnSettingKeys, styleKeys);
        this.rawConfigs.style.dashboardSize.width = 1080;
        this.rawConfigs.style.dashboardSize.height = 720;

        this.viewConfigs.displayOptions = {
            dashboardStyle: {
                size: {
                    h: 720,
                    w: 1080
                },
                style: {
                    background: {
                        color: 'white'
                    }
                }
            }
        };
    }
}