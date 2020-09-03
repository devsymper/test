import { SYMPER_APP } from "../main"
import { util } from "../plugins/util";

export const actionHelper = {
    /**
     * Lọc ra các action được chấp nhận trong một object với key là tên action, 
     * value có thể là bất cứ cái gì
     * @param {Object} collection object chứa các actionName và value
     * @param {string} objectType Loại object: document_definition, orgchart ....
     * @param {string} objId id cuả object cha cần check quyền, thường sẽ bằng hẳn thằng 
     * @param {string} subId id của các object con (instance id của objId), thường áp dụng cho document hoặc workflow
     * 
     */
    filterAdmittedActions(collection, objectType, objId, subId = -1, returnArr = true) {
        let opsMap = SYMPER_APP.$store.state.app.userOperations;
        let userInfo = util.auth.getSavedUserInfo();
        let userType = userInfo.profile.type;

        if (userType == 'ba') {
            return returnArr ? Object.values(collection) : collection;
        } else {
            if (opsMap[objectType]) {
                let rsl = {};
                if (opsMap[objectType][0]) { // nếu có quyền với thằng cha, thì các thằng con sẽ phải theo thằng cha hết
                    for (let action in opsMap[objectType][0]) {
                        if (collection[action]) {
                            rsl[action] = collection[action];
                        }
                    }
                }

                // và còn có một vài quyền riêng mà thằng con được cài đặt
                for (let action in opsMap[objectType][objId]) {
                    if (collection[action]) {
                        rsl[action] = collection[action];
                    }
                }
                return returnArr ? Object.values(rsl) : rsl;
            } else {
                return returnArr ? [] : {};
            }
        }
    }
}