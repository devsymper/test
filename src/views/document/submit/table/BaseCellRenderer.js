export default class BaseCellRenderer{
    init(params){
        this.eGui = document.createElement('div');
        let value = (params.value) ? params.value : "";
        let control = params.control;
        let dotIcon = `<div style="position:relative;height:100%;width:100%;">` + value + control.makeErrNoti(params.rowIndex) + `</div>`
        control.optionValues['Require'] = {};
        control.optionValues['Require'][params.rowIndex] = {
            isValid:false
        }
        control.optionValues['RequireChange'] = {};
        control.optionValues['RequireChange'][params.node.id] = {
            isValid:false
        }
        this.eGui.innerHTML = value;
        if(value == ""){
            if(control.isRequiredControl()){
                this.eGui.innerHTML = dotIcon;
                control.optionValues['Require'][params.rowIndex] = {
                    isValid:true,
                    msg:'Không được bỏ trống trường thông tin '+control.title
                }
            }
        }
        else {
            if(control.optionValues['Validate'] && control.optionValues['Validate'][params.rowIndex] && control.optionValues['Validate'][params.rowIndex].isValid){
                this.eGui.innerHTML = dotIcon;
            }
        }
        if(control.tableCellHistoryData['row_'+params.rowIndex]){
            this.eGui.classList.add('info-control-btn');
            this.eGui.setAttribute('rowIndex',params.rowIndex);
            this.eGui.setAttribute('data-control',control.name);
            this.eGui.style.height = '100%'
        }
        if(control.checkProps('isRequireChange')){
            if(control.oldValue){
                if(control.oldValue[params.node.id] == value){
                    control.optionValues['RequireChange'][params.rowIndex] = {
                        isValid:true,
                        msg:'Yêu cầu thay đổi giá trị trường '+control.title
                    }
                    this.eGui.innerHTML = dotIcon;
                }
            }
            
        }

    }
    getGui(){
        return this.eGui;
    }
    destroy(params) {
        
    }
}