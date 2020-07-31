import { permissionApi } from "../../api/permissionPack";

const getAllPermission = async(context, data) => {
    if (context.state.flagGetPermissionPack) {
        context.state.flagGetPermissionPack = false;
        let res = await permissionApi.getAllPermission();
        context.commit('setAllPermissionPack', res.data);
    }
};


const getAllActionPack = async(context, data) => {
    if (context.state.flagGetActionPack) {
        context.state.flagGetActionPack = false;
        let res = await permissionApi.getAllActionPack();
        context.commit('setAllActionPack', res.data);
    }
};

export { getAllPermission, getAllActionPack };