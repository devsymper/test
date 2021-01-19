import { SYMPER_APP } from '@/main.js'

/**
 * Select renderer
 */
export const SelectCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
SelectCellRenderer.prototype.init = function(params) {
    if(!params.node.rowPinned){
        this.eGui = document.createElement('span');
        let value = (params.value) ? params.value : "";
        let control = params.control;
        this.params = params;
        control.optionValues['Require'] = {};
        control.optionValues['Require'][params.rowIndex] = {
            isValid:false
        }
        let validateEle = ((control.isRequiredControl() && !value) || 
        (control.optionValues['Validate'] && control.optionValues['Validate'][params.rowIndex]
        && control.optionValues['Validate'][params.rowIndex].isValid)) ? control.makeErrNoti(params.rowIndex) : '';
        let div = `<div class="select-cell" style="position:relative;height:22px;width:100%;">` + value +validateEle+ `
                        <span class="select-chervon-bottom" style="position: absolute;right:8px;top:2px;font-size: 10px;color: #ababab;">▼</span>
                    </div>`
        this.eGui.innerHTML = div;
        if(control.isRequiredControl()){
            control.optionValues['Require'][params.rowIndex] = {
                isValid:true,
                msg:'Không được bỏ trống trường thông tin '+control.title
            }
        }
        this.eGui.querySelector('.select-chervon-bottom').addEventListener('click', function(e){
            if(e.target.classList.contains('validate-icon')){
                return false;
            }
            SYMPER_APP.$evtBus.$emit('document-submit-select-input', {
                e: e,
                controlName: control.name,
                rowIndex:[params.rowIndex]
            })
        } );
    }
    
};

SelectCellRenderer.prototype.getGui = function() {
    return this.eGui;
};

SelectCellRenderer.prototype.destroy = function() {
    if(this.eGui && !this.params.node.rowPinned){
        this.eGui.querySelector('.select-chervon-bottom').removeEventListener('click',(event));
    }
};