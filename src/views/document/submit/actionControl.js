import Control from "./control";
import store from './../../../store/document'
import { SYMPER_APP } from './../../../main.js'

let isDetailView = store.state.submit.isDetailView;
export default class ActionControl extends Control {
    constructor(idField, ele, controlProps, curParentInstance) {
        super(idField, ele, controlProps, curParentInstance);
    }
    render() {
        if (this.type == 'approvalHistory') {
            this.renderApprovalEle();
        } else {
            this.ele.addClass('d-none');
        }
    }
    renderApprovalEle() {
        alert('app');
    }
}