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
        try {
            let value = (params.value) ? JSON.parse(params.value) : null;
            let countFile = (value && value.length > 0) ? '<span style="font-size:12px">'+value.length + ' files </span>' : "+";
            let div = `
                    <div class="file-add" title="Thêm file" style="font-size: 20px;
                    text-align: center;
                    line-height: 18px;" >
                        `+countFile+`
                    </div>
                `;
            this.eGui.innerHTML = div;
            this.eGui.querySelector('.file-add').addEventListener('click', function(e){
                SYMPER_APP.$evtBus.$emit('document-submit-add-file-click', {
                    control:control
                })
            } );
        } catch (error) {
            console.warn(error);
        }
        
        
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