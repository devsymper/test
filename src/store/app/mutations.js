const changeCollapseSidebar = (state, newValue) => {
  state.collapseSideBar = newValue;
};
const decreaseUnreadNotification = (state, delta = 1) => {
  state.unreadNotification -= delta;
};
const increaseUnreadNotification = (state, delta = 1) => {
  state.unreadNotification += delta;
};

const changeCurrentBAInfo = (state, data) => {
    for(let name in data){
        state.baInfo[name] = data[name];
    }
};

export {
  changeCollapseSidebar,
  increaseUnreadNotification,
  decreaseUnreadNotification,
  changeCurrentBAInfo
};
