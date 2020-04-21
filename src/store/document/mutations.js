const addControl = (state, params) => {
    console.log(params);
    let id = params.id
    let prop = params.props

    state.editor.allControl[id] = prop;
};
const addCurrentControl = (state, control) => {
    console.log(control.formulas);

    state.editor.currentSelectedControl['properties'] = control.properties
    state.editor.currentSelectedControl['formulas'] = control.formulas
};

export {
    addControl,
    addCurrentControl,
};