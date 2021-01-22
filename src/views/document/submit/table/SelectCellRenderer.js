import { SYMPER_APP } from '@/main.js'

/**
 * Select renderer
 */
export const SelectCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
SelectCellRenderer.prototype.init = function(params) {
    if(!params.node.rowPinned && !params.node.group){
        this.eGui = document.createElement('span');
        let value = (params.value) ? params.value : "";
        let control = params.control;
        this.params = params;
        control.optionValues['Require'] = {};
        control.optionValues['Require'][params.node.id] = {
            isValid:false
        }
        let validateEle = ((control.isRequiredControl() && !value) || 
        (control.optionValues['Validate'] && control.optionValues['Validate'][params.node.id]
        && control.optionValues['Validate'][params.node.id].isValid)) ? control.makeErrNoti(params.node.id) : '';
        let div = `<div class="select-cell" style="position:relative;height:22px;width:100%;">` + value +validateEle+ `
                        <span class="select-chervon-bottom" style="position: absolute;right:8px;top:2px;font-size: 10px;color: #ababab;">▼</span>
                    </div>`
        this.eGui.innerHTML = div;

        if(control.isRequiredControl() && !value){
            control.optionValues['Require'][params.node.id] = {
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
                rowNodeId:[params.node.id],
                type:control.type,
                isSingleSelect:(control.type == 'select') ? true : false
            })
        } );
        console.log(control,'controlcontrolcontrol');
    }
    
};

SelectCellRenderer.prototype.getGui = function() {
    return this.eGui;
};

SelectCellRenderer.prototype.destroy = function(params) {
    if(this.eGui && params && !params.node.rowPinned){
        this.eGui.querySelector('.select-chervon-bottom').removeEventListener('click',(event));
    }
};