import sDocument from '@/store/document';

// cell renderer class
export const AutoCompleteCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
AutoCompleteCellRenderer.prototype.init = function(params) {
    if(!params.node.rowPinned){
        this.eGui = document.createElement('span');
        let control = params.control;
        let mapValueToText = sDocument.state.submit[control.curParentInstance].mapValueToTextAutocompleteInput[control.name];
        var text = (params.value && mapValueToText && mapValueToText[params.value]) ? mapValueToText[params.value] : params.value;
        if(!text){
            text = ""
        }
        control.optionValues['Require'] = {};
        control.optionValues['Require'][params.rowIndex] = {
            isValid:false
        }
        if(!text){
            let validateEle = (control.isRequiredControl()) ? control.makeErrNoti(params.rowIndex) : '';
            let userEle = (control.type == 'user') ? '<span style="position: absolute;right:8px;top:2px;font-size: 14px;color: #ababab;" class="mdi mdi-account-search-outline"></span>' : ''
            let div = `<div style="position:relative;height:100%;width:100%;">` + text +validateEle+ userEle+`</div>`
            this.eGui.innerHTML = div;

            if(control.isRequiredControl()){
                control.optionValues['Require'][params.rowIndex] = {
                    isValid:true,
                    msg:'Không được bỏ trống trường thông tin '+control.title
                }
            }
        }
        else{
            this.eGui.innerHTML = text;
            for (let index = 0; index < control.validateMessageType.length; index++) {
                const type = control.validateMessageType[index];
                if(control.optionValues[type] && control.optionValues[type][params.rowIndex] && control.optionValues[type][params.rowIndex].isValid){
                    let div = `<div style="position:relative;height:100%;width:100%;">` + text + control.makeErrNoti(params.rowIndex) + `</div>`
                    this.eGui.innerHTML = div;
                    break;
                }
            }
        }
    }
};

AutoCompleteCellRenderer.prototype.getGui = function() {
    return this.eGui;
};


