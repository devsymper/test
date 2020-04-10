<template>
  <list-items
        :pageTitle="'Danh sách document'"
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
      listUser : [],
      containerHeight: 200,
      columns: [{"name":"id","title":"Id","type":"numeric"},{"name":"name","title":"Tên","type":"text"},{"name":"title","title":"Tiêu đề","type":"text"},{"name":"menu","title":"Menu","type":"text"},{"name":"workflow","title":"Worflow","type":"text"},{"name":"createtime","title":"Thời gian tạo","type":"date"},{"name":"updatetime","title":"Thời gian cập nhật","type":"date"},{"name":"userupdate","title":"Ba update","type":"text"},{"name":"usercreate","title":"BA khởi tạo","type":"text"},{"name":"countobject","title":"Số bản ghi","type":"numeric"}],
      data: [{"id":"1910","name":"f_pttm","title":"PHIẾU THU TIỀN MẶT","createtime":"2019-12-12 13:57:52","updatetime":"2019-12-14 10:48:27","userupdate":"tannq@symper.vn","usercreate":"tannq@symper.vn","countobject":"0","menu":"<a href='/menu/?panel=detail&id=217'>DK - Phiếu thu tiền mặt</a>","workflow":""},{"id":"1909","name":"dm_tk","title":"DANH MỤC TÀI KHOẢN","createtime":"2019-12-10 08:59:38","updatetime":"2019-12-13 17:46:32","userupdate":"thangnt@symper.vn","usercreate":"tannq@symper.vn","countobject":"267","menu":"<a href='/menu/?panel=detail&id=216'>DK - Danh mục tài khoản</a>","workflow":""},{"id":"1907","name":"f_pctm","title":"PHIẾU CHI TIỀN MẶT","createtime":"2019-12-09 17:21:11","updatetime":"2020-01-03 17:48:27","userupdate":"thangnt@symper.vn","usercreate":"tannq@symper.vn","countobject":"2","menu":"<a href='/menu/?panel=detail&id=215'>DK - Phiếu chi tiền mặt</a>","workflow":""},{"id":"1905","name":"k_dnnk","title":"ĐỀ NGHỊ NHẬP KHO","createtime":"2019-11-29 11:39:00","updatetime":"2020-02-29 10:58:29","userupdate":"thangnt@symper.vn","usercreate":"tannq@symper.vn","countobject":"3","menu":"<a href='/menu/?panel=detail&id=208'>DK - Phiếu đề nghị nhập kho</a>","workflow":"<a href='/workflow/?panel=add&action=edit&id=321'>ĐỀ NGHỊ NHẬP KHO</a>"}],
      total: 6,
    }
  },
  mounted() {
      this.calcContainerHeight();
  },
  created(){
    this.getListUser();
  },
  methods:{
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
      this.listUser = listUser;
    },
    calcContainerHeight() {
        this.containerHeight = util.getComponentSize(this).h;
    }
  }
}
</script>