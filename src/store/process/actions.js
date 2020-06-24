import workflowApi from "@/api/BPMNEngine.js";
import { SYMPER_APP } from "@/main.js";
const action1 = (state, data) => {
    state.data = data;
};


const getAllDefinitions = async(context) => {

    if ($.isEmptyObject(context.state.allDefinitions)) {
        try {
            let res = await workflowApi.getDefinitions({
                "start": 0,
                "size": 1000
            });
            context.commit('setAllDefinition', res.data);
        } catch (error) {
            SYMPER_APP.$snotifyError(error, "Can not get all definitions!");
        }
    }
}

export { getAllDefinitions };