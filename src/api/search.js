import Api from "./api";
import { appConfigs } from "./../configs.js";

let api = new Api(appConfigs.apiDomain.search);

export default {
    getData(value) {
        return api.post('search', {
            keyword: value
        })
    },
}