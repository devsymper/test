/**
 * Các hàm phục vụ cho việc xác thực, lưu trữ dữ liệu đăng nhập cho người dùng
 */
import { cookie } from "./cookie.js";
import {authUtil} from './auth.js'
if(self.importScripts){
	self.importScripts('./../env.js');
}
export const store = {
    getComponentSize(comp) {
        if (!comp) {
            return {
                h: 0,
                w: 0
            }
        }

        let dom = false;
        if (comp._isVue) {
            dom = comp.$el;
        } else if (comp.localName) {
            dom = comp;
        }

        if (dom && dom.getBoundingClientRect) {
            // let rect = dom.getBoundingClientRect();
            // return {
            //     h: rect.height,
            //     w: rect.width,
            // }
            return {
                h: $(dom).innerHeight(),
                w: $(dom).innerWidth(),
            }
        } else {
            return {
                h: 0,
                w: 0
            }
        }
    },

    /**
     * Tìm vue instance gần nhất với dom được truyền vào
     * @param {DOM} dom  điểm xuất phát của dom để tìm 
     * @param {String} name tên của vue instance cần tìm
     */
    getClosestVueInstanceFromDom(dom, name = false) {
        let vm
        while (dom) {
            if (dom.__vue__) {
                vm = dom.__vue__;
                if (name) {
                    if (vm.$options.name === name) {
                        return vm;
                    } else {
                        dom = dom.parentNode
                    }
                } else {
                    return vm;
                }
            } else {
                dom = dom.parentNode
            }
        }

        return false;
    },

    getSavedLocale() {
        let savedLocale = cookie.get('user-locale');
        return savedLocale ? savedLocale : 'vn';
    },

    setSavedLocale(locale) {
        cookie.set('user-locale', locale);
    },
    /**
     * Biến mội chuỗi thành  một đối tượng File để có thể gửi đi trong request
     * @param {String} content Nội dung cần tạo thành file
     * @param {String} fileName Tên file cần tạo
     */
    makeStringAsFile(contents, fileName = 'file.txt') {
        var blob = new Blob([contents], { type: 'text/plain' });
        var file = new File([blob], fileName, { type: "text/plain" });
        return file;
    },

    setEncoded(link, name, data) {
        var encodedData = encodeURIComponent(data);
        if (data) {
            link.attr({
                href: "data:application/bpmn20-xml;charset=UTF-8," +
                    encodedData,
                download: name
            });
            setTimeout(() => {
                link[0].click();
            }, 200);
        }
    },
    isPromise(value) {
        return value && value.then && typeof value.then === 'function';
    },
    addEnvToUrl(url) {
		url = url.trim();
		if (url.indexOf('https://') === 0) {
            if (SYMPER_ENV.environment != '') {
                url = url.replace('https://', `https://${SYMPER_ENV.environment}.`);
            }
        } else {
            console.error("url must start with https://");
        }
        return url;
    },
    copyTextToClipboard(text) {
        let textArea = document.createElement("textarea");
        textArea.classList = 'hidden-textarea-for-copy';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    },
    getExcelFile(configs, url, filename = 'data'){
        let token = "Bearer " + authUtil.getToken()
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "POST",
                url: url,
                data: typeof configs == 'string' ? configs : JSON.stringify(configs),
                xhrFields: {
                    responseType: 'blob' // to avoid binary data being mangled on charset conversion
                },
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': token,
                },
                success: function(blob, status, xhr) {
                    // check for a filename
                    var filename = filename;
                    var disposition = xhr.getResponseHeader('Content-Disposition');
                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        var matches = filenameRegex.exec(disposition);
                        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                    }
    
                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                        window.navigator.msSaveBlob(blob, filename);
                    } else {
                        var URL = window.URL || window.webkitURL;
                        var downloadUrl = URL.createObjectURL(blob);
    
                        if (filename) {
                            // use HTML5 a[download] attribute to specify filename
                            var a = document.createElement("a");
                            // safari doesn't support this yet
                            if (typeof a.download === 'undefined') {
                                window.location.href = downloadUrl;
                            } else {
                                a.href = downloadUrl;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.click();
                            }
                        } else {
                            window.location.href = downloadUrl;
                        }
    
                        setTimeout(function () { 
                            URL.revokeObjectURL(downloadUrl);
                            resolve({}); 
                        }, 100); // cleanup
                    }
                }
            });
        });
    },
    printDOM(prtHtml){
        // Get all stylesheets HTML
        let stylesHtml = '';
        for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
            stylesHtml += node.outerHTML;
        }
    
        // Open the print window
        const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if(WinPrint){
            setTimeout(self=>{
                WinPrint.document.write(`<!DOCTYPE html>
            <html>
                <head>
                    ${stylesHtml}
                </head>
                <body>
                    ${prtHtml}
                </body>
                </html>`);
                WinPrint.document.close();
                WinPrint.focus();
            },200, this)
            setTimeout(() => {
                WinPrint.print();        
            }, 300);
        }   
       
    }
    
}