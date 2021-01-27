import { SYMPER_APP } from '@/main.js'

export const DateCellRenderer =()=> {}

DateCellRenderer.prototype.init = function(params) {
    if(!params.node.rowPinned){
        this.eGui = document.createElement('div');
        let value = (params.value) ? params.value : '<span style="color: #ababab;font-size: 11px;">DD/MM/YYYY</span>';
        let control = params.control;
        let pattern = control.controlProperties.formatDate.value;
        if(pattern && params.value){
            value = SYMPER_APP.$moment(value, 'YYYY-MM-DD').format(pattern);
        }
        control.optionValues['Require'] = {};
        control.optionValues['Require'][params.rowIndex] = {
            isValid:false
        }
        let validateEle = ((control.isRequiredControl() && !params.value) || 
        (control.optionValues['Validate'] && control.optionValues['Validate'][params.rowIndex]
        && control.optionValues['Validate'][params.rowIndex].isValid)) ? control.makeErrNoti(params.rowIndex) : '';
        let div = `<div style="position:relative;height:100%;width:100%;">` + value + validateEle+`
                        <span style="position: absolute;right:8px;top:2px;font-size: 14px;color: #ababab;" class="mdi mdi-calendar"></span>
                    </div>`
        if(control.isRequiredControl()){
            control.optionValues['Require'][params.rowIndex] = {
                isValid:true,
                msg:'Không được bỏ trống trường thông tin '+control.title
            }
        }
        this.eGui.innerHTML = div;
        this.eGui.classList.add('ag-input-date');
        this.eGui.addEventListener('dblclick', function(e){
            let event = e;
            if(event.target.classList.contains('validate-icon')){
                return false;
            }
            event.controlName = params.control.name;
            SYMPER_APP.$evtBus.$emit('document-submit-date-input-click', event);
        });
    }
    
}


DateCellRenderer.prototype.getGui = function(params) {
    return this.eGui;
}

DateCellRenderer.prototype.destroy = function(params) {
    if(this.eGui && params && !params.node.rowPinned){
        this.eGui.removeEventListener('dblclick', (event));
    }
    
}
