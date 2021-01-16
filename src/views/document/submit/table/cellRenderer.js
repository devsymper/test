
// cell renderer class
import sApp from '@/store/app';
let mapIdToUsers = sApp.state.mapIdToUsers;



// cell renderer class
export const UserRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
UserRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    var text = (params.value) ? mapIdToUsers(params.value)[params.display] : 0;
    this.eGui.innerHTML = text;
};

UserRenderer.prototype.getGui = function() {
    return this.eGui;
};



/**
 * percent cell renderer
 */
export const PercentRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
PercentRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('span');
    var text =  (params.value == "" || params.value == null || !/\d/.test(params.value)) ? "" : params.value + " %";
    this.eGui.innerHTML = text;
};

PercentRenderer.prototype.getGui = function() {
    return this.eGui;
};


/**
 * Checkbox renderer
 */
export const CheckboxRenderer =()=> {}

CheckboxRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('input');
    this.eGui.type = 'checkbox';
    this.eGui.checked = params.value;
    this.checkedHandler = this.checkedHandler.bind(this);
    this.eGui.addEventListener('click', this.checkedHandler);
}

CheckboxRenderer.prototype.checkedHandler = function(e) {
    let checked = e.target.checked;
    let colId = this.params.column.colId;
    this.params.node.setDataValue(colId, checked);
}

CheckboxRenderer.prototype.getGui = function(params) {
return this.eGui;
}

CheckboxRenderer.prototype.destroy = function(params) {
this.eGui.removeEventListener('click', this.checkedHandler);
}
/**
 * Date renderer
 */
export const DateRenderer =()=> {}

DateRenderer.prototype.init = function(params) {
this.eGui = document.createElement('span');
this.eGui.innerHTML = '21/12/2020';
this.checkedHandler = this.checkedHandler.bind(this);
this.eGui.addEventListener('click', this.checkedHandler);
}

DateRenderer.prototype.checkedHandler = function(e) {
//   let checked = e.target.checked;
//   let colId = this.params.column.colId;
//   this.params.node.setDataValue(colId, checked);
}

DateRenderer.prototype.getGui = function(params) {
return this.eGui;
}

DateRenderer.prototype.destroy = function(params) {
this.eGui.removeEventListener('click', this.checkedHandler);
}
/**
 * Time renderer
 */
export const TimeRenderer =()=> {}

TimeRenderer.prototype.init = function(params) {
this.eGui = document.createElement('span');
this.eGui.innerHTML = '21/12/2020';
this.checkedHandler = this.checkedHandler.bind(this);
this.eGui.addEventListener('click', this.checkedHandler);
}

TimeRenderer.prototype.checkedHandler = function(e) {
//   let checked = e.target.checked;
//   let colId = this.params.column.colId;
//   this.params.node.setDataValue(colId, checked);
}

TimeRenderer.prototype.getGui = function(params) {
return this.eGui;
}

TimeRenderer.prototype.destroy = function(params) {
this.eGui.removeEventListener('click', this.checkedHandler);
}



// FileRenderer
export const FileRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
FileRenderer.prototype.init = function(params) {
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
};

FileRenderer.prototype.getGui = function() {
    return this.eGui;
};