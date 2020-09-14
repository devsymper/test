import { getIconFromType } from './../../components/document/controlPropsFactory.js';
import { defaultState } from "./defaultState";
import { util } from "./../../plugins/util.js";

import Vue from "vue";
import { type } from 'jquery';

const addControl = (state, params) => {
    let id = params.id
    let prop = params.props
    let instance = params.instance
    Vue.set(state.editor[instance].allControl, id, prop);

};

const addToListInputInDocument = (state, params) => {
    let name = params.name
    let control = params.control
    let instance = params.instance
        // state.editor.allControl[id] = prop;
    Vue.set(state.submit[instance].listInputInDocument, name, control);
};


const addControlToTable = (state, params) => {
    let id = params.id
    let prop = params.props
    let tableId = params.tableId
    let instance = params.instance

    if (state.editor[instance].allControl[tableId]['listFields']) {} else {
        state.editor[instance].allControl[tableId]['listFields'] = {};
    }
    Vue.set(state.editor[instance].allControl[tableId]['listFields'], id, prop);

};
const addCurrentControl = (state, control) => {
    let instance = control.instance
    Vue.set(state.editor[instance].currentSelectedControl, 'formulas', control.formulas);
    Vue.set(state.editor[instance].currentSelectedControl, 'id', control.id);
    Vue.set(state.editor[instance].currentSelectedControl, 'type', control.type);

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
        let propsTypeIsTable = Object.filter(control.properties, prop => prop.groupType == 'table')
        groups = { name: propsTypeIsName, display: propsTypeIsDisplay, print: propsTypeIsPrint, table: propsTypeIsTable };
    }
    Vue.set(state.editor[instance].currentSelectedControl, 'properties', groups);

};
const updateCurrentControlProps = (state, params) => {
    let group = params.group;
    let prop = params.prop;
    let typeProp = params.typeProp;
    let value = params.value;
    let instance = params.instance
    Vue.set(state.editor[instance].currentSelectedControl.properties[group][prop], typeProp, value);
}
const updateCurrentControlFormulas = (state, params) => {
        let type = params.type;
        let typeProp = params.typeProp;
        let value = params.value;
        let instance = params.instance
        Vue.set(state.editor[instance].currentSelectedControl.formulas[type], typeProp, value);
    }
    // hàm xóa control đang chọn ra khỏi store
const resetCurrentControl = (state, params) => {

    let currentSelectedControl = {
        // control đang được click bởi người dùng
        properties: {
            name: {},
            display: {},
            print: {},
            table: {},

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
            if (name == 'name' && state.editor[instance].currentSelectedControl['properties']['name'].hasOwnProperty(name)) {
                Vue.set(state.editor[instance].currentSelectedControl['properties']['name'][name], type, value);
            }
            Vue.set(state.editor[instance].allControl[tableId]['listFields'][id]['properties'][name], type, value);
        } else if (state.editor[instance].allControl[tableId]['listFields'][id]['formulas'][name]) {
            if (value.trim() == "") {
                Vue.set(state.editor[instance].allControl[tableId]['listFields'][id]['formulas'][name], "formulasId", 0);
            }
            Vue.set(state.editor[instance].allControl[tableId]['listFields'][id]['formulas'][name], type, value);
        }

    } else {
        if (state.editor[instance].allControl[id]['properties'][name]) {
            if (name == 'name') {
                Vue.set(state.editor[instance].currentSelectedControl['properties']['name'][name], type, value);
            }
            Vue.set(state.editor[instance].allControl[id]['properties'][name], type, value);
        } else if (state.editor[instance].allControl[id]['formulas'][name]) {
            if (value.trim() == "") {
                Vue.set(state.editor[instance].allControl[id]['formulas'][name], "formulasId", 0);
            }
            Vue.set(state.editor[instance].allControl[id]['formulas'][name], type, value);
        }
    }

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
    let allControl = util.cloneDeep(state.editor[instance].allControl);
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
    Vue.set(state.editor[instance], 'allControl', allControl);


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
    let instance = params.instance;
    if (state.submit[instance].listInputInDocument.hasOwnProperty(controlName)) {
        Vue.set(state.submit[instance].listInputInDocument[controlName], key, value);
    }
}


const addToDocumentSubmitStore = (state, params) => {
    let key = params.key
    let value = params.value
    let instance = params.instance
    if (state.submit.hasOwnProperty(instance)) {
        Vue.set(state.submit[instance], key, value);
    }
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
        docStatus: 'init',
        SQLLiteDB: {},
        rootControl: {},
        impactedFieldsList: {},
        impactedFieldsListWhenStart: {},
        rootChangeFieldName: null,
        currentTableInteractive: null,
        currentControlAutoComplete: null,
        submitFormulas: null,
        listUser: null,
        localRelated: {},
        workflowVariable: {},
        currentControlEditByUser: null,
        autocompleteData: { // lưu lại các giá trị của autocomplete khi đã gõ
            controlName: {
                header: [],
                cacheData: {
                    letter: { // giá trị nhập và dữ liệu tương ứng
                        data: []
                    }
                }
            }
        },
        orgchartTableSqlName: {},
        tableLoaded: {},
        readyLoaded: false,
        listTableRootControl: {}
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
        allControlForTableOption: [],
        listDataFlow: []
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
const updateCurrentControlEditByUser = (state, params) => {
    let currentControl = params.currentControl;
    let instance = params.instance;
    console.log(state.submit);
    Vue.set(state.submit[instance], 'currentControlEditByUser', currentControl);
}
const addToRelatedLocalFormulas = (state, params) => {
    let key = params.key
    let instance = params.instance;
    let curListRelate = state.submit[instance].localRelated;

    let value = params.value
    for (let index = 0; index < value.length; index++) {
        let element = value[index];
        element = element.trim();
        if (!curListRelate.hasOwnProperty(element)) {
            curListRelate[element] = [];
        }
        curListRelate[element].push(key);
    }

    Vue.set(state.submit[instance], 'localRelated', curListRelate);
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
const cacheDataAutocomplete = (state, params) => {
        let controlName = params.controlName
        let header = params.header
        let cacheData = params.cacheData
        let object = { header: header, cacheData: cacheData }
        let instance = params.instance;
        if (state.submit[instance]['autocompleteData'].hasOwnProperty(controlName)) {
            Vue.set(state.submit[instance]['autocompleteData'][controlName]['cacheData'], Object.keys(cacheData)[0], Object.values(cacheData)[0]);
            if (state.submit[instance]['autocompleteData'][controlName]['header'].length == 0) {
                Vue.set(state.submit[instance]['autocompleteData'][controlName], 'header', header);
            }
        } else {
            Vue.set(state.submit[instance]['autocompleteData'], controlName, object);
        }

    }
    /**
     * Hàm update dữ liệu vào danh sách các control root trong table
     * @param {*} state 
     * @param {*} params 
     */
const updateDataToTableControlRoot = (state, params) => {
    let controlName = params.controlName;
    let tableName = params.tableName;
    let value = params.value;
    let instance = params.instance;
    Vue.set(state.submit[instance]['listTableRootControl'][tableName], controlName, value);

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
    addToDocumentSubmitStore,
    addToDocumentDetailStore,
    changeViewType,
    addToDocumentPropsEditor,
    addToDocumentEditorStore,
    setAllDocuments,
    resetCurrentControl,
    updateCurrentControlProps,
    updateCurrentControlFormulas,
    addToRelatedLocalFormulas,
    setDefaultSubmitStore,
    setDefaultEditorStore,
    setDefaultDetailStore,
    updateCurrentControlEditByUser,
    cacheDataAutocomplete,
    updateDataToTableControlRoot

};