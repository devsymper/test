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
        let dotIcon = `<div style="position:relative;height:100%;width:100%;">` + value + control.makeErrNoti(params.rowIndex) + `</div>`
        control.optionValues['Require'] = {};
        control.optionValues['Require'][params.rowIndex] = {
            isValid:false
        }
        if(value == ""){
            if(control.isRequiredControl()){
                this.eGui.innerHTML = dotIcon;
                control.optionValues['Require'][params.rowIndex] = {
                    isValid:true,
                    msg:'Không được bỏ trống trường thông tin '+control.title
                }
            }
            else{
                this.eGui.innerHTML = value;
            }
        }
        else {
            if(control.optionValues['Validate'] && control.optionValues['Validate'][params.rowIndex] && control.optionValues['Validate'][params.rowIndex].isValid){
                this.eGui.innerHTML = dotIcon;
            }
            else{
                this.eGui.innerHTML = value;
            }
        }
        
    }
    
};

ValidateCellRenderer.prototype.getGui = function() {
    return this.eGui;
};