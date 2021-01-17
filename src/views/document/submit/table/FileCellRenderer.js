
// cell renderer class



// FileCellRenderer
export const FileCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
FileCellRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    let div = `
            <div class="file-add" title="Thêm file" >
                <span class="text-show"><span class="mdi mdi-plus"></span></span>
            </div>
        `;
    let icon = 'mdi-file-image';
    let url = '';
    let template = `<div class="upload-file-wrapper-outtb">${div}
        <div title="${url}" class="file-item">
            <span title="xóa" data-item="`+url+`" class="remove-file"><span class="mdi mdi-close"></span></span>
            <i  onclick="window.open('`+url+`');" class="mdi ` + icon + ` file-view" ></i>
        </div>
    </div>`
    this.eGui.innerHTML = template;
    let control = params.control;
    this.eGui.querySelector('.file-add').addEventListener('click', function(e){
        SYMPER_APP.$evtBus.$emit('document-submit-add-file-click', {
            control:control
        })
    } );
};

FileCellRenderer.prototype.getGui = function() {
    return this.eGui;
};
FileCellRenderer.prototype.destroy = function() {
    if(this.eGui){
        this.eGui.querySelector('.file-add').removeEventListener('click',(event));
    }
};