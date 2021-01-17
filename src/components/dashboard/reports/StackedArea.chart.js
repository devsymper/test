import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
export default class StackedArea extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group1.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group1.styleKeys
        super('stackedArea', symperId, columnSettingKeys, styleKeys);
    }
}