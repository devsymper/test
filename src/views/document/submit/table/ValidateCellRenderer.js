/**
 * validate renderer
 */
export const ValidateCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
ValidateCellRenderer.prototype.init = function(params) {
    if(!params.node.rowPinned){
        this.eGui = document.createElement('span');
        let value = (params.value) ? params.value : "";
        this.params = params;
        
        let control = params.control;
        if(control.isRequiredControl() && value == ""){
            let div = `<div style="position:relative;height:100%;width:100%;">` + value + control.makeErrNoti(params.rowIndex) + `</div>`
            this.eGui.innerHTML = div;
        }
        else{
            this.eGui.innerHTML = value;
        }
        
    }
    
};

ValidateCellRenderer.prototype.getGui = function() {
    return this.eGui;
};