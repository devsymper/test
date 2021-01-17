import { SYMPER_APP } from '@/main.js'

export const DateCellRenderer =()=> {}

DateCellRenderer.prototype.init = function(params) {
    if(!params.node.rowPinned){
        this.eGui = document.createElement('div');
        let value = (params.value) ? params.value : '<span style="color: #ababab;font-size: 11px;">DD/MM/YYYY</span>';
        let pattern = params.control.controlProperties.formatDate.value;
        console.log(pattern,'patternpattern');
        let div = `<div style="position:relative;height:100%;width:100%;">` + value + `
                        <span style="position: absolute;right:8px;top:2px;font-size: 14px;color: #ababab;" class="mdi mdi-calendar"></span>
                    </div>`
        this.eGui.innerHTML = div;
        this.eGui.classList.add('ag-input-date');
        this.eGui.addEventListener('click', function(e){
            let event = e;
            event.controlName = params.control.name
            SYMPER_APP.$evtBus.$emit('document-submit-date-input-click', event);
        });
    }
    
}


DateCellRenderer.prototype.getGui = function(params) {
    return this.eGui;
}

DateCellRenderer.prototype.destroy = function(params) {
    this.eGui.removeEventListener('click', (event));
}
