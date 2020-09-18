import Control from "./control";
import { documentApi } from './../../../api/Document.js';
import sDocument from './../../../store/document'
import { userApi } from './../../../api/user.js';
import store from './../../../store';
import moment from "moment-timezone";
export default class ActionControl extends Control {
    constructor(idField, ele, controlProps, curParentInstance, value) {
        super(idField, ele, controlProps, curParentInstance, value);
    }
    render() {
        if (this.type == 'approvalHistory') {
            this.renderApprovalEle();
        } else if (this.type == 'submit') {
            this.ele.addClass('d-none');
            if (this.controlFormulas.hasOwnProperty('submit')) {
                let formulas = this.controlFormulas.submit.instance;
                store.commit("document/addToDocumentSubmitStore", {
                    key: 'submitFormulas',
                    value: formulas,
                    instance: this.curParentInstance
                });
            }
        } else {
            this.ele.addClass('d-none');
        }
    }
    renderApprovalEle() {
        if (this.checkDetailView()) {
            console.log(this.value);
            let thisCpn = this;
            let listUser = store.state.app.allUsers;
            documentApi.getListApprovalHistory(this.value).then(res => {
                    if (res.status == 200) {
                        let data = res.data;
                        if (data.length == 0) {
                            thisCpn.ele.hide()
                        } else {
                            for (let index = 0; index < data.length; index++) {
                                let approvalHistory = data[index];
                                let user = listUser.filter(u => {
                                    return u.id == approvalHistory.userId
                                })
                                if (user) {
                                    user = user[0]
                                }
                                let item = `<div class="approved-item">
                                                            <span>Người duyệt ` + index + 1 + `: </span>  <img src="https://file.symper.vn/readFile/user_avatar_` + user.id + `" style="    height: 18px;
                                                            border-radius: 50%;
                                                            width: 18px;
                                                            margin-bottom: -4px;"> <strong>` + user.displayName + `</strong> <span>đã duyệt ` + moment(approvalHistory.createAt).fromNow() + ` ( ` + approvalHistory.createAt + ` )</span>
                                                        </div>`
                                thisCpn.ele.append(item)
                            }
                        }

                    } else {
                        thisCpn.ele.hide()
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