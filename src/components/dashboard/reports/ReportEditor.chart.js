import ReportBase from './ReportBase'
import {TranslatorHelper} from '@/components/dashboard/configPool/translatorHelper';
export default class ReportEditor extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = [];
        let styleKeys = {
			"general":{
				"title":"General",
				"items":["bgColor","borderColor","borderWidth","colorPalette","fontFamily"]
			},
			"title":{
				"title":"Title",
				"items":["alignment","bgColor","fontColor","show","textSize","titleText"]
            }
        };
        super('editor', symperId, columnSettingKeys, styleKeys);
    }
    
    restoreConfigFromSavedData(cell){
        this.restoreByDefault(cell);
        cell.settings = typeof cell.settings == 'string' ? JSON.parse(cell.settings) : cell.settings;
        this.viewConfigs.displayOptions.content = cell.settings.content;
    }
    translate(rawConfig,  data, extraData = {} ,changes = {}, oldOutput = {}){
        oldOutput = {"content":"Content ne","general":{"textOutline":"0px","display":"","backgroundColor":"#ffffff","color":"","fontFamily":"roboto","fontSize":"13px","textAlign":"","borderBottomWidth":"","borderWidth":"0px","borderColor":"#e5e5e5"},"symperTitle":{"text":"BÁO CÁO SẢN XUẤT NGÀY","style":{"textOutline":"0px","display":"","backgroundColor":"#ffffff","color":"rgba(242, 134, 18, 1)","fontFamily":"roboto","fontSize":"18px","textAlign":"center","borderBottomWidth":"","borderWidth":""}},"contentSize":{"w":169,"h":39}};
        let displayOptions = {};
        displayOptions = TranslatorHelper.Charts.editor(rawConfig,displayOptions,extraData,oldOutput,1);
        return displayOptions;
    }

    canGetDataFromServer(){
        return true;
    }
}