import { orgchartApi } from "../../api/orgchart";
import { SYMPER_APP } from "../../main";

const action1 = (state, data) => {
    state.data = data;
};


const getAllStyleNode = async(context) => {
    if (context.state.allNodeStyle.length == 0) {
        try {
            let res = await orgchartApi.getListNodeStyle();
            if (res.status == 200) {
                context.commit('setNodeStyle', res.data);
            } else {
                SYMPER_APP.$snotifyError(error, "Can not get all node style!");
            }
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get all node style !");
        }
    }
}

export { getAllStyleNode };