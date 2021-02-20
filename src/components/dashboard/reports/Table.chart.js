import ReportBase from './ReportBase'
export default class Table extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ['value'];
        let styleKeys = {
            headerFormat: {
                title: 'Header Style',
                items: ['fontColor', 'textSize', 'bgColor', 'tableColumnWidthMode', 'borderWidth', 'borderColor', 'borderStyle', 'alignment', 'verticalLine', 'wrapText']
            },
            cellFormat: {
                title: 'Row data Style',
                items: ['fontColor', 'textSize', 'borderBottomWidth', 'borderBottomColor','borderStyle', 'verticalLine', 'zeroValueDisplay', 'tooltipDecimalNumber']
            },
            total: {
                title: 'Total',
                items: ['show', 'fontColor', 'textSize','borderWidth', 'borderColor', 'borderStyle', 'bgColor']
            },
            conditionalFormat: {
                title: 'Conditional format',
                items: ['conditionalFormatCondition']
            },
        };
        super('table', symperId, columnSettingKeys, styleKeys);
        this.sharedConfigs.pageSize = 50;
        this.sharedConfigs.currentPage = 1;
    }
    
    translate(rawConfig,  resData, extraData, changes = {}, oldOutput = {}){
        let ratio = 1;
        let data = resData.data;
        let columns = rawConfig.setting;
        let style = rawConfig.style;
        let prevDisplayOptions = oldOutput;

        /** hàm cũ */
        let needTotal = style.total.children.show.value;
        let commonAttr = this.getCommonCellStyleAttr(style, ratio);
        let rsl = {
            needTotal: needTotal,
            totalRowCount: Number(resData.total),
            data: data,
            tableColumnWidthMode: style.headerFormat.children.tableColumnWidthMode.value,
            columns: [],
            cellStyle: this.getStyleItemsInConfig(style.cellFormat.children, 'px', ratio),
            headerStyle: this.getStyleItemsInConfig(style.headerFormat.children, 'px', ratio),
            totalRowBackup: [],
            totalRow: [],
            tableSize: {
                h: extraData.size.h,
                w: extraData.size.w,
            }
        };
        

        rsl.headerStyle.verticalLine = style.headerFormat.children.verticalLine.value;
        rsl.cellStyle.verticalLine = style.cellFormat.children.verticalLine.value;

        let cellStyle = rsl.cellStyle;
        cellStyle.backgroundColor = commonAttr.general.backgroundColor;
        cellStyle.symperCellConfig = {
            zeroValueDisplay: this.getZeroValueDisplay(style),
            headerWrapText: style.headerFormat.children.wrapText.value,
            decimalTootip: style.cellFormat.children.tooltipDecimalNumber.value
        };

        cellStyle.originStyle = style;
        cellStyle.extraData = rawConfig.extra;
        // if (type == 'table') {
        rsl.columns = this.makeDisplayColOptions(cellStyle, columns.value.selectedColums, 'as', 'as', prevDisplayOptions, style)
        if(rsl.columns[0].symperColumnName == "Format entire row"){ // check xem có condition format cho toàn bộ row trong table hay ko
            rsl.rowFormatCond = rsl.columns[0].formatConds;
            // rsl.getRowStyle = function (params) {
            //     var row = params.node.data;
            //     for(let item of rowFormatCond){
            //         let checkCondition = eval(item.condition);
            //         if(checkCondition){
            //             return item.style;
            //         }
            //     }
            //     return null;
            // }
            rsl.columns.splice(0,1);
        }
        // }

        if(prevDisplayOptions.totalRowBackup){
            rsl.totalRowBackup = prevDisplayOptions.totalRowBackup;
        }
        rsl.totalRow = [];
        if(needTotal){
            if(extraData.changeType == 'style'){
                rsl.totalRow = prevDisplayOptions.totalRowBackup;
            }else if (rsl.data && rsl.data.length > 0) {
                rsl.totalRow = [rsl.data.pop()];
                rsl.totalRowBackup = rsl.totalRow;
            }
            rsl.totalRowStyle = this.getStyleItemsInConfig(style.total.children, 'px', ratio);
        }

        // tìm cột đầu tiên ko phải là number để thêm chữ tổng
        if(rsl.totalRow.length > 0){
            let notNumberColumn = null;
            for(let col of rsl.columns){
                if(col.symperType != 'number' || col.lastLineAgg == 'none'){
                    notNumberColumn = col;
                    break;
                }
            }

            if(notNumberColumn){
                rsl.totalRow[0][notNumberColumn.field] = 'Tổng';
            }
        }
        return Object.assign(commonAttr, rsl);
    }
}