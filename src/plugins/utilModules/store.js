/**
 * Các hàm phục vụ cho việc xác thực, lưu trữ dữ liệu đăng nhập cho người dùng
 */
import { cookie } from "./cookie.js";
import env  from "@/../env.json";
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
    addEnvToUrl(url){
        url = url.trim();
        if(url.indexOf('https://') === 0){
            if(env.environment != ''){
                url = url.replace('https://', `https://${env.environment}.`);                
            }
        }else{
            console.error("url must start with https://");
        }
        return url;
    }
    
}


// namespace Library;
// class Environment{
//     public static function getPrefixEnvironment(){
//         if($GLOBALS['env']['environment']!=""){
//             return $GLOBALS['env']['environment'].".";
//         }
//         else{
//             return "";
//         }
//     }
// }