import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
export default class StackedColumn100 extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group1.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group1.styleKeys
        super('stackedColumn100', symperId, columnSettingKeys, styleKeys);
    }
}