import ReportBase from './ReportBase'
import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'

export default class Pie extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group3.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group3.styleKeys
        super('pie', symperId, columnSettingKeys, styleKeys);
	}

	translate(rawConfig, data, changes = {} , oldOutput = {}){
		rawConfig
		data
		debugger
		return 'pl'
	}
}