onmessage = function (event) {
    let data = event.data;
    let action = data.action;
    if(handler[action]){
        handler[action](data.data);
    } else {
        console.error(` action ${action} not found `);
    }
};
import { autoLoadChartClasses } from "@/components/dashboard/configPool/reportConfig.js";
import { dashboardApi } from "@/api/dashboard";
var reportClasses = autoLoadChartClasses();

var handler = {
    
    isDropListFilter(cell) {
        // return cell.sharedConfigs.type == 'filter' && cell.viewConfigs.queryKey;
        return cell.sharedConfigs.type == 'filter';
    },
    
    getSortData(cell) {
        return cell.rawConfigs.extra ? cell.rawConfigs.extra.sortConfig : [];
    },

    
    /**
     * Kiểm tra xem cell này có cần tính total hay không
     * @param {Object} cell Object chứa thông tin của cell
     * @returns {Boolean} 
     */
    checkNeedTotal(cell) {
        if (cell.sharedConfigs.type == 'table' || cell.sharedConfigs.type == 'pivot') {
            let styles = cell.rawConfigs.style;
            return cell.rawConfigs.style.total.children.show.value;
        } else {
            return false;
        }
    },

    getDataInputForReport(cell, relations){
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
        // for (let id in cell.viewConfigs.filter) {
        //     filter = filter.concat(cell.viewConfigs.filter[id])
        // }

        let condition = cell.rawConfigs.condition;

        // comment lại do chưa dùng đến
        /**Phát hiện drop list filter để giới hạn các giá trị hiển thị cho lựa chọn */
        // if (this.isDropListFilter(cell)) {
        //     let cond = [];
        //     for (let item of condition) {
        //         cond.push(item);
        //     }

        //     let col = columnsSetting['value'][0];
        //     if (col) {
        //         let condCol = Object.assign({}, col);
        //         condCol.cond = {
        //             type: "contains",
        //             val: cell.viewConfigs.queryKey
        //         };
        //         cond.push(condCol);
        //     }
        //     condition = cond;
        // }

        let sortData = this.getSortData(cell);

        let reportName = cell.rawConfigs.style.title.children.titleText.value;
        let rsl = {
            relations: relations,
            columns: columnsSetting,
            condition: condition,
            reportType: cell.sharedConfigs.type,
            cellId: cell.sharedConfigs.cellId,
            filter: filter,
            // crossFilterCond: cell.viewConfigs.crossFilterCond,
            crossFilterCond: '',
            sort: sortData,
            reportName: reportName,
            needTotal: this.checkNeedTotal(cell)
        };

        if(cellType == 'table' || cellType == 'pivot'){
            rsl.pageSize = cell.sharedConfigs.pageSize ? cell.sharedConfigs.pageSize : 200;
            rsl.currentPage = cell.sharedConfigs.currentPage ? cell.sharedConfigs.currentPage : 1;
        }
        return rsl;
    },
    async translateReportConfig(options){
        let cell = options.cell;
        let extra = options.extra;
        let oldDisplayOptions = options.oldDisplayOption;
        let reportObj = new reportClasses[cell.sharedConfigs.type](cell.sharedConfigs.cellId);
        reportObj.assignComputedAttrsValue(cell);
        let rsl = {};
        if(typeof reportObj.translate == 'function'){
            let dataInput = null;
            let res = {};
            let data = null;
            if (options.cell.sharedConfigs.type != 'editor') {
                dataInput = this.getDataInputForReport(cell, extra.relations);
                res = await dashboardApi.getData(dataInput);
                data = res.data;
            }
            if(data && data.error){
                rsl.error = data.error;
            }else{
                let translatedData = reportObj.translate(cell.rawConfigs,  data, extra, {}, oldDisplayOptions);
                rsl.cellId = cell.sharedConfigs.cellId;
                rsl.translatedData = translatedData;
            }
            rsl.originData  = data ? data.data : null;
        }
        self.postMessage({
            action: 'applyTranslatedConfig',
            data: rsl
        });
    }
}