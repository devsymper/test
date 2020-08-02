import { permissionApi } from "../../api/permissionPack";

const action1 = (state, data) => {
    state.data = data;
};

const getAllActionByObjectType = async(context) => {
    if (context.state.flagToGetAllActionByObjectType) {
        context.state.flagToGetAllActionByObjectType = false;
        let res = await permissionApi.getAllActionByObjectType();
        context.commit('setAllActionByObjectType', res.data);
    }
}

export { action1, getAllActionByObjectType };