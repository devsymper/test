import { getIconFromType } from './../../components/document/controlPropsFactory.js';
import { defaultState } from "./defaultState";
import { util } from "./../../plugins/util.js";

import Vue from "vue";
import { type } from 'jquery';

const addControl = (state, params) => {
    let id = params.id
    let prop = params.props
    let instance = params.instance
    if (params.hasOwnProperty('from')) {
        if (params.from == 'submit') {

        } else {
            setTreeListControlInDoc(state, instance);
        }
    } else {
        setTreeListControlInDoc(state, instance);
    }
    Vue.set(state.editor[instance].allControl, id, prop);

};

const addToListInputInDocument = (state, params) => {
    let name = params.name
    let control = params.control
    let instance = params.instance

    // state.editor.allControl[id] = prop;
    Vue.set(state.submit[instance].listInputInDocument, name, control);
};
// ham xây dựng dữ liệu cho treeview ở bên sidebar trái khi thay đổi thuộc tính control
function setTreeListControlInDoc(state, instance) {
    let treeData = [{
        name: 'Control',
        icon: 'icon/ic_image.png',
        root: true,
        children: [

        ],
    }];
    let allControl = util.cloneDeep(state.editor[instance].allControl);
    for (let controlId in allControl) {
        let control = allControl[controlId];
        let type = control.type;
        let props = control.properties;
        let name = "";
        let title = "";
        if (type == 'submit' || type == 'draft' || type == 'reset' || type == 'approvalHistory') {
            name = type
            title = type
        } else {
            title = props.title.value;
            name = props.name.value;
        }
        if (type == 'table') {
            let listFields = control.listFields;
            let children = [];
            for (let childControlId in listFields) {
                let childControl = listFields[childControlId];
                let childProps = childControl.properties;
                let childType = childControl.type;
                let childTitle = childProps.title.value;
                let childName = childProps.name.value;
                let item = { name: childName + " - " + childTitle, icon: getIconFromType(childType), id: childControlId }
                children.push(item)
            }
            treeData[0].children.push({ name: name + " - " + title, active: false, icon: getIconFromType(type), id: controlId, children: children })
        } else {
            treeData[0].children.push({ name: name + " - " + title, active: false, icon: getIconFromType(type), id: controlId })
        }
    }
    Vue.set(state.editor[instance], 'listControlTreeData', treeData)
}

const addControlToTable = (state, params) => {
    let id = params.id
    let prop = params.props
    let tableId = params.tableId
    let instance = params.instance

    if (state.editor[instance].allControl[tableId]['listFields']) {} else {
        state.editor[instance].allControl[tableId]['listFields'] = {};
    }
    Vue.set(state.editor[instance].allControl[tableId]['listFields'], id, prop);
    setTreeListControlInDoc(state, instance);
};
const addCurrentControl = (state, control) => {
    let instance = control.instance
    Vue.set(state.editor[instance].currentSelectedControl, 'formulas', control.formulas);
    Vue.set(state.editor[instance].currentSelectedControl, 'id', control.id);

    let groups = { name: {}, display: {}, print: {} };
    if (control.properties != undefined && typeof control.properties != 'undefined') {
        Object.filter = (obj, predicate) =>
            Object.keys(obj)
            .filter(key => predicate(obj[key]))
            .reduce((res, key) => Object.assign(res, {
                [key]: obj[key]
            }), {});
        let propsTypeIsName = Object.filter(control.properties, prop => prop.groupType == 'name')
        let propsTypeIsDisplay = Object.filter(control.properties, prop => prop.groupType == 'display')
        let propsTypeIsPrint = Object.filter(control.properties, prop => prop.groupType == 'print')
        groups = { name: propsTypeIsName, display: propsTypeIsDisplay, print: propsTypeIsPrint };
    }
    Vue.set(state.editor[instance].currentSelectedControl, 'properties', groups);

};
const updateCurrentControlProps = (state, params) => {
        let group = params.group;
        let prop = params.prop;
        let typeProp = params.typeProp;
        let value = params.value;
        Vue.set(state.editor.currentSelectedControl.properties[group][prop], typeProp, value);
    }
    // hàm xóa control đang chọn ra khỏi store
const resetCurrentControl = (state, params) => {

    let currentSelectedControl = {
        // control đang được click bởi người dùng
        properties: {
            name: {},
            display: {},
            print: {},

        },
        formulas: {

        },
        type: "",
        id: ""
    }
    let instance = params.instance
    Vue.set(state.editor[instance], 'currentSelectedControl', currentSelectedControl);
}
const updateProp = (state, params) => {
    let id = params.id
    let name = params.name
    let value = params.value
    let tableId = params.tableId
    let instance = params.instance
    let type = params.type;
    if (tableId != '0') {
        if (state.editor[instance].allControl[tableId]['listFields'][id]['properties'][name]) {
            state.editor[instance].allControl[tableId]['listFields'][id]['properties'][name][type] = value

        } else if (state.editor[instance].allControl[tableId]['listFields'][id]['formulas'][name]) {
            state.editor[instance].allControl[tableId]['listFields'][id]['formulas'][name][type] = value
        }

    } else {
        if (state.editor[instance].allControl[id]['properties'][name]) {
            state.editor[instance].allControl[id]['properties'][name][type] = value
        } else if (state.editor[instance].allControl[id]['formulas'][name]) {
            state.editor[instance].allControl[id]['formulas'][name][type] = value
        }
    }
    setTreeListControlInDoc(state, instance);
}
const updateFormulasId = (state, params) => {
    let id = params.id
    let name = params.name
    let value = params.value
    let instance = params.instance
    let tableId = params.tableId
    if (tableId != 0 && tableId != '0') {
        if (state.editor[instance].allControl[tableId]['listFields'][id]['formulas'][name]) {
            state.editor[instance].allControl[tableId]['listFields'][id]['formulas'][name]['formulasId'] = value
        }

    } else {
        if (state.editor[instance].allControl[id]['formulas'][name]) {
            state.editor[instance].allControl[id]['formulas'][name]['formulasId'] = value
        }
    }
}

const minimizeControl = (state, params) => {
    let instance = params.instance
    let allControl = state.editor[instance].allControl;
    for (let i of Object.keys(allControl)) {
        if (allControl[i]['listFields']) {
            for (let j of Object.keys(allControl[i]['listFields'])) {
                if (params.allId.indexOf(j) === -1) {
                    delete allControl[i]['listFields'][j];
                }
            }
        } else {
            if (params.allId.indexOf(i) === -1) {
                delete allControl[i];
            }
        }
    }
    setTreeListControlInDoc(state, instance);

}

/**
 * hàm thêm instance SQLLite vào store
 */

const addInstanceSubmitDB = (state, params) => {
    let instance = params.instance
    let sqlLite = params.sqlLite
        // state.editor.allControl[id] = prop;
    Vue.set(state.submit[instance].SQLLiteDB, instance, sqlLite);
}


/**
 * hàm thêm các giá trị cho listInputInDocument -- submit store
 */

const updateListInputInDocument = (state, params) => {
    let key = params.key
    let controlName = params.controlName;
    let value = params.value
    let instance = params.instance
    if (state.submit[instance].listInputInDocument.hasOwnProperty(controlName)) {
        Vue.set(state.submit[instance].listInputInDocument[controlName], key, value);
    }
}
const addToRootControl = (state, params) => {
    let key = params.key
    let value = params.value
    Vue.set(state.submit.rootControl, key, value);
}
const addToImpactedFieldsList = (state, params) => {
    let value = params.value
    Vue.set(state.submit, 'impactedFieldsList', value);
}

const addToDocumentSubmitStore = (state, params) => {
    let key = params.key
    let value = params.value
    let instance = params.instance
    Vue.set(state.submit[instance], key, value);
}
const addToDocumentDetailStore = (state, params) => {
    let key = params.key
    let value = params.value
    let instance = params.instance
    Vue.set(state.detail[instance], key, value);
}
const changeViewType = (state, params) => {
    let key = params.key
    let value = params.value
    Vue.set(state.viewType, key, value);
}
const addToDocumentPropsEditor = (state, params) => {
    let key = params.key
    let value = params.value
    Vue.set(state.documentProps, key, value);
}
const addToDocumentEditorStore = (state, params) => {
    let key = params.key
    let instance = params.instance
    let value = params.value
    Vue.set(state.editor[instance], key, value);
}
const setDefaultSubmitStore = (state, params) => {
    let value = {
        listInputInDocument: {},
        dataInputCache: {},
        docStatus: 'init',
        SQLLiteDB: {},
        rootControl: {},
        impactedFieldsList: {},
        impactedFieldsListWhenStart: {},
        rootChangeFieldName: null,
        currentTableInteractive: null,
        currentCellSelected: null,
        currentControlAutoComplete: null,
        submitFormulas: null,
        listUser: null,
        localRelated: {},
        workflowVariable: {}
    }
    let instance = params.instance;
    Vue.set(state.submit, instance, value);
}
const setDefaultEditorStore = (state, params) => {
    let value = {
        allControl: {

        },
        currentSelectedControl: {
            // control đang được click bởi người dùng
            properties: {
                name: {},
                display: {},
                print: {},

            },
            formulas: {

            },
            type: "",
            id: ""
        },
        listControlTreeData: [],
        allControlForTableOption: []
    }
    let instance = params.instance;
    Vue.set(state.editor, instance, value);
}
const setDefaultDetailStore = (state, params) => {
    let value = {
        allData: {

        },

    }
    let instance = params.instance;
    Vue.set(state.detail, instance, value);
}
const addToRelatedLocalFormulas = (state, params) => {
    let curListRelate = state.submit.localRelated;
    let key = params.key
    let value = params.value
    for (let index = 0; index < value.length; index++) {
        let element = value[index];
        element = element.trim();
        if (!curListRelate.hasOwnProperty(element)) {
            curListRelate[element] = [];
        }
        curListRelate[element].push(key);
    }

    Vue.set(state.submit, 'localRelated', curListRelate);
}

/**
 * Khadm:
 * Set tất cả các document để cache lại
 */
const setAllDocuments = (state, docs) => {
    docs = docs.reduce((obj, el) => {
        obj[el.name] = el;
        el.allFields = null;
        return obj;
    }, {});
    Vue.set(state, 'listAllDocument', docs);
}


export {
    addControl,
    addCurrentControl,
    addControlToTable,
    updateProp,
    minimizeControl,
    addToListInputInDocument,
    addInstanceSubmitDB,
    updateListInputInDocument,
    updateFormulasId,
    addToRootControl,
    addToImpactedFieldsList,
    addToDocumentSubmitStore,
    addToDocumentDetailStore,
    changeViewType,
    addToDocumentPropsEditor,
    addToDocumentEditorStore,
    setAllDocuments,
    resetCurrentControl,
    updateCurrentControlProps,
    addToRelatedLocalFormulas,
    setDefaultSubmitStore,
    setDefaultEditorStore,
    setDefaultDetailStore

};