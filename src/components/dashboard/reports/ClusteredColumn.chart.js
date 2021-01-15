import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
export default class ClusteredColumn extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group1.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group1.styleKeys
        super('clusteredColumn', symperId, columnSettingKeys, styleKeys);
    }
}