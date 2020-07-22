import { getIconFromType } from './../../components/document/controlPropsFactory.js';
import { defaultState } from "./defaultState";
import { util } from "./../../plugins/util.js";

import Vue from "vue";
import { type } from 'jquery';

const addControl = (state, params) => {
    let id = params.id
    let prop = params.props
    if (params.hasOwnProperty('from')) {
        if (params.from == 'submit') {

        } else {
            setTreeListControlInDoc(state);
        }
    } else {
        setTreeListControlInDoc(state);
    }
    Vue.set(state.editor.allControl, id, prop);

};

const addToListInputInDocument = (state, params) => {
    let name = params.name
    let control = params.control

    // state.editor.allControl[id] = prop;
    Vue.set(state.submit.listInputInDocument, name, control);
};
const changeControlSubmitProps = (state, params) => {
    let name = params.name
    let key = params.key
    let value = params.value
        // state.editor.allControl[id] = prop;

    Vue.set(state.submit.listInputInDocument[name], key, value);
};



const restoreState = (state) => {
    state.editor.allControl = {};
    state.editor.currentSelectedControl = { formulas: {}, properties: { name: {}, display: {}, print: {} }, type: '' };
    state.submit = {
        listInputInDocument: {

        },
        dataInputCache: {

        },
        docStatus: 'init',
        isDetailView: false,
        SQLLiteDB: {}

    }
    setTreeListControlInDoc(state)
}

// ham xây dựng dữ liệu cho treeview ở bên sidebar trái khi thay đổi thuộc tính control
function setTreeListControlInDoc(state) {
    let treeData = [{
        name: 'Control',
        icon: 'icon/ic_image.png',
        root: true,
        children: [

        ],
    }];
    let allControl = util.cloneDeep(state.editor.allControl);
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
    state.editor.listControlTreeData = treeData;
    // Vue.set(state.editor, listControlTreeData, treeData)
}

const addControlToTable = (state, params) => {
    let id = params.id
    let prop = params.props
    let tableId = params.tableId
    if (state.editor.allControl[tableId]['listFields']) {} else {
        state.editor.allControl[tableId]['listFields'] = {};
    }
    Vue.set(state.editor.allControl[tableId]['listFields'], id, prop);
    setTreeListControlInDoc(state);
};
const addCurrentControl = (state, control) => {
    Vue.set(state.editor.currentSelectedControl, 'formulas', control.formulas);
    Vue.set(state.editor.currentSelectedControl, 'id', control.id);

    // state.editor.currentSelectedControl['formulas'] = control.formulas
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
    // state.editor.currentSelectedControl['properties'] = groups
    Vue.set(state.editor.currentSelectedControl, 'properties', groups);
    console.log('currentSelectedControl', state.editor.currentSelectedControl);

};
const updateCurrentControlProps = (state, params) => {
        let group = params.group;
        let prop = params.prop;
        let typeProp = params.typeProp;
        let value = params.value;
        Vue.set(state.editor.currentSelectedControl.properties[group][prop], typeProp, value);
    }
    // hàm xóa control đang chọn ra khỏi store
const resetCurrentControl = (state, control) => {

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
    Vue.set(state.editor, 'currentSelectedControl', currentSelectedControl);
}
const updateProp = (state, params) => {
    let id = params.id
    let name = params.name
    let value = params.value
    let tableId = params.tableId
    let type = params.type;
    if (tableId != '0') {
        if (state.editor.allControl[tableId]['listFields'][id]['properties'][name]) {
            state.editor.allControl[tableId]['listFields'][id]['properties'][name][type] = value

        } else if (state.editor.allControl[tableId]['listFields'][id]['formulas'][name]) {
            state.editor.allControl[tableId]['listFields'][id]['formulas'][name][type] = value
        }

    } else {
        if (state.editor.allControl[id]['properties'][name]) {
            state.editor.allControl[id]['properties'][name][type] = value
        } else if (state.editor.allControl[id]['formulas'][name]) {
            state.editor.allControl[id]['formulas'][name][type] = value
        }
    }
    setTreeListControlInDoc(state);
}
const updateFormulasId = (state, params) => {
    let id = params.id
    let name = params.name
    let value = params.value
    let tableId = params.tableId
    if (tableId != 0 && tableId != '0') {
        if (state.editor.allControl[tableId]['listFields'][id]['formulas'][name]) {
            state.editor.allControl[tableId]['listFields'][id]['formulas'][name]['formulasId'] = value
        }

    } else {
        if (state.editor.allControl[id]['formulas'][name]) {
            state.editor.allControl[id]['formulas'][name]['formulasId'] = value
        }
    }
}

const minimizeControl = (state, params) => {
    for (let i of Object.keys(state.editor.allControl)) {
        if (state.editor.allControl[i]['listFields']) {
            for (let j of Object.keys(state.editor.allControl[i]['listFields'])) {
                if (params.allId.indexOf(j) === -1) {
                    delete state.editor.allControl[i]['listFields'][j];
                }
            }
        } else {
            if (params.allId.indexOf(i) === -1) {
                delete state.editor.allControl[i];
            }
        }
    }
    setTreeListControlInDoc(state);

}

/**
 * hàm thêm instance SQLLite vào store
 */

const addInstanceSubmitDB = (state, params) => {
    let instance = params.instance
    let sqlLite = params.sqlLite
        // state.editor.allControl[id] = prop;
    Vue.set(state.submit.SQLLiteDB, instance, sqlLite);
}

/**
 * hàm thêm các giá trị cho listInputInDocument -- submit store
 */

const updateListInputInDocument = (state, params) => {
    console.log('jhsd', util.cloneDeep(params));

    let key = params.key
    let controlName = params.controlName;
    let value = params.value
    if (state.submit.listInputInDocument.hasOwnProperty(controlName)) {
        Vue.set(state.submit.listInputInDocument[controlName], key, value);
    }
    console.log('jhsd', state.submit.listInputInDocument[controlName]);

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
    console.log('jhsd', params);
    let key = params.key
    let value = params.value
    Vue.set(state.submit, key, value);
}
const addToDocumentDetailStore = (state, params) => {
    let key = params.key
    let value = params.value
    Vue.set(state.detail, key, value);
}
const addToDocumentStore = (state, params) => {
    let key = params.key
    let value = params.value
    Vue.set(state, key, value);
}
const addToDocumentEditorStore = (state, params) => {
    let key = params.key
    let value = params.value
    Vue.set(state.editor, key, value);
}
const resetSubmitStore = (state, params) => {
    let value = {
        listInputInDocument: {

        },
        dataInputCache: {

        },
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
    Vue.set(state, 'submit', value);
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
    restoreState,
    addToListInputInDocument,
    changeControlSubmitProps,
    addInstanceSubmitDB,
    updateListInputInDocument,
    updateFormulasId,
    addToRootControl,
    addToImpactedFieldsList,
    addToDocumentSubmitStore,
    addToDocumentDetailStore,
    addToDocumentStore,
    addToDocumentEditorStore,
    setAllDocuments,
    resetCurrentControl,
    updateCurrentControlProps,
    addToRelatedLocalFormulas,
    resetSubmitStore

};