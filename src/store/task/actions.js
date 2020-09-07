import { task } from "./../../api/task.js";
import { SYMPER_APP } from "./../../main.js";


const getArrFileAttachment = async(context, data) => {
    try {
        let res =await task.getFileByList(data);
        if (res.status == 200) {
            if (res.data != null) {
                context.commit('setArrFileAttach', res.data);
            }
        } else {
            context.commit('setArrFileAttach', []);
        }
    } catch (error) {
        SYMPER_APP.$snotifyError(error, "Can not get list file attachment document !");
    }
}
export {
    getArrFileAttachment,
  
};