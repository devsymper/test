import _cloneDeep from "lodash/cloneDeep";
/**
 * Tất cả các trường thông tin cần điền để tạo thành các báo cáo
 */
let reportColumnSettingItems = {
    xAxis:{
        name:'X Axis',
        slot:'n',
    },
    legend:{
        name:'Legend',
        slot:'1'
    },
    yAxis1:{
        name:'Y Axis 1',
        slot:'1',
        hasAgg:true,
    },
    yAxis2:{
        name:'Y Axis 2',
        slot:'1',
        hasAgg:true,
    },
    tooltips:{
        name:'Tooltips',
        slot:'n',
        hasAgg:true
    },
    sharedAxis:{
        name:'Shared Axis',
        slot:'n'
    },
    columnSeries:{
        name:'Column series',
        slot:'n'
    },
    columnValues:{
        name:'Column Value',
        slot:'n'
    },
    lineValues:{
        name:'Line Values',
        slot:'n'
    },
    detail:{
        name:'Detail',
        slot:'1'
    },
    yAxis:{
        name:'Y Axis',
        slot:'n',
        hasAgg:true,
    },
    size:{
        name:'Size',
        slot:'1'
    },
    playAxis:{
        name:'Play Axis',
        slot:'1'
    },
    category:{
        name:'Category',
        slot:'n'
    },
    breakDown:{
        name:'Break Down',
        slot:'1'
    },
    group:{
        name:'Group',
        slot:'n'
    },
    min:{
        name:'Min',
        slot:'1'
    },
    max:{
        name:'Max',
        slot:'1'
    },
    targetValue:{
        name:'Target Value',
        slot:'1'
    },
    value:{
        name:'Value',
        slot:'n',
        hasAgg:true

    },
    rows:{
        name:'Rows',
        slot:'1'
    },
    columns:{
        name:'Columns',
        slot:'1'
    },
    compareValue:{
        name:'Comparation Value',
        slot:'1',
        hasAgg:true

    }
};

/**
 * 
 * @param {Array} attrNames mảng chứa tên các item cần lấy 
 */
export const getColumnConfigItems = function(attrNames) {
    let rsl = {};
    attrNames.forEach(name => {
        rsl[name] = reportColumnSettingItems[name];
        rsl[name].selectedColums = [];
    });
    return _cloneDeep(rsl);
}