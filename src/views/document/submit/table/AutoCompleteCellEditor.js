import { SYMPER_APP } from '@/main.js'

// function to act as a class
export const  AutoCompleteCellEditor =()=> {
}
var KEY_BACKSPACE = 8;
var KEY_F2 = 113;
var KEY_DELETE = 46;

// gets called once before the renderer is used
AutoCompleteCellEditor.prototype.init = function(params) {
    this.eInput = document.createElement('input');
    if (params.value) {
        this.eInput.value = params.value;
    }
    
    this.params = params;
    
    this.eInput.classList.add('ag-input-field-input');
    this.eInput.classList.add('ag-text-field-input');
    this.eInput.style.height = 'inherit'
    var startValue;
    var keyPressBackspaceOrDelete =
        params.keyPress === KEY_BACKSPACE
        || params.keyPress === KEY_DELETE;

    if (keyPressBackspaceOrDelete) {
        startValue = '';
    } else if (params.charPress) {
        startValue = params.charPress;
    } else {
        startValue = params.value;
        if (params.keyPress !== KEY_F2) {
            this.highlightAllOnFocus = true;
        }
    }
    
    if (startValue !== null && startValue !== undefined) {
        this.eInput.value = startValue;
    }
    this.eInput.addEventListener('keydown', this.keyDownEventListener);
};
// gets called once when grid ready to insert the element
AutoCompleteCellEditor.prototype.getGui = function() {
    return this.eInput;
};
AutoCompleteCellEditor.prototype.getValue = function () {
    return this.eInput.value;
};

// focus and select can be done after the gui is attached
AutoCompleteCellEditor.prototype.afterGuiAttached = function() {
    this.eInput.focus();
};

AutoCompleteCellEditor.prototype.keyDownEventListener = function(e) {
    SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-key-event', {
        e: e,
        // autocompleteFormulasInstance: formulasInstance,
        // isSelect: false,
        // controlTitle: colHeaders[columnIndex],
        // controlName: controlName
    })
    
}
AutoCompleteCellEditor.prototype.getValue = function() {
    return this.eInput.value;
};
AutoCompleteCellEditor.prototype.destroy = function() {
    if(this.eInput){
        this.eInput.removeEventListener('keydown', this.keyDownEventListener);
    }
};