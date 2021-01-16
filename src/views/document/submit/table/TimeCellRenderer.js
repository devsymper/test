import { SYMPER_APP } from '@/main.js'

export const TimeCellRenderer =()=> {}

TimeCellRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    this.eGui.placeholder = "HH:mm:ss";
    let value = (params.value) ? params.value : "";
    this.eGui.classList.add('ag-input-time');
    this.eGui.innerHTML = value;
    this.eGui.addEventListener('click', function(e){
        let event = e;
        event.controlName = params.controlName
        event.curTarget = event.target;
        console.log(event,'xxxx');
        SYMPER_APP.$evtBus.$emit('document-submit-show-time-picker', event);
    });
}


TimeCellRenderer.prototype.getGui = function(params) {
    return this.eGui;
}

TimeCellRenderer.prototype.destroy = function(params) {
    this.eGui.removeEventListener('click', (event));
}
