import { util } from "./../plugins/util.js";

export const routeMiddleware = {
    /**
     * Các hàm middleware dùng cho tất cả các route
     * Có thể viết thêm tiếp các middleware ở đây, với key là tên hàm, value là hàm xử lý middleware đó
     */
    common: {
        /**
         * Kiểm tra xem đã đăng nhập hay chưa, nếu chưa dẫn đến trang đăng nhập
         * @param {Object} to Object chứa thông tin của route cần đi tới
         * @param {Object} from  Object chứa thông tin của route khởi nguồn
         * @param {Function} next Hàm đi tới route tiếp theo
         */
        checkLogin(to, from, next) {
            const noNeedLoginPages = {
                login: true,
                pageNotFound: true
            };
            if (noNeedLoginPages.hasOwnProperty(to.name) || util.auth.checkLogin()) {
                next();
            } else { 
                next({name:'login'});
            }
        }
    }
}