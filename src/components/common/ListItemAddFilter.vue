<template>
    <v-row  class="w-100" style="background:rgb(230, 229, 229)">
        <v-col class="col-md-11" style="margin-top:-5px;margin-bottom:-8px">
            <span class="ml-1 fs-13">Tên bộ lọc </span>
            <v-text-field
                class="d-inline-block ml-2 sym-small-size"
                single-line
                v-model="name"
                style="background:white"
                outlined
                dense
            ></v-text-field>
        </v-col>
        <v-col class="col-md-1" style="margin-top:-5px; margin-bottom:-8px">
            <span class="mdi mdi-check color-green mx-6" @click="handleAddFilter('save')"></span>
            <span class="mdi mdi-close" @click="handleAddFilter('add')"></span>
        </v-col>
    </v-row>
</template>
<script>
export default {
  data () {
    return {
        errorMess: ''
    }
  },
  created () {
      this.name = this.filterName
  },
 
  props: {
       filterName:{
			type: String,
			default: '',
		},
  },
  methods: {
      handleAddFilter(type){
          let data={
              type: type,
              filterName:this.name,
              valid:false
          }
        this.$emit('add-filter',data)
      }
  },
    
}
</script>