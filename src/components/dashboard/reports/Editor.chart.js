import ReportBase from './ReportBase'
export default class Editor extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = [];
        let styleKeys = {};
        super('editor', symperId, columnSettingKeys, styleKeys);
    }
    
    restoreConfigFromSavedData(cell){
        this.restoreByDefault(cell);
        cell.settings = typeof cell.settings == 'string' ? JSON.parse(cell.settings) : cell.settings;
        this.viewConfigs.displayOptions.content = cell.settings.content;
    }
}