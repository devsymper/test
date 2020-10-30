import store from './../../../store';
import sDocument from './../../../store/document';
import { util } from '../../../plugins/util';

let listNameValueControl = {};
const checkDbOnly = function(instance, controlName) {
    let control = getControlInstanceFromStore(instance, controlName);
    if (control.controlProperties['isDBOnly'] != undefined &&
        (control.controlProperties['isDBOnly'].value == "1" ||
            control.controlProperties['isDBOnly'].value == true ||
            control.controlProperties['isDBOnly'].value == 1)) {
        return control;
    } else {
        return false
    }
}
const getControlInstanceFromStore = function(instance, controlName) {
    if (sDocument.state.submit[instance].listInputInDocument.hasOwnProperty(controlName)) {
        return sDocument.state.submit[instance].listInputInDocument[controlName]
    } else {
        return false
    }
}
const getControlTitleFromName = function(instance, controlName) {
    let control = getControlInstanceFromStore(instance, controlName);
    if (control != false) {
        return control.title;
    } else {
        return false
    }
}
const checkInTable = function(element) {
    let table = element.closest('.s-control-table');
    let tableId = '0'
    if (table.length > 0) {
        tableId = table.attr('id');
    }
    return tableId;
}
const getControlType = function(instance, controlName) {
    let control = getControlInstanceFromStore(instance, controlName);
    if (control != false) {
        return control.type;
    } else {
        return false
    }
}
const getSDocumentSubmitStore = function(instance) {
    return sDocument.state.submit[instance]
}
const getSDocumentEditorStore = function(instance) {
    return sDocument.state.editor[instance]
}
const getListInputInDocument = function(instance) {
    return getSDocumentSubmitStore(instance).listInputInDocument;
}
const mapTypeToEffectedControl = {
    linkConfig: "effectedLinkControl",
    formulas: "effectedControl",
    readOnly: "effectedReadonlyControl",
    hidden: "effectedHiddenControl",
    require: "effectedRequireControl",
    validate: "effectedValidateControl",
}
const currentSelectedControl = function(instance) {
    return getSDocumentEditorStore(instance).currentSelectedControl;
};
const getControlEditor = function(instance, id, tableId = '0') {
    let allControl = getSDocumentEditorStore(instance).allControl;
    if (tableId != '0') {
        return allControl[tableId]['listFields'][id]
    } else {
        return allControl[id];
    }
};
/**
 * Hàm kiểm tra tên 1 control có bị trùng với các control khác hay không, nếu bị trùng thì thông báo lỗi
 */
const checkNameControl = function(instance) {
        let isValid = true;
        let curControl = currentSelectedControl(instance);
        let input = curControl.properties.name.name;
        let elements = $('#document-editor-' + instance + '_ifr').contents().find('#' + curControl.id);
        let tableId = checkInTable(elements)
        if (tableId == curControl.id)
            tableId = '0';
        let errValue = ''
        let listValue = Object.values(listNameValueControl);
        let dataControl = { value: input.value, match: false, id: curControl.id };
        if (input.value == "" && input.value.length == 0) {
            errValue = "Không được bỏ trống tên control"
            elements.addClass('s-control-error');
            isValid = false;
        } else {
            if (/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(input.value) == false) {
                errValue = "Tên không hợp lệ";
                elements.addClass('s-control-error');
                isValid = false;
            } else {
                elements.removeClass('s-control-error');
                let controlConflic = listValue.filter(c => {
                    return c.value == input.value
                });
                if (controlConflic.length > 0) {
                    let listControlIdConflic = controlConflic.reduce((arr, obj) => [
                        ...arr, obj.id
                    ], []);
                    dataControl.match = listControlIdConflic;
                    elements.addClass('s-control-error');
                    for (let index = 0; index < controlConflic.length; index++) {
                        let control = controlConflic[index];
                        let newList = util.cloneDeep(listControlIdConflic);
                        newList.splice(newList.indexOf(control.id), 1);
                        newList.push(curControl.id);
                        listNameValueControl[control.id].match = newList;
                        $('#document-editor-' + instance + '_ifr').contents().find('#' + control.id).addClass('s-control-error');
                        let tableId = checkInTable($('#document-editor-' + instance + '_ifr').contents().find('#' + control.id));
                        if (tableId == control.id) {
                            tableId = '0'
                        }
                        let controlEditor = getControlEditor(instance, control.id, tableId);
                        controlEditor.properties.name.validateStatus = {
                            isValid: false,
                            message: "Trùng tên control"
                        }
                    }
                    if (listNameValueControl.hasOwnProperty(curControl.id)) {
                        for (let index = 0; index < listNameValueControl[curControl.id].length; index++) {
                            const element = listNameValueControl[curControl.id][index];
                            $('#document-editor-' + instance + '_ifr').contents().find('#' + element.id).removeClass('s-control-error')
                        }
                    }
                } else {
                    if (listNameValueControl.hasOwnProperty(curControl.id)) {
                        let controlOldConflic = listNameValueControl[curControl.id].match;
                        for (let index = 0; index < controlOldConflic.length; index++) {
                            let control = controlOldConflic[index];
                            listNameValueControl[control].match.splice(listNameValueControl[control].match.indexOf(curControl.id), 1);
                            if (listNameValueControl[control].match.length == 0)
                                $('#document-editor-' + instance + '_ifr').contents().find('#' + control).removeClass('s-control-error')
                        }
                    }
                    $('#document-editor-' + instance + '_ifr').contents().find('#' + curControl.id).removeClass('s-control-error')
                }
            }
        }
        listNameValueControl[curControl.id] = dataControl;
        let validateStatus = {
            isValid: isValid,
            message: errValue
        }
        store.commit(
            "document/updateProp", { id: curControl.id, name: 'name', value: validateStatus, tableId: tableId, type: "validateStatus", instance: instance }
        );
        store.commit(
            "document/updateCurrentControlProps", { instance: instance, group: 'name', prop: 'name', typeProp: 'validateStatus', value: validateStatus }
        );
    }
    /**
     * Hàm kiểm tra tên 1 control có bị trùng với các control khác hay không, nếu bị trùng thì thông báo lỗi
     */
const checkTitleControl = function(instance) {
    let isValid = true;
    let curControl = currentSelectedControl(instance);
    let input = curControl.properties.name.title;
    let elements = $('#document-editor-' + instance + '_ifr').contents().find('#' + curControl.id);
    elements.removeClass('s-control-error');
    if (elements.is('.page-item')) {
        elements.find('.page-item__name').text(input.value);
    }
    if (elements.is('[s-control-type="tab"]')) {
        elements.text(input.value);
    }
    let tableId = checkInTable(elements)
    if (tableId == curControl.id)
        tableId = '0';
    let errValue = ""
    if (!input.value) {
        errValue = "Không được bỏ trống tiêu đề control";
        isValid = false;
        elements.addClass('s-control-error');
    }
    let validateStatus = {
        isValid: isValid,
        message: errValue
    }
    store.commit(
        "document/updateProp", { id: curControl.id, name: 'title', value: validateStatus, tableId: tableId, type: "validateStatus", instance: instance }
    );
    store.commit(
        "document/updateCurrentControlProps", { instance: instance, group: 'name', prop: 'title', typeProp: 'validateStatus', value: validateStatus }
    );
}
export {
    // handlerRunOtherFormulasControl
    getControlInstanceFromStore,
    checkDbOnly,
    checkInTable,
    getControlTitleFromName,
    getControlType,
    getSDocumentSubmitStore,
    getListInputInDocument,
    checkNameControl,
    checkTitleControl,
    mapTypeToEffectedControl
}