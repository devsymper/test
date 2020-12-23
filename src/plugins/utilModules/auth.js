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
        localStorage.setItem('symper-login-info', JSON.stringify(data));
    },

    getToken() {
        // let loginInfo = localStorage.getItem('symper-login-info');
        // if (loginInfo) {
		// 	debugger
        //     return JSON.parse(loginInfo).token;
        // } else {
        //     return false;
		// }
		return "eyJhbGciOiJSUzI1NiIsInR5cGUiOiJKV1QifQ==.eyJpZCI6IjIiLCJuYW1lIjoiTmd1eVx1MWVjNW4gVmlcdTFlYzd0IERpbmgiLCJlbWFpbCI6ImRpbmhudkBzeW1wZXIudm4iLCJ1c2VyRGVsZWdhdGUiOnsiaWQiOiI5MjIiLCJmaXJzdE5hbWUiOiJcdTAxMTBpXHUxZWM3cCIsImxhc3ROYW1lIjoiIiwidXNlck5hbWUiOiJcdTAxMTBpXHUxZWM3cCBUQktTIFx1MDExMFx1MDBlMG0gVGhcdTFlY2IiLCJkaXNwbGF5TmFtZSI6Ilx1MDExMGlcdTFlYzdwIFRCS1MgXHUwMTEwXHUwMGUwbSBUaFx1MWVjYiIsImVtYWlsIjoidGh1eWRpZXBAcGh1Y2hhLmNvbSIsInBob25lIjoidGVzdCBiaW5kIGxhc3QzIiwic3RhdHVzIjoiMSIsImF2YXRhciI6IiIsInR5cGUiOiJ1c2VyIiwiaXAiOiIxNC4xNjIuMTcxLjEzOSIsInVzZXJBZ2VudCI6Ik1vemlsbGFcLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdFwvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lXC84Ny4wLjQyODAuODggU2FmYXJpXC81MzcuMzYiLCJsb2NhdGlvbiI6W10sInJvbGUiOiJvcmdjaGFydDoxMDk6YmU3YTZlM2EtMWI2YS00MGU2LTgwNTctODg5ZDYyZTMzMjg4In0sInR5cGUiOiJiYSJ9.NDNiMzQ0NzE1ODAyZGFjODg2ZWY0MjFmNmQ2YWI0NTNhY2U2ZThlMzIwYWI3MGQ4MTEwY2JlODg3MzliNjBkYjg0Mzk3NmQxMGI1ZjQ0NDQ5OGZiZWNkZmVlOGRkMjk1MzkyODRhMmZmOWRlZWUyYWFmZGNlNWYyNGYxYzE5ZGJlNjNmYWE2YjYyNGJlNGZmNzhlNzcwNDE3ZjZkMjUwNjZkYjcwOTllNjZlZTNmNWFlOWVhZGE5MzM3ZGI0ZDhjZWUxOWM3YjBiNmU3ZDBkOGFkYWZkYzBlOTZjMGQ2NjY5MDAyMDczZTg5NzA5N2JhODZiNmY3MjVlNTYwYTg5YWI5YzJkZjAyODc0ODExOTE0MGFkMDgzZGMwN2QxZDBjYzFkNjU4OTVlMzU1MjIyODc2NGY3YTI5MjAzNWM3MzUxNmQ3MGUzMDNiODVmMzIzMzM1ZjRmNTk0YzE3ZDBlYTgxMzk0OGYxMTViZjU5NGM1MjI3MGU4NmMzZWJmZWZiYjAxNmM5OTAxZTJkNDY1Mjk0NjEyODFmNTc4MWFiN2JhY2MyZTVkMTQ4ZDE0NDM2Zjk0M2FjYjcwOGFjMzE1Y2IzZTBlZmQyNjBiZTRhMmIxZGQzNGI1N2U0ZDA1NThmNTIyMTFkNjdlYjg1MjJkODA3MTU3ZjA1ZDY1YjNjMGY="
		
    },

    isSupportter() {
        return this.getSavedUserInfo().profile.type == 'ba';
    },

    checkLogin() {
        if (this.getToken()) {
            return true;
        } else {
            return false;
		}
    },
    logout() {
        localStorage.removeItem('symper-login-info');
    },

    getSavedUserInfo() {
        let loginInfo = localStorage.getItem('symper-login-info');
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

    getCurrentUserRole() {

        let data = this.getSavedUserInfo();
        let role = '';
        if (data.profile.userDelegate &&
            data.profile.userDelegate.role) {
            role = data.profile.userDelegate.role;
        } else {
            role = data.profile.role;
        }
        return role;
    }

}