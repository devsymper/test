import ReportBase from './ReportBase'
export default class Table extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ['value'];
        let styleKeys = {
            headerFormat: {
                title: 'Header Style',
                items: ['fontColor', 'textSize', 'bgColor', 'tableColumnWidthMode', 'borderWidth', 'borderColor', 'alignment', 'verticalLine', 'wrapText']
            },
            cellFormat: {
                title: 'Row data Style',
                items: ['fontColor', 'textSize', 'borderBottomWidth', 'borderBottomColor', 'verticalLine', 'zeroValueDisplay', 'tooltipDecimalNumber']
            },
            total: {
                title: 'Total',
                items: ['show', 'fontColor', 'textSize', 'bgColor']
            },
            conditionalFormat: {
                title: 'Conditional format',
                items: ['conditionalFormatCondition']
            },
        };
        super('table', symperId, columnSettingKeys, styleKeys);
    }
    
    makeDisplayColOptions(cellStyle, list, keyAs = 'name', keyName = 'name', prevDisplayOptions) {
        let rsl = [];
        let extraDisplay = prevDisplayOptions ? (prevDisplayOptions.symperExtraDisplay ? prevDisplayOptions.symperExtraDisplay : {}) : {};
        let colsWidth = extraDisplay.columnsWidth ? extraDisplay.columnsWidth : [];
        let pinnedColIdx = extraDisplay.pinnedColIdx ? extraDisplay.pinnedColIdx : {};
        let run = 0;
        let mapNameToColumn = {};
        list.forEach(element => {
            mapNameToColumn[element.columnName] = element;
            let newCol = {
                headerName: element[keyAs],
                field: element[keyName],
                headerTooltip: element[keyAs],
                symperType: element.type,
                symperColumnName: element.columnName,
                editable: false,
                symperCellConfig: {
                    decimal: cellStyle.symperCellConfig.decimalTootip
                },
                lastLineAgg: element.lastLineAgg ? element.lastLineAgg : 'sum',
                headerClass: 'symper-table-dashboard-header',
                cellClass: element.type == 'number' ? 'text-align-right' : '',
            };

            if (element.type == 'number') {
                newCol.cellRenderer = 'numberRenderer';
                newCol.symperCellConfig.zeroValueDisplay = cellStyle.symperCellConfig.zeroValueDisplay;
            }

            if (cellStyle.symperCellConfig.headerWrapText) {
                newCol.headerClass += ' symper-table-dashboard-header-wraptext';
            }

            if (colsWidth[run]) {
                newCol.width = colsWidth[run];
            }

            if (pinnedColIdx[run]) {
                newCol.pinned = pinnedColIdx[run];
            }
            run += 1;
            newCol.symperCellConfig.decimalNumber = cellStyle.symperCellConfig.decimalTootip;
            rsl.push(newCol);
        });
        // comment do chưa dùng tới chức năng conditional format
        // rsl = treeConditionConverter.addConditionFormatToColDef(rsl, cellStyle.originStyle, mapNameToColumn);
        return rsl;
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
            data: data,
            tableColumnWidthMode: style.headerFormat.children.tableColumnWidthMode.value,
            columns: [],
            cellStyle: this.getStyleItemsInConfig(style.cellFormat.children, 'px', ratio),
            headerStyle: this.getStyleItemsInConfig(style.headerFormat.children, 'px', ratio),
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
        // if (type == 'table') {
        rsl.columns = this.makeDisplayColOptions(cellStyle, columns.value.selectedColums, 'as', 'as', prevDisplayOptions, style)
        // if(rsl.columns[0].symperColumnName == "Format entire row"){ // check xem có condition format cho toàn bộ row trong table hay ko
        //     let rowFormatCond = rsl.columns[0].formatConds;
        //     rsl.getRowStyle = function (params) {
        //         var row = params.node.data;
        //         for(let item of rowFormatCond){
        //             let checkCondition = eval(item.condition);
        //             if(checkCondition){
        //                 return item.style;
        //             }
        //         }
        //         return null;
        //     }
        //     rsl.columns.splice(0,1);
        // }
        // }

        if (rsl.needTotal) {
            if (rsl.data && rsl.data.length > 0) {
                rsl.totalRow = prevDisplayOptions.totalRow ? prevDisplayOptions.totalRow : [rsl.data.pop()];
                rsl.totalRowStyle = this.getStyleItemsInConfig(style.total.children, 'px', ratio);
            }
        } else if (prevDisplayOptions.totalRow) {
            rsl.totalRow = prevDisplayOptions.totalRow;
        }


        // tìm cột đầu tiên ko phải là number để thêm chữ tổng
        if(Array.isArray(rsl.totalRow)){
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