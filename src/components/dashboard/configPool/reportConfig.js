/**
 * File phục vụ cho việc lấy các cấu hình mặc định của report
 */
export const getDefaultReportConfig = function(){
    return {
        rawConfigs: { // config thô do BA setting
            condition: [], // cấu hình điều kiện cho report này
            setting: {}, // cấu hình cho các cột
            style: {} // cấu hình cho việc hiển thị của report
        },
        sharedConfigs: { // các cấu hình chung của report
            cellId: "", // id đánh tự động của report
            data: [], // dữ liệu thô được lấy từ server
            type: "", // loại report
            yAxisCount: 1, // số lượng yAxis được sử dụng
        },
        viewConfigs: { // cấu hình phục vụ cho việc hiển thị
            commentCount: 0, // số lượng comment
            displayOptions: {}, // cấu hình được translate từ các rawConfig thành cấu hình tương ứng của thư viện
            filter: {}, // filter áp dụng cho report này
            isSelecting: false, // có đang click để lựa chọn hay không
            loadingData: false, // có đang tải dữ liệu không 
            needSaveExtraOptions: {}, // các cấu hình phụ cần lưu trong quá trình tương tác với report, vd: chiều rộng của các column trong table sau resize
            selectedDataset: {}, // chứa các cột trong các dataset  được lựa chọn cho report này 
            showIcon: true // có hiển thị icon ko
        }
    }
}

var loadedClasses = {}; // map các class đã được map với key là 
var mapReportTypeAndClasses
/**
 * Hàm load tự động các class của các loại report
 * @returns {Object} object chứa các hàm khởi tạo của 
 */
export const autoLoadChartClasses = function () {
    if(Object.keys(loadedClasses) == 0){
        let context = require.context('@/components/dashboard/reports', true, /\.(chart\.js)$/);
        let rsl = {};
        let obj;
        let reportClass = null;
        context.keys().forEach((filePath) => {
            reportClass = context(filePath).default;
            obj = new reportClass();
            rsl[obj.getType()] = reportClass;
        });
        loadedClasses = rsl;
        return rsl;
    }else{
        return loadedClasses;
    }
}


export const getUsedDatasetsFromSetting = function(setting){
    let rsl = {};
    for(let key in setting){
        for(let col of setting[key].selectedColums){
            rsl[col.dataset] = true;
        }
    }
    return rsl;
}

export const getSortData = function (cell) {
    let rsl = [];
    for (let name in cell.rawConfigs.setting) {
        let cols = cell.rawConfigs.setting[name].selectedColums;
        for(let col of cols){
            if(col.sort && col.sort != 'none'){
                rsl.push({
                    mode: col.sort,
                    column: col
                });
            }
        }
    }
    return rsl;
}


/**
 * Kiểm tra xem cell này có cần tính total hay không
 * @param {Object} cell Object chứa thông tin của cell
 * @returns {Boolean} 
 */
export const checkNeedTotal = function(cell) {
    if (cell.sharedConfigs.type == 'table' || cell.sharedConfigs.type == 'pivot') {
        return cell.rawConfigs.style.total.children.show.value;
    } else {
        return false;
    }
}

function isDropListFilter(cell) {
    // return cell.sharedConfigs.type == 'filter' && cell.viewConfigs.queryKey;
    return cell.sharedConfigs.type == 'filter';
}

export const getDataInputForReport = function(cell, relations){
    let columnsSetting = {};
    let selectedDataset = {};
    let cellType = cell.sharedConfigs.type;
    for (let name in cell.rawConfigs.setting) {
        columnsSetting[name] = cell.rawConfigs.setting[name].selectedColums;
        for (let col of columnsSetting[name]) {
            if (cellType == 'table') {
                col.as = col.as.replace(/\./g, ' ');
            }
            if (!selectedDataset.hasOwnProperty(col.dataset)) {
                selectedDataset[col.dataset] = {};
            }
            selectedDataset[col.dataset][col.name] = true;
        }
    }

    if (cellType == 'card') {
        columnsSetting['value'] = columnsSetting['value'].concat(columnsSetting['compareValue']);
    } else if (cellType == 'treeMap') {
        if (columnsSetting['group'][0]) {
            columnsSetting['group'][0].agg = 'not_agg';
        }
        if (columnsSetting['detail'][0]) {
            columnsSetting['detail'][0].agg = 'not_agg';
        }
    } else if (cellType == 'filter' && columnsSetting.value[0]) {
        columnsSetting.value[0].selectionMode = cell.rawConfigs.style.selectionControl.children.selectionMode.value;
    }
    let filter = [];
    for (let id in cell.sharedConfigs.filter) {
        filter = filter.concat(cell.sharedConfigs.filter[id])
    }

    let condition = cell.rawConfigs.condition;

    /**Phát hiện drop list filter để giới hạn các giá trị hiển thị cho lựa chọn */
    if (isDropListFilter(cell)) {
        let cond = [];
        for (let item of condition) {
            cond.push(item);
        }

        let col = columnsSetting['value'][0];
        if (col && cell.sharedConfigs.queryKey) {
            let condCol = Object.assign({}, col);
            condCol.cond = {
                type: "contains",
                val: cell.sharedConfigs.queryKey
            };
            cond.push(condCol);
        }
        condition = cond;
    }

    let sortData = getSortData(cell);

    let reportName = cell.rawConfigs.style.title.children.titleText.value;
    let rsl = {
        relations: relations,
        columns: columnsSetting,
        condition: condition,
        reportType: cell.sharedConfigs.type,
        cellId: cell.sharedConfigs.cellId,
        filter: filter,
        crossFilterCond: cell.sharedConfigs.crossFilterCond,
        sort: sortData,
        reportName: reportName,
        needTotal: checkNeedTotal(cell)
    };
    let pageSize = 1000;
    if(cellType == 'table' || cellType == 'pivot' || cellType == 'gantt'){
        pageSize = 50;
    }
    rsl.pageSize = cell.sharedConfigs.pageSize ? cell.sharedConfigs.pageSize : pageSize;
    rsl.currentPage = cell.sharedConfigs.currentPage ? cell.sharedConfigs.currentPage : 1;
    return rsl;
}