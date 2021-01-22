<template>
    <v-row  class="w-100 mt-1 mb-0" style="background:rgb(230, 229, 229)">
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
        <v-col class="col-md-1 pl-13" style="margin-top:-5px; margin-bottom:-8px">
            <v-btn x-small text @click="handleAddFilter('save')" >
                <span class="mdi mdi-check color-green " style="font-size:15px"></span>
            </v-btn>
            <v-btn  x-small text @click="handleAddFilter('add')">
                <span class="mdi mdi-close"  style="font-size:15px"></span>
            </v-btn>
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