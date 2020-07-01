import Control from "./control";
import { documentApi } from './../../../api/Document.js'
import { userApi } from './../../../api/user.js'
import moment from "moment-timezone";
export default class ActionControl extends Control {
    constructor(idField, ele, controlProps, curParentInstance, value) {
        super(idField, ele, controlProps, curParentInstance, value);
    }
    render() {
        if (this.type == 'approvalHistory') {
            this.renderApprovalEle();
        } else {
            this.ele.addClass('d-none');
        }
    }
    renderApprovalEle() {
        if (this.checkDetailView()) {
            console.log(this.value);
            let thisCpn = this;
            documentApi.getListApprovalHistory(this.value).then(res => {
                    if (res.status == 200) {
                        let data = res.data;
                        $.each(data, function(k, v) {
                            userApi.getDetailUser(v.userId).then(res => {
                                    if (res.status == 200) {
                                        let user = res.data.user;
                                        let item = `<div class="approved-item">
                                    <span>Người duyệt 1: </span> <strong>` + user.displayName + `</strong> <span>đã duyệt ` + moment(v.createAt).fromNow() + ` ( ` + v.createAt + ` )</span>
                                </div>`
                                        thisCpn.ele.append(item)
                                    }
                                })
                                .catch(err => {

                                })
                                .always(() => {});
                        })
                    }

                })
                .catch(err => {

                })
                .always(() => {});
        } else {
            this.ele.remove();
        }
    }
}