

export const BottomPinnedRowRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
BottomPinnedRowRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = params.value;
};

BottomPinnedRowRenderer.prototype.getGui = function() {
    return this.eGui;
};
