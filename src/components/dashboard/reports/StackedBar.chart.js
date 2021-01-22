import ReportBase from './ReportBase'
import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import {TranslatorHelper} from '@/components/dashboard/configPool/translatorHelper'

export default class StackedBar extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group1.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group1.styleKeys
        super('stackedBar', symperId, columnSettingKeys, styleKeys);
    }
    
    translate(rawConfig,  data, extraData = {} ,changes = {}, oldOutput = {}){
        let displayOptions = {};
        displayOptions = TranslatorHelper.Charts.barChart(rawConfig,data,displayOptions,extraData,"bar",'normal',1);
        return displayOptions;

    }
}

