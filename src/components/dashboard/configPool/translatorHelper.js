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
				// tooltip: {
				// 	formatter: function() { // ko thể truyền hàm qua worker, đưa hàm này lên mainprocess
				// 		let decimal = style.pieDetailLabel.children.tooltipDecimalNumber.value;
				// 		let vl = Highcharts.numberFormat(TranslatorHelper.y, decimal);
				// 		return `<b>${TranslatorHelper.x !== undefined ? TranslatorHelper.x : ''}</b><br>
				// 				<b>${TranslatorHelper.series.name} : </b> ${vl}`;
				// 	}
				// }
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
		/**
		 * Chuyển đổi cấu hình cho loại treemap chart
		 * @param {Array} data Mảng dữ liệu của chart
		 * @param {Object} columns Cấu hình các cột
		 * @param {Object} style Cấu hình hiển thịs
		 */
		filter(data, columns, style, ratio) {
			style = TranslatorHelper.makeStyleMap(style);
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
	}
}