import { SYMPER_APP } from '@/main.js'

export const DateCellRenderer =()=> {}

DateCellRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    this.eGui.placeholder = "DD/MM/YYYY";
    let value = (params.value) ? params.value : "";
    this.eGui.classList.add('ag-input-date');
    this.eGui.innerHTML = value;
    this.eGui.addEventListener('click', function(e){
        let event = e;
        event.controlName = params.controlName
        SYMPER_APP.$evtBus.$emit('document-submit-date-input-click', event);
    });
}


DateCellRenderer.prototype.getGui = function(params) {
    return this.eGui;
}

DateCellRenderer.prototype.destroy = function(params) {
    this.eGui.removeEventListener('click', (event));
}
