export default class Control {
    constructor(ele, controlProps, curParentInstance) {
        /**
         * Gía trị gốc của control, được set bởi BA
         */
        this.controlProperties = controlProps.properties
        this.controlFormulas = controlProps.formulas
            /**
             * jQueryObject tham chiếu tới DOM của control
             */
        this.ele = ele;
        /**
         * instance của submit hiện tại
         */
        this.curParentInstance = curParentInstance;

    }
    init() {
        this.value = '';

        /**
         * Tên của control
         */
        this.name = this.controlProperties.name.value;

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
    }

}