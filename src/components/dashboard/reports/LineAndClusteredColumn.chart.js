import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
export default class LineAndClusteredColumn extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group2.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group2.styleKeys
        super('lineAndClusteredColumn', symperId, columnSettingKeys, styleKeys);
    }
}