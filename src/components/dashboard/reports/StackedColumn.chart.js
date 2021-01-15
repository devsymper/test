import ReportBase from './ReportBase'
import {Group1} from '@/components/dashboard/configPool/reportGroupConfig'
export default class StackedColumn extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = Group1.columnSettingKeys
        let styleKeys = Group1.styleKeys
        super('stackedColumn', symperId, columnSettingKeys, styleKeys);
    }
}