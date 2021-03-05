export default class BaseCellRenderer{
    init(params){
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = params.value;
        if(params.control.tableCellHistoryData['row_'+params.rowIndex]){
            this.eGui.classList.add('info-control-btn');
            this.eGui.setAttribute('rowIndex',params.rowIndex);
            this.eGui.setAttribute('data-control',params.control.name);
            this.eGui.style.height = '100%'
        }
    }
    getGui(){
        return this.eGui;
    }
    destroy(params) {
        
    }
}