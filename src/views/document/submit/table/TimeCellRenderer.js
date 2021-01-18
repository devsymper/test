import { SYMPER_APP } from '@/main.js'

export const TimeCellRenderer =()=> {}

TimeCellRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    this.eGui.placeholder = "HH:mm:ss";
    let value = (params.value) ? params.value : "";
    this.eGui.classList.add('ag-input-time');

    if(!value){
        let div = `<div style="position:relative;height:100%;width:100%;">` + value + `
                <span style="position: absolute;right:8px;top:2px;font-size: 14px;color: #ababab;" class="mdi mdi-clock-time-two-outline"></span>
            </div>`
        this.eGui.innerHTML = div;
    }
    else{
        this.eGui.innerHTML = value;
    }

    let control = params.control;
    this.eGui.addEventListener('click', function(e){
        let event = e;
        event.controlName = control.name
        event.curTarget = event.target;
        SYMPER_APP.$evtBus.$emit('document-submit-show-time-picker', event);
    });
}


TimeCellRenderer.prototype.getGui = function(params) {
    return this.eGui;
}

TimeCellRenderer.prototype.destroy = function(params) {
    this.eGui.removeEventListener('click', (event));
}
