import { SYMPER_APP } from "./../../main.js";
import { orgChartApi } from "./../../api/OrgChart";

const handleUrlChanges = (context, data) => {
    console.log(context, data, 'xxx');
    context.commit('changeUrlsToTabs', data);
    // urlToTabTitleMap
};

const getAllOrgchartNodes = (context) => {
    if ($.isEmptyObject(context.orgchartNodes)) {
        orgChartApi.getAllNodes().then(res => {
                if (res.status == 200) {
                    let map = res.data.reduce((o, item) => {
                        o[item.id] = item;
                        return o;
                    }, {});
                    context.commit('setOrgchartNodes', map);
                } else {
                    SYMPER_APP.$snotify({
                        type: "error",
                        title: "Can not get nodes of orgcharts!",
                    });
                }
            })
            .catch(err => {
                SYMPER_APP.$snotify({
                    type: "error",
                    title: "Can not get nodes of orgcharts!",
                });
            })
            .always(() => {

            });
    }
}

export { getAllOrgchartNodes, handleUrlChanges };