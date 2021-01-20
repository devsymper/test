export const TranslatorHelper = {
	Charts:{
		/**
		 * Chuyển đổi cấu hình cho loại pie chart
		 * @param {Array} data Mảng dữ liệu của chart
		 * @param {Object} columns Cấu hình các cột
		 * @param {Object} style Cấu hình hiển thị
		 * @param {Object} isDonut Loại chart donut false of true 
		 */
		pie(data, columns, style, isDonut = false, ratio) {
			let pieDetailLabelFormat = {
				category: '{point.name}',
				value: '{point.y}',
				percent: '{point.percentage:.1f} %',
				categoryPercent: '<b>{point.name}</b>:<br>{point.percentage:.1f} %',
				valuePercent: '{point.y} ({point.percentage:.1f} %)',
				all: '<b>{point.name}</b>:<br>{point.y} ({point.percentage:.1f} %)',
			};
			data = TranslatorHelper.makeValuesToNumber(data, columns);
			style = TranslatorHelper.makeStyleMap(style);
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
					formatter: function() {
						let decimal = style.pieDetailLabel.children.tooltipDecimalNumber.value;
						let vl = Highcharts.numberFormat(TranslatorHelper.y, decimal);
						return `<b>${TranslatorHelper.x !== undefined ? TranslatorHelper.x : ''}</b><br>
								<b>${TranslatorHelper.series.name} : </b> ${vl}`;
					}
				}
			};

			if (isDonut) {
				rsl.series.innerSize = '50%';
			}
			let commonAttr = TranslatorHelper.getCommonCellStyleAttr(style, ratio);
			rsl.chart = {
				backgroundColor: commonAttr.general.backgroundColor,
				type: 'pie'
			};
			return Object.assign(commonAttr, rsl);

		},
		/**
		 * Chuyển đổi cấu hình cho loại treemap chart
		 * @param {Array} data Mảng dữ liệu của chart
		 * @param {Object} columns Cấu hình các cột
		 * @param {Object} style Cấu hình hiển thị
		 */
		treeMap(data, columns, style, ratio) {
			style = TranslatorHelper.makeStyleMap(style);
			let colors = TranslatorHelper.getColorsFromStyle(style);
			let groupCol = columns.group.selectedColums[0] ? columns.group.selectedColums[0] : false;
			let detailCol = columns.detail.selectedColums[0] ? columns.detail.selectedColums[0] : false;
			let valueCol = columns.value.selectedColums[0];
			let chartData = TranslatorHelper.getTreeMapData(groupCol, detailCol, valueCol, data, colors);
			let rsl = {
				chart: {
					type: 'treemap'
				},
				tooltip: {
					formatter: function() {
						let decimal = style.lvl1DataLabel.children.tooltipDecimalNumber.value;
						let vl = Highcharts.numberFormat(this.point.value, decimal);
						return `<b>${this.key} : </b> ${vl}`;
					}
				}
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
		stackedBarChart(rawConfigs,data,displayOptions, ratio) {
			ratio = 1;
			let columns = rawConfigs.setting;
			let style = util.cloneDeep(rawConfigs.style);
		  //  let cellSize = SDashboardEditor.getSizeOfCellContent(cell.sharedConfigs.cellId);
		
			displayOptions.symperExtraDisplay = rawConfigs.extra;
			// style.cellId = cell.sharedConfigs.cellId;
			let viewOptions = translateV2(data, columns, style, ratio);
			let rsl = viewOptions; // Kết quả trả về
			// rsl.contentSize = {
			//     w: cellSize.w,
			//     h: cellSize.h - 10,
			// };
		
			// translate cho chart
			let options = JSON.parse(JSON.stringify(staticChartOptions));
			options.chart.type = 'bar';
			
			rsl = options;
			for (let name in options) {
				if (viewOptions[name]) {
					options[name] = Object.assign(options[name], viewOptions[name]);
					delete viewOptions[name];
				}
			}
			rsl = Object.assign(options, viewOptions);
			// rsl.chart.height = rsl.contentSize.h;
			// rsl.chart.width = rsl.contentSize.w - 5;
			return rsl;
		}
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
        columns = filterUnuseColumnsForGroup1(columns);
        let style = makeStyleMap(originStyle);
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
            series: series.series,
            tooltip: {
                formatter: function() {
                    let decimal = style.dataLabel.children.tooltipDecimalNumber.value;
                    let vl = Highcharts.numberFormat(this.y, decimal);
                    setFocusingPoint(originStyle.cellId, this.point.index);
                    return `<b>${this.x}</b><br>
                            <b>${this.series.name} : </b> ${vl}`;
                }
            }
        };
        rsl.xAxis.categories = series.xAxisCategory;
        let commonAttr = getCommonCellStyleAttr(style, ratio);
        rsl.chart = {
            backgroundColor: commonAttr.general.backgroundColor,
        };
        return Object.assign(commonAttr, rsl);
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
	 /**
     * Chuyển từ dạng mảng các style thành dạng key value để dễ truy cập
     * @param {Array} style mảng các style
     */
    makeStyleMap(style) {
        let styleMap = {};
        for (let item of style) {
            styleMap[item.name] = item;
        }
        return styleMap;
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
        return rsl;
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
	}

}