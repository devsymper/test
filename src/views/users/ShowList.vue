<template>
  <list-items
        ref="listUser"
        @change-page="changePage"
        @add-item="addUser"
        @context-selection-edit="editUser"
        @refresh-list="getListUser"
        :pageTitle="'Danh sách User'"
        :containerHeight="containerHeight"
        :columns="columns"
        :data="data"
        :actionPanelWidth="actionPanelWidth"
        :totalPage="totalPage"
    >
      <div slot="right-panel-content" class="h-100">
            <action-panel
            ref="panel"
            @refresh-new-user="setNewUserItem"
            @close-panel="closePanel"
            :actionType="actionType"
            />
        </div>
    </list-items>
</template>
<script>
import { userApi } from "./../../api/user.js";
import ListItems from "./../../components/common/ListItems.vue";
import ActionPanel from "./../../views/users/ActionPanel.vue";
import { util } from "./../../plugins/util.js";
export default {
  components: {
      "list-items": ListItems,
      "action-panel": ActionPanel
  },
  data(){
    return {
      actionPanelWidth:800,
      containerHeight: 200,
      columns: [{"name":"id","title":"Id","type":"numeric"}],
      data: [],
      totalPage: 6,
      actionType:''
    }
  },
  mounted() {
      this.calcContainerHeight();
  },
  created(){
    this.getListUser();
  },
  methods:{
    changePage(page){
      alert('ok');
    },
    closePanel(){
      this.$refs.listUser.closeactionPanel();
    },
    addUser(){
      this.actionType = 'add';
      this.$refs.listUser.openactionPanel();
      // chỗ này, muốn sửa giá trị của no chỗ này
      // this.$router.push('/users/add');
    },
    editUser(row,colName){
      this.actionType = 'edit';
      this.$refs.panel.setUser(this.data[row]);
    },
    getListUser(){
      let thisCpn = this;
      userApi
        .getListUser(1,20)
        .then(res => {
            if (res.status == 200) {
                thisCpn.setListUser(res.data);
            }
        })
        .catch(err => {
            console.log("error from show list user api!!!", err);
        })
        .always(() => {
        });
    },
    setListUser(listUser){
      this.columns = listUser.columns;
      this.data = listUser.listObject;
      this.totalPage = listUser.totalPage;
    },
    setNewUserItem(user){
      this.data.unshift(user);
    },
    calcContainerHeight() {
        this.containerHeight = util.getComponentSize(this).h;
    }
  }
}
</script>
