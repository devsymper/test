<template>
    <div>
        <span>{{title}}</span>
        <v-btn
            depressed
            small
            :loading="loadingExportExcel"
            :disabled="loadingExportExcel"
        >
            <v-icon left dark>mdi-microsoft-excel</v-icon>
        </v-btn>
    </div>
</template>
<script>

export default {
    props:{
        title:""
    },
  mounted() {
  },
  created(){
  },
  methods:{
    
  }
}
</script>