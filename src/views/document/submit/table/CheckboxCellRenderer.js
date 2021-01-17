
/**
 * Checkbox renderer
 */
export const CheckboxCellRenderer =()=> {}

CheckboxCellRenderer.prototype.init = function(params) {
    if(!params.node.rowPinned){
        this.eGui = document.createElement('input');
        this.params = params;
        this.eGui.type = 'checkbox';
        this.eGui.checked = params.value;
        this.checkedHandler = this.checkedHandler.bind(this);
        this.eGui.addEventListener('click', this.checkedHandler);
    }
    
}

CheckboxCellRenderer.prototype.checkedHandler = function(e) {
    let checked = e.target.checked;
    let colId = this.params.column.colId;
    this.params.node.setDataValue(colId, checked);
}

CheckboxCellRenderer.prototype.getGui = function(params) {
return this.eGui;
}

CheckboxCellRenderer.prototype.destroy = function(params) {
this.eGui.removeEventListener('click', this.checkedHandler);
}