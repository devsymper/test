<template>
    <v-dialog v-model="showDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Xóa bình luận</v-card-title>
        <v-card-text>Bạn có chắc chắn muốn xóa bình luận này không</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="showDialog = false">Hủy</v-btn>
          <v-btn color="green darken-1" text @click="confirmDelete">Đồng ý</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
   props:{
       showDialog:{
           type:Boolean,
           default:false
       }
   },
   methods:{
       confirmDelete(){
           this.$emit('confirm-delete')
       }
   }
}
</script>

<style>

</style>