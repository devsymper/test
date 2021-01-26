<template>
    <v-dialog v-model="showDialog" persistent max-width="290" style="z-index:1001">
      <v-card >
        <v-card-title class="headline fs-16"> {{title}} </v-card-title>
        <v-card-text class="fs-13"> {{content}} </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cancel">Hủy</v-btn>
          <v-btn color="green darken-1" text @click="confirm">Đồng ý</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
   props:{
       title:{
           type:String,
           default: ''
       },
       content:{
           type:String,
           default: ''
       },
       showDialog:{
           type:Boolean,
           default:false
       }
   },
   methods:{
       confirm(){
           this.$emit('confirm')
       },
       cancel(){
           this.$emit('cancel')
       },
   }
}
</script>

<style>

</style>