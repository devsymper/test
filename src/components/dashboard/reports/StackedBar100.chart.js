import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
import {TranslatorHelper} from '@/components/dashboard/configPool/translatorHelper'

export default class StackedBar100 extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group1.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group1.styleKeys
        super('stackedBar100', symperId, columnSettingKeys, styleKeys);
    }
    translate(rawConfig,  data, extraData = {} ,changes = {}, oldOutput = {}){
        let displayOptions = {};
        displayOptions = TranslatorHelper.Charts.barChart(rawConfig,data,displayOptions,extraData,"bar",'percent',1);
        return displayOptions;

    }
}