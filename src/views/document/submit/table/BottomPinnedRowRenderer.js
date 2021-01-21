

export const BottomPinnedRowRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
BottomPinnedRowRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('div');
    console.log(params,'xxxxxxxxxxxx');
    if(params.rowIndex == params.api.getDisplayedRowCount()){
        this.eGui.innerHTML = params.value;
    }
};

BottomPinnedRowRenderer.prototype.getGui = function() {
    return this.eGui;
};
