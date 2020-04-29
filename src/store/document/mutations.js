import { getIconFromType } from './../../components/document/controlPropsFactory.js';
import { defaultState } from "./defaultState";
const addControl = (state, params) => {
    console.log(state.editor.allControl);
    let id = params.id
    let prop = params.props
    state.editor.allControl[id] = prop;
    setTreeListControlInDoc(state);
};

const restoreState = (state) => {
    state.editor.allControl = {};
    state.editor.currentSelectedControl = {};
    setTreeListControlInDoc(state)
}

function setTreeListControlInDoc(state) {
    let treeData = [{
        name: 'Control',
        icon: 'icon/ic_image.png',
        children: [

        ],
    }];
    // tạo cây ở đây
    let allControl = state.editor.allControl;
    for (let controlId in allControl) {
        let control = allControl[controlId];
        let type = control.type;
        let props = control.properties;
        let title = props.title.value;
        let name = props.name.value;
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
    state.editor.currentSelectedControl['properties'] = control.properties
    state.editor.currentSelectedControl['formulas'] = control.formulas

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