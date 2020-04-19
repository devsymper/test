import { util } from "./../../../plugins/util.js";

const defaultConfig = {
    sort: "",
    searchKey: "",
    selectAll: true,
    total: 0,
    valuesIn: {},
    valuesNotIn: {},
    clickedSelectAll: true,
    conditionFilter: {
        // Các giá trị của lọc theo điều kiện
        conjunction: "and",
        items: [{
                type: "none",
                value: ""
            },
            {
                type: "none",
                value: ""
            }
        ]
    }
};
export const getDefaultFilterConfig = function() {
    return util.cloneDeep(defaultConfig);
}