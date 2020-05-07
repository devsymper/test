import { getIconFromType } from './../../components/document/controlPropsFactory.js';
import { defaultState } from "./defaultState";
import Vue from "vue";

const addControl = (state, params) => {
    let id = params.id
    let prop = params.props
        // state.editor.allControl[id] = prop;
    Vue.set(state.editor.allControl, id, prop);
    setTreeListControlInDoc(state);
};

const restoreState = (state) => {
    state.editor.allControl = {};
    state.editor.currentSelectedControl = { formulas: {}, properties: { name: {}, display: {}, print: {} }, type: '' };
    setTreeListControlInDoc(state)
}

// ham xây dựng dữ liệu cho treeview ở bên sidebar trái khi thay đổi thuộc tính control
function setTreeListControlInDoc(state) {
    let treeData = [{
        name: 'Control',
        icon: 'icon/ic_image.png',
        children: [

        ],
    }];
    let allControl = state.editor.allControl;
    for (let controlId in allControl) {
        let control = allControl[controlId];
        let type = control.type;
        let props = control.properties;
        let name = "";
        let title = "";
        if (type == 'submit' || type == 'draft') {
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
                let item = { name: childName + " - " + childTitle, icon: getIconFromType(childType) }
                children.push(item)
            }
            treeData[0].children.push({ name: name + " - " + title, icon: getIconFromType(type), children: children })
        } else {
            treeData[0].children.push({ name: name + " - " + title, icon: getIconFromType(type) })
        }
    }
    state.editor.listControlTreeData = treeData;
}

const addControlToTable = (state, params) => {
    let id = params.id
    let prop = params.props
    let tableId = params.tableId
    if (state.editor.allControl[tableId]['listFields']) {
        state.editor.allControl[tableId]['listFields'][id] = prop
    } else {
        state.editor.allControl[tableId]['listFields'] = {};
        state.editor.allControl[tableId]['listFields'][id] = prop
    }
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

};

const updateProp = (state, params) => {
    let id = params.id
    let name = params.name
    let value = params.value
    let tableId = params.tableId

    if (tableId != '0') {
        if (state.editor.allControl[tableId]['listFields'][id]['properties'][name]) {
            state.editor.allControl[tableId]['listFields'][id]['properties'][name]['value'] = value

        } else if (state.editor.allControl[tableId]['listFields'][id]['formulas'][name]) {
            state.editor.allControl[tableId]['listFields'][id]['formulas'][name]['value'] = value
        }

    } else {
        if (state.editor.allControl[id]['properties'][name]) {
            state.editor.allControl[id]['properties'][name]['value'] = value
        } else if (state.editor.allControl[id]['formulas'][name]) {
            state.editor.allControl[id]['formulas'][name]['value'] = value
        }
    }
    console.log(params);

    setTreeListControlInDoc(state);
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


export {
    addControl,
    addCurrentControl,
    addControlToTable,
    updateProp,
    minimizeControl,
    restoreState
};