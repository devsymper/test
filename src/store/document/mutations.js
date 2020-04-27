const addControl = (state, params) => {
    console.log(params);
    let id = params.id
    let prop = params.props

    state.editor.allControl[id] = prop;
};
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

}

export {
    addControl,
    addCurrentControl,
    addControlToTable,
    updateProp,
    minimizeControl
};