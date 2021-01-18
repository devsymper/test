import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
export default class Line extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group2.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group2.styleKeys
        super('line', symperId, columnSettingKeys, styleKeys);
    }
}