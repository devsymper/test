import Control from "./control";
export default class TableControl extends Control {
    constructor(idField, ele, controlProps, curParentInstance) {
        super(idField, ele, controlProps, curParentInstance);
    }
    initTableControl() {

        this.init();
        /**
         * Chứa instance của table, mặc địn là null, control có type là table mới khác null
         */
        this.tableInstance = null;
        /**
         * tên các control nằm trong control này, mặc định là null, nếu control là table thì mới có giá trị là {'tên control':true}
         */
        this.listInsideControls = null;
        this.ele.wrap('<span style="position:relative;display: block;" class="wrap-table">');

    }
    renderTable() {
        this.tableInstance.render();

    }
    setData(data) {
        for (let controlName in data) {
            let dataControl = data[controlName];
            let vls = [];
            for (let index = 0; index < dataControl.length; index++) {
                let row = dataControl[index];
                if (row == null || row == 'null')
                    row = '';
                vls.push([index, controlName, row]);
            }
            this.tableInstance.tableInstance.setDataAtRowProp(vls, null, null, 'auto_set');
        }

    }

}