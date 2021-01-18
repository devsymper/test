
/**
 * percent cell renderer
 */
export const PercentCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
PercentCellRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    var text =  (params.value == "" || params.value == null || !/\d/.test(params.value)) ? "" : params.value + " %";
    let control = params.control;
    if(!text){
        let validateEle = (control.isRequiredControl() && !params.node.rowPinned) ? control.makeErrNoti(params.rowIndex) : '';
        let div = `<div style="position:relative;height:100%;width:100%;">` + text + validateEle+`
                <span style="position: absolute;right:8px;top:2px;font-size: 14px;color: #ababab;" class="mdi mdi-percent-outline"></span>
            </div>`
        this.eGui.innerHTML = div;
    }
    else{
        this.eGui.innerHTML = text;
    }

};

PercentCellRenderer.prototype.getGui = function() {
    return this.eGui;
};

