/**
 * tất cả các Item cho style setting của các report
 * các type của từng Item: select, text, number, color, switch, slider, btnSelect
 */
import _cloneDeep from "lodash/cloneDeep";
var attrItems = {
    titleText: {
        title: 'Title text',
        type: 'text',
        default: ''
    },
    zeroValueDisplay: {
        title: 'Zero value display', // Tiêu đề hiển thị của cấu hình
        type: 'select', // loại input để hiển thị
        default: '-', // giá trị mặc định cho thuộc tính này
        options: [{   // Thuộc tính đặc thù của từng loại
                value: 'original',
                text: 'Original'
            },
            {
                value: '-',
                text: '-'
            },
            {
                value: 'blank',
                text: 'Blank'
            }
        ]
    },
    pieLableStyle: {
        title: 'Label style',
        type: 'select',
        default: 'category',
        options: [{
                value: 'category',
                text: 'Category'
            },
            {
                value: 'value',
                text: 'Data value'
            },
            {
                value: 'percent',
                text: 'percent'
            },
            {
                value: 'categoryPercent',
                text: 'Category, percent'
            },
            {
                value: 'valuePercent',
                text: 'Data value, percent'
            },
            {
                value: 'all',
                text: 'All detail'
            },
        ]
    },
    show: {
        title: 'Show',
        type: 'switch',
        default: true
    },
    showLegendTitle: {
        title: 'Show Legend Title',
        type: 'switch',
        default: true
    },

    name: {
        title: 'Name',
        type: 'text',
        default: ''
    },
    axistitle: {
        title: 'Axis title',
        type: 'switch',
        default: true
    },
    gridLine: {
        title: 'Show Gridline',
        type: 'switch',
        default: true
    },
    gridLineWidth: {
        title: 'Gridline Width',
        type: 'number',
        default: 1
    },
    gridLineColor: {
        title: 'Gridline Color',
        type: 'color',
        default: '#e6e6e6'
    },
    gridLineType: {
        title: 'Gridline Type',
        type: 'select',
        default: 'LongDash',
        options: [{
                value: 'LongDash',
                text: 'Dashed'
            },
            {
                value: 'Dot',
                text: 'Dot'
            },
            {
                value: 'Solid',
                text: 'Solid'
            }
        ]
    },
    dateFormat: {
        title: 'Format date',
        type: 'text',
        default: 'YYYY-mm-dd',
    },
    wrapText: {
        title: 'Wrap text',
        type: 'switch',
        default: false
    },
    fontColor: {
        title: 'Font Corlor',
        type: 'color',
        default: '#344750'
    },
    legendPosition: {
        title: 'Position',
        type: 'btnSelect',
        default: 'vertical-bottom',
        options: [{
                name: 'Left',
                icon: 'ms-Icon ms-Icon--AlignHorizontalLeft',
                value: 'vertical-left',
                text: ''
            },
            {
                name: 'Top',
                icon: 'ms-Icon ms-Icon--AlignVerticalTop',
                value: 'horizontal-top',
                text: ''
            },
            {
                name: 'Right',
                icon: 'ms-Icon ms-Icon--AlignHorizontalRight',
                value: 'vertical-right',
                text: ''
            },
            {
                name: 'Bottom',
                icon: 'ms-Icon ms-Icon--AlignVerticalBottom',
                value: 'horizontal-bottom',
                text: ''
            },
        ],
    },
    unit: {
        title: 'Display Unit',
        type: 'select',
        default: 'auto',
        options: [{
                value: 'auto',
                text: 'Auto'
            },
            {
                value: 'none',
                text: 'None'
            },
            {
                value: 'thousands',
                text: 'Thousands'
            },
            {
                value: 'milions',
                text: 'Milions'
            },
            {
                value: 'bilions',
                text: 'Bilions'
            },
            {
                value: 'trilions',
                text: 'Trilions'
            }
        ]
    },
    dataColor: {
        columnDepend: true // được clone dựa vào từng column, không biết trước số lượng cụ thể
    },
    borderColor: {
        title: 'Border Corlor',
        type: 'color',
        default: '#000000'
    },
    borderBottomColor: {
        title: 'Border Corlor',
        type: 'color',
        default: '#ededed'
    },
    bgColor: {
        title: 'Background Corlor',
        type: 'color',
        default: '#ffffff'
    },
    textSize: {
        title: 'Text Size',
        type: 'number',
        default: '13'
    },
    borderWidth: {
        title: 'Border Width',
        type: 'number',
        default: 0
    },
    borderBottomWidth: {
        title: 'Border Width',
        type: 'number',
        default: 1
    },
    tooltipDecimalNumber: {
        title: 'Decimal number',
        type: 'number',
        default: 2
    },
    fontFamily: {
        title: 'Font family',
        type: 'select',
        default: 'roboto',
        options: [{
            value: 'roboto',
            text: 'Roboto'
        }]
    },
    position: {
        title: 'Position',
        type: 'select',
        default: 'bottom',
        options: [{
                value: 'bottom',
                text: 'Bottom'
            },
            {
                value: 'top',
                text: 'Top'
            },
            {
                value: 'left',
                text: 'Left'
            },
            {
                value: 'right',
                text: 'Right'
            },
            {
                value: 'bottom-left',
                text: 'Bottom Left'
            },
            {
                value: 'bottom-right',
                text: 'Bottom Right'
            },
            {
                value: 'top-right',
                text: 'Top Right'
            },
            {
                value: 'top-left',
                text: 'Top Left'
            },
        ]
    },
    alignment: {
        title: 'Alignment',
        type: 'btnSelect',
        default: 'left',
        options: [{
                name: 'left',
                icon: 'mdi-align-horizontal-left',
                value: 'left',
                text: ''
            },
            {
                name: 'center',
                icon: 'mdi-align-horizontal-center',
                value: 'center',
                text: ''
            },
            {
                name: 'right',
                icon: 'mdi-align-horizontal-right',
                value: 'right',
                text: ''
            },
        ]
    },
    verticalAlign: {
        title: 'vertical alignment',
        type: 'btnSelect',
        default: 'top',
        options: [{
                name: 'Top',
                icon: 'mdi-align-vertical-top',
                value: 'top',
                text: ''
            },
            {
                name: 'Midle',
                icon: 'mdi-align-vertical-center',
                value: 'midle',
                text: ''
            },
            {
                name: 'bottom',
                icon: 'mdi-align-vertical-bottom',
                value: 'Bottom',
                text: ''
            },
        ]
    },
    selectionType: {
        title: 'Selection Type',
        type: 'btnSelect',
        default: 'multiple',
        options: [{
                name: 'Single',
                icon: 'mdi-check-circle-outline',
                value: 'single',
                text: ''
            },
            {
                name: 'multiple',
                icon: 'mdi-checkbox-multiple-marked-circle-outline',
                value: 'multiple',
                text: ''
            }
        ]
    },
    selectionMode: {
        title: 'Selection Mode',
        type: 'select',
        default: 'default',
        options: [{
                value: 'default',
                text: 'Default',
            },
            {
                value: 'dropList',
                text: 'Drop List',
            }
        ]
    },
    valueDecimal: {
        title: 'Value decimal places',
        type: 'number',
        default: 2
    },
    markerSize: {
        title: 'Marker size',
        type: 'number',
        default: 3
    },
    markerEnable: {
        title: 'Marker enable',
        type: 'switch',
        default: false
    },
    revertColor: {
        title: 'Revert color',
        type: 'switch',
        default: false
    },
    verticalLine: {
        title: 'Vertical line',
        type: 'switch',
        default: false
    },
    lineWidth: {
        title: 'Line width',
        type: 'number',
        default: 1.3
    },
    cardMode: {
        title: 'Mode',
        type: 'radio',
        default: 'number',
        options: [{
                name: 'Compare by number',
                icon: '',
                value: 'number',
                text: ''
            },
            {
                name: 'Compare by percent',
                icon: '',
                value: 'percent',
                text: ''
            },
            {
                name: 'Progress',
                icon: '',
                value: 'progress',
                text: ''
            }
        ]
    },
    dashboardSizeType: {
        title: 'Size type',
        type: 'select',
        default: '16:9',
        disabled: false,
        options: [{
                value: '16:9',
                text: '16:9'
            },
            {
                value: '4:3',
                text: '4:3'
            },
            {
                value: 'letter',
                text: 'Letter'
            },
            {
                value: 'tooltip',
                text: 'Tooltip'
            },
            {
                value: 'custom',
                text: 'Custom'
            }
        ]
    },
    dashboardSizeMode: {
        title: 'Size mode',
        type: 'select',
        disabled: false,
        default: 'realSize',
        options: [{
                value: 'fitWidth',
                text: 'Fit width'
            },
            {
                value: 'realSize',
                text: 'Real size'
            },
            {
                value: 'fitScreen',
                text: 'Fit screen'
            }
        ]
    },
    width: {
        title: 'Width',
        type: 'number',
        default: 0,
        disabled: false,

    },
    height: {
        title: 'Height',
        type: 'number',
        default: 0,
        disabled: false,

    },
    cellMargin: {
        title: 'Margin between cells',
        type: 'number',
        default: 10
    },
    colorPalette: {
        title: 'Color palette',
        type: 'colorArray',
        default: [],
    },
    tableColumnWidthMode: {
        title: 'Column width mode',
        type: 'select',
        default: 'auto',
        options: [{
                value: 'auto',
                text: 'Auto'
            },
            {
                value: 'fitData',
                text: 'Fit data only'
            },
            {
                value: 'fitCell',
                text: 'Fit cell width'
            },
            {
                value: 'fitDataAndHeader',
                text: 'Fit data and header'
            }
        ]
    },
    conditionalFormatCondition: {
        title: 'Conditional format columns',
        type: 'conditionalFormatItems',
        default: []
    },
};
/**
 * lấy ra các attr item với đầu vào là mảng tên của các attr đó
 */
export const getStyleItems = function(attrNames) {
    let rsl = {};
    attrNames.forEach(name => {
        rsl[name] = attrItems[name];
    });
    return _cloneDeep(rsl);
}