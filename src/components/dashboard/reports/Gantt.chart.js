import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import ReportBase from './ReportBase'
import {TranslatorHelper} from '@/components/dashboard/configPool/translatorHelper'
import { util } from '@/plugins/util';

export default class Gantt extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group4.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group4.styleKeys
        super('gantt', symperId, columnSettingKeys, styleKeys);
        if (this.rawConfigs && this.rawConfigs.setting.id && this.rawConfigs.setting.id.selectedColums.length > 0 ) {
            let dataSet = this.rawConfigs.setting.id.selectedColums[0].dataset;
            let item = {
                "as":"DocumentObjectId",
                "agg":"not_agg",
                "cond":{
                    "val":"",
                    "type":dataSet
                },
                "dataset": "3732",
                "name":"document_object_id",
                "type":"number",
            }
            this.rawConfigs.setting.documentObjectId.selectedColums.push(item);
        }
        this.sharedConfigs.pageSize = 50;
    }
    translate(rawConfig,  data, extraData = {} ,changes = {}, oldOutput = {}){
        let displayOptions = {};
        let dataCopy = util.cloneDeep(data);
        if ( oldOutput.symperSearchKey && rawConfig.setting.name.selectedColums.length > 0) {
            dataCopy.data = this.filterData(dataCopy.data,oldOutput.symperSearchKey,rawConfig)
        }
        displayOptions = TranslatorHelper.Charts.ganttChart(rawConfig,dataCopy,displayOptions,extraData,"ganttChart",undefined,1);
        return displayOptions;

    }
    filterData(data,vl,rawConfig){
        vl = vl.toLowerCase();
        let keyName = rawConfig.setting.name.selectedColums[0].as; 
        let dataFilter = [];
        for (let i = 0; i < data.length; i++) {
            let taskName = data[i][keyName].toLowerCase();
            if (taskName.includes(vl)) {
                dataFilter.push(data[i]);
            } 
        }
        // push lại task parent 
        if (rawConfig.setting.parent.selectedColums.length > 0 && dataFilter.length > 0) {
            let keyParent = rawConfig.setting.parent.selectedColums[0].as; 
            let keyId = rawConfig.setting.id.selectedColums[0].as; 
            for (let i = 0; i < dataFilter.length; i++) {
                if (dataFilter[i][keyParent]) {
                    let isCheck = dataFilter.find(ele => ele[keyId] == dataFilter[i][keyParent]);
                    if (!isCheck) {
                        let parent = data.find(ele => ele[keyId] == dataFilter[i][keyParent]);
                        if (parent) {
                            let keyStartDate = rawConfig.setting.start.selectedColums[0].as;
                            delete parent[keyStartDate]; 
                            dataFilter.push(parent);
                        }
                    }
                }
            }
        }

        return dataFilter;
    }

}