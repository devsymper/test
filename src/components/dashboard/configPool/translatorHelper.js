import { util } from '@/plugins/util';
export const staticChartOptions = {
    lang: {
        numericSymbols: ["K", "M", "B", "T", "P", "E"],
        thousandsSep: ','
    },
    // colors: ['#01B8AA','#374649','#FD625E','#F2C80F','#5F6B6D','#8AD4EB','#FE9666','#A66999 #73B761','#4A588A','#ECC846','#CD4C46','#71AFE2','#8D6FD1','#EE9E64','#95DABB #074650','#009292','#FE6DB6','#FEB5DA','#480091','#B66DFF','#B5DAFE','#6DB6FF'],
    chart:{
        height : null,
        width : null,
        style:{
            fontFamily :'roboto',
        }
    },
    title : {
        text : ''
    },
    xAxis:{
        labels:{
            autoRotation:[-45,-90]
        }
    }
};
const yAxisValueFormatter = {
    none: () => {
        return eval("this.value;");
    },
    thousands: () => {
        return eval("(this.value/1000)+'K'");
    },
    milions: () => {
        return eval("(this.value/1000000)+'M'");
    },
    bilions: () => {
        return eval("(this.value/1000000000)+'B'");
    },
    trilions: () => {
        return eval("(this.value/1000000000000)+'T'");
    }
};
function convertDateToTimestamp(date){
	if (!date) {
		return;
	}
	var newDate = new Date(date);
	return newDate.getTime();
}

export const TranslatorHelper = {
	Charts:{
		/**
		 * Chuyển đổi cấu hình cho loại pie chart
		 * @param {Array} data Mảng dữ liệu của chart
		 * @param {Object} columns Cấu hình các cột
		 * @param {Object} style Cấu hình hiển thị
		 * @param {Object} isDonut Loại chart donut false of true 
		 */
		pie(data, columns, style, isDonut = false, ratio, extraData) {
			let pieDetailLabelFormat = {
				category: '{point.name}',
				value: '{point.y}',
				percent: '{point.percentage:.1f} %',
				categoryPercent: '<b>{point.name}</b>:<br>{point.percentage:.1f} %',
				valuePercent: '{point.y} ({point.percentage:.1f} %)',
				all: '<b>{point.name}</b>:<br>{point.y} ({point.percentage:.1f} %)',
			};
			data = TranslatorHelper.makeValuesToNumber(data, columns);
			let dataLabels = style.pieDetailLabel.children;
			let labelsStyle = TranslatorHelper.getStyleItemsInConfig(dataLabels, '', ratio);
			labelsStyle.fontWeight = 300;
			let rsl = {
				plotOptions: {
					pie: {
						showInLegend: style.legend.children.show.value,
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							backgroundColor: dataLabels.bgColor.value,
							borderColor: dataLabels.borderColor.value,
							borderWidth: dataLabels.borderWidth.value,
							borderRadius: 2,
							enabled: dataLabels.show.value,
							format: pieDetailLabelFormat[dataLabels.pieLableStyle.value],
							style: labelsStyle,
						}
					}
				},
				legend: TranslatorHelper.translateLegend(style.legend.children, ratio),
				series: TranslatorHelper.getPieSeries(data, columns, style),
				tooltip: {
				// 	formatter: function() { // ko thể truyền hàm qua worker, đưa hàm này lên mainprocess
				// 		let decimal = style.pieDetailLabel.children.tooltipDecimalNumber.value;
				// 		let vl = Highcharts.numberFormat(TranslatorHelper.y, decimal);
				// 		return `<b>${TranslatorHelper.x !== undefined ? TranslatorHelper.x : ''}</b><br>
				// 				<b>${TranslatorHelper.series.name} : </b> ${vl}`;
				// 	}
				}
			};

			if (isDonut) {
				rsl.series.innerSize = '50%';
			}
			let commonAttr = TranslatorHelper.getCommonCellStyleAttr(style, ratio);
			rsl.chart = {
				backgroundColor: commonAttr.general.backgroundColor,
				type: 'pie',
				style:{
					fontFamily: 'roboto'
				},
				height: extraData.size.h,
				width: extraData.size.w
			};
			rsl.contentSize = {
				h: extraData.size.h,
				w: extraData.size.w
			};
			rsl.lang = {"numericSymbols":["K","M","B","T","P","E"],"thousandsSep":","} //extraData
			rsl.xAxis = {"labels":{"autoRotation":[-45,-90]}} //extraData
			return Object.assign(commonAttr, rsl);

		},
		/**
		 * Chuyển đổi cấu hình cho loại treemap chart
		 * @param {Array} data Mảng dữ liệu của chart
		 * @param {Object} columns Cấu hình các cột
		 * @param {Object} style Cấu hình hiển thị
		 */
		treeMap(data, columns, style, ratio, extraData) {
			let colors = TranslatorHelper.getColorsFromStyle(style);
			let groupCol = columns.group.selectedColums[0] ? columns.group.selectedColums[0] : false;
			let detailCol = columns.detail.selectedColums[0] ? columns.detail.selectedColums[0] : false;
			let valueCol = columns.value.selectedColums[0];
			let chartData = TranslatorHelper.getTreeMapData(groupCol, detailCol, valueCol, data, colors);
			let rsl = {
				chart: {
					type: 'treemap'
				},
				// tooltip: {
				// 	formatter: function() {
				// 		let decimal = style.lvl1DataLabel.children.tooltipDecimalNumber.value;
				// 		let vl = Highcharts.numberFormat(this.point.value, decimal);
				// 		return `<b>${this.key} : </b> ${vl}`;
				// 	}
				// }
			};
			rsl.series = [{
				type: "treemap",
				layoutAlgorithm: 'squarified',
				alternateStartingDirection: true,
				levels: [{
					level: 1,
					layoutAlgorithm: 'squarified',
					dataLabels: {
						enabled: style.lvl1DataLabel.children.show.value,
						align: style.lvl1DataLabel.children.alignment.value,
						verticalAlign: style.lvl1DataLabel.children.verticalAlign.value,
						style: TranslatorHelper.getStyleItemsInConfig(style.lvl1DataLabel.children, '', ratio)
					}
				}, {
					level: 2,
					dataLabels: {
						enabled: style.lvl2DataLabel.children.show.value,
						align: style.lvl2DataLabel.children.alignment.value,
						verticalAlign: style.lvl2DataLabel.children.verticalAlign.value,
						style: TranslatorHelper.getStyleItemsInConfig(style.lvl2DataLabel.children, '', ratio)
					}
				}],
				data: chartData
			}];
			rsl.series[0].levels[0].dataLabels.style.fontWeight = 100;
			rsl.series[0].levels[1].dataLabels.style.fontWeight = 100;
			let commonAttr = TranslatorHelper.getCommonCellStyleAttr(style, ratio);
			rsl = Object.assign(rsl, commonAttr);
			return rsl;
		},
		/**
		 * Chuyển đổi cấu hình cho loại treemap chart
		 * @param {Array} data Mảng dữ liệu của chart
		 * @param {Object} columns Cấu hình các cột
		 * @param {Object} style Cấu hình hiển thịs
		 */
		filter(data, columns, style, ratio) {
			let selectedColum = columns.value.selectedColums[0];
			selectedColum = selectedColum ? selectedColum : {};

			let rsl = {
				selectionMode: style.selectionControl.children.selectionMode.value,
				data: data,
				selectionType: style.selectionControl.children.selectionType.value,
				itemStyle: TranslatorHelper.getStyleItemsInConfig(style.filterItem.children, 'px', ratio)
			};
			
			
			if (data.length > 0) {
				let type = selectedColum.type;
				if (rsl.selectionMode == 'default' && (type == 'number' || type == 'date')) {
					let min = type == 'number' ? Number(data[0].min) : data[0].min;
					let max = type == 'number' ? Number(data[0].max) : data[0].max;
					rsl.data = {
						min: min,
						max: max,
						value: [min, max]
					};
				} else {
					for (let i in data) {
						rsl.data[i].symper__selected = false;
					}
				}
			}
			rsl = JSON.parse(JSON.stringify(rsl));
			let commonAttr = TranslatorHelper.getCommonCellStyleAttr(style, ratio);
			commonAttr.symperTitle.text = commonAttr.symperTitle.text ? commonAttr.symperTitle.text : selectedColum.as;
			return Object.assign(commonAttr, rsl);
		},
		card(data, columns, style, ratio, extraData) {
			let valueCol = columns.value.selectedColums[0];
			valueCol = valueCol ? valueCol : {};
			let rsl = {
				delta: false,
				value: data[0] ? data[0][valueCol.as] : 0,
				compareValue: false,
				mode: 'number',
				revert: style.card.children.revertColor.value,
				sign: 'equal',
				deltaStyle: TranslatorHelper.getStyleItemsInConfig(style.deltaInfo.children, 'px', ratio),
				valueStyle: TranslatorHelper.getStyleItemsInConfig(style.dataLabel.children, 'px', ratio),
			};
	
			let upStyle = {
				color: 'green'
			};
			let downStyle = {
				color: 'red'
			};
			if (columns.compareValue.selectedColums.length > 0) {
				rsl.compareValue = data[0][columns.compareValue.selectedColums[0].as];
				let mode = style.card.children.cardMode.value;
				rsl.mode = mode;
				let delta = 0;
				if (mode == 'percent') {
					delta = Number(((rsl.compareValue - rsl.value) / rsl.compareValue * 100).toFixed(3));
					rsl.sign = delta >= 0 ? (delta == 0 ? 'equal' : 'greater') : 'less';
					delta += ' %';
				} else if (mode == 'progress') {
					delta = Number((rsl.value / rsl.compareValue * 100).toFixed(3));
				} else if (mode == 'number') {
					delta = rsl.compareValue - rsl.value;
					rsl.sign = delta >= 0 ? (delta == 0 ? 'equal' : 'greater') : 'less';
					let deltaTmp = Math.abs(delta);
					deltaTmp = TranslatorHelper.getValueDecimal(deltaTmp, 2, 'auto', true);
					delta = delta > 0 ? deltaTmp : ('-' + deltaTmp);
				}
	
				if (style.card.children.revertColor.value) {
					let tmp = upStyle;
					upStyle = downStyle;
					downStyle = tmp;
				}
	
				if (rsl.sign == 'less') {
					rsl.deltaStyle = Object.assign(rsl.deltaStyle, downStyle);
				} else if (rsl.sign == 'greater') {
					rsl.deltaStyle = Object.assign(rsl.deltaStyle, upStyle);
				}
				rsl.delta = delta;
			}
			rsl.value = 0;
			if (data[0]) {
				rsl.value = TranslatorHelper.getValueDecimal(data[0][valueCol.as], style.dataLabel.children.valueDecimal.value, style.dataLabel.children.unit.value, true);
			}
			let commonStyle = TranslatorHelper.getCommonCellStyleAttr(style, ratio);
			let titleText = commonStyle.symperTitle.text;
			titleText = titleText ? titleText : '';
			commonStyle.symperTitle.text = titleText.trim() != '' ? titleText : valueCol.as;
			return Object.assign(commonStyle, rsl);
		},
		
		barChart(rawConfigs,data,displayOptions,extraData,typeChart,stacking, ratio) {
			let columns = rawConfigs.setting;
			let style = util.cloneDeep(rawConfigs.style);
		  //  let cellSize = SDashboardEditor.getSizeOfCellContent(cell.sharedConfigs.cellId);
		
			displayOptions.symperExtraDisplay = rawConfigs.extra;
			// style.cellId = data.cellId;
			// let viewOptions = translateV2(data.data, columns, style, ratio);
			let viewOptions = TranslatorHelper.linesAndColumns(data.data,columns,style,typeChart,stacking, ratio);
			let rsl = viewOptions; // Kết quả trả về
			// translate cho chart
			let options = JSON.parse(JSON.stringify(staticChartOptions));
			options.chart.type = typeChart;
		
			rsl = options;
			for (let name in options) {
				if (viewOptions[name]) {
					options[name] = Object.assign(options[name], viewOptions[name]);
					delete viewOptions[name];
				}
			}
			rsl = Object.assign(options, viewOptions);
			rsl.chart.height = extraData.size.h;
			rsl.chart.width = extraData.size.w;
		
			return rsl;
		},
		ganttChart(rawConfigs,data,displayOptions,extraData,typeChart,stacking, ratio){
			let columns = rawConfigs.setting;
			let style = util.cloneDeep(rawConfigs.style);
			if (columns.name.selectedColums.length == 0 || columns.start.selectedColums.length == 0 ) {
				return;
			}
			let viewOptions = TranslatorHelper.getDataGantt(data.data,columns,style,typeChart,stacking, ratio);
			let rsl = viewOptions; // Kết quả trả về
			// translate cho chart
			// let options = JSON.parse(JSON.stringify(staticChartOptions));
			return rsl;
		},
		editor(rawConfigs,displayOptions,extraData,oldOutput,ratio) {
			let content = oldOutput? oldOutput.content : "";
			let style = util.cloneDeep(rawConfigs.style);
		
			displayOptions.symperExtraDisplay = rawConfigs.extra;
			let viewOptions = TranslatorHelper.editor(style,content, ratio);

			let rsl = viewOptions; // Kết quả trả về
			rsl.contentSize = {
				w: oldOutput.contentSize.w,
				h: oldOutput.contentSize.h,
			};
			return rsl;
		},
	},
    editor(style, content, ratio) {
        let rsl = {
            content: content,
        };
        let commonAttr = this.getCommonCellStyleAttr(style, ratio);
        rsl = Object.assign(rsl, commonAttr);
        return rsl;
	},
	/**
     * Chuyển các cấu hình thành options tương ứng với các loại chart gantt
     * @param {Array} data mảng dữ liệu của chart
     * @param {Object} columns Cấu hình cột của chart
     * @param {Object} style style của chart
     * @param {number} ratio tỷ lệ thu phóng của dashboard
     */
	getDataGantt(data, columns, originStyle, chartType, stacking = undefined, ratio){
		data = this.makeValuesToNumber(data, columns);
        columns = this.clearColumnsNotSelect(columns);
		let style = originStyle;
		let series = this.getSeriesOptionsForGantt(data, columns, chartType, stacking);

		let rsl = {
            series: series
        };
        // rsl.xAxis.categories = series.xAxisCategory;
        // let commonAttr = this.getCommonCellStyleAttr(style, ratio);
        // rsl.chart = {
        //     backgroundColor: commonAttr.general.backgroundColor,
        // };
        return rsl;
	},
	    /**
     * Chuyển các cấu hình thành options tương ứng với các loại chart: line, column, bar, combo
     * @param {Array} data mảng dữ liệu của chart
     * @param {Object} columns Cấu hình cột của chart
     * @param {Object} style style của chart
     * @param {number} ratio tỷ lệ thu phóng của dashboard
     */
    linesAndColumns(data, columns, originStyle, chartType, stacking = undefined, ratio) {
		data = this.makeValuesToNumber(data, columns);
		console.log("dataBar",data);
		
		columns = this.filterUnuseColumnsForGroup1(columns);
		console.log("columns",data);
		
        let style = originStyle;
		let series = this.getSeriesOptions(data, columns, chartType, stacking);
        series.series = this.applySeriesStyle(series.series, style, ratio);
        let rsl = {
            yAxis: this.getYAxisOptions(style, ratio),
            xAxis: this.translateAxis(style.xAxis.children, ratio),
            plotOptions: {
                series: {
                    dataLabels: this.translateDataLabels(style.dataLabel.children, style.yAxis1.children, ratio),
                }
            },
            legend: this.translateLegend(style.legend.children, ratio),
            series: series.series
            // tooltip: {
            //     formatter: function() {
            //         let decimal = style.dataLabel.children.tooltipDecimalNumber.value;
            //         let vl = Highcharts.numberFormat(this.y, decimal);
            //         setFocusingPoint(originStyle.cellId, this.point.index);
            //         return `<b>${this.x}</b><br>
            //                 <b>${this.series.name} : </b> ${vl}`;
            //     }
            // }
        };
        rsl.xAxis.categories = series.xAxisCategory;
        let commonAttr = this.getCommonCellStyleAttr(style, ratio);
        rsl.chart = {
            backgroundColor: commonAttr.general.backgroundColor,
        };
        return Object.assign(commonAttr, rsl);
	},
	clearColumnsNotSelect(column){
		let allColumn = util.cloneDeep(column);
		let columns = {};
		for (let name in allColumn) {
			if (allColumn[name].selectedColums.length > 0) {
				columns[name] = allColumn[name];
			}
		}
		return columns;
		
	},
	/**
     * Chuyển giá trị của các row có chứa key bắt buộc là number thành number
     * @param {Array} data mảng dữ liệu của chart
     * @param {Objecgt} columns  Cấu hình các cột của chart
     */
    makeValuesToNumber(data, columns, keyword = 'yAxis') {
        let keys = [];
        for (let name in columns) {
            if (name.includes(keyword)) {
                for (let col of columns[name].selectedColums) {
                    keys.push(col.as);
                }
            }
        }

        for (let i in data) {
            for (let k of keys) {
                data[i][k] = Number(data[i][k]);
            }
        }
        return data;
	},

	getValueDecimal(num, decimalNum, mode, needUnit = false) {
		num = Number(num);
		decimalNum = Number(decimalNum);
		let rsl = num;
		let modeMapNum = {
			thousands: {
				v: 1000,
				s: 'K'
			},
			milions: {
				v: 1000000,
				s: 'M'
			},
			bilions: {
				v: 1000000000,
				s: 'B'
			},
			trilions: {
				v: 1000000000000,
				s: 'T'
			},
		};
		if (mode == 'none') {
			rsl = num;
		} else if (mode == 'auto') {
			for (let runMode in modeMapNum) {
				if (num > modeMapNum[runMode].v) {
					mode = runMode;
					rsl = num / modeMapNum[runMode].v;
				}
			}
		} else {
			rsl = num / modeMapNum[mode].v;
		}
		rsl = Number(Number(rsl).toFixed(decimalNum));
		rsl = (rsl + '').split('.');
		rsl[0] = rsl[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
		rsl = rsl.length > 1 ? (rsl[0] + '.' + rsl[1]) : rsl[0];
		if (needUnit && mode != 'none') {
			let unit = mode == 'auto' ? '' : modeMapNum[mode].s;
			rsl = rsl + unit;
		}
		return rsl;
	},
	getStyleItemsInConfig(st, sizeUnit = '', ratio) {
        let rsl = {
            textOutline: '0px',
            display: st.show === undefined ? '' : (st.show.value ? '' : 'none'),
            backgroundColor: st.bgColor ? st.bgColor.value : '',
            color: st.fontColor ? st.fontColor.value : '',
            fontFamily: st.fontFamily ? st.fontFamily.value : 'roboto',
            fontSize: ((st.textSize ? st.textSize.value : 13) * ratio) + sizeUnit,
            textAlign: st.alignment ? st.alignment.value : '',
            borderBottomWidth: st.borderBottomWidth ? (st.borderBottomWidth.value + sizeUnit) : '',
            borderWidth: st.borderWidth ? (st.borderWidth.value + sizeUnit) : '',
        }

        if (st.borderBottomColor && st.borderBottomColor.value) {
            rsl.borderBottomColor = st.borderBottomColor.value;
        }

        if (st.borderColor && st.borderColor.value) {
            rsl.borderColor = st.borderColor.value;
        }

        return rsl;
	},
	translateLegend(st, ratio) {
        let positionMap = {
            'vertical-left': {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top'
            },
            'horizontal-top': {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'top'
            },
            'vertical-right': {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            'horizontal-bottom': {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
            },
        };

        let rsl = {
            itemMarginBottom: 5,
            padding: 0,
            style: TranslatorHelper.getStyleItemsInConfig(st, '', ratio),
            enabled: st.show.value,
            title: {
                text: st.titleText.value,
                style: {
                    fontSize: 13 * ratio,
                    fontWeight: '400'
                }
            },
            itemStyle: {
                fontSize: st.textSize.value * ratio,
                color: st.fontColor.value,
            }
        }

        rsl = Object.assign(rsl, positionMap[st.legendPosition.value]);
        return rsl;
	},
	  /**
     * Lấy ra series của pie chart
     * @param {Array} data Mảng dữ liệu
     * @param {Object} columns Cấu hình cột
     */
    getPieSeries(data, columns, styles) {
        let colors = TranslatorHelper.getColorsFromStyle(styles);
        data = data.length == 0 ? [{}] : data;
        let yAxisCol = columns.yAxis1.selectedColums;
        let legendCols = columns.legend.selectedColums;
        let rsl = {
            name: '',
            colorByPoint: true,
            data: []
        };
        let i = 0;
        if (legendCols.length > 0) {
            legendCols = legendCols[0];
            yAxisCol = yAxisCol[0];
            rsl.name = yAxisCol.as;

            for (let row of data) {
                rsl.data.push({
                    name: row[legendCols.as],
                    y: row[yAxisCol.as],
                    color: colors[i]
                });
                i += 1;
            }
        } else {
            for (let col of yAxisCol) {
                rsl.data.push({
                    name: col.as,
                    y: data[0][col.as],
                    color: colors[i]
                });
                i += 1;
            }
        }
        return [rsl];
    },
	 /**
     * Dịch các thông tin chung của tất cả các cell thành dạng css
     * @param {Object} commonAttr Object chứa thông tin về các thuộc tính chung của cell, 
     * trùng với các thông tin ở hàm  getCommonAttr() trong file getAtyleAttesFuncs
     */
    getCommonCellStyleAttr(commonAttr, ratio) {
        return {
            general: TranslatorHelper.getStyleItemsInConfig(commonAttr.general.children, 'px', ratio),
            symperTitle: {
                text: commonAttr.title.children.titleText.value,
                style: TranslatorHelper.getStyleItemsInConfig(commonAttr.title.children, 'px', ratio)
			},
			title: {
				text: ""
			}
        };
	},
	getColorsFromStyle(style) {
		return style.general.children.colorPalette.value;
	},
	getTreeMapData(groupCol, detailCol, valueCol, data, colors) {
		let chartData = [];
		let i = 0;
		if (groupCol) {
			if (detailCol) {
				let level1Items = {};
				for (let item of data) {
					level1Items[groupCol.as] = true;
					chartData.push({
						name: item[detailCol.as],
						parent: item[groupCol.as],
						value: Number(item[valueCol.as]),
					});
					i += 1;
				}
				for (let name in level1Items) {
					chartData.unshift({
						name: name,
						color: colors[i],
						id: name,
					});
					i += 1;
				}
			} else {
				for (let item of data) {
					chartData.push({
						color: colors[i],
						name: item[groupCol.as],
						value: Number(item[valueCol.as]),
					});
					i += 1;
				}
			}
		} else {
			if (detailCol) {
				for (let item of data) {
					chartData.push({
						color: colors[i],
						name: item[detailCol.as],
						value: Number(item[valueCol.as])
					});
					i += 1;
				}
			} else {
				chartData.push({
					color: colors[i],
					name: valueCol.as,
					value: Number(data[0][valueCol.as])
				});
			}
		}
		return chartData;
	},
	  /**
     * Loại bỏ các cột không phù hợp với ràng buộc để tạo thành biểu đổ cho Group 1: là nhóm các chart line, column, bar, combo
     * @param {Object} columns cấu hình các cột cho việc lấy dữ liệu
     */
	filterUnuseColumnsForGroup1(columns) {
		let correctColumnConfigs = {
			legend: {
				selectedColums: []
			},
			xAxis: {},
			yAxis1: {},
		};
		// Nếu có legend
		if (columns.legend.selectedColums.length > 0) {
			correctColumnConfigs.legend.selectedColums = [columns.legend.selectedColums[0]]; // chỉ lấy cột đầu tiên của legend
			// Chỉ lấy cột đầu tiên của yAxis
			correctColumnConfigs.yAxis1.selectedColums = columns.yAxis1.selectedColums.length > 0 ? [columns.yAxis1.selectedColums[0]] : [];
		} else {
			for (let name in columns) {
				if (name.includes('yAxis')) {
					correctColumnConfigs[name] = columns[name];
				}
			}
		}
		// chỉ lấy cột đầu tiên của xAxis
		correctColumnConfigs.xAxis.selectedColums = columns.xAxis.selectedColums.length > 0 ? [columns.xAxis.selectedColums[0]] : [];
		return correctColumnConfigs;
	},
	 /**
     *  Lấy ra cấu hình của các series trong chart gantt
     * @param {Array} data mảng dữ liệu của chart
     * @param {Object} columns cấu hình các cột của chart
     * @param {Number} ratio tỷ lệ thu phóng của dashboard
     */
	getSeriesOptionsForGantt(data, columns, chartType, stacking){
		if (Object.keys(columns).length == 0) {
			return {};
		}
		let rsl = {
            data: []
		};
		for (let i = 0; i < data.length; i++) {
			let item = {};
			for (let name in columns) {
				let timestart = null;
				if ( name == "start" ) { // convert format datetime to timestamp
					item[name] = convertDateToTimestamp(data[i][columns[name].selectedColums[0].as]);
					timestart = item[name];
				}else if(name == "end"){ // convert format datetime to timestamp
					item[name] = convertDateToTimestamp(data[i][columns[name].selectedColums[0].as]);
				}
				else if(name == "duration"){
					if (!timestart) {
						timestart = convertDateToTimestamp(data[i][columns["start"].selectedColums[0].as]);
						let endDate = timestart+Number(data[i][columns[name].selectedColums[0].as])*1000 * 60 * 60 * 24;
						item['end'] = endDate;
					}
				}
				else if(name == "completed"){
					let progress = Number(data[i][columns[name].selectedColums[0].as]);
					if (progress > 1) {
						progress = progress/100;
					}
					item[name] = progress;
				}
				else if(name == "milestone"){
					let milestone = data[i][columns[name].selectedColums[0].as];
					if (milestone == 0) {
						milestone = false;
					}else{
						milestone = true;
					}
					item[name] = milestone;
				}else{
					item[name] = data[i][columns[name].selectedColums[0].as];
				}
			}
			rsl.data.push(item)		
		}
		return rsl;
	},
	 /**
     *  Lấy ra cấu hình của các series trong chart
     * @param {Array} data mảng dữ liệu của chart
     * @param {Object} columns cấu hình các cột của chart
     * @param {Number} ratio tỷ lệ thu phóng của dashboard
     */
    getSeriesOptions(data, columns, chartType, stacking) {

        let rsl = {
            xAxisCategory: [''],
            series: []
        };
        let xAxisCol = false;
        let yAxisCol = columns.yAxis1.selectedColums[0];
        let legendCols = columns.legend.selectedColums;

        // danh sách tất cả các column trong yAxis1, yAxis2, ... 
        let allColsInYAxis = [];
        for (let name in columns) {
            if (name.includes('yAxis')) {
                let yAxisNum = Number(name.replace('yAxis', '')) - 1;
                for (let columnInYAxis of columns[name].selectedColums) {
                    columnInYAxis.yAxisNum = yAxisNum;
                }
                allColsInYAxis = allColsInYAxis.concat(columns[name].selectedColums);
            }
        }
        // có xAxis
        if (columns.xAxis.selectedColums.length > 0) {
            xAxisCol = columns.xAxis.selectedColums[0].as;
            // có legend => chỉ xét một cột của một yaxis
            if (legendCols.length > 0) {
                let pivotData = this.getPivotArray(data, yAxisCol.as, legendCols[0].as, xAxisCol);
                rsl.xAxisCategory = pivotData[0].slice(1);

                for (let i = 1; i < pivotData.length; i++) {
                    let type = yAxisCol.seryType ? yAxisCol.seryType : chartType;
                    rsl.series.push({
                        yAxis: 0,
                        zIndex: /line/i.test(type) ? 2 : 1,
                        stacking: stacking,
                        name: pivotData[i][0],
                        type: type,
                        data: pivotData[i].slice(1),
                    });
                }
            } else {
                rsl.xAxisCategory = [];
                // Không có legend, xét nhiều yAxis và nhiều cột trong yAxis
                for (let yAxisCol of allColsInYAxis) {
                    let type = yAxisCol.seryType ? yAxisCol.seryType : chartType;
                    rsl.series.push({
                        yAxis: yAxisCol.yAxisNum,
                        stacking: stacking,
                        name: yAxisCol.as,
                        zIndex: /line/i.test(type) ? 2 : 1,
                        type: type,
                        data: [],
                    });
                    for (let item of data) {
                        if (yAxisCol.yAxisNum == 0) {
                            rsl.xAxisCategory.push(item[xAxisCol] === null ? '' : item[xAxisCol]);
                        }
                        rsl.series[rsl.series.length - 1].data.push(item[yAxisCol.as]);
                    }
                }
            }
        } else {
            // có legend
            if (legendCols.length > 0) {
                for (let item of data) {
                    let type = yAxisCol.seryType ? yAxisCol.seryType : chartType;
                    rsl.series.push({
                        yAxis: 0,
                        stacking: stacking,
                        name: legendCols[0].as,
                        zIndex: /line/i.test(type) ? 2 : 1,
                        type: type,
                        data: [item[yAxisCol.as]],
                    });
                }
            } else {
                for (let yAxisCol of allColsInYAxis) {
                    let type = yAxisCol.seryType ? yAxisCol.seryType : chartType;
                    rsl.series = [{
                        yAxis: yAxisCol.yAxisNum,
                        stacking: stacking,
                        zIndex: /line/i.test(type) ? 2 : 1,
                        name: yAxisCol.as,
                        type: type,
                        data: [data[0][yAxisCol.as]],
                    }];
                }

            }
        }
        return rsl;
    },
	applySeriesStyle(series, styles, ratio) {
        let colors = this.getColorsFromStyle(styles);
        for (let i in series) {
            series[i].color = colors[i];
            if (/line/i.test(series[i].type) && styles.hasOwnProperty('line')) {
                let lineProp = styles.line.children;
                series[i].lineWidth = lineProp.lineWidth.value;
                series[i].states = {
                        hover: {
                            enabled: true,
                            lineWidth: lineProp.lineWidth.value
                        }
                    },
                    series[i].marker = {
                        enabled: lineProp.markerEnable.value,
                        radius: lineProp.markerSize.value * ratio,
                        states: {
                            hover: {
                                enabled: true,
                                radius: lineProp.markerSize.value * ratio
                            }
                        }
                    };
            }

        }

        return series;
	},
	getYAxisOptions(styles, ratio) {
        let yAxis = [];
        for (let name in styles) {
            if (name.includes('yAxis')) {
                let props = styles[name].children;
                let newYAxis = this.translateAxis(props, ratio);
                let alignValue = props.alignment.value;
                newYAxis.opposite = alignValue == 'left' ? false : true;
                if (props.unit.value != 'auto') {
                    newYAxis.labels.formatter = yAxisValueFormatter[props.unit.value];
                }
                yAxis.push(newYAxis);
            }
        }
        return yAxis;
    },
    translateAxis(st, ratio) {
        let mapAlignment = {
            left: 'low',
            right: 'high',
            center: 'middle',
        };
        return {
            gridLineColor: st.gridLineColor.value,
            gridLineDashStyle: st.gridLineType.value,
            gridLineWidth: st.gridLine.value ? st.gridLineWidth.value : 0,

            visible: st.show.value,
            labels: {
                style: {
                    fontSize: st.textSize.value * ratio
                }
            },

            title: {
                align: mapAlignment[st.alignment.value],
                enabled: st.axistitle.value,
                text: st.titleText.value
            }
        }
	},
	translateDataLabels(st, yAxis, ratio) {
        let options = {
            align: 'center',
            borderRadius: 2,

            padding: 4 * ratio,
            enabled: st.show.value,
            borderColor: st.borderColor.value,
            borderWidth: st.borderWidth.value,
            backgroundColor: st.bgColor.value,
            style: this.getStyleItemsInConfig(st, '', ratio),
            // formatter: function(options) {
            //     return getValueDecimal(this.y, 2, yAxis.unit.value, true);
            // }
        };
        options.style.fontWeight = 300;
        return options;
	},
	getValueDecimal(num, decimalNum, mode, needUnit = false) {
		num = Number(num);
		decimalNum = Number(decimalNum);
		let rsl = num;
		let modeMapNum = {
			thousands: {
				v: 1000,
				s: 'K'
			},
			milions: {
				v: 1000000,
				s: 'M'
			},
			bilions: {
				v: 1000000000,
				s: 'B'
			},
			trilions: {
				v: 1000000000000,
				s: 'T'
			},
		};
		if (mode == 'none') {
			rsl = num;
		} else if (mode == 'auto') {
			for (let runMode in modeMapNum) {
				if (num > modeMapNum[runMode].v) {
					mode = runMode;
					rsl = num / modeMapNum[runMode].v;
				}
			}
		} else {
			rsl = num / modeMapNum[mode].v;
		}
		rsl = Number(Number(rsl).toFixed(decimalNum));
		rsl = (rsl + '').split('.');
		rsl[0] = rsl[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
		rsl = rsl.length > 1 ? (rsl[0] + '.' + rsl[1]) : rsl[0];
		if (needUnit && mode != 'none') {
			let unit = mode == 'auto' ? '' : modeMapNum[mode].s;
			rsl = rsl + unit;
		}
		return rsl;
    },
         /**
     * Chuyển đổi dạng 
     * @param {Array} dataArray Data cần pivot dạng [{key1:value1}, {key2:value2}]
     * @param {*} rowKey key trong row để lấy dữ liệu cho row
     * @param {*} colKey key của row để lấy dữ liệu cho column
     * @param {*} dataIndex key của row để lấy dữ liệu đê tính giá trị
     */
    getPivotArray(dataArray, dataIndex, rowKey, colKey) {
        var result = {},ret = [];
        var newCols = [];
        for (var i = 0; i < dataArray.length; i++) {
            if (!result[dataArray[i][rowKey]]) {
                result[dataArray[i][rowKey]] = {};
            }
            result[dataArray[i][rowKey]][dataArray[i][colKey]] = dataArray[i][dataIndex];
            //To get column names
            if (newCols.indexOf(dataArray[i][colKey]) == -1) {
                newCols.push(dataArray[i][colKey]);
            }
        }
        newCols.sort();
        var item = [];
        //Add Header Row
        item.push('Item');
        item.push.apply(item, newCols);
        ret.push(item);
        //Add content 
        for (var key in result) {
            item = [];
            item.push(key);
            for (var i = 0; i < newCols.length; i++) {
                item.push(result[key][newCols[i]] || "-");
            }
            ret.push(item);
        }
        return ret;
    },
}