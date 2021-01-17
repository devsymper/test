import { SYMPER_APP } from '@/main.js'

/**
 * Select renderer
 */
export const ValidateCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
ValidateCellRenderer.prototype.init = function(params) {
    if(!params.node.rowPinned){
        this.eGui = document.createElement('span');
        let value = (params.value) ? params.value : "";
        this.params = params;
        
        let control = params.control;
        if(control.isRequiredControl() && value == ""){
            let div = `<div style="position:relative;height:100%;width:100%;">` + value + `
                        <span class="validate-icon mdi mdi-alert-circle" style="position: absolute;right:8px;top:2px;font-size: 8px;color: red;"></span>
                    </div>`
            this.eGui.innerHTML = div;
            this.eGui.querySelector('.validate-icon').addEventListener('click', function(e){
                let msg = 'Không được bỏ trống'
                SYMPER_APP.$evtBus.$emit('document-submit-open-validate-message', {e:e,msg:msg});
            } );
        }
        else{
            this.eGui.innerHTML = value;
        }
        
    }
    
};

ValidateCellRenderer.prototype.getGui = function() {
    return this.eGui;
};

ValidateCellRenderer.prototype.destroy = function() {
    if(this.eGui && !this.params.node.rowPinned && this.eGui.querySelector('.validate-icon')){
        this.eGui.querySelector('.validate-icon').removeEventListener('click',(event));
    }
};