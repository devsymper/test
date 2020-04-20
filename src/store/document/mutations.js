const addControl = (state, id, prop) => {
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