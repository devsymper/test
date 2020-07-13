import { permissionApi } from "../../api/permissionPack";

const getAllPermission = async(context, data) => {
    if (Object.values(context.state.allPermissionPack).length == 0) {

        let res = await permissionApi.getAllPermission();
        context.commit('setAllPermissionPack', res.data);
    }
};

export { getAllPermission };