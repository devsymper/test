import Control from "./control";
import { documentApi } from './../../../api/Document.js'
import { userApi } from './../../../api/user.js'
import store from './../../../store'
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
            documentApi.getListApprovalHistory(this.value).then(res => {
                    if (res.status == 200) {
                        let data = res.data;
                        if (data.length == 0) {
                            thisCpn.ele.hide()
                        } else {
                            console.log("theanhcheckxem", data);
                            $.each(data, function(k, v) {
                                userApi.getDetailUser(v.userId).then(res => {
                                        if (res.status == 200) {
                                            let user = res.data.user;
                                            let item = `<div class="approved-item">
                                                            <span>Người duyệt 1: </span>  <img src="https://file.symper.vn/readFile/user_avatar_` + user.id + `" style="    height: 18px;
                                                            border-radius: 50%;
                                                            width: 18px;
                                                            margin-bottom: -4px;"> <strong>` + user.displayName + `</strong> <span>đã duyệt ` + moment(v.createAt).fromNow() + ` ( ` + v.createAt + ` )</span>
                                                        </div>`
                                            thisCpn.ele.append(item)
                                        }
                                    })
                                    .catch(err => {

                                    })
                                    .always(() => {});
                            })
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