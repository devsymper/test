import { util } from "./../../../plugins/util.js";

const defaultConfig = {
    sort: "",
    dataType: "text", // Loại dữ liệu của cột này
    searchKey: "",
    selectAll: true,
    total: 0,
    valuesIn: {},
    valuesNotIn: {},
    selectItems: [], // danh sách các item hiển thị cho autocomplete trong  filter, mỗi item có dạng: {value: 'xx', checked: true}
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