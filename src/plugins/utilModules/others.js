/**
 * Các hàm phục vụ cho việc xác thực, lưu trữ dữ liệu đăng nhập cho người dùng
 */
export const others = {
    getComponentSize(comp) {
        let dom = false;
        if (comp._isVue) {
            dom = comp.$el;
        } else if (comp.localName) {
            dom = comp;
        }

        if (dom) {
            let rect = dom.getBoundingClientRect();
            return {
                h: rect.height,
                w: rect.width,
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
    }
}