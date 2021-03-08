<template>
    <div class="pa-2">
         <v-checkbox 
                class="ml-2 checkbox"
                 style='margin-top:-5px; margin-bottom:-35px'
                v-model="selectAll"
                :label="`${$t('common.all')}`"
        ></v-checkbox>
        <div v-for="(item, index) in listCate" :key="index" style='margin-top:-10px; margin-bottom:-35px'>
            <v-checkbox 
                class="ml-2 checkbox"
                v-model="item.selected"
                :label="`${item.key}-${item.name}`"
            ></v-checkbox>
        </div>
        <div class="d-flex justify-end mt-4">
            <v-btn class="fs-13 fw-400" x-small @click="applyFilter" color="success">
                {{$t('common.apply')}}
            </v-btn>
        </div>
    </div>
</template>
<script>
export default {
  watch: {
      selectAll(){
        this.listCate.map(cate=>{
            cate.selected = this.selectAll;
        })
      }
  },
  methods: {
      applyFilter(){
            let listSeleted = [];
            this.listCate.filter(cate=>cate.selected==true).map(cate=>{
                listSeleted.push(cate.id)
          })
          this.$store.commit('timesheet/getFilterCate',listSeleted)
      }
  },
  props: {
      listCate:{
          type:Array,
          default(){
              return []
          }
      }
  },
  data () {
    return {
        selectAll:true
    }
  },
  created () {
  },
    
}
</script>
<style scoped>
    .checkbox ::v-deep .v-label{
        color:black!important
    }
</style>