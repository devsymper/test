var numbro = require("numbro");
export const NumberCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
NumberCellRenderer.prototype.init = function(params) {
    if(!params.node.group){
        this.eGui = document.createElement('span');
        var text = (params.value) ? params.value : 0;
        let control = params.control;
        if(isNaN(Number(text))){
            this.eGui.style.background = 'red'
        }
        text = numbro(Number(text)).format(control.controlProperties.formatNumber.value)
        console.log(control,'controlcontrol');
        control.optionValues['Require'] = {};
        control.optionValues['Require'][params.rowIndex] = {
            isValid:false
        }
        if(!text){
            let validateEle = ((control.isRequiredControl() && !params.node.rowPinned) || 
            (control.optionValues['Validate'] && control.optionValues['Validate'][params.rowIndex] && 
            control.optionValues['Validate'][params.rowIndex].isValid)) ? control.makeErrNoti(params.rowIndex) : '';
            if(validateEle){
                text = "";
            }
            if(control.isRequiredControl()){
                control.optionValues['Require'][params.rowIndex] = {
                    isValid:true,
                    msg:'Không được bỏ trống trường thông tin '+control.title
                }
            }
            let div = `<div style="position:relative;height:100%;width:100%;">` + text + validateEle +`</div>`
            this.eGui.innerHTML = div;
        }
        else{
            this.eGui.innerHTML = text;
        }
    }
    
};

NumberCellRenderer.prototype.getGui = function() {
    return this.eGui;
};
