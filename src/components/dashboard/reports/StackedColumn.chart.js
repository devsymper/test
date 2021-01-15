import ReportBase from './ReportBase'
import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
export default class StackedColumn extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group1.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group1.styleKeys
        super('stackedColumn', symperId, columnSettingKeys, styleKeys);
    }
}