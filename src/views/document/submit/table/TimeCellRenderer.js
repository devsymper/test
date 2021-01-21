import { SYMPER_APP } from '@/main.js'

export const TimeCellRenderer =()=> {}

TimeCellRenderer.prototype.init = function(params) {
    if(!params.node.rowPinned){
        this.eGui = document.createElement('span');
        this.eGui.placeholder = "HH:mm:ss";
        let value = (params.value) ? params.value : "";
        this.eGui.classList.add('ag-input-time');
        let control = params.control;
        control.optionValues['Require'] = {};
        control.optionValues['Require'][params.rowIndex] = {
            isValid:false
        }
        if(!value){
            let validateEle = (control.isRequiredControl() || 
            (control.optionValues['Validate'] && control.optionValues['Validate'][params.rowIndex]
            && control.optionValues['Validate'][params.rowIndex].isValid)) ? control.makeErrNoti(params.rowIndex) : '';
            let div = `<div style="position:relative;height:100%;width:100%;">` + value + validateEle+`
                    <span style="position: absolute;right:8px;top:2px;font-size: 14px;color: #ababab;" class="mdi mdi-clock-time-two-outline"></span>
                </div>`
            this.eGui.innerHTML = div;
            if(control.isRequiredControl()){
                control.optionValues['Require'][params.rowIndex] = {
                    isValid:true,
                    msg:'Không được bỏ trống trường thông tin '+control.title
                }
            }
        }
        else{
            this.eGui.innerHTML = value;
        }

        this.eGui.addEventListener('dblclick', function(e){
            let event = e;
            if(event.target.classList.contains('validate-icon')){
                return false;
            }
            event.controlName = control.name
            event.curTarget = event.target;
            SYMPER_APP.$evtBus.$emit('document-submit-show-time-picker', event);
        });
    }
}


TimeCellRenderer.prototype.getGui = function(params) {
    return this.eGui;
}

TimeCellRenderer.prototype.destroy = function(params) {
    this.eGui.removeEventListener('dblclick', (event));
}
