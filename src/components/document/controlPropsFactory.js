import { util } from "./../../plugins/util.js";
// đầu vào : loại control
// đầu ra: tất cả các thuộc tính của control đó
const commonProps = {
    name: {
        title: "Tên",
        type: "text",
        value: "",
        groupType: "name"
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
        type: "text",
        value: "",
        groupType: "display"
    },
    formatDateTime: {
        title: "Định dạng thời gian",
        type: "text",
        value: "",
        groupType: "display"
    },
    isImportant: {
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
        type: "textarea",
    },
    hidden: {
        title: "Công thức ẩn hiện",
        type: "textarea",
    },
    link: {
        title: "Công thức link",
        type: "textarea",
    },
    formulas: {
        title: "Công thức giá trị",
        type: "textarea",
    },
    autocomplete: {
        title: "Công thức autocomplete",
        type: "textarea",
    },
    validate: {
        title: "Công thức xác thực",
        type: "textarea",
    },
    readOnly: {
        title: "Công thức readonly",
        type: "textarea",
    },
    uniqueDB: {
        title: "Nội dung thông báo khi bị trùng dữ liệu DB",
        type: "textarea",
    },
    uniqueTable: {
        title: "Nội dung thông báo khi bị trùng dữ liệu trong bảng",
        type: "textarea",
    },
    report: {
        title: "Công thức lấy dữ liệu báo cáo",
        type: "textarea"
    },
    headerTable: {
        title: "Cấu hình tiêu đề cho bảng",
        type: "textarea"
    },
    filterOptions: {
        title: "Bộ lọc tùy chọn",
        type: "textarea"
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
    }
}

const controlTypes = {
    label: {
        icon: "mdi mdi-format-color-text",
        html: `<span class="s-control s-control-label" contenteditable="false" s-control-type="label" style="font-size:13px;padding:2px 8px;border-radius:4px;">Label</span>`,
        title: "Label",
        notInProps: ['formatNumber', 'isSumTable', 'isReadOnly'],
        formulas: ['link', 'formulas', 'hidden']
    },
    qrCode: {
        icon: "mdi mdi-qrcode",
        html: `<span class="s-control s-control-qrcode" contenteditable="false" style="cursor: pointer;display: inline-block;width: 100px;height: 100px;border:none;" s-control-type="qrCode" data-mce-selected="1">
                    <img style="width: 100%;height: 100%;" src="/qrcode/?code=">
                    <input type="hidden">
                </span>`,
        title: "QrCode",
        notInProps: ['otherInfo', 'fontSize', 'color', 'formatNumber', 'isSumTable', 'isRequired', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['link', 'formulas', 'hidden']
    },
    image: {
        icon: "mdi mdi-image",
        html: `<span class="s-control s-control-image" contenteditable="false" style="cursor: pointer;display: inline-block;width: 100px;height: 100px;border:none;" s-control-type="image">
                    <img style="width: 100%;height: 100%;" src="/view/themes/img/image.png">
                    <input type="hidden" >
                </span>`,
        title: "Image",
        notInProps: ['otherInfo', 'fontSize', 'color', 'formatNumber', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['link', 'formulas', 'hidden']
    },
    textInput: {
        icon: "mdi mdi-sign-text",
        html: `<input class="s-control s-control-text" contenteditable="false" s-control-type="textInput" type="text" style="border:none">`,
        title: "Text input",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate'],
        formulas: ['link', 'formulas', 'hidden', 'readOnly', 'autocomplete', 'require', 'validate']
    },
    richText: {
        icon: "mdi mdi-format-paragraph",
        html: `<textarea class="s-control S-control-rich-text" contenteditable="false" s-control-type="richText" type="text" style="border:none"></textarea>`,
        title: "Rich text",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['link', 'formulas', 'hidden', 'readOnly', 'require']
    },
    number: {
        icon: "mdi mdi-numeric",
        html: `<input class="s-control s-control-number" contenteditable="false" s-control-type="number" type="number" style="border:none">`,
        title: "Number",
        notInProps: ['isDisplayCompact', 'isMultipleValue'],
        formulas: ['link', 'formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    date: {
        icon: "mdi mdi-calendar",
        html: `<input class="s-control s-control-date" contenteditable="false" s-control-type="date" type="date" style="border:none">`,
        title: "Date",
        notInProps: ['otherInfo', 'formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    dateTime: {
        icon: "mdi mdi-calendar-clock",
        html: `<input class="s-control s-control-datetime" contenteditable="false" s-control-type="dateTime" type="datetime-local" style="border:none">`,
        title: "Date time",
        notInProps: ['otherInfo', 'formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    time: {
        icon: "mdi mdi-calendar-clock",
        html: `<input class="s-control s-control-time" contenteditable="false" s-control-type="time" type="time" style="border:none">`,
        title: "Time",
        notInProps: ['otherInfo', 'formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    month: {
        icon: "mdi mdi-calendar-multiple",
        html: `<input class="s-control s-control-month" contenteditable="false" s-control-type="month" type="month" style="border:none">`,
        title: "Month",
        notInProps: ['otherInfo', 'formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    select: {
        icon: "mdi mdi-select",
        html: `<select class="s-control s-control-select" contenteditable="false" s-control-type="select" type="select" style="border:none"></select>`,
        title: "Select",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'link', 'require']
    },
    documentSelect: {
        icon: "mdi mdi-file-document",
        html: `<select class="s-control s-control-document" contenteditable="false" s-control-type="documentSelect" type="select"></select>`,
        title: "Document select",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require']
    },
    phone: {
        icon: "mdi mdi-cellphone",
        html: `<input class="s-control s-control-phone" contenteditable="false" s-control-type="phone" type="tel">`,
        title: "Phone",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    email: {
        icon: "mdi mdi-email-variant",
        html: `<input class="s-control s-control-email" contenteditable="false" s-control-type="email" type="email">`,
        title: "Email",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    currency: {
        icon: "mdi mdi-currency-usd",
        html: `<input class="s-control s-control-currency" contenteditable="false" s-control-type="currency" type="number" step="0.01">`,
        title: "Currency",
        inProps: ['isHidden'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    radio: {
        icon: "mdi mdi-radiobox-marked",
        html: `<div class="s-control s-control-radio" contenteditable="false" style="width: auto;" s-control-type="radio"><label><input type="radio" > </label></div>`,
        title: "Radio",
        notInProps: ['mobileProps', 'formatNumber', 'isImportant', 'isMobile', 'isSumTable', 'isDBOnly', 'isRequired', 'isTableOnly', 'isTableOnly', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require']
    },
    checkbox: {
        icon: "mdi mdi-checkbox-marked-outline",
        html: `<input type="checkbox" value="false" class="s-control s-control-checkbox" s-control-type="checkbox" contenteditable="false">`,
        title: "Checkbox",
        notInProps: ['otherInfo', 'fontSize', 'formatNumber', 'isSumTable', 'isDBOnly', 'isRequired', 'isTableOnly', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue', 'isBorderSubmit', 'isBorderView', 'isBorderPrint'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require']
    },
    color: {
        icon: "mdi mdi-format-paint",
        html: `<input class="s-control s-control-color" contenteditable="false" s-control-type="color" type="text">`,
        title: "Color",
        inProps: ['isHidden'],
        formulas: ['hidden']
    },
    percent: {
        icon: "mdi mdi-percent",
        html: `<input class="s-control s-control-percent" contenteditable="false" s-control-type="percent" type="number" step="0.01">`,
        title: "Percent",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly']
    },
    user: {
        icon: "mdi mdi-account-outline",
        html: `<select class="s-control s-control-user" contenteditable="false" s-control-type="user"></select>`,
        title: "User",
        notInProps: ['formatNumber', 'isSumTable', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['hidden', 'readOnly']
    },
    inputFilter: {
        icon: "mdi mdi-filter-outline",
        html: `<input class="s-control s-control-filter" contenteditable="false" type="text" s-control-type="inputFilter">`,
        title: "Input filter",
        notInProps: ['formatNumber', 'isSumTable', 'isTableOnly', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['formulas', 'hidden', 'readOnly', 'link', 'require', 'validate']
    },
    hidden: {
        icon: "mdi mdi-eye-off-outline",
        html: `<input class="s-control s-control-hidden" contenteditable="false" type="text" s-control-type="hidden" placeholder="hidden control">`,
        title: "Hidden",
        notInProps: ['formatNumber', 'isSumTable', 'isAllowUpdate'],
        formulas: ['formulas', 'hidden', 'readOnly', 'require', 'validate']
    },
    table: {
        icon: "mdi mdi-table",
        html: `<div style="overflow-y: auto;position: relative;font-size: 13px;" contenteditable="true" class="s-control s-control-table" s-control-type="table">
                <table style="width:100%;text-align: center;" >
                    <thead >
                        <tr>
                            <th class="column-function">Chọn</th>
                            <th class="column-item">Tiêu đề</th>
                            <th class="column-function">Chức năng</th>
                        </tr>
                    </thead>
                <tbody style="background: white;">
                    <tr class="s-control-table-row-template">
                        <td class="column-function"><input type="checkbox" class="s-control-check-table-row"></td>
                        <td class="column-item"></td>
                        <td class="column-function"><button class="btn btn-primary s-control-table-remove-row" style="margin: 5px;">Xoá</button></td>
                    </tr>
                </tbody>
                </table>
                <div class="row text-center" style="margin-top: 20px; display: none;">
                    <a class="btn btn-primary s-control-table-add-row">Thêm dòng </a>
                    <a class="btn btn-primary s-control-table-remove-select">Xoá dòng đã chọn </a>
                    <a class="btn btn-primary s-control-table-remove-unselect">Xoá dòng không chọn </a>
                </div>
                </div>
                <br>`,
        title: "Table",
        notInProps: ['width', 'height', 'isImportant', 'formatNumber', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isDisplayCompact', 'isMultipleValue', 'isAllowPrint', 'isBorderSubmit', 'isBorderView', 'isBorderPrint'],
        formulas: ['formulas', 'hidden', 'readOnly', 'headerTable', 'filterOptions']
    },
    panel: {
        icon: "mdi mdi-collage",
        html: `<div class="s-control s-control-panel" contenteditable="false" s-control-type="panel" style="width: 100%;display: inline-block;font-size: 13px;" >
                    <span class="panel-title2" style="background: #dadada;color: #6e6e6e;border-bottom: 0.5px solid #ddd;height: 30px;font-weight: bold;width: 100%;padding:7px;display: inline-block!important;">Tiêu đề panel</span>
                    <div style="padding:7px;display: block;">
                    
                    </div>
                </div><br>`,
        title: "Panel",
        notInProps: ['fontSize', 'formatNumber', 'isImportant', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue', 'isAllowPrint', 'isBorderSubmit', 'isBorderView', 'isBorderPrint'],
        formulas: ['hidden']
    },
    fileUpload: {
        icon: "mdi mdi-attachment",
        html: `<div class="s-control s-control-file-upload " style="display: inline-block;width: auto;border-radius: 10px;font-size: 13px;height: auto;padding: 5px!important;border: 1px solid #c5c5c5!important;    " s-control-type="fileUpload" contenteditable="false">
                <input type="hidden" name="FileUpload">
                <span class="cmd-file-list"></span>
                <span class="btn " style="padding: 0;text-transform: capitalize!important;">
                <!-- <img src="/view/themes/icon/upload.png" width="50px">  -->
                <span class="btn-upload-file-input">
                <img src="/view/themes/icon/upload.png" width="20px"> Attach
                
                </span>
                </span>
                </div><br>`,
        title: "File upload",
        notInProps: ['width', 'height', 'fontSize', 'color', 'mobileProps', 'isImportant', 'formatNumber', 'isMobile', 'isSumTable', 'isDBOnly', 'isTableOnly', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['hidden']
    },
    report: {
        icon: "mdi mdi-chart-bar-stacked",
        html: `<div class="s-control-report s-control" s-control-type="report" style="min-height: 50px;width:100px;font-size: 13px;;box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);display: inline-block;"contenteditable="false">
                <h5 style="margin:5px;font-family: 'Roboto', sans-serif!important;font-weight:normal">Report</h5>
                </div><br>`,
        title: "Report",
        notInProps: ['fontSize', 'mobileProps', 'isImportant', 'formatNumber', 'isMobile', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isHidden', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue', 'isBorderSubmit', 'isBorderView', 'isBorderPrint'],
        formulas: ['hidden', 'report']
    },
    approvalHistory: {
        icon: "mdi mdi-chart-timeline",
        html: `<div class="s-control-approval-history s-control" s-control-type="approvalHistory" style="min-height: 50px;font-size: 13px;width: 100%;display: inline-block" contenteditable="false">
                <h5 style="margin:5px;font-family: 'Roboto', sans-serif!important;font-weight:normal">Lịch sử phê duyệt</h5>
                <div class="list-approval-history"></div>
                </div><br>`,
        title: "Approval history",
        inProps: ['isAllowPrint', 'isBorderSubmit', 'isBorderView', 'isBorderPrint'],
        formulas: ['hidden']
    },
    trackingValue: {
        icon: "mdi mdi-chart-timeline",
        html: `<div class="s-control-tracking-value s-control" s-control-type="trackingValue" style="min-height: 50px;font-size: 13px;width: 100%;display: inline-block;" contenteditable="false" readonly="readonly">
                <h5 style="margin:5px;font-family: 'Roboto', sans-serif!important;font-weight:normal">Tracking giá trị của control</h5>
                </div><br>`,
        title: "Tracking value",
        inProps: ['name', 'isAllowPrint', 'isBorderSubmit', 'isBorderView', 'isBorderPrint'],
        formulas: ['hidden']
    },
    submit: {
        icon: "mdi mdi-archive",
        html: `<span type="button" class="s-control s-control-submit" contenteditable="false" s-control-type="submit" value="Submit" style="display: inline;font-size: 13px;">Submit</span>`,
        title: "Submit",
        inProps: ['mobileProps', 'isImportant', 'formatNumber', 'isMobile', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isHidden', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['hidden']
    },
    reset: {
        icon: "mdi mdi-archive",
        html: `<span type="button" class="s-control s-control-reset" contenteditable="false" s-control-type="reset" value="Reset" style="display: inline;font-size: 13px;">Reset</span>`,
        title: "Reset",
        inProps: ['otherInfo', 'mobileProps', 'isImportant', 'formatNumber', 'isMobile', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isHidden', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['hidden']
    },
    draf: {
        icon: "mdi mdi-archive",
        html: `<span type="button" class="s-control s-control-draf" contenteditable="false" s-control-type="draf" value="Draf" style="display: inline;font-size: 13px;">Draf</span>`,
        title: "Draf",
        inProps: ['otherInfo', 'mobileProps', 'isImportant', 'formatNumber', 'isMobile', 'isSumTable', 'isRequired', 'isDBOnly', 'isTableOnly', 'isHidden', 'isAllowUpdate', 'isReadOnly', 'isDisplayCompact', 'isMultipleValue'],
        formulas: ['hidden']
    },


}


export const GetControlProps = function(type) {
    let control = util.cloneDeep(controlTypes[type]);

    console.log(type);
    console.log(control);

    let allProperties = util.cloneDeep(commonProps);
    let notInProps = control.notInProps;
    let inProps = control.inProps;

    if (inProps != undefined && typeof inProps != 'undefined' && inProps.length > 0) {
        let propertiesControl = [];
        for (let i = 0; i < inProps.length; i++) {
            propertiesControl.push(allProperties[inProps[i]]);
        }
        propertiesControl = Object.assign({}, propertiesControl);
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
export const getAllTypeControl = function() {
    let allControl = util.cloneDeep(controlTypes);
    let result = Object.keys(allControl).map(function(key) {
        return { type: key, prop: allControl[key] };
    });
    return result;
}
export const getControlElement = function(type) {
    return util.cloneDeep(controlTypes[type]);
}
export const getGroupProps = function(group) {
    return util.cloneDeep(groupType[group]);
}
export const getControlElementForTableSetting = function(type) {
    let control = util.cloneDeep(controlTypes[type]);
    let result = Object.keys(control).map(function(key) {
        return { type: key, prop: control[key] };
    });
    return result
}