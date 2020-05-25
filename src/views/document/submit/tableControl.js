import Control from "./control";
import './customControl.css';
export default class TableControl extends Control {
    constructor(ele, controlProps, curParentInstance) {
        super(ele, controlProps, curParentInstance);
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

    }
    renderTable() {
        this.tableInstance.render();
    }
}