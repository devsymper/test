import { util } from "./../../plugins/util.js";
// đầu vào : loại control
// đầu ra: tất cả các thuộc tính của control đó
const commonProps = {
    name: {
        title: "Tên",
        type: "text",
        value: "",
        groupType: "name",
    },
    title: {
        title: "Tiêu đề",
        type: "text",
        value: "",
        groupType: "name"
    },
    otherInfo: {
        title: "Thông tin thêm",
        type: "text",
        value: "",
        groupType: "name"
    },
    //hiên thi
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
    fontSize: {
        title: "Cỡ chữ",
        type: "select",
        value: "",
        options: ['8px', '10px', '11px', '12px', '13px', '14px', '15px'],
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
        value: "",
        groupType: "display"
    },
    // formatTime: {
    //     title: "Định dạng thời gian",
    //     type: "text",
    //     value: "",
    //     groupType: "display"
    // },
    isPrimary: {
        title: "Quan trọng",
        type: "checkbox",
        value: "",
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
        title: "Required",
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
    isAllowPrint: {
        title: "Cho phép in",
        type: "checkbox",
        value: "",
        groupType: "print"
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
        title: "Border view",
        type: "checkbox",
        value: "",
        groupType: "print"
    },
}

let commonFormulas = {
    require: {
        title: "Công thức require",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    hidden: {
        title: "Công thức ẩn hiện",
        value: "",
        formulasId: 0,
        type: "treeValidate",
        groupType: "formulas"
    },
    link: {
        title: "Công thức link",
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
    autocomplete: {
        title: "Công thức autocomplete",
        value: "",
        formulasId: 0,
        type: "script",
        groupType: "formulas"
    },
    validate: {
        title: "Công thức xác thực",
        value: "",
        formulasId: 0,
        type: "treeValidate",
        groupType: "formulas"
    },
    readOnly: {
        title: "Công thức readonly",
        value: "",
        formulasId: 0,
        type: "treeValidate",
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
    label: {
        icon: `/icon/ic_label.png`,
        html: `<span class="s-control s-control-label" contenteditable="false" s-control-type="label"  title="Label">Aa</span>&nbsp;`,
        title: "Label",
        notInProps: ['formatNumber', 'isSumTable', 'isReadOnly'],
        formulas: ['link', 'formulas', 'hidden']
    },
    qrCode: {
        icon: "/icon/ic_qrcode.png",
        html: `<span class="s-control s-control-qrcode" contenteditable="false"  title="Qr code" style="cursor: pointer;text-align: center;display: inline-block;width: 25px;height: 25px;" s-control-type="qrCode" data-mce-selected="1">
                    <span class="mdi mdi-qrcode-scan" style="font-size: 22px;color: #757575;"></span>
                    <input type="hidden">
                </span>&nbsp;`,
        title: "QrCode",
        notInProps: ['otherInfo', 'fontSize', 'color', 'formatNumber', 'isSumTable', 'isRequired', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['link', 'formulas', 'hidden']
    },
    image: {
        icon: "/icon/ic_image.png",
        html: `<span class="s-control s-control-image" contenteditable="false"  title="Image" style="cursor: pointer;text-align: center;display: inline-block;width: 25px;height: 25px;" s-control-type="image">
                    <span class="mdi mdi-image-area" style="font-size: 22px;color: #757575;"></span>
                    <input type="hidden" >
                </span>&nbsp;`,
        title: "Image",
        notInProps: ['otherInfo', 'fontSize', 'color', 'formatNumber', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['link', 'formulas', 'hidden']
    },
    textInput: {
        icon: "/icon/ic_textinput.png",
        html: `<input class="s-control s-control-text mdi" contenteditable="false" s-control-type="textInput" type="text" title="Text Input">&nbsp;&nbsp;`,
        title: "Text input",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate'],
        formulas: ['link', 'formulas', 'hidden', 'readOnly', 'autocomplete', 'require', 'validate']
    },
    richText: {
        icon: "/icon/ic_richtext.png",
        html: `<textarea class="s-control S-control-rich-text" contenteditable="false"  title="Rich-text" s-control-type="richText" type="text"></textarea>&nbsp;&nbsp;`,
        title: "Rich text",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['link', 'formulas', 'hidden', 'readOnly', 'require']
    },
    number: {
        icon: "/icon/ic_number.png",
        html: `<input class="s-control s-control-number" contenteditable="false"  title="Number" s-control-type="number" type="number">&nbsp;&nbsp;`,
        title: "Number",
        notInProps: ['formatDate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['link', 'formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    date: {
        icon: "/icon/ic_date.png",
        html: `<input class="s-control s-control-date" contenteditable="false"  title="Date" s-control-type="date" type="date">&nbsp;&nbsp;`,
        title: "Date",
        notInProps: ['otherInfo', 'formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    dateTime: {
        icon: "/icon/ic_date.png",
        html: `<input class="s-control s-control-datetime" contenteditable="false"  title="Date time" s-control-type="dateTime" type="datetime-local">&nbsp;&nbsp;`,
        title: "Date time",
        notInProps: ['otherInfo', 'formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    time: {
        icon: "/icon/ic_date.png",
        html: `<input class="s-control s-control-time" contenteditable="false"  title="Time" s-control-type="time" type="time" style="width: 150px;">&nbsp;&nbsp;`,
        title: "Time",
        notInProps: ['otherInfo', 'formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    month: {
        icon: "/icon/ic_date.png",
        html: `<input class="s-control s-control-month" contenteditable="false" title="Month" s-control-type="month" type="month">&nbsp;&nbsp;`,
        title: "Month",
        notInProps: ['otherInfo', 'formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    select: {
        icon: "/icon/ic_select.png",
        html: `<select class="s-control s-control-select" contenteditable="false" title="Select" s-control-type="select" type="select"></select>&nbsp;&nbsp;`,
        title: "Select",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'link', 'require']
    },
    documentSelect: {
        icon: "/icon/ic_document_select.png",
        html: `<select class="s-control s-control-document" contenteditable="false" title="Document Select" s-control-type="documentSelect" type="select"></select>&nbsp;&nbsp;`,
        title: "Document select",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require']
    },
    phone: {
        icon: "/icon/ic_phone.png",
        html: `<input class="s-control s-control-phone" contenteditable="false" title="Phone" s-control-type="phone" type="tel">&nbsp;&nbsp;`,
        title: "Phone",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    email: {
        icon: "/icon/ic_mail.png",
        html: `<input class="s-control s-control-email" contenteditable="false" title="Email" s-control-type="email" type="email">&nbsp;&nbsp;`,
        title: "Email",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    currency: {
        icon: "/icon/ic_currency.png",
        html: `<input class="s-control s-control-currency" contenteditable="false" title="Currency" s-control-type="currency" type="number" step="0.01">&nbsp;`,
        title: "Currency",
        notInProps: ['formatDate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    radio: {
        icon: "/icon/ic_radio.png",
        html: `<div class="s-control s-control-radio" contenteditable="false" title="Radio" style="width: 40px;min-width: 20px;" s-control-type="radio"><label><input type="radio" style="margin-top: 7px;"> </label></div>&nbsp;`,
        title: "Radio",
        notInProps: ['mobileProps', 'formatNumber', 'isPrimary', 'isMobile', 'isSumTable', 'isDBOnly', 'isRequired', 'isTableOnly', 'isTableOnly', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require']
    },
    checkbox: {
        icon: "/icon/ic_checkbox.png",
        html: `<input type="checkbox" value="false" class="s-control s-control-checkbox" title="Checkbox" s-control-type="checkbox" contenteditable="false">&nbsp;`,
        title: "Checkbox",
        notInProps: ['otherInfo', 'fontSize', 'formatNumber', 'isSumTable', 'isDBOnly', 'isRequired', 'isTableOnly', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue', 'isBorderSubmit', 'isBorderView', 'isBorderPrint'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require']
    },
    color: {
        icon: "/icon/ic_date.png",
        html: `<input class="s-control s-control-color" contenteditable="false" title="Color" s-control-type="color" type="text">&nbsp;`,
        title: "Color",
        inProps: ['isHidden'],
        formulas: ['hidden']
    },
    percent: {
        icon: "/icon/ic_percent.png",
        html: `<input class="s-control s-control-percent" contenteditable="false" title="Percent" s-control-type="percent" type="number" step="0.01">&nbsp;`,
        title: "Percent",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly']
    },
    user: {
        icon: "/icon/ic_user.png",
        html: `<select class="s-control s-control-user" contenteditable="false" title="User" s-control-type="user"></select>&nbsp;`,
        title: "User",
        notInProps: ['formatNumber', 'isSumTable', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['hidden', 'readOnly']
    },
    inputFilter: {
        icon: "/icon/ic_input_filter.png",
        html: `<input class="s-control s-control-filter" contenteditable="false" title="Input filter" type="text" s-control-type="inputFilter">&nbsp;`,
        title: "Input filter",
        notInProps: ['formatNumber', 'isSumTable', 'isTableOnly', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'link', 'require', 'validate']
    },
    hidden: {
        icon: "/icon/ic_hidden.png",
        html: `<input class="s-control s-control-hidden" contenteditable="false" title="Hidden" type="text" s-control-type="hidden" placeholder="Hidden control">&nbsp;`,
        title: "Hidden",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    table: {
        icon: "/icon/ic_table.png",
        html: `<table contenteditable="true" class="s-control s-control-table" s-control-type="table">
                    <thead style="font-size: 11px;background:#f2f2f2">
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr class="s-control-table-row-template">
                        <td style="width:20%;"></td>
                        <td style="width:20%;"></td>
                        <td style="width:20%;"></td>
                        <td style="width:20%;"></td>
                        <td style="width:20%;"></td>
                    </tr>
                </tbody>
                </table> &nbsp;
                `,
        title: "Table",
        notInProps: ['width', 'height', 'isPrimary', 'formatNumber', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue', 'isAllowPrint', 'isBorderSubmit', 'isBorderView', 'isBorderPrint'],
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
        notInProps: ['fontSize', 'formatNumber', 'isPrimary', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue', 'isAllowPrint', 'isBorderSubmit', 'isBorderView', 'isBorderPrint'],
        formulas: ['hidden']
    },
    fileUpload: {
        icon: "/icon/ic_file_upload.png",
        html: `<div class="s-control s-control-file-upload " title="File upload" s-control-type="fileUpload" contenteditable="false">
                <span class="mdi mdi-attachment" style="font-size: 22px;color: #757575;"></span>
                <input type="hidden" name="FileUpload">
                </div> &nbsp;`,
        title: "File upload",
        notInProps: ['width', 'height', 'fontSize', 'color', 'mobileProps', 'isPrimary', 'formatNumber', 'isMobile', 'isSumTable', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['hidden']
    },
    report: {
        icon: "/icon/ic_report.png",
        html: `<div class="s-control-report s-control" title="Report" s-control-type="report" style="width:150px" contenteditable="false">
                <h5 style="margin:0;height: 100%;padding-top: 5px;font-size: 12px;font-family: 'Roboto', sans-serif!important;font-weight:normal">Report</h5>
                </div>&nbsp;`,
        title: "Report",
        notInProps: ['fontSize', 'mobileProps', 'isPrimary', 'formatNumber', 'isMobile', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isHidden', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue', 'isBorderSubmit', 'isBorderView', 'isBorderPrint'],
        formulas: ['hidden', 'report']
    },
    approvalHistory: {
        icon: "/icon/ic_approval_history.png",
        html: `<div class="s-control-approval-history s-control" title="Approval history" s-control-type="approvalHistory" style="width:150px" contenteditable="false">
                <h5 style="margin:0;height: 100%;padding-top: 5px;font-size: 12px;font-family: 'Roboto', sans-serif!important;font-weight:normal">Lịch sử phê duyệt</h5>
                <div class="list-approval-history"></div>
                </div>&nbsp;`,
        title: "Approval history",
        inProps: ['isAllowPrint', 'isBorderSubmit', 'isBorderView', 'isBorderPrint'],
        formulas: ['hidden']
    },
    trackingValue: {
        icon: "/icon/ic_tracking_value.png",
        html: `<div class="s-control-tracking-value s-control" title="Tracking value" s-control-type="trackingValue" style="width:150px" contenteditable="false" readonly="readonly">
                <h5 style="margin:0;height: 100%;padding-top: 5px;font-size: 12px;font-family: 'Roboto', sans-serif!important;font-weight:normal">Tracking giá trị của control</h5>
                </div>&nbsp;`,
        title: "Tracking value",
        inProps: ['name', 'isAllowPrint', 'isBorderSubmit', 'isBorderView', 'isBorderPrint'],
        formulas: ['hidden']
    },
    submit: {
        icon: "/icon/ic_submit.png",
        html: `<span type="button" class="s-control s-control-submit" contenteditable="false" s-control-type="submit" value="Submit" style="display: inline;font-size: 13px;color:green;">Submit</span>&nbsp;`,
        title: "Submit",
        inProps: ['mobileProps', 'isPrimary', 'formatNumber', 'isMobile', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isHidden', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['hidden']
    },
    reset: {
        icon: "/icon/ic_reset.png",
        html: `<span type="button" class="s-control s-control-reset" contenteditable="false" s-control-type="reset" value="Reset" style="display: inline;font-size: 13px;color:red;">Reset</span>&nbsp;`,
        title: "Reset",
        inProps: ['otherInfo', 'mobileProps', 'isPrimary', 'formatNumber', 'isMobile', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isHidden', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['hidden']
    },
    draft: {
        icon: "/icon/ic_draft.png",
        html: `<span type="button" class="s-control s-control-draft" contenteditable="false" s-control-type="draft" value="Draf" style="display: inline;font-size: 13px;">Draft</span>&nbsp;`,
        title: "Draft",
        inProps: ['otherInfo', 'mobileProps', 'isPrimary', 'formatNumber', 'isMobile', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isHidden', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
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
    "AllowPrint": "isAllowPrint",
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

// hàm lấy tất cac thuoc tinh và các trường công thức của control
// input : type của control
// output : data control  : {icon,html,title,formulas,properties}
export const GetControlProps = function(type) {
    let control = util.cloneDeep(controlTypes[type]);

    let allProperties = util.cloneDeep(commonProps);
    let notInProps = control.notInProps;
    let inProps = control.inProps;

    if (inProps != undefined && typeof inProps != 'undefined' && inProps.length > 0) {
        let propertiesControl = {};
        for (let i = 0; i < inProps.length; i++) {
            console.log(inProps[i]);

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
            return { type: key, prop: allControl[key] };
        });
        return result;
    }
    // hàm lấy tất cả thông tin các control trong tablesetting
export const getAllControlForTableSetting = function(inType) {

        let allControl = util.cloneDeep(controlTypes);

        let result = Object.keys(allControl).map(function(key) {
            return { type: key, prop: allControl[key] };
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
        return { type: key, prop: control[key] };
    });
    return result
}

// hàm lấy tất cả thuộc tính control nhóm theo grouptype
export const getAllPropsControl = function() {
    let allProp = util.cloneDeep(commonProps);
    let allFormulas = util.cloneDeep(commonFormulas);
    let data = Object.assign(allProp, allFormulas);
    let result = Object.keys(data).map(function(key) {
        let type = data[key].type;
        let width = (type == 'checkbox') ? 40 : 100
        let colDefine = { headerName: data[key].title, field: key, groupType: data[key].groupType, width: width, editable: true, colId: key }
        if (type == 'checkbox') {
            colDefine = {
                headerName: data[key].title,
                field: key,
                cellRenderer: 'checkBoxRenderer',
                editable: true,
                groupType: data[key].groupType,
                width: width,
                colId: key
            }
        }
        // function(params) {
        //     var checkbox = document.createElement("input");
        //     checkbox.type = "checkbox";
        //     checkbox.checked = params.value
        //     checkbox.addEventListener('click', function(event) {
        //         params.value = !params.value;
        //         let colName = params.colDef.field;
        //         params.node.data[colName] = params.value;
        //     });
        //     return checkbox
        // },
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
    console.log(result);

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
    console.log(dataPropsResult);
    return dataPropsResult;
}

export const getAllFormulasName = function() {
    let allFormulas = util.cloneDeep(commonFormulas);
    return Object.keys(allFormulas);
}