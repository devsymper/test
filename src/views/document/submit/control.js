import Formulas from "./formulas";

export default class Control {
    constructor(idField, ele, controlProps, curParentInstance) {
        /**
         * object các thuộc tính về hiển thị của control
         */
        this.controlProperties = controlProps.properties
            /**
             * Object các thuộc tính về công thức của control
             */
        this.controlFormulas = controlProps.formulas
            /**
             * jQueryObject tham chiếu tới DOM của control
             */
        this.ele = ele;
        /**
         * instance của submit hiện tại
         */
        this.curParentInstance = curParentInstance;
        /**
         * id của dòng dữ liệu trong bảng field, phục vụ cho việc lấy datapost submit
         */
        this.idField = idField;

    }
    init() {
        /**
         * mảng luu giá trị các control bị ảnh hưởng, chỉ ra control này thay đổi giá trị thì sẽ thay đổi theo các control nào
         */
        this.effectedControl = [];

        this.value = '';

        /**
         * Tên của control
         */
        this.name = (this.controlProperties.hasOwnProperty('name')) ? this.controlProperties.name.value : "";

        /**
         * id của control
         */
        this.id = this.ele.attr('id');

        /**
         * Loại control
         */
        this.type = this.ele.attr('s-control-type');


        /**
         * Danh sách các hàm sẽ thực thi khi kết thúc chuỗi chạy công thức mà bắt đầu từ control này
         */
        this.afterChainFormulaEnd = [];

        /**
         * Danh sách các control bị thay đổi giá trị, hoặc hiển thị... khi control này thay đổi giá trị
         */
        this.sourceControlNames = {
            validate: {},
            readonly: {},
            visibility: {},
            require: {},
            data: {}
        };
        this.initFormulas();

    }

    /**
     * Khởi tạo các formulas của từng control
     */
    initFormulas() {
        if (Object.keys(this.controlFormulas).length > 0) {
            for (let key in this.controlFormulas) {
                if (this.controlFormulas[key].value != "") {
                    this.controlFormulas[key]['instance'] = new Formulas(this.curParentInstance, this.controlFormulas[key].value, key);
                    // if (key == "formulas") {
                    //     this.controlFormulas[key]['instance'].findRootControl(this);
                    // }
                }
            }
        }


    }
    getEffectedControl() {
        return this.effectedControl;
    }
}