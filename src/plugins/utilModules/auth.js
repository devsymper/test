import IndexedDB from "@/plugins/utilModules/indexedDB.js";
import { reject } from "lodash";
var loginedInfo = null;	

async function getLoginInfoFromIndexedDB() {	
    return new Promise((resolve, reject) => {
        let indexedDB = new IndexedDB('SYMPER-LOGIN-INFOR');
        if(!loginedInfo){
            indexedDB.open('loginInfo', false, false, async()=>{	
                loginedInfo = await indexedDB.read('loginInfo');	
                if(typeof loginedInfo == 'string'){	
                    loginedInfo = JSON.parse(loginedInfo);	
                }
                resolve(loginedInfo);
            });	
        }else{
            resolve(loginedInfo);
        }
    });
}

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
		if(self.window){
			let loginInfo = localStorage.getItem('symper-login-info');
			if (loginInfo) {
			    return JSON.parse(loginInfo).token;
			} else {
			    return false;
			}
		}else{
            return new Promise(async (resolve, reject) => {
				let loginInfo = await getLoginInfoFromIndexedDB();
                resolve(loginInfo.token);
            });
		}
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
    },

    checkLoginAndSetToIndexedDB(){
        if(this.checkLogin()){
            let logiInfo = this.getSavedUserInfo();
            let indexedDB = new IndexedDB('SYMPER-LOGIN-INFOR');
            indexedDB.open('loginInfo', false, false, ()=>{
                indexedDB.save(logiInfo, 'loginInfo');
            });
        }
    }

}