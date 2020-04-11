import Api from "./api";
import { appConfigs } from "./../configs.js";

var coreApi = new Api(appConfigs.apiDomain.core);
export const packageApi = {

    getAllPackage(id) {
        // return coreApi.get("user/detail/" + id);
    }
};