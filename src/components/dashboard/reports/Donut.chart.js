import ReportBase from './ReportBase'
import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'

export default class Donut extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group3.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group3.styleKeys
        super('donut', symperId, columnSettingKeys, styleKeys);
    }
}