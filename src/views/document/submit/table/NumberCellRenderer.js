export const NumberCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
NumberCellRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    var text = (params.value) ? params.value : 0;
    this.eGui.innerHTML = text;
};

NumberCellRenderer.prototype.getGui = function() {
    return this.eGui;
};
