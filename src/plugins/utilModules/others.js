/**
 * Các hàm phục vụ cho việc xác thực, lưu trữ dữ liệu đăng nhập cho người dùng
 */
export const others = {
    getComponentSize(comp){
        let dom = false;
        if(comp._isVue){
            dom = comp.$el;
        }else if(comp.localName){
            dom = comp;
        }

        if(dom){
            let rect = dom.getBoundingClientRect();
            return {
                h: rect.height,
                w: rect.width,
            }
        }else{
            return {
                h: 0,
                w: 0
            }
        }
    }
}