import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
import {TranslatorHelper} from '@/components/dashboard/configPool/translatorHelper'
export default class Gantt extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group4.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group4.styleKeys
        super('gantt', symperId, columnSettingKeys, styleKeys);
    }
    translate(rawConfig,  data, extraData = {} ,changes = {}, oldOutput = {}){
        let displayOptions = {};
        displayOptions = TranslatorHelper.Charts.ganttChart(rawConfig,data,displayOptions,extraData,"ganttChart",undefined,1);
        console.log("ganttOption",displayOptions);
        return displayOptions;

    }
 
}