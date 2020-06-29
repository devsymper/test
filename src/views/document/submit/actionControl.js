import Control from "./control";
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
        let item = `<div class="approved-item">
                        <span>Người duyệt 1: </span> <strong>Hằng TCKT.Nguyễn Thị Thanh</strong> <span>đã Duyệt 6 tháng trước ( 2020-01-09 17:46:32 )</span>
                    </div>
                    <div class="approved-item">
                        <span>Người duyệt 2: </span> <strong>Hằng TCKT.Nguyễn Thị Thanh</strong> <span>đã Duyệt 6 tháng trước ( 2020-01-09 17:46:32 )</span>
                    </div>
                    <div class="approved-item">
                        <span>Người duyệt 3: </span> <strong>Hằng TCKT.Nguyễn Thị Thanh</strong> <span>đã Duyệt 6 tháng trước ( 2020-01-09 17:46:32 )</span>
                    </div>`
        this.ele.append(item)

    }
}