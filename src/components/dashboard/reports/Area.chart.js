import {Group1} from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
export default class Area extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = Group1.columnSettingKeys
        let styleKeys = Group1.styleKeys
        super('area', symperId, columnSettingKeys, styleKeys);
    }
}