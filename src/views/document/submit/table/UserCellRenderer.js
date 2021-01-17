import sDocument from '@/store/document';

// cell renderer class
export const UserCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
UserCellRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    let control = params.control;
    let mapIdToUsers = sDocument.state.submit[control.curParentInstance].mapValueToTextAutocompleteInput[control.name];
    var text = (params.value) ? mapIdToUsers[params.value] : '';
    this.eGui.innerHTML = text;
};

UserCellRenderer.prototype.getGui = function() {
    return this.eGui;
};


