import {Group2} from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
export default class LineAndClusteredColumn extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = Group2.columnSettingKeys
        let styleKeys = Group2.styleKeys
        super('lineAndClusteredColumn', symperId, columnSettingKeys, styleKeys);
    }
}