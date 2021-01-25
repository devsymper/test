import ReportBase from './ReportBase'
import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig';
import {TranslatorHelper} from '@/components/dashboard/configPool/translatorHelper'

export default class StackedColumn extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group1.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group1.styleKeys
        super('stackedColumn', symperId, columnSettingKeys, styleKeys);
    }
       
    translate(rawConfig,  data, extraData = {} ,changes = {}, oldOutput = {}){
        console.log("barcolumn:",rawConfig,data);
        let displayOptions = {};
        displayOptions = TranslatorHelper.Charts.barChart(rawConfig,data,displayOptions,extraData,"column",'normal',1);
        return displayOptions;
    }
}