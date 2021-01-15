/**
 * tất cả các Item cho style setting của các report
 * các type của từng Item: select, text, number, color, switch, slider, btnSelect
 */
import _cloneDeep from "lodash/cloneDeep";
var attrItems = {
    titleText: {
        label: 'Title text',
        type: 'text',
        default: ''
    },
    zeroValueDisplay: {
        label: 'Zero value display', // Tiêu đề hiển thị của cấu hình
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
        label: 'Label style',
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
        label: 'Show',
        type: 'switch',
        default: true
    },
    showLegendTitle: {
        label: 'Show Legend Title',
        type: 'switch',
        default: true
    },

    name: {
        label: 'Name',
        type: 'text',
        default: ''
    },
    axistitle: {
        label: 'Axis title',
        type: 'switch',
        default: true
    },
    gridLine: {
        label: 'Show Gridline',
        type: 'switch',
        default: true
    },
    gridLineWidth: {
        label: 'Gridline Width',
        type: 'number',
        default: 1
    },
    gridLineColor: {
        label: 'Gridline Color',
        type: 'color',
        default: '#e6e6e6'
    },
    gridLineType: {
        label: 'Gridline Type',
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
        label: 'Format date',
        type: 'text',
        default: 'YYYY-mm-dd',
    },
    wrapText: {
        label: 'Wrap text',
        type: 'switch',
        default: false
    },
    fontColor: {
        label: 'Font Corlor',
        type: 'color',
        default: '#344750'
    },
    legendPosition: {
        label: 'Position',
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
        label: 'Display Unit',
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
        label: 'Border Corlor',
        type: 'color',
        default: '#000000'
    },
    borderBottomColor: {
        label: 'Border Corlor',
        type: 'color',
        default: '#ededed'
    },
    bgColor: {
        label: 'Background Corlor',
        type: 'color',
        default: '#ffffff'
    },
    textSize: {
        label: 'Text Size',
        type: 'number',
        default: '13'
    },
    borderWidth: {
        label: 'Border Width',
        type: 'number',
        default: 0
    },
    borderBottomWidth: {
        label: 'Border Width',
        type: 'number',
        default: 1
    },
    tooltipDecimalNumber: {
        label: 'Decimal number',
        type: 'number',
        default: 2
    },
    fontFamily: {
        label: 'Font family',
        type: 'select',
        default: 'roboto',
        options: [{
            value: 'roboto',
            text: 'Roboto'
        }]
    },
    position: {
        label: 'Position',
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
        label: 'Alignment',
        type: 'btnSelect',
        default: 'left',
        options: [{
                name: 'left',
                icon: 'ms-Icon ms-Icon--AlignHorizontalLeft',
                value: 'left',
                text: ''
            },
            {
                name: 'center',
                icon: 'ms-Icon ms-Icon--AlignHorizontalCenter',
                value: 'center',
                text: ''
            },
            {
                name: 'right',
                icon: 'ms-Icon ms-Icon--AlignHorizontalRight',
                value: 'right',
                text: ''
            },
        ]
    },
    verticalAlign: {
        label: 'vertical alignment',
        type: 'btnSelect',
        default: 'top',
        options: [{
                name: 'Top',
                icon: 'ms-Icon ms-Icon--AlignVerticalTop',
                value: 'top',
                text: ''
            },
            {
                name: 'Midle',
                icon: 'ms-Icon ms-Icon--AlignVerticalCenter',
                value: 'midle',
                text: ''
            },
            {
                name: 'bottom',
                icon: 'ms-Icon ms-Icon--AlignVerticalBottom',
                value: 'Bottom',
                text: ''
            },
        ]
    },
    selectionType: {
        label: 'Selection Type',
        type: 'btnSelect',
        default: 'multiple',
        options: [{
                name: 'Single',
                icon: 'ms-Icon ms-Icon--ReceiptCheck',
                value: 'single',
                text: ''
            },
            {
                name: 'multiple',
                icon: 'ms-Icon ms-Icon--CheckList',
                value: 'multiple',
                text: ''
            }
        ]
    },
    selectionMode: {
        label: 'Selection Mode',
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
        label: 'Value decimal places',
        type: 'number',
        default: 2
    },
    markerSize: {
        label: 'Marker size',
        type: 'number',
        default: 3
    },
    markerEnable: {
        label: 'Marker enable',
        type: 'switch',
        default: false
    },
    revertColor: {
        label: 'Revert color',
        type: 'switch',
        default: false
    },
    verticalLine: {
        label: 'Vertical line',
        type: 'switch',
        default: false
    },
    lineWidth: {
        label: 'Line width',
        type: 'number',
        default: 1.3
    },
    cardMode: {
        label: 'Mode',
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
        label: 'Size type',
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
        label: 'Size mode',
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
        label: 'Width',
        type: 'number',
        default: 0,
        disabled: false,

    },
    height: {
        label: 'Height',
        type: 'number',
        default: 0,
        disabled: false,

    },
    cellMargin: {
        label: 'Margin between cells',
        type: 'number',
        default: 10
    },
    colorPalette: {
        label: 'Color palette',
        type: 'colorArray',
        default: [],
    },
    tableColumnWidthMode: {
        label: 'Column width mode',
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
        label: 'Conditional format columns',
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