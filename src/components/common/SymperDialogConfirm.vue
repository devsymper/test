<template>
    <v-dialog v-model="showDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline"> {{title}} </v-card-title>
        <v-card-text> {{content}} </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="showDialog = false">Hủy</v-btn>
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
   }
}
</script>

<style>

</style>