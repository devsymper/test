import { SYMPER_APP } from '@/main.js'

export const DateCellRenderer =()=> {}

DateCellRenderer.prototype.init = function(params) {
    if(!params.node.rowPinned){
        this.eGui = document.createElement('div');
        let control = params.control;
        let patternDateStr = (control.type == 'date' && control.controlProperties.formatDate.value) ? control.controlProperties.formatDate.value : "DD/MM/YYYY";
        let placeHolder = (control.type == 'date') ? patternDateStr : "DD/MM/YYYY HH:mm";
        let value = (params.value) ? params.value : '<span style="color: #ababab;font-size: 11px;">'+placeHolder+'</span>';
        if(control.type == 'date'){
            let pattern = control.controlProperties.formatDate.value;
            if(pattern && params.value){
                value = SYMPER_APP.$moment(value, 'YYYY-MM-DD').format(pattern);
            }
        }
        control.optionValues['Require'] = {};
        control.optionValues['Require'][params.node.id] = {
            isValid:false
        }
        let validateEle = ((control.isRequiredControl() && !params.value) || 
        (control.optionValues['Validate'] && control.optionValues['Validate'][params.node.id]
        && control.optionValues['Validate'][params.node.id].isValid)) ? control.makeErrNoti(params.node.id) : '';
        let div = `<div style="position:relative;height:100%;width:100%;">` + value + validateEle+`
                        <span style="position: absolute;right:8px;top:2px;font-size: 14px;color: #ababab;" class="mdi mdi-calendar"></span>
                    </div>`
        if(control.isRequiredControl() && !params.value){
            control.optionValues['Require'][params.node.id] = {
                isValid:true,
                msg:'Không được bỏ trống trường thông tin '+control.title
            }
        }
        this.eGui.innerHTML = div;
        if(control.tableCellHistoryData['row_'+params.rowIndex]){
            this.eGui.classList.add('info-control-btn');
            this.eGui.setAttribute('rowIndex',params.rowIndex);
            this.eGui.setAttribute('data-control',control.name);
            this.eGui.style.height = '100%'
        }
        this.eGui.classList.add('ag-input-date');
        this.eGui.addEventListener('dblclick', function(e){
            let event = e;
            if(event.target.classList.contains('validate-icon')){
                return false;
            }
            event.controlName = params.control.name;
            event.control = params.control;
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
