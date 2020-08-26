/**
 * Các hàm phục vụ cho việc xác thực, lưu trữ dữ liệu đăng nhập cho người dùng
 */
export const authUtil = {
    saveLoginInfo(data) {
        /**
         * data có dạng: {
         *      token: "xxx",
         *      baId: "yyy",
         *      endUserId: "zzzz"
         * }
         */
        window.localStorage.setItem('symper-login-info', JSON.stringify(data));
    },

    getToken() {
        let loginInfo = window.localStorage.getItem('symper-login-info');
        if (loginInfo) {
            return JSON.parse(loginInfo).token;
        } else {
            return false;
        }
    },

    checkLogin() {
        if (this.getToken()) {
            return true;
        } else {
            return false;
        }
    },


    logout() {
        window.localStorage.removeItem('symper-login-info');
    },

    getSavedUserInfo() {
        let loginInfo = window.localStorage.getItem('symper-login-info');
        if (loginInfo) {
            return JSON.parse(loginInfo);
        } else {
            return {};
        }
    },

    setSavedUserInfo(data) {
        let loginInfo = this.getSavedUserInfo();
        loginInfo = Object.assign(loginInfo, data);
        this.saveLoginInfo(loginInfo);
    },

}