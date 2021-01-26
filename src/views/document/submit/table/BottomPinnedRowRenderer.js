
var numbro = require("numbro");

export const BottomPinnedRowRenderer = ()=> {
}

// init method gets the details of the cell to be renderer
BottomPinnedRowRenderer.prototype.init = function(params) {
    this.eGui = document.createElement('div');
    let control = params.control;
    if(typeof params.value == 'object'){
        let count = this.getCount(params.value);
        let optionEl = `<option value="sum">
                        <span>Count: </span>
                        <span>`+count+`</span>
                        </option>`
        if(['number','percent'].includes(control.type)){
            let sum = this.getSum(params.value);
            let avg = this.getAvg(sum,count);
            if(control.controlProperties.formatNumber.value){
                sum = numbro(sum).format(control.controlProperties.formatNumber.value);
                avg = numbro(avg).format(control.controlProperties.formatNumber.value);
            }    
            let numberOpEl = `
                <option value="avg">
                <span>Sum: </span>
                <span>`+sum+`</span>
                </option>
                <option value="count">
                <span>Avg: </span>
                <span>`+avg+`</span>
                </option>
            `;
            optionEl = numberOpEl + optionEl;
        }
        let el = `
            <div class="select-table-bottom">
                <select class="w-100">
                    `+optionEl+`
                </select>
                <span style="position: absolute;right:8px;top:2px;font-size: 10px;color: #ababab;">▼</span>
            <div>
            `
        this.eGui.innerHTML = el;
    }
    else{
        this.eGui.innerHTML = "";
    }
};

BottomPinnedRowRenderer.prototype.getGui = function() {
    return this.eGui;
};
BottomPinnedRowRenderer.prototype.getSum = function(array) {
    return array.reduce((a, b) => Number(a) + Number(b));
};
BottomPinnedRowRenderer.prototype.getCount = function(array) {
    return array.length;
};
BottomPinnedRowRenderer.prototype.getAvg = function(sum, length) {
    return sum/length;
};
