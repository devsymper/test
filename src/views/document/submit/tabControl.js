import LayoutControl from "./layoutControl";
export default class TabControl extends LayoutControl {
    constructor(idField, ele, controlProps, curParentInstance, value) {
        super(idField, ele, controlProps, curParentInstance, value);
    }
    render() {
        this.renderTabControl();

    }
    renderTabControl() {
        if (this.controlProperties['isHidden'] != undefined &&
            (this.controlProperties['isHidden'].value === "1" ||
                this.controlProperties['isHidden'].value === 1)) {
            this.ele.css({ 'display': 'none' });
            this.ele.closest('.page-active').find('[tab-id="' + this.id + '"]').css({ 'display': 'none' });
        }
    }

}