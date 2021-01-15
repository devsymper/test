import {Group1} from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
export default class StackedArea extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = Group1.columnSettingKeys
        let styleKeys = Group1.styleKeys
        super('stackedArea', symperId, columnSettingKeys, styleKeys);
    }
}