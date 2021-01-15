import ReportBase from './ReportBase'
import {Group3} from '@/components/dashboard/configPool/reportGroupConfig'

export default class Donut extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = Group3.columnSettingKeys
        let styleKeys = Group3.styleKeys
        super('donut', symperId, columnSettingKeys, styleKeys);
    }
}