import Control from "./control";
import { documentApi } from './../../../api/Document.js';
import store from './../../../store';
import { SYMPER_APP } from './../../../main.js'

export default class ActionControl extends Control {
    constructor(idField, ele, controlProps, keyInstance, value) {
        super(idField, ele, controlProps, keyInstance, value);
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
                    instance: this.keyInstance
                });
            }
            if (this.controlFormulas.hasOwnProperty('update')) {
                let formulas = this.controlFormulas.update.instance;
                store.commit("document/addToDocumentSubmitStore", {
                    key: 'updateFormulas',
                    value: formulas,
                    instance: this.keyInstance
                });
            }
        } else {
            this.ele.addClass('d-none');
        }
    }
    addCommentToView(el){
        this.ele.find('.content-comment').append(el)
    }
    renderApprovalEle() {
        let thisObj = this;
        this.ele.on('click','.approval-tablinks',function(e){
            $(e.target).siblings().removeClass('active')
            $(e.target).addClass('active');
            if($(e.target).attr('data-tab') == 'comment'){
                thisObj.ele.find('.content-history').removeClass('tab-content-active');
                thisObj.ele.find('.content-comment').addClass('tab-content-active');
            }
            else if($(e.target).attr('data-tab') == 'history'){
                thisObj.ele.find('.content-comment').removeClass('tab-content-active')
                thisObj.ele.find('.content-history').addClass('tab-content-active')
            }
        })
        if (this.checkDetailView()) {
            let listUser = store.state.app.allUsers;
            thisObj.ele.empty();
            let template = `
                <div class="approval-tab">
                    <button class="approval-tablinks active" data-tab="history">Lịch sử duyệt</button>
                    <button class="approval-tablinks" data-tab="comment">Bình luận</button>
                </div>
                <div class="approval-tabcontent content-history tab-content-active">
                    
                </div>

                <div class="approval-tabcontent content-comment">
                    
                </div>

            `
            thisObj.ele.html(template)
            documentApi.getListApprovalHistory(this.value).then(res => {
                    if (res.status == 200) {
                        let data = res.data;
                        if (data.length == 0) {
                            thisObj.ele.hide()
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
                                thisObj.ele.find('.content-history').append(item)
                            }
                        }

                    } else {
                        thisObj.ele.hide()
                    }

                })
                .catch(err => {

                })
                .finally(() => {});
        } else {
            this.ele.remove();
        }
    }
}