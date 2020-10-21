import Api from "./api";
import { appConfigs } from "./../configs.js";

var api = new Api(appConfigs.apiDomain.permission);
export const accessControlApi = {
    getAllTypeAction() {
        return api.get("operations/actions");
    }
}