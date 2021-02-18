import ReportBase from './ReportBase'

export default class Pivot extends ReportBase {
    constructor(symperId){
        let columnSettingKeys = ['columns','rows','value']
        let styleKeys ={
			"headerFormat":{
				"title":"Header Style",
				"items":["alignment","bgColor","borderColor","borderWidth","borderStyle","fontColor","tableColumnWidthMode","textSize","verticalLine","verticalAlign","wrapText"]
			},
			"cellFormat":{
				"title":"Row data Style",
				"items":["borderBottomColor","borderBottomWidth","fontColor","textSize","tooltipDecimalNumber","verticalLine","verticalAlign","zeroValueDisplay"]
			},
			"total":{
				"title":"Total",
				"items":["bgColor","fontColor","show","textSize","borderColor","borderWidth","borderStyle"]
			},
			"conditionalFormat":{
				"title":"Conditional Format",
				"items":["conditionalFormatCondition"]
			},
			"general":{
				"title":"General",
				"items":["bgColor","borderColor","borderWidth","colorPalette","fontFamily"]
			},
			"title":{
				"title":"Title",
				"items":["alignment","bgColor","fontColor","show","textSize","titleText"]
			},
		}
        super('pivot', symperId, columnSettingKeys, styleKeys);
        this.sharedConfigs.pageSize = 50;
        this.sharedConfigs.currentPage = 1;
	}
	
    getPivotStaticCols(columns, cellStyle) {
        let rsl = this.makeDisplayColOptions(cellStyle, columns.rows.selectedColums, 'as');
        if (columns.columns.selectedColums.length == 0) {
            rsl = rsl.concat(this.makeDisplayColOptions(cellStyle, columns.value.selectedColums, 'as'));
        }
        return rsl;
	}
	getLeafColFromGroup(groupCols, rsl = []) {
        for (let i in groupCols) {
            let col = groupCols[i];
            if (!col.hasOwnProperty('children')) {
                rsl.push(col);
            } else {
                this.getLeafColFromGroup(col.children, rsl);
            }
        }
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
        // if (type == 'pivot') {
		rsl.data = data.data;
		let staticCols = this.getPivotStaticCols(columns, cellStyle);
		if (data.colDefs) {
			if (data.colDefs.group.length > 0) {
				rsl.columns = staticCols.concat(data.colDefs.group);
				let leafCols = [];
				this.getLeafColFromGroup(rsl.columns, leafCols);

				let extraDisplay = prevDisplayOptions ? (prevDisplayOptions.symperExtraDisplay ? prevDisplayOptions.symperExtraDisplay : {}) : {};
				let colsWidth = extraDisplay.columnsWidth ? extraDisplay.columnsWidth : [];
				let pinnedCols = extraDisplay.pinnedColIdx ? extraDisplay.pinnedColIdx : {};
				let hiddenCols = extraDisplay.hiddenCols ? extraDisplay.hiddenCols : {};
				
				for (let i = 0; i < leafCols.length; i++) {
					if (colsWidth[i]) {
						leafCols[i].width = colsWidth[i];
					}

					if (pinnedCols[i]) {
						leafCols[i].pinned = pinnedCols[i];
					}
					
					if(hiddenCols[leafCols[i].field]){
						leafCols[i].hide = true;
					}
				}

				let computedCols = this.makeDisplayColOptions(cellStyle, leafCols, 'headerName', 'field');
				let map = computedCols.reduce((map, el) => {
					map[el.headerName] = el;
					return map;
				});
				for(let i = 0; i < leafCols.length; i ++){
					leafCols[i] = Object.assign(leafCols[i], map[leafCols[i].headerName]);
				}
			} else {
				rsl.columns = staticCols.concat(this.makeDisplayColOptions(cellStyle, data.colDefs.columns, 'title'));
			}
		}
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