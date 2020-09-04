import defaultAvatar from "@/assets/image/avatar_default.jpg";

const setAvatarUrl = (state, data) => {
    Vue.set(state.userAvatars, data.id, {
        loading: data.hasOwnProperty('loading') ? data.loading : true,
        url: data.url ? data.url : defaultAvatar
    });
};

export {
    setAvatarUrl
};