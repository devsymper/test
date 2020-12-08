import Control from "./control";
import { documentApi } from './../../../api/Document.js';
import store from './../../../store';
import { SYMPER_APP } from './../../../main.js'

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
            if (this.controlFormulas.hasOwnProperty('update')) {
                let formulas = this.controlFormulas.update.instance;
                store.commit("document/addToDocumentSubmitStore", {
                    key: 'updateFormulas',
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
            thisCpn.ele.empty();
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
                                                            <span> </span>  <img src="https://file.symper.vn/readFile/user_avatar_` + user.id + `" style="    height: 18px;
                                                            border-radius: 50%;
                                                            width: 18px;
                                                            margin-bottom: -4px;"> <strong>` + user.displayName + `</strong> <span>Thực hiện <span style="font-weight:500;">` + approvalHistory.actionTitle + "</span> " + SYMPER_APP.$moment(approvalHistory.createAt).fromNow() + ` ( ` + approvalHistory.createAt + ` )</span>
                                                        </div>`
                                console.log("asdsadsad#D", thisCpn);
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