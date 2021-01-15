import {Group2} from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
export default class Line extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = Group2.columnSettingKeys
        let styleKeys = Group2.styleKeys
        super('line', symperId, columnSettingKeys, styleKeys);
    }
}