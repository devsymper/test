<template>
  <list-items
        @change-page="changePage"
        @add-item="addUser"
        :pageTitle="'Danh sách User'"
        :containerHeight="containerHeight"
        :columns="columns"
        :data="data"
        :total="total"
    ></list-items>
</template>
<script>
import { userApi } from "./../../api/user.js";
import ListItems from "./../../components/common/ListItems.vue";
import { util } from "./../../plugins/util.js";
export default {
  components: {
      "list-items": ListItems
  },
  data(){
    return {
      containerHeight: 200,
      columns: [{"name":"id","title":"Id","type":"numeric"}],
      data: [],
      total: 0,
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
    addUser(){
      alert('ok');
      this.$router.push('/users/add');
    },
    getListUser(){
      let thisCpn = this;
      userApi
        .getListUser()
        .then(res => {
            if (res.status == 200) {
                thisCpn.setListUser(res.data);
            }
        })
        .catch(err => {
            console.log("error from show list user api!!!", res);
        })
        .always(() => {
        });
    },
    setListUser(listUser){
      this.columns = listUser.columns;
      this.data = listUser.listObject;
      this.total = listUser.totalPage;
    },
    calcContainerHeight() {
        this.containerHeight = util.getComponentSize(this).h;
    }
  }
}
</script>