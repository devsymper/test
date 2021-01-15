import ReportBase from './ReportBase'
export default class TableChart extends ReportBase {
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
}