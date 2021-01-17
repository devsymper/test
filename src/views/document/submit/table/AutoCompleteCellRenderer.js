import sDocument from '@/store/document';

// cell renderer class
export const AutoCompleteCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
AutoCompleteCellRenderer.prototype.init = function(params) {
    if(!params.node.rowPinned){
        this.eGui = document.createElement('span');
        let control = params.control;
        let mapValueToText = sDocument.state.submit[control.curParentInstance].mapValueToTextAutocompleteInput[control.name];
        var text = (params.value) ? mapValueToText[params.value] : '';
        this.eGui.innerHTML = text;
    }
};

AutoCompleteCellRenderer.prototype.getGui = function() {
    return this.eGui;
};


