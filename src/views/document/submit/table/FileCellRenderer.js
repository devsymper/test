import { SYMPER_APP } from '@/main.js'
let fileTypes = {
    'xlsx': 'mdi-microsoft-excel',
    'txt': 'mdi-file-document-outline',
    'csv': 'mdi-file-document-outline',
    'pdf': 'mdi-file-pdf-outline',
    'mp3': 'mdi-radio',
    'rar': 'mdi-folder-zip-outline',
    'zip': 'mdi-folder-zip-outline',
    'docx': 'mdi-file-word-outline',
    'doc': 'mdi-file-word-outline',
    'pptx': 'mdi-microsoft-powerpoint',

    'mp4': 'mdi-file-video-outline',
    'webm': 'mdi-file-video-outline',
    'flv': 'mdi-file-video-outline',
    'mov': 'mdi-file-video-outline',
    'mpg': 'mdi-file-video-outline',
    'm4v': 'mdi-file-video-outline',
    '3gv': 'mdi-file-video-outline',

    'jpg': 'mdi-file-image',
    'png': 'mdi-file-image',
    'gif': 'mdi-file-image',
    'svg': 'mdi-file-image',

    'js': 'mdi-file-code-outline',
    'php': 'mdi-file-code-outline',
    'html': 'mdi-file-code-outline',
    'py': 'mdi-file-code-outline',
    'java': 'mdi-file-code-outline',
    'sql': 'mdi-file-code-outline',
};

// FileCellRenderer
export const FileCellRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
FileCellRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    if(!params.node.rowPinned){
        let control = params.control;
        let div = `
                <div class="file-add" title="Thêm file" >
                    <span class="text-show"><span class="mdi mdi-plus"></span></span>
                </div>
            `;
        let url = '';
        let ext = url.split('.').pop();
        let icon = fileTypes[ext] ? fileTypes[ext] : 'mdi-file-document-outline';
        let fileEl = "";
        if(params.value){
            fileEl = `<div title="${url}" class="file-item">
                <span title="xóa" data-item="`+url+`" class="remove-file"><span class="mdi mdi-close"></span></span>
                <i  onclick="window.open('`+url+`');" class="mdi ` + icon + ` file-view" ></i>
            </div>`
        }
        let template = `<div class="upload-file-wrapper-outtb">${div}
            ${fileEl}
        </div>`
        this.eGui.innerHTML = template;
        this.eGui.querySelector('.file-add').addEventListener('click', function(e){
            SYMPER_APP.$evtBus.$emit('document-submit-add-file-click', {
                control:control
            })
        } );
    }
    
};

FileCellRenderer.prototype.getGui = function() {
    return this.eGui;
};
FileCellRenderer.prototype.destroy = function() {
    if(this.eGui){
        this.eGui.querySelector('.file-add').removeEventListener('click',(event));
    }
};