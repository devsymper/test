
/**
 * percent cell renderer
 */
export const PercentCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
PercentCellRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    var text =  (params.value == "" || params.value == null || !/\d/.test(params.value)) ? "" : params.value + " %";
    this.eGui.innerHTML = text;
};

PercentCellRenderer.prototype.getGui = function() {
    return this.eGui;
};

