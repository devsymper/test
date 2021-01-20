import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
import {TranslatorHelper} from '@/components/dashboard/configPool/translatorHelper'

export default class Line extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group2.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group2.styleKeys
        super('line', symperId, columnSettingKeys, styleKeys);
    }
    translate(rawConfig,  data, extraData = {} ,changes = {}, oldOutput = {}){
        let displayOptions = {};
        displayOptions = TranslatorHelper.Charts.barChart(rawConfig,data,displayOptions,"line",undefined,1);
        return displayOptions;
    }
}