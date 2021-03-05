import sDocument from '@/store/document';

// cell renderer class
export const UserCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
UserCellRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('div');
    let control = params.control;
    let mapIdToUsers = sDocument.state.submit[control.keyInstance].mapValueToTextAutocompleteInput[control.name];
    var text = (params.value) ? mapIdToUsers[params.value] : '';
    let div = `<div style="position:relative;height:100%;width:100%;">` + text + `
                    <span style="position: absolute;right:8px;top:2px;font-size: 14px;color: #ababab;" class="mdi mdi-account-search-outline"></span>
                </div>`
    this.eGui.innerHTML = div;
    if(control.tableCellHistoryData['row_'+params.rowIndex]){
        this.eGui.classList.add('info-control-btn');
        this.eGui.setAttribute('rowIndex',params.rowIndex);
        this.eGui.setAttribute('data-control',control.name);
        this.eGui.style.height = '100%'
    }
};

UserCellRenderer.prototype.getGui = function() {
    return this.eGui;
};


