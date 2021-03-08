<template>
    <v-card class="pb-2 px-2">
        <v-card-title primary-title class="pb-1 w-100 mt-s10" > 
            <span class="fs-18 fw-430">{{$t('process.list.title')}}</span> 
        </v-card-title>
          <v-divider ></v-divider>
            <v-card-text >
                <span class="fs-13 color-black">Chọn danh sách quy trình dưới đây:</span>
            </v-card-text>
            <v-card-text @click="selectProcess(item)" style="margin-top:-20px" class="list-process" v-for="(item, index) in listProcess" :key="index">
                 <div class="color-black fs-13">Tên quy trình: {{item.name}}</div>
                 <div class="color-grey fs-12">Mô tả: {{item.description}}</div>
            </v-card-text>
    </v-card>
</template>
<script>
export default {
  methods: {
      selectProcess(process){
          this.$emit('select-process-key',process)
      }
  },
  props: {
      listProcess:{
          type:Array,
          default() {}
      }
  },

    
}
</script>
<style scoped>
    .list-process:hover{
        background: lightgrey;

    }
</style>