import { SYMPER_APP } from '@/main.js'

/**
 * Select renderer
 */
export const SelectCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
SelectCellRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    let value = (params.value) ? params.value : "";
    let div = `<div class="select-cell" style="position:relative;height:22px;width:100%;">` + value + `
                    <span class="select-chervon-bottom" style="position: absolute;right:8px;top:2px;font-size: 10px;color: #ababab;">▼</span>
                </div>`
    this.eGui.innerHTML = div;
    let control = params.control;
    this.eGui.querySelector('.select-chervon-bottom').addEventListener('click', function(e){
        SYMPER_APP.$evtBus.$emit('document-submit-select-input', {
            e: e,
            controlName: control.name,
            rowIndex:[params.rowIndex]
        })
    } );
};

SelectCellRenderer.prototype.getGui = function() {
    return this.eGui;
};

SelectCellRenderer.prototype.destroy = function() {
    if(this.eGui){
        this.eGui.querySelector('.select-chervon-bottom').removeEventListener('click',(event));
    }
};