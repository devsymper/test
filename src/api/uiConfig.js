import Api from "./api";
import { appConfigs } from "./../configs.js";
import { util } from "../plugins/util";

var moduleApi = new Api(appConfigs.apiDomain.uiConfig);
export const uiConfigApi = {
    saveUiConfig(data) {
        return moduleApi.post("wigets", data);
    },

    getUiConfig(widgetIdentifier) {
        return moduleApi.get("wigets/" + widgetIdentifier);
    },
};