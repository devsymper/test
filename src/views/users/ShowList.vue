<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Tên</th>
          <th class="text-left">Email</th>
          <th class="text-left">Số điện thoại</th>
          <th class="text-left">Ghi chú</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in listUser" :key="item.id">
          <td>{{ item.fullName }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.phone }}</td>
          <td>{{ item.note }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
import { userApi } from "./../../api/user.js";
export default {
  data(){
    return {
      listUser : []
    }
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
    }
  }
}
</script>