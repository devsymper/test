import ReportBase from './ReportBase'
import ReportGroupConfig from '@/components/dashboard/configPool/reportGroupConfig'
import { staticChartOptions} from './Common.js'
import { util } from '@/plugins/util';
import common from './Common.js'
export default class StackedBar extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ReportGroupConfig.Group1.columnSettingKeys
        let styleKeys = ReportGroupConfig.Group1.styleKeys
        super('stackedBar', symperId, columnSettingKeys, styleKeys);
    }
    
    translate(rawConfig,  data, extraData = {} ,changes = {}, oldOutput = {}){
        let displayOptions = configsToDisplayOptions(rawConfig,data,displayOptions,1);

    }
}

function configsToDisplayOptions(rawConfigs,data,displayOptions, ratio) {
    ratio = 1;
    let columns = rawConfigs.setting;
    let style = util.cloneDeep(rawConfigs.style);
  //  let cellSize = SDashboardEditor.getSizeOfCellContent(cell.sharedConfigs.cellId);

    displayOptions.symperExtraDisplay = rawConfigs.extra;
    // style.cellId = cell.sharedConfigs.cellId;
    let viewOptions = translateV2(data, columns, style, ratio);
    let rsl = viewOptions; // Kết quả trả về
    // rsl.contentSize = {
    //     w: cellSize.w,
    //     h: cellSize.h - 10,
    // };

    // translate cho chart
    let options = JSON.parse(JSON.stringify(staticChartOptions));
    options.chart.type = 'bar';
    
    rsl = options;
    for (let name in options) {
        if (viewOptions[name]) {
            options[name] = Object.assign(options[name], viewOptions[name]);
            delete viewOptions[name];
        }
    }
    rsl = Object.assign(options, viewOptions);
    // rsl.chart.height = rsl.contentSize.h;
    // rsl.chart.width = rsl.contentSize.w - 5;
    console.log("result", rsl);
    return rsl;
}

function translateV2(data,columns,stlye, ratio = 1){
    let result = common.linesAndColumns(data,columns,stlye,'bar','normal', ratio);
    return result;
}

