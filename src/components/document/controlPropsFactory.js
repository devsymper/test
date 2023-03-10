import {
    util
} from "./../../plugins/util.js";
// đầu vào : loại control
// đầu ra: tất cả các thuộc tính của control đó
const commonProps = {
    dataFlowId: {
        title: "Dataflow",
        type: "autocomplete",
        groupType: "name",
        options: [],
        properties: {
            dense: true,
            solo: true,
            'hide-details': true,
            flat: true,
        },
        isSelectionChip: false,
        value: {}
    },
    name: {
        title: "Tên",
        type: "text",
        value: "",
        groupType: "name",
        oldName: "",
        validateStatus: {
            isValid: true,
            message: ""
        }
    },
    title: {
        title: "Tiêu đề",
        type: "text",
        value: "",
        groupType: "name",
        validateStatus: {
            isValid: true,
            message: ""
        }
    },
    otherInfo: {
        title: "Thông tin thêm",
        type: "text",
        value: "",
        groupType: "name"
    },
    defaultValue: {
        title: "Giá trị mặc định",
        type: "text",
        value: "",
        groupType: "name"
    },

    //hiên thi
    
    maxValue: {
        title: "Độ dài tối đa",
        type: "text",
        value: "",
        groupType: "display",
    },
    minValue: {
        title: "Độ dài tối thiểu",
        type: "text",
        value: "",
        groupType: "display",
    },
    width: {
        title: "Chiều rộng",
        type: "text",
        value: "",
        groupType: "display"
    },
    height: {
        title: "Chiều cao",
        type: "text",
        value: "",
        groupType: "display"
    },
    tableView:{
        title: "Dạng hiển thị",
        type: "select",
        value: "Flat",
        groupType: "display",
        options: [
            {
                text: 'Flat',
                value: 'Flat'
            },
            {
                text: 'Pivot',
                value: 'Pivot'
            },
            {
                text: 'Group',
                value: 'Group'
            }
        ]
    },
    fontSize: {
        title: "Cỡ chữ",
        type: "select",
        value: "",
        options: [{
                text: '8px',
                value: '8px'
            },
            {
                text: '10px',
                value: '10px'
            },
            {
                text: '11px',
                value: '11px'
            },
            {
                text: '12px',
                value: '12px'
            },
            {
                text: '13px',
                value: '13px'
            },
            {
                text: '14px',
                value: '14px'
            },
            {
                text: '15px',
                value: '15px'
            }
        ],
        groupType: "display"
    },
    color: {
        title: "Màu chữ",
        type: "text",
        value: "",
        groupType: "display"
    },
    css: {
        title: "Thuộc tính css",
        type: "textarea",
        value: "",
        groupType: "display"
    },
    mobileProps: {
        title: "Thuộc tính mobile",
        type: "textarea",
        value: "",
        groupType: "display"
    },
    formatNumber: {
        title: "Định dạng số",
        type: "numberFormat",
        value: "#,###",
        groupType: "display"
    },
    itemValue: {
        title: "Giá trị cho Input",
        type: "text",
        value: "",
        groupType: "display"
    },
    // formatDateTime: {
    //     title: "Định dạng thời gian",
    //     type: "text",
    //     value: "",
    //     groupType: "display"
    // },
    formatDate: {
        title: "Định dạng thời gian",
        type: "dateFormat",
        value: "DD/MM/YYYY",
        groupType: "display"
    },
    tablePrimaryKey: {
        title: "Chọn trường định danh",
        type: "select",
        value: "",
        options: [],
        groupType: "display"
    },
    // formatTime: {
    //     title: "Định dạng thời gian",
    //     type: "text",
    //     value: "",
    //     groupType: "display"
    // },
    // thuộc tính chọn doc làm form sub submit
    // quickSubmit: {
    //     title: "Nhập liệu nhanh",
    //     type: "autocomplete",
    //     value: "",
    //     groupType: "display"
    // },
    isKeyCacheInTable: {
        title: "Key cache trong table",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    isQuickSubmit: {
        title: "Nhập liệu nhanh",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    isSingleSelect: {
        title: "Cho phép chọn nhiều",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    // thuộc tính chọn control đổ dữ liệu vào sau khi submit từ form sub submit
    // mapControlFromSubForm: {
    //     title: "Chọn control",
    //     type: "autocomplete",
    //     value: "",
    //     groupType: "display"
    // },
    /**
     * THuộc tính này cho phép control tự dãn chiều cao nếu dữ liệu nhiều lúc submit
     */
    autoHeight: {
        title: "Tự động co dãn",
        type: "checkbox",
        value: false,
        groupType: "display"
    },
    isPrimaryKey: {
        title: "Định danh",
        type: "checkbox",
        value: false,
        groupType: "display"
    },
    isRefreshData: {
        title: "Làm mới giá trị",
        type: "checkbox",
        value: false,
        groupType: "display"
    },
    isPrimary: {
        title: "Quan trọng",
        type: "checkbox",
        value: true,
        groupType: "display"
    },
    isMobile: {
        title: "Mobile",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    isSumTable: {
        title: "Tính tổng trong bảng",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    isRequired: {
        title: "Require",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    isRequireChange: {
        title: "Require change",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    isDBOnly: {
        title: "Duy nhất trong DB",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    isTableOnly: {
        title: "Duy nhất trong table",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    isHidden: {
        title: "Ẩn",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    tableWrapText: {
        title: "Wrap text",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    
    isAllowUpdate: {
        title: "Cho phép update",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    isReadOnly: {
        title: "Chỉ Xem",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    isSaveToDB: {
        title: "Lưu giá trị",
        type: "checkbox",
        value: true,
        groupType: "display"
    },
    isInsertRow: {
        title: "Cho phép thêm dòng",
        type: "checkbox",
        groupType: "display",
        value: true,
    },
    isShowHeaderTinyMce: {
        title: "Hiển thị Menu Bar",
        type: "checkbox",
        value: false,
        groupType: "display"
    },
    isMultipleValue: {
        title: "Lấy nhiều giá trị như mảng",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    isDisplayCompact: {
        title: "Hiển thị rút gọn",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    isVarchar: {
        title: "Kiểu dữ liệu varchar",
        type: "checkbox",
        value: "",
        groupType: "display"
    },
    isPreventedConfig: {
        title: "Không cho phép thay đổi cấu hình",
        type: "checkbox",
        value: "",
        groupType: "display"
    },

    isBorderSubmit: {
        title: "Border submit",
        type: "checkbox",
        value: "",
        groupType: "print"
    },
    isBorderView: {
        title: "Border view",
        type: "checkbox",
        value: "",
        groupType: "print"
    },
    isBorderPrint: {
        title: "Border print",
        type: "checkbox",
        value: "",
        groupType: "print"
    },
    mapParamsDataflow: {
        title: 'Mapping',
        type: 'table',
        groupType: 'table',
        value: [],
        columns: [{
                title: 'From',
                name: 'name',
                type: 'text',
            },
            {
                title: 'To',
                name: 'controlName',
                type: 'text',
            },
        ],
    },
}
export const propsNotChangeForTaskManager = ['isSaveToDB', 'name', 'isVarchar', 'isRefreshData', 'isPrimaryKey']

let commonFormulas = {

    require: {
        title: "Công thức require",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    requireChange: {
        title: "Công thức require change",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    hidden: {
        title: "Công thức ẩn hiện",
        value: "",
        formulasId: 0,
        type: "script", // muoons treevalidate thi thay script ow day
        groupType: "formulas"
    },
    link: {
        title: "Công thức link",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    list: {
        title: "Công thức danh sách",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    formulas: {
        title: "Công thức giá trị",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    // autocomplete: {
    //     title: "Công thức autocomplete",
    //     value: "",
    //     formulasId: 0,
    //     type: "script",
    //     groupType: "formulas"
    // },
    autocomplete: {
        title: "Cấu hình autocomplete",
        value: "",
        formulasId: 0,
        type: "script",
        isConfigCustom: true,
        isConfigAutocomplete: false,
        groupType: "formulas",
        configData: {
            treeData: [],
            documentSelected: {},
            columnSelected: []
        }
    },
    validate: {
        title: "Công thức xác thực",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    readOnly: {
        title: "Công thức readonly",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    uniqueDB: {
        title: "Nội dung thông báo khi bị trùng dữ liệu DB",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    uniqueTable: {
        title: "Nội dung thông báo khi bị trùng dữ liệu trong bảng",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    report: {
        title: "Công thức lấy dữ liệu báo cáo",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    headerTable: {
        title: "Cấu hình tiêu đề cho bảng",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    filterOptions: {
        title: "Bộ lọc tùy chọn",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    submit: {
        title: "Công thức sau submit",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    update: {
        title: "Công thức sau update",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    linkConfig: {
        title: "Link đến đối tượng hệ thống",
        value: "",
        configData: [],
        formulasId: 0,
        type: "linkConfig",
        groupType: "formulas"
    },
    minDate: {
        title: "Ngày bắt đầu từ",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    maxDate: {
        title: "Ngày kết thúc",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    }
}


let groupType = {
    name: {
        title: 'Tên'
    },
    display: {
        title: 'Hiển thị'
    },
    print: {
        title: 'In'
    },
    formulas: {
        title: 'Công thức'
    }
}


const controlTypes = {
    labelPrint: {
        icon: `/icon/ic_label.png`,
        html: `<label class="s-control s-control-label" contenteditable="false" s-control-type="label"  title="Label">Aa</label>&nbsp;`,
        title: "Label in",
        inProps: ['width', 'color', 'fontSize'],
        formulas: ['formulas']
    },
    label: {
        icon: `/icon/ic_label.png`,
        html: `<label class="s-control s-control-label" contenteditable="false" s-control-type="label"  title="Label">Aa</label>&nbsp;`,
        title: "Label",
        notInProps: ['tableWrapText','tableView','itemValue','isVarchar','isQuickSubmit','isInsertRow', 'isShowHeaderTinyMce', 'autoHeight', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'formatNumber', 'formatDate', 'isSumTable', 'isReadOnly'],
        formulas: ['linkConfig', 'formulas', 'hidden']
    },
    qrCode: {
        icon: "/icon/ic_qrcode.png",
        html: `<span class="s-control s-control-qrcode" contenteditable="false"  title="Qr code" style="cursor: pointer;text-align: center;display: inline-block;width: 25px;height: 25px;" s-control-type="qrCode" data-mce-selected="1">
                    <span class="mdi mdi-qrcode-scan" style="font-size: 22px;color: #757575;"></span>
                    <input type="hidden">
                </span>&nbsp;`,
        title: "QrCode",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isVarchar','isQuickSubmit','isInsertRow','isShowHeaderTinyMce', 'defaultValue', 'autoHeight', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'otherInfo', 'formatDate', 'fontSize', 'color', 'formatNumber', 'isSumTable', 'isRequired', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['linkConfig', 'formulas', 'hidden']
    },
    image: {
        icon: "/icon/ic_image.png",
        html: `<label class="s-control s-control-image" contenteditable="false"  title="Image" style="cursor: pointer;text-align: center;display: inline-block;width: 25px;height: 25px;" s-control-type="image">
                    <span class="mdi mdi-image-area" style="font-size: 22px;color: #757575;"></span>
                </label>&nbsp;`,
        title: "Image",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue', 'isVarchar','isQuickSubmit','isInsertRow','isShowHeaderTinyMce', 'defaultValue', 'autoHeight', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'otherInfo', 'formatDate', 'fontSize', 'color', 'formatNumber', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['linkConfig', 'formulas', 'hidden']
    },
    textInput: {
        icon: "/icon/ic_textinput.png",
        html: `<input class="s-control s-control-text mdi" contenteditable="false" s-control-type="textInput" type="text" title="Text Input">&nbsp;&nbsp;`,
        title: "Text input",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','autoHeight', 'dataFlowId', 'formatNumber', 'formatDate','isInsertRow','isShowHeaderTinyMce', 'isSumTable', 'isAllowUpdate'],
        formulas: ['linkConfig', 'linkConfig', 'formulas', 'hidden', 'readOnly', 'autocomplete', 'require', 'validate','requireChange']
    },
    department: {
        icon: "/icon/ic_textinput.png",
        html: `<input class="s-control s-control-text mdi" contenteditable="false" s-control-type="department" type="text" title="Department">&nbsp;&nbsp;`,
        title: "Department",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isVarchar','isQuickSubmit', 'autoHeight', 'dataFlowId', 'isPrimaryKey','isInsertRow','isShowHeaderTinyMce', 'formatNumber', 'formatDate', 'isSumTable', 'isAllowUpdate'],
        formulas: ['formulas', 'autocomplete', 'hidden', 'readOnly', 'require', 'validate','requireChange']
    },
    richText: {
        icon: "/icon/ic_richtext.png",
        html: `<input class="s-control s-control-rich-text" contenteditable="false"  s-control-type="richText" type="text" title="Rich text">&nbsp;&nbsp;`,
        title: "Rich text",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isVarchar','isQuickSubmit', 'autoHeight', 'dataFlowId','isInsertRow', 'isPrimaryKey', 'minValue', 'maxValue', 'formatNumber', 'formatDate', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['linkConfig', 'formulas', 'hidden', 'readOnly', 'require','requireChange']
    },
    number: {
        icon: "/icon/ic_number.png",
        html: `<input class="s-control s-control-number" contenteditable="false"  title="Number" s-control-type="number" type="number">&nbsp;&nbsp;`,
        title: "Number",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isVarchar','isQuickSubmit', 'autoHeight','isInsertRow','isShowHeaderTinyMce', 'dataFlowId', 'minValue', 'maxValue', 'formatDate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['linkConfig', 'formulas', 'hidden', 'readOnly', 'require', 'validate','requireChange']
    },
    date: {
        icon: "/icon/ic_date.png",
        html: `<input class="s-control s-control-date" contenteditable="false"  title="Date" s-control-type="date" type="date">&nbsp;&nbsp;`,
        title: "Date",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isVarchar','isQuickSubmit', 'autoHeight', 'dataFlowId','isInsertRow','isShowHeaderTinyMce', 'isPrimaryKey', 'minValue', 'maxValue', 'otherInfo', 'formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate', 'minDate', 'maxDate','requireChange']
    },
    dateTime: {
        icon: "/icon/ic_date.png",
        html: `<input class="s-control s-control-datetime" contenteditable="false"  title="Date time" s-control-type="dateTime" type="datetime-local">&nbsp;&nbsp;`,
        title: "Date time",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isVarchar','isQuickSubmit', 'autoHeight', 'dataFlowId','isInsertRow','isShowHeaderTinyMce', 'isPrimaryKey', 'minValue', 'maxValue', 'otherInfo', 'formatNumber', 'formatDate', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate','requireChange']
    },
    time: {
        icon: "/icon/ic_date.png",
        html: `<input class="s-control s-control-time" contenteditable="false"  title="Time" s-control-type="time" type="time" style="width: 150px;">&nbsp;&nbsp;`,
        title: "Time",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isVarchar','isQuickSubmit', 'autoHeight', 'dataFlowId','isInsertRow','isShowHeaderTinyMce', 'isPrimaryKey', 'minValue', 'maxValue', 'otherInfo', 'formatNumber', 'formatDate', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate','requireChange']
    },
    month: {
        icon: "/icon/ic_date.png",
        html: `<input class="s-control s-control-month" contenteditable="false" title="Month" s-control-type="month" type="month">&nbsp;&nbsp;`,
        title: "Month",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isVarchar','isQuickSubmit', 'autoHeight','isInsertRow','isShowHeaderTinyMce', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'otherInfo', 'formatNumber', 'formatDate', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    select: {
        icon: "/icon/ic_select.png",
        html: `<input class="s-control s-control-select" readonly="readonly" contenteditable="false" title="Select" s-control-type="select" type="select">&nbsp;&nbsp;`,
        title: "Select",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','isVarchar','autoHeight', 'dataFlowId', 'isPrimaryKey','isInsertRow','isShowHeaderTinyMce', 'minValue', 'maxValue', 'formatNumber', 'isSumTable', 'formatDate', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'list', 'hidden', 'readOnly', 'linkConfig', 'require','requireChange']
    },
    combobox: {
        icon: "/icon/ic_select.png",
        html: `<input class="s-control s-control-combobox" readonly="readonly" contenteditable="false" title="Combobox" s-control-type="combobox">&nbsp;&nbsp;`,
        title: "Combobox",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','isVarchar','autoHeight', 'dataFlowId', 'isPrimaryKey','isInsertRow','isShowHeaderTinyMce', 'minValue', 'maxValue', 'formatNumber', 'isSumTable', 'formatDate', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'list','validate', 'hidden', 'readOnly', 'linkConfig', 'require','requireChange']
    },
    documentSelect: {
        icon: "/icon/ic_document_select.png",
        html: `<input class="s-control s-control-document" readonly="readonly" contenteditable="false" title="Document Select" s-control-type="documentSelect">&nbsp;&nbsp;`,
        title: "Document select",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','isVarchar','autoHeight', 'dataFlowId','isInsertRow','isShowHeaderTinyMce', 'isPrimaryKey', 'minValue', 'maxValue', 'formatNumber', 'isSumTable', 'formatDate', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require']
    },
    phone: {
        icon: "/icon/ic_phone.png",
        html: `<input class="s-control s-control-phone" contenteditable="false" title="Phone" s-control-type="phone" type="tel">&nbsp;&nbsp;`,
        title: "Phone",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isVarchar','isQuickSubmit', 'autoHeight','isInsertRow','isShowHeaderTinyMce', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'formatNumber', 'isSumTable', 'formatDate', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    email: {
        icon: "/icon/ic_mail.png",
        html: `<input class="s-control s-control-email" contenteditable="false" title="Email" s-control-type="email" type="email">&nbsp;&nbsp;`,
        title: "Email",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isVarchar','isQuickSubmit', 'autoHeight','isInsertRow','isShowHeaderTinyMce', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'formatNumber', 'isSumTable', 'formatDate', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    currency: {
        icon: "/icon/ic_currency.png",
        html: `<input class="s-control s-control-currency" contenteditable="false" title="Currency" s-control-type="currency" type="number" step="0.01">&nbsp;`,
        title: "Currency",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isVarchar','isQuickSubmit', 'autoHeight','isInsertRow', 'isShowHeaderTinyMce','dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'formatDate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    radio: {
        icon: "/icon/ic_radio.png",
        html: `<div class="s-control s-control-radio" contenteditable="false" title="Radio" style="width: 40px;min-width: 20px;" s-control-type="radio"><label><input type="radio" style="margin-top: 7px;"> </label></div>&nbsp;`,
        title: "Radio",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isVarchar','isQuickSubmit', 'autoHeight','isInsertRow', 'isShowHeaderTinyMce','dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'mobileProps', 'formatDate', 'formatNumber', 'isPrimary', 'isMobile', 'isSumTable', 'isDBOnly', 'isRequired', 'isTableOnly', 'isTableOnly', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require']
    },
    checkbox: {
        icon: "/icon/ic_checkbox.png",
        html: `<input type="checkbox" value="false" class="s-control s-control-checkbox" title="Checkbox" s-control-type="checkbox" contenteditable="false">&nbsp;`,
        title: "Checkbox",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isVarchar','isInsertRow','isShowHeaderTinyMce','isQuickSubmit', 'defaultValue', 'autoHeight', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'otherInfo', 'formatDate', 'fontSize', 'formatNumber', 'isSumTable', 'isDBOnly', 'isRequired', 'isTableOnly', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue', 'isBorderPrint'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require','requireChange']
    },
    color: {
        icon: "/icon/ic_date.png",
        html: `<input class="s-control s-control-color" contenteditable="false" title="Color" s-control-type="color" type="text">&nbsp;`,
        title: "Color",
        inProps: ['isHidden','isShowHeaderTinyMce','isInsertRow'],
        formulas: ['hidden']
    },
    percent: {
        icon: "/icon/ic_percent.png",
        html: `<input class="s-control s-control-percent" contenteditable="false" title="Percent" s-control-type="percent" type="number" step="0.01">&nbsp;`,
        title: "Percent",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','displayFieldInUser','isInsertRow','isShowHeaderTinyMce','isVarchar','isQuickSubmit', 'autoHeight', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'formatDate', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly','validate','requireChange']
    },
    user: {
        icon: "/icon/ic_user.png",
        html: `<input class="s-control s-control-user" contenteditable="false" title="User" s-control-type="user" type="text">&nbsp;`,
        title: "User",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','isInsertRow','isShowHeaderTinyMce','isVarchar','isQuickSubmit', 'autoHeight', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'formatNumber', 'formatDate', 'isSumTable', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['hidden', 'readOnly','formulas','autocomplete','requireChange']
    },
    inputFilter: {
        icon: "/icon/ic_input_filter.png",
        html: `<input class="s-control s-control-filter" contenteditable="false" title="Input filter" type="text" s-control-type="inputFilter">&nbsp;`,
        title: "Input filter",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isInsertRow','isShowHeaderTinyMce','isVarchar','autoHeight', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'formatNumber', 'formatDate', 'isSumTable', 'isTableOnly', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'list', 'hidden', 'readOnly', 'linkConfig', 'require', 'validate','requireChange']
    },
    hidden: {
        icon: "/icon/ic_hidden.png",
        html: `<input class="s-control s-control-hidden" contenteditable="false" title="Hidden" type="text" s-control-type="hidden" placeholder="Hidden control">&nbsp;`,
        title: "Hidden",
        notInProps: ['tableWrapText','tablePrimaryKey','tableView','itemValue','isInsertRow','isShowHeaderTinyMce','isVarchar','isQuickSubmit', 'autoHeight', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'formatNumber', 'formatDate', 'isSumTable', 'isAllowUpdate'],
        formulas: ['isRequireChange','formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    table: {
        icon: "/icon/ic_table.png",
        html: `<div class="wrap-s-control-table s-control s-control-table" s-control-type="table" contenteditable="false" style="overflow:auto;">
            <table contenteditable="true">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
            </table></div> &nbsp;&nbsp;`,
        title: "Table",
        notInProps: ['isRequireChange','isKeyCacheInTable','itemValue','isVarchar','isShowHeaderTinyMce','isQuickSubmit', 'defaultValue', 'autoHeight', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'width', 'height', 'formatDate', 'isPrimary', 'formatNumber', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue', 'isBorderPrint'],
        formulas: ['formulas', 'hidden', 'readOnly', 'headerTable', 'filterOptions']
    },
    panel: {
        icon: "/icon/ic_panel.png",
        html: `<div class="s-control s-control-panel" contenteditable="false" title="Panel" s-control-type="panel" style="display: inline-block;font-size: 11px;width: 100%;max-width: 100%;" >
                    <span class="panel-title2" style="background: #f2f2f2;color: gray;height: 30px;font-weight: bold;width: 100%;text-align: center;display: inline-block;line-height: 2.5;">Tiêu đề panel</span>
                    <div style="height: 30px;display: block;background: white;border: 1px solid #f2f2f2;border-top: none;">
                    
                    </div>
                </div>&nbsp;`,
        title: "Panel",
        notInProps: ['isRequireChange','isKeyCacheInTable','tableWrapText','tablePrimaryKey','tableView','itemValue','isShowHeaderTinyMce','isInsertRow','isVarchar','isQuickSubmit', 'defaultValue', 'autoHeight', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'fontSize', 'formatNumber', 'formatDate', 'isPrimary', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue', 'isBorderPrint'],
        formulas: ['hidden']
    },
    fileUpload: {
        icon: "/icon/ic_file_upload.png",
        html: `<div class="s-control s-control-file-upload " title="File upload" s-control-type="fileUpload" contenteditable="false">
                <span class="mdi mdi-attachment" style="font-size: 22px;color: #757575;"></span>
                <input type="hidden" name="FileUpload">
                </div> &nbsp;`,
        title: "File upload",
        notInProps: ['isKeyCacheInTable','tableWrapText','tablePrimaryKey','tableView','itemValue','isShowHeaderTinyMce','isInsertRow','isVarchar','isQuickSubmit', 'defaultValue', 'autoHeight', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'width', 'height', 'formatDate', 'fontSize', 'color', 'mobileProps', 'isPrimary', 'formatNumber', 'isMobile', 'isSumTable', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['hidden']
    },
    report: {
        icon: "/icon/ic_report.png",
        html: `<div class="s-control-report s-control" title="Report" s-control-type="report" style="width:150px" contenteditable="false">
                <h5 style="margin:0;height: 100%;padding-top: 5px;font-size: 12px;font-weight:normal">Report</h5>
                </div>&nbsp;`,
        title: "Report",
        notInProps: ['isRequireChange','isKeyCacheInTable','tableWrapText','tablePrimaryKey','tableView','itemValue','isShowHeaderTinyMce','isInsertRow','isVarchar','isQuickSubmit', 'defaultValue', 'autoHeight', 'dataFlowId', 'isPrimaryKey', 'minValue', 'maxValue', 'fontSize', 'formatDate', 'mobileProps', 'isPrimary', 'formatNumber', 'isMobile', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isHidden', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue', 'isBorderPrint'],
        formulas: ['hidden', 'report']
    },
    dataFlow: {
        icon: "/icon/ic_report.png",
        html: `<div class="s-control s-control-data-flow" contenteditable="false" title="Data Flow" s-control-type="dataFlow" >
                    <button class="run-dataflow d-none"><span class="mdi mdi-play-outline"></span></button>
                    <div>
                        <span class="panel-title2" style="background: #f2f2f2;color: gray;height: 30px;font-weight: bold;width: 100%;text-align: center;display: inline-block;line-height: 2.5;">Data Flow</span>
                        <div style="height: 30px;display: block;background: white;border: 1px solid #f2f2f2;border-top: none;    
                        display: flex;
                        flex-direction: row;
                        text-align: center;
                        align-items: center;
                        justify-content: center;">
                            <img style="width:14px;height:14px;margin: 0 4px;" src="`+require('./../../../public/img/document/icon/ic_report.png')+`">
                            <img style="width:14px;height:14px;margin: 0 4px;" src="`+require('./../../../public/img/document/icon/ic_table.png')+`">
                            <img style="width:14px;height:14px;margin: 0 4px;" src="`+require('./../../../public/img/document/icon/ic_document_select.png')+`">
                        </div>
                    </div>
                </div>&nbsp;`,
        title: "Data Flow",
        inProps: ['mapParamsDataflow', 'name', 'title', 'dataFlowId', 'width', 'height'],
        formulas: []
    },
    approvalHistory: {
        icon: "/icon/ic_approval_history.png",
        html: `<div class="s-control-approval-history s-control" title="Approval history" s-control-type="approvalHistory" style="width:150px" contenteditable="false">
                <h5 style="margin:0;height: 100%;padding-top: 5px;font-size: 12px;font-weight:normal">Lịch sử phê duyệt</h5>
                <div class="list-approval-history"></div>
                </div>&nbsp;`,
        title: "Approval history",
        inProps: ['formatDate', 'isBorderPrint'],
        formulas: ['hidden']
    },
    trackingValue: {
        icon: "/icon/ic_tracking_value.png",
        html: `<div class="s-control-tracking-value s-control" title="Tracking value" s-control-type="trackingValue" style="width:150px" contenteditable="false" readonly="readonly">
                <h5 style="margin:0;height: 100%;padding-top: 5px;font-size: 12px;font-weight:normal">Tracking giá trị của control</h5>
                </div>&nbsp;`,
        title: "Tracking value",
        inProps: ['name', 'formatDate', 'isBorderPrint'],
        formulas: ['hidden']
    },
    submit: {
        icon: "/icon/ic_submit.png",
        html: `<span type="button" class="s-control s-control-submit" contenteditable="false" s-control-type="submit" value="Submit" style="display: inline;font-size: 13px;color:green;">Submit</span>&nbsp;`,
        title: "Submit",
        inProps: ['mobileProps'],
        formulas: ['submit','update']
    },
    reset: {
        icon: "/icon/ic_reset.png",
        html: `<span type="button" class="s-control s-control-reset" contenteditable="false" s-control-type="reset" value="Reset" style="display: inline;font-size: 13px;color:red;">Reset</span>&nbsp;`,
        title: "Reset",
        inProps: ['otherInfo', 'mobileProps', 'formatDate', 'isPrimary', 'formatNumber', 'isMobile', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isHidden', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['hidden']
    },
    draft: {
        icon: "/icon/ic_draft.png",
        html: `<span type="button" class="s-control s-control-draft" contenteditable="false" s-control-type="draft" value="Draf" style="display: inline;font-size: 13px;">Draft</span>&nbsp;`,
        title: "Draft",
        inProps: ['otherInfo', 'mobileProps', 'formatDate', 'isPrimary', 'formatNumber', 'isMobile', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isHidden', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['hidden']
    },

    tabPage: {
        icon: "/icon/ic_panel.png",
        html: `<div class="s-control s-control-tab-page"  title="Tab / Page" 
                s-control-type="tabPage" 
                style="display: flex;width: 100%;height:300px;border: 1px solid rgba(0 0 0 / 0.1);" >
                    <div class="sidebar-page">
                        <div class="page-header-action">
                            <button class="add-page-btn"> <span class="mdi mdi-plus"></span>  <span class="page-item__name">Thêm trang</span></button>
                        </div>
                        <div class="list-page">
                            <div class="page-item sb-page-active s-control" s-control-type="page" page-index="1">
                                <span class="icon-page mdi mdi-format-page-break"></span>
                                <span class="page-item__name">Trang so 1</span>
                                <span class="delete-page-icon mdi mdi-window-close"></span>
                                
                            </div>
                        </div>
                        <button class="collapse-sidebar-btn"><span class="mdi mdi-chevron-left"></span></button>
                    </div>
                    <div class="list-page-content">
                        <div class="page-content page-active">
                            <div class="page-content-header">
                                <button class="add-tab-btn">+ Thêm tab</button>
                                <div class="tab">
                                
                                </div>
                            </div>
                            <div class="page-content-body">
                                
                            </div>
                        </div>
                    </div>
                </div>&nbsp;`,
        title: "Tab / Page",
        inProps: ['height', 'isHidden', 'autoHeight'],
        formulas: ['hidden']
    },
    tab: {
        html: `<div contenteditable="true" class="tabcontent">
                <div>tab 1</div>
            </div>`,
        inProps: ['name', 'title', 'isHidden'],
        formulas: ['hidden']
    },
    page: {
        html: `<div class="page-content page-active">
                <div class="page-content-header">
                    <button class="add-tab-btn">+ Thêm tab</button>
                    <div class="tab">
                    
                    </div>
                </div>
                <div class="page-content-body">
                    
                </div>
            </div>`,
        inProps: ['name', 'title', 'isHidden'],
        formulas: ['hidden']
    },
}

export const mappingOldVersionControlProps = {


    "Name": "name",
    "Title": "title",
    "PlaceHolder": "otherInfo",
    "Width": "width",
    "Height": "height",
    "FontSize": "fontSize",
    "Color": "color",
    "Css": "css",
    "Format-Number": "formatNumber",
    "IsPrimary": "isPrimary",
    "Mobile": "isMobile",
    "CalSum": "isSumTable",
    "Required": "isRequired",
    "IsUniqueInDB": "isDBOnly",
    "IsUniqueInTable": "isTableOnly",
    "IsHidden": "isHidden",
    "AllowUpdate": "isAllowUpdate",
    "AllowReadOnly": "isReadOnly",
    "MultipleValue": "isMultipleValue",
    "mobileProps": "mobileProps",
    "BorderSubmit": "isBorderSubmit",
    "BorderView": "isBorderView",
    "BorderPrint": "isBorderPrint",



}
export const mappingOldVersionControlFormulas = {
    "LinkFormulas": "link",
    "RequireDataFormulas": "require",
    "DataFormulas": "formulas",
    "AutoCompleteFormulas": "autocomplete",
    "VisibleFormulas": "hidden",
    "Validate": "validate",
    "MessageUniqueDB": "uniqueDB",
    "ReadonlyDataFormulas": "uniqueTable"
}

export const listControlNotNameProp = ['approvalHistory', 'submit', 'reset', 'draft', 'tabPage']
// hàm lấy tất cả thuộc tính và các trường công thức của 1 control
// input : type của control
// output : data control  : {icon,html,title,formulas,properties}
export const GetControlProps = function(type) {
    let control = util.cloneDeep(controlTypes[type]);

    let allProperties = util.cloneDeep(commonProps);
    let notInProps = (control.hasOwnProperty('notInProps')) ? control.notInProps : false;
    let inProps = (control.hasOwnProperty('inProps')) ? control.inProps : false;
    if (inProps != undefined && typeof inProps != 'undefined' && inProps.length > 0) {
        let propertiesControl = {};
        for (let i = 0; i < inProps.length; i++) {
            propertiesControl[inProps[i]] = allProperties[inProps[i]];

        }

        control['properties'] = propertiesControl;
    }
    if (notInProps != undefined && typeof notInProps != 'undefined' && notInProps.length > 0) {
        for (let i = 0; i < notInProps.length; i++) {
            delete allProperties[notInProps[i]]
        }
        control['properties'] = allProperties;
    }
    var formulas = [];
    for (let i = 0; i < control.formulas.length; i++) {
        formulas[control.formulas[i]] = util.cloneDeep(commonFormulas[control.formulas[i]]);
    }
    formulas = Object.assign({}, formulas);
    control.formulas = formulas;
    return control;

}

// hàm lấy tất cả thông tin các control
export const getAllTypeControl = function() {
    let allControl = util.cloneDeep(controlTypes);
    let result = Object.keys(allControl).map(function(key) {
        return {
            type: key,
            prop: allControl[key]
        };
    });
    return result;
}
// hàm lấy tất cả thông tin các control trong tablesetting
export const getAllControlForTableSetting = function(inType) {
    let allControl = util.cloneDeep(controlTypes);

    let result = Object.keys(allControl).map(function(key) {
        return {
            type: key,
            prop: allControl[key]
        };
    });
    let controlInTableSetting = result.filter(control => {
        return $.inArray(control.type, inType) != -1;
    })
    return controlInTableSetting;
}
    //hàm trả về 1 control
export const getControlElement = function(type) {
    return util.cloneDeep(controlTypes[type]);
}
export const getGroupProps = function(group) {
    return util.cloneDeep(groupType[group]);
}
export const getIconFromType = function(type) {
    let control = util.cloneDeep(controlTypes[type]);
    return control.icon;
}
export const getAPropsControl = function(type, value) {
    let prop = util.cloneDeep(commonProps[type]);
    prop.value = value;
    return prop;
}


// hàm lấy thông tin control cho tablesetting của control tabele trong doc editor
export const getControlElementForTableSetting = function(type) {
    let control = util.cloneDeep(controlTypes[type]);
    let result = Object.keys(control).map(function(key) {
        return {
            type: key,
            prop: control[key]
        };
    });
    return result
}

// hàm lấy tất cả thuộc tính control nhóm theo grouptype
// mục đích hiển thị trên sidebar phải khi click vào 1 control
export const getAllPropsControl = function() {
    let allProp = util.cloneDeep(commonProps);
    let allFormulas = util.cloneDeep(commonFormulas);
    let data = Object.assign(allProp, allFormulas);
    let result = Object.keys(data).map(function(key) {
        let type = data[key].type;
        let width = (type == 'checkbox') ? 40 : 100
        let colDefine = {
            headerName: data[key].title,
            field: key,
            groupType: data[key].groupType,
            width: width,
            editable: true,
            colId: key
        }
        if (type == 'checkbox') {
            colDefine['cellRenderer'] = 'checkBoxRenderer'
        }
        if (key == 'name') {
            colDefine['cellEditor'] = 'colGroupEditor'
        }
        if (type == 'select') {
            colDefine['cellEditor'] = 'agSelectCellEditor'
            colDefine['cellRenderer'] = function(params) {
                let el = document.createElement('span');
                if (params.value !== "" || params.value !== undefined || params.value !== null) {
                    el.innerHTML = params.value;
                }
                return el
            }
            colDefine['cellEditorParams'] = {
                values: ['8pt', '10pt', '12pt', '14pt', '16pt', '18pt']
            }
        }
        return colDefine;
    });

    let groups = util.cloneDeep(groupType);
    Object.filter = (obj, predicate) =>
        Object.fromEntries(Object.entries(obj).filter(predicate));
    let dataPropsResult = []
    for (let group in groups) {
        let propsOfGroup = Object.filter(result, ([name, prop]) => prop.groupType == group);
        groups[group]['listFields'] = Object.values(propsOfGroup);
        groups[group]['name'] = group;
        dataPropsResult.push(groups[group]);
    }
    return dataPropsResult;
}

export const getAllFormulasName = function() {
    let allFormulas = util.cloneDeep(commonFormulas);
    return Object.keys(allFormulas);
}